---
template: engineering
version: 1.1
description: MCP Action API Engineering Document (Final Revision)
variables:
  - feature: mcp-action-api
  - date: 2026-04-17
  - author: Gemini
  - project: PEDAL
  - version: 0.1.2
---

# mcp-action-api Engineering Document

> **Summary**: MCP 서버에 PEDAL 티켓 단계 이동을 위한 POST API 구현 (스크립트 기반 업데이트)
>
> **Project**: PEDAL
> **Version**: 0.1.2
> **Author**: Gemini
> **Date**: 2026-04-17
> **Status**: Final Draft
> **Planning Doc**: [mcp-action-api.plan.md](../01-plan/mcp-action-api.plan.md)

### Related Documents

| Document                                 | Status |
| ---------------------------------------- | ------ |
| [Wiki (SSOT)](../wiki/index.md)          | ✅     |
| [Plan](../01-plan/mcp-action-api.plan.md) | ✅     |
| [Conventions](../wiki/CONVENTIONS.md)    | ✅     |
| [Prompt](../01-plan/mcp-action-api.prompt.md) | ✅     |
| [mcp-fastapi-backend Report](../archived/mcp-fastapi-backend/mcp-fastapi-backend.report.md) | ✅ (Ref) |

---

## 1. Overview

### 1.1 Engineering Goals

- PEDAL 상태를 안전하게 업데이트하는 REST API 엔드포인트 구현
- AI 에이전트가 직접 상태를 변경할 수 있는 MCP Tool 제공
- `pedal-sync.sh` 스크립트와의 연동을 통한 데이터 무결성 유지 및 실행 제어 보완

### 1.2 Engineering Principles

- **Single Source of Truth**: 상태 파일 직접 수정을 지양하고 반드시 `pedal-sync.sh`를 통해서만 업데이트 수행
- **Input Validation & Sanitization**: Pydantic을 이용한 엄격한 타입 검증 및 입력 문자열 제한 (Shell Injection 방지 및 DoS 방어)
- **Robustness**: 서브프로세스 호출 시 타임아웃 처리, 예외 처리 및 에러 로깅 강화
- **Security by Default**: API 토큰 검증 필수 및 신뢰 경계 정의

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Dashboard  │────▶│   FastAPI    │────▶│ pedal-sync.sh    │
│  (Next.js)  │     │   Backend    │     │ (Shell Script)   │
└─────────────┘     └──────────────┘     └──────────────────┘
            (Auth: API Key)        ▲                      │
                           │                      ▼
┌─────────────┐            │             ┌──────────────────┐
│ AI Agent    │────────────┘             │ .pedal-status.   │
│ (MCP Client)│                          │ shared.json      │
└─────────────┘                          └──────────────────┘
```

### 2.2 Data Flow

Request (feature_id, phase, desc) → FastAPI Validation (Schema & Limits) → Auth Check (API Key) → Subprocess Execution (bash scripts/pedal-sync.sh update ... with 30s timeout) → Script Log Capture → Exit Code Check → Response

### 2.3 Reference Decisions (Inherited from mcp-fastapi-backend)

- **SSE Transport**: AI 에이전트와의 실시간 통신을 위해 SSE 기반 MCP 전송 계층 사용 유지.
- **Hybrid Backend**: Dashboard(REST)와 Agent(MCP)가 동일한 비즈니스 로직(Shell Script)을 공유하는 구조 채택.

---

## 3. Data Model

### 3.1 Entity Definition

```python
from enum import Enum
from pydantic import BaseModel, Field, constr
from typing import Optional

class PedalPhase(str, Enum):
    PLAN = "plan"
    ENGINEERING = "engineering"
    DO = "do"
    ANALYZE = "analyze"
    ITERATE = "iterate"
    LEARN = "learn"

class StatusUpdateRequest(BaseModel):
    # alphanumeric, dashes, underscores allowed. Length 3-50.
    feature_id: constr(regex=r"^[a-zA-Z0-9\-_]+$", min_length=3, max_length=50) = Field(
        ..., description="The ID of the feature to update"
    )
    phase: PedalPhase = Field(..., description="The target phase")
    # Max length 500 to prevent DoS. Unified across REST and MCP.
    description: Optional[constr(max_length=500)] = Field(
        None, description="Detailed reason for the change"
    )

class StatusUpdateResponse(BaseModel):
    success: bool
    message: str
    feature_id: str
    new_phase: PedalPhase
