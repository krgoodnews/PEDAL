---
template: plan
version: 1.0
description: MCP Kanban Dashboard Planning Document (Revised)
variables:
  - feature: mcp-kanban
  - date: 2026-04-16
  - author: Gemini
  - project: PEDAL
  - version: 0.1.1
---

# mcp-kanban Planning Document

> **Summary**: MCP 서버의 PEDAL 상태를 시각화하는 칸반 대시보드 구축
>
> **Project**: PEDAL
> **Version**: 0.1.1
> **Author**: Gemini
> **Date**: 2026-04-16
> **Status**: Draft (Revised)

---

## 1. Overview

### 1.1 Purpose

PEDAL 프로젝트의 각 피처 상태를 시각적으로 파악할 수 있는 칸반 보드 형태의 웹 대시보드를 제공하여 전체 워크플로 진행 상황을 한눈에 관리합니다.

### 1.2 Background

현재 PEDAL 상태는 `.pedal-status.shared.json` 파일로 관리되며, MCP 서버의 `/api/status` 엔드포인트를 통해 접근 가능합니다. 텍스트 형태의 상태 데이터를 사용자 친화적인 칸반 UI로 변환하여 협업 및 작업 관리를 용이하게 합니다.

### 1.3 Related Documents

- Wiki (project SSOT): [docs/wiki/index.md](../wiki/index.md)
- Status API Source: [mcp-server/server.py](../../mcp-server/server.py)
- Review Report: [docs/01-plan/mcp-kanban.plan.review.md](./mcp-kanban.plan.review.md)

---

## 2. Scope

### 2.1 In Scope

- [ ] Next.js (landing 앱 내) 기반의 대시보드 페이지 (`/dashboard`) 구현
- [ ] MCP 서버의 `/api/status` API 연동 (Read-only)
- [ ] PEDAL 워크플로 단계별 칸반 컬럼 (Plan, Engineering, Do, Analyze, Learn, Archived) 구현
- [ ] 각 피처를 카드로 표시하고 상세 정보(업데이트 시간, 설명 등) 노출
- [ ] 반응형 UI 및 모던한 디자인 적용 (GSAP 활용 애니메이션은 선택 사항으로 포함)

### 2.2 Out of Scope

- 대시보드에서의 직접적인 상태 변경 (POST 요청) - 다음 단계 예정
- 사용자 인증 및 권한 관리 (현재는 로컬/인트라넷 기반 가정)
- 멀티 프로젝트 지원

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority        | Status  |
| ----- | ------------------------- | --------------- | ------- |
| FR-01 | MCP 서버로부터 현재 상태 데이터 조회 | High            | Pending |
| FR-02 | PEDAL 단계별 칸반 보드 레이아웃 구성 | High            | Pending |
| FR-03 | 피처별 상태 카드 렌더링 (이름, 설명, 시간) | High            | Pending |
| FR-04 | 단계별 카드 필터링 및 자동 배치 | High            | Pending |
| FR-05 | 데이터 갱신 기능 (새로고침 버튼) | Medium          | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                        | Measurement Method    |
| ------------- | ------------------------------- | --------------------- |
| Performance   | 초기 로딩 시간 < 1초 (로컬 네트워크) | 브라우저 DevTools     |
| UX/UI         | PEDAL 프로젝트의 룩앤필과 일관성 유지 | 디자인 리뷰           |
| Reliability   | API 오류 시 적절한 에러 메시지 노출 | 수동 테스트           |
| Security      | 개발 환경 외 오리진 제한 정책 수립 | 코드 리뷰 (CORS 설정) |
| Accessibility | 키보드 내비게이션 및 적정 명도 대비 확보 | Lighthouse / 수동 점검 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `/dashboard` 경로에서 칸반 보드 정상 노출
- [ ] MCP 서버 API 응답 데이터가 UI상에 누락 없이 매핑됨
- [ ] 각 카드가 해당 단계의 컬럼에 위치함
- [ ] 브라우저 개발자 도구에서 콘솔 에러 없음
- [ ] TDD 기반의 핵심 컴포넌트(컬럼, 카드 등) 테스트 통과

---

## 5. Risks and Mitigation

| Risk     | Impact          | Likelihood      | Mitigation        |
| -------- | --------------- | --------------- | ----------------- |
| CORS 이슈 | High            | Medium          | 개발 시에는 와일드카드 허용, 운영 시에는 특정 오리진으로 제한 정책 적용 |
| API 통신 장애 | Medium          | Low             | 에러 핸들링 UI 및 재시도 로직 구현 |
| 과도한 애니메이션 | Low             | Low             | GSAP 사용 시 접근성 옵션 고려 및 필수 기능 구현 우선 |

---

## 6. Convention Prerequisites

### 6.1 Existing Project Conventions

- [x] Project config file has coding conventions section
- [x] `docs/wiki/CONVENTIONS.md` exists
- [x] Linter configuration exists (Next.js/ESLint)
- [x] Formatter configuration exists (Prettier)

### 6.2 Conventions to Define/Verify

| Category                  | Current State    | To Define         | Priority |
| ------------------------- | ---------------- | ----------------- | :------: |
| **Naming**                | exists           | PascalCase for components | High |
| **Folder structure**      | exists           | App Router convention | High |
| **Import order**          | exists           | Standardized via ESLint | Medium |
| **Error handling**        | missing          | Global error boundary | Medium |

### 6.3 Environment Variables Needed

| Variable   | Purpose   | Scope         | To Be Created |
| ---------- | --------- | ------------- | :-----------: |
| `NEXT_PUBLIC_API_BASE_URL` | MCP 서버 API 기본 주소 | Client |       ☑       |

---

## 7. Next Steps

1. [ ] Write engineering document (`mcp-kanban.engineering.md`)
2. [ ] Team review and approval (Cursor Review Round 2)
3. [ ] Start implementation in `landing/src/app/dashboard`

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini   |
| 0.1.1   | 2026-04-16 | Revised based on Cursor Review (Security, Env vars, Risks) | Gemini |
