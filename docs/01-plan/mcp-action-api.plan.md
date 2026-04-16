---
template: plan
version: 1.2
description: MCP Action API Planning Document (Final Revision)
variables:
  - feature: mcp-action-api
  - date: 2026-04-16
  - author: Gemini
  - project: PEDAL
  - version: 0.1.2
---

# mcp-action-api Planning Document

> **Summary**: MCP 서버에 PEDAL 티켓 단계 이동을 위한 POST API 구현 (스크립트 기반 업데이트)
>
> **Project**: PEDAL
> **Version**: 0.1.2
> **Author**: Gemini
> **Date**: 2026-04-16
> **Status**: Draft (Final Revision)

---

## 1. Overview

### 1.1 Purpose

PEDAL 대시보드 및 AI 에이전트가 특정 피처의 단계를 변경할 수 있도록 하는 실행형(Action) API를 제공합니다. 이를 통해 상태 관리 자동화와 UI를 통한 직관적인 작업 제어가 가능해집니다.

### 1.2 Background

현재 상태 조회(GET) 기능은 구현되어 있으나, 상태 변경(POST)은 `pedal-sync.sh` 스크립트를 수동으로 호출해야 합니다. `mcp-fastapi-backend` 아카이브 리포트에서 제안된 "Hybrid Backend Action API" 개념을 실현하여, MCP Tool과 REST 엔드포인트를 통합한 상태 관리 인터페이스를 구축합니다.

### 1.3 Related Documents

- Wiki (project SSOT): [docs/wiki/index.md](../wiki/index.md)
- Context: [docs/archived/mcp-fastapi-backend/mcp-fastapi-backend.report.md](../archived/mcp-fastapi-backend/mcp-fastapi-backend.report.md)
- Status File: [`.pedal-status.shared.json`](../../.pedal-status.shared.json)
- Review Reports: [docs/01-plan/mcp-action-api.plan.review.md](./mcp-action-api.plan.review.md), [.v2.md](./mcp-action-api.plan.review.v2.md)

---

## 2. Scope

### 2.1 In Scope

- [ ] FastAPI 기반의 `POST /api/status/update` 엔드포인트 구현
- [ ] **중요**: 모든 상태 업데이트는 `scripts/pedal-sync.sh update`를 호출하여 수행.
- [ ] **필드 일관성**: API는 상태 파일을 직접 수정하지 않으며, `pedal-sync.sh`가 보장하는 전체 필드(`phase`, `status`, `updatedAt`, `history`, `lastUpdated`, `session.lastActivity`) 갱신 계약을 그대로 따름.
- [ ] 입력 데이터 검증 (Pydantic 모델 활용: feature_id, phase, description)
- [ ] MCP Tool 등록: `update_pedal_status` (AI 에이전트용)

### 2.2 Out of Scope

- [ ] 작업 공간 생성(worktree create) 연동
- [ ] 복잡한 사용자 권한/인증
- [ ] Git 커밋/푸시 자동화 (스크립트 내부 로직에 의존)
- [ ] 웹 대시보드 프론트엔드 UI 수정 (API 제공까지만 포함)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority        | Status  |
| ----- | ------------------------- | --------------- | ------- |
| FR-01 | 피처 ID와 대상 단계를 전달받아 `pedal-sync.sh` 호출 | High            | Pending |
| FR-02 | 스크립트 실행 결과를 파싱하여 성공/실패 여부 반환 | High            | Pending |
| FR-03 | MCP 도구를 통해 AI 에이전트가 상태 변경 명령 수행 | High            | Pending |
| FR-04 | 유효하지 않은 단계로의 변경 요청 시 스크립트 에러 처리 | Medium          | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                        | Measurement Method    |
| ------------- | ------------------------------- | --------------------- |
| Consistency   | `pedal-sync.sh`의 잠금 메커니즘을 통한 동시성 보장 | 단위 테스트 |
| Security      | 허용된 Phase 값 이외의 입력 차단 | Pydantic Enum 검증 |
| Reliability   | 서브프로세스 호출 실패 시 적절한 HTTP 상태 코드 반환 | 수동 테스트 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `POST /api/status/update` 호출 후 `.pedal-status.shared.json`이 의도대로 변경됨
- [ ] MCP Tool `update_pedal_status`가 정상 호출되어 상태가 변경됨
- [ ] API 응답에 변경된 상태의 요약 정보가 포함됨
- [ ] 로그에서 `pedal-sync.sh` 호출 이력 확인 가능

---

## 5. Risks and Mitigation

| Risk     | Impact          | Likelihood      | Mitigation        |
| -------- | --------------- | --------------- | ----------------- |
| 스크립트 호출 오버헤드 | Low             | Low             | 빈번한 호출이 아니므로 성능 이슈 미미할 것으로 예상 |
| 스크립트 경로 문제 | Medium          | Low             | 절대 경로 또는 환경 변수를 통한 스크립트 위치 고정 |

---

## 6. Convention Prerequisites

### 6.1 Existing Project Conventions

- [x] Python 개발 컨벤션 (FastAPI, Pydantic)
- [x] `docs/wiki/CONVENTIONS.md` (상태 관리 원칙: Always use sync script)

### 6.2 Conventions to Define/Verify

| Category                  | Current State    | To Define         | Priority |
| ------------------------- | ---------------- | ----------------- | :------: |
| **API Endpoint Naming**   | missing          | `/api/status/update` |   High   |
| **Phase Enum**            | missing          | API용 단계 리스트 |   High   |

---

## 7. Next Steps

1. [ ] Write engineering document (`mcp-action-api.engineering.md`)
2. [ ] Team review (Pass confirmed by reviewer Round 2 feedback)
3. [ ] Implement subprocess call logic in FastAPI

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini   |
| 1.1     | 2026-04-16 | Revised: Enforce script-based updates, narrowed scope | Gemini   |
| 1.2     | 2026-04-16 | Finalized: Clarified field consistency and archived report link | Gemini |