```

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path                | Description               | Auth    |
| ------ | ------------------- | ------------------------- | ------- |
| POST   | /api/status/update  | Update PEDAL feature phase| API Key |

### 4.2 Detailed Specification

#### `POST /api/status/update`

**Authentication:**
- `X-API-Key` 헤더 필수 (환경변수 `PEDAL_API_KEY`와 대조)
- localhost 접근 시에도 보안 일관성을 위해 API Key 요구 (또는 개발 환경에서만 선택적 비활성화)

**Request Body:**

```json
{
  "feature_id": "mcp-action-api",
  "phase": "engineering",
  "description": "Starting engineering phase"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Successfully updated state for mcp-action-api to engineering.",
  "feature_id": "mcp-action-api",
  "new_phase": "engineering"
}
```

**Error Responses:**

- `401 Unauthorized`: API Key 누락 또는 불일치
- `422 Unprocessable Entity`: 유효성 검사 실패 (잘못된 phase, 길이 초과, 금지된 문자)
- `429 Too Many Requests`: `pedal-sync.sh`가 락을 획득하지 못해 실패한 경우
- `504 Gateway Timeout`: 스크립트 실행이 30초를 초과하여 강제 종료된 경우
- `500 Internal Server Error`: 기타 스크립트 실행 실패

---

## 5. MCP Tool Specification

### 5.1 `update_pedal_status`

**Description:** 특정 피처의 PEDAL 단계를 업데이트합니다.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "feature_id": { "type": "string", "pattern": "^[a-zA-Z0-9\\-_]+$", "minLength": 3, "maxLength": 50 },
    "phase": { 
      "type": "string", 
      "enum": ["plan", "engineering", "do", "analyze", "iterate", "learn"] 
    },
    "description": { "type": "string", "maxLength": 500 }
  },
  "required": ["feature_id", "phase"]
}
```

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message             | Cause                         | Handling                     |
| ---- | ------------------- | ----------------------------- | ---------------------------- |
| 401  | Unauthorized        | API Key invalid               | Reject request               |
| 422  | Validation Error    | Invalid input or phase        | Pydantic automatic response  |
| 429  | Lock Contention     | Failed to acquire script lock | Client should retry later    |
| 504  | Timeout Error       | Script took longer than 30s   | Terminate process, return 504|
| 500  | Script Execution Err| Shell script returned non-0   | Log stderr and return 500    |

---

## 7. Security Considerations

- [x] **Input Sanitization**: `subprocess` 호출 시 리스트 형태(`["bash", "script.sh", ...]`)로 전달하여 Shell Injection 방지.
- [x] **DoS Prevention**: `description` 길이 제한(500자) 및 타임아웃(30s) 설정.
- [x] **Auth Enforcement**: API Key 기반 인증을 통해 비인가 접근 차단.

---

## 8. Test Plan

### 8.1 Test Scope

| Type      | Target             | Tool   |
| --------- | ------------------ | ------ |
| Unit Test | Status update logic| pytest |

### 8.2 Test Cases (Key)

- [x] **Happy Path**: `POST /api/status/update` 성공 시 `pedal-sync.sh` 호출 및 200 응답 확인
- [x] **Validation**: REST와 MCP Tool 양쪽에서 `description` 500자 제한 동일 적용 확인
- [x] **Auth**: 유효하지 않은 API Key 요청 시 401 반환 확인
- [x] **Timeout**: 30초 초과 시 504 반환 및 프로세스 정리 확인
- [x] **Lock**: 스크립트 락 획득 실패 시 429 반환 확인

---

## 9. Implementation Guide

### 9.1 File Structure

```
mcp-server/
├── server.py       # API 및 MCP Tool 구현 추가
└── test_server.py  # 단위 테스트 코드 작성
```

### 9.2 Implementation Order

1. [x] `StatusUpdateRequest`, `StatusUpdateResponse` 모델 정의
2. [x] `pedal-sync.sh` 호출 유틸리티 (timeout 및 lock 에러 구분 포함)
3. [x] API Key 인증 의존성 정의
4. [x] `/api/status/update` 및 MCP Tool 구현
5. [x] 테스트 코드 작성 및 검증

---

## Version History

| Version | Date       | Changes       | Author |
| ------- | ---------- | ------------- | ------ |
| 0.1     | 2026-04-17 | Initial draft | Gemini |
