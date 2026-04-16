---
template: plan
version: 1.1
description: PEDAL Plan phase document template with Architecture and Convention considerations
variables:
  - feature: state-separation
  - date: 2026-04-16
  - author: Gemini CLI
  - project: pedal
  - version: 1.1.0
---

# state-separation Planning Document

> **Summary**: 상태 데이터를 공유 상태(Git)와 실행 상태(로컬) 2계층으로 분리하여 병렬 작업 시의 충돌을 방지하는 아키텍처 설계 및 이행
>
> **Project**: pedal
> **Version**: 1.1.0
> **Author**: Gemini CLI
> **Date**: 2026-04-16
> **Status**: Draft (Revised)

---

## 1. Overview

### 1.1 Purpose

여러 에이전트(혹은 사람)가 동시에 프로젝트 내의 다양한 피처를 개발(병렬 워크트리 작업)할 때, 단일 `.pedal-status.json` 파일에 의존함으로써 발생하는 상태 충돌과 Git 병합 이슈를 해결하기 위함입니다. 이를 위해 협업용 "공유 상태(shared state)"와 휘발성 "실행 상태(runtime state)"의 2계층 구조로 상태를 분리합니다.

### 1.2 Background

기존 PEDAL 워크플로는 `.pedal-status.json` 파일을 현재 워크트리에 저장했습니다. 하지만 기능 단위로 Git 브랜치나 워크트리를 분리해서 병렬로 작업할 경우, 워크트리마다 상태가 파편화되어 전체적인 PEDAL 티켓 진행 상황을 파악하고 동기화하는 데 어려움이 발생했습니다. 

### 1.3 Related Documents

- Wiki (project SSOT): [docs/wiki/index.md](../wiki/index.md)
- Requirements: 2계층 상태 분리 (2-Tier State Separation)
- Review: [docs/01-plan/state-separation.plan.review.md](./state-separation.plan.review.md)

---

## 2. Scope

### 2.1 In Scope

- [ ] `.pedal-status.shared.json` (Git 기록용) 및 `~/.pedal/<repo-id>/runtime.json` (로컬 런타임용) 스키마 설계
- [ ] 상태 읽기 및 쓰기 시 동시성 이슈를 방지할 수 있는 File Lock 기반 셸 스크립트(`pedal-sync.sh` 등) 작성
- [ ] `GEMINI.md` 및 `.cursor/rules/pedal.mdc`의 지시문을 새로운 상태 관리 구조에 맞게 업데이트
- [ ] **SSOT 동기화**: 변경된 구조를 반영하기 위한 [`.pedal/PEDAL.md`](../.pedal/PEDAL.md) 문서 업데이트 포함
- [ ] **데이터 이행**: 기존 `.pedal-status.json`의 데이터를 새로운 2계층 구조로 안전하게 마이그레이션하는 로직

### 2.2 Out of Scope

- 실시간 통합 UI(대시보드) 구현 자체 (상태 분리에만 초점을 맞추며, 향후 UI 확장이 가능하게끔 JSON 구조만 설계)
- 단일 DB 데몬(SQLite 등)을 띄워 관리하는 별도의 중앙 API 서버 아키텍처 구현 (로컬 파일 기반 Lock으로 우선 해결)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority | Status  |
| ----- | ------------------------- | -------- | ------- |
| FR-01 | 실행 상태(Runtime)와 공유 상태(Shared, Append-Only 고려) 분리 구조의 JSON 스키마 명세 작성 | High | Pending |
| FR-02 | `pedal-sync.sh` 스크립트를 통한 안전한 JSON 읽기/쓰기 (Advisory Lock 구현) | High | Pending |
| FR-03 | 프로젝트 내 AI 지시문 (`GEMINI.md`, `pedal.mdc`, `PEDAL.md`) 최신화 반영 | High | Pending |
| FR-04 | 기존 `.pedal-status.json` 데이터를 새로운 공유 상태 파일로 자동 이행(Migration) 및 이전 파일 제거/백업 | High | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                        | Measurement Method    |
| ------------- | ------------------------------- | --------------------- |
| Reliability   | 동시 쓰기(Concurrency) 환경에서 데이터 손실이 없어야 함 | 10개 병렬 프로세스 x 100회 반복 쓰기 시 JSON 무결성 검증 |
| Maintainability | Git 브랜치 Merge 시 충돌 최소화 로직 탑재 | main 브랜치 기준 pull-then-merge 전략 또는 Append-only 검증 |
| Compatibility | 단일 워크트리 환경에서도 정상 작동 보장 | 기존 단일 워크트리 환경에서의 동작 테스트 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 런타임 및 공유 상태의 JSON 스키마 문서화 완료
- [ ] 상태 동기화 및 Lock 처리용 셸 스크립트 정상 작동 확인 (스트레스 테스트 통과)
- [ ] `GEMINI.md`, Cursor Rule 및 `PEDAL.md` 업데이트 완료
- [ ] 기존 상태 데이터의 이행 완료 및 기존 파일 제거 확인

---

## 5. Risks and Mitigation

| Risk     | Impact | Likelihood | Mitigation |
| -------- | ------ | ---------- | ---------- |
| `shared.json` 브랜치 병합 시 Git Conflict | High | High | 상태 업데이트 시 `main` 브랜치 기준 최신 상태를 Pull 후 병합(Merge)하거나, Append-Only 히스토리 구조 활용 |
| File Lock 오작동으로 인한 데드락(Deadlock) 상태 | Medium | Low | Lock 파일이 일정 시간(예: 10초) 초과 시 stale Lock으로 간주하여 강제로 해제하거나 소유 PID 확인 로직 추가 |

---

## 6. Convention Prerequisites

### 6.1 Existing Project Conventions

- [x] `docs/wiki/CONVENTIONS.md` (Wiki 내 프로젝트 공통 컨벤션 존재)
- [x] `.pedal/PEDAL.md` (워크플로 SSOT 존재)

### 6.2 Conventions to Define/Verify

| Category                  | Current State    | To Define         | Priority |
| ------------------------- | ---------------- | ----------------- | :------: |
| **Naming**                | Proposed | `~/.pedal/<repo-id>/runtime.json`, `.pedal-status.shared.json` |   High   |
| **Folder structure**      | Proposed | `~/.pedal/<repo-id>/` (다중 저장소 대응을 위해 repo-id 필수 포함) |   High   |

### 6.3 Environment Variables Needed

| Variable   | Purpose   | Scope         | To Be Created |
| ---------- | --------- | ------------- | :-----------: |
| 없음       | -         | -             |       ☐       |

---

## 7. Next Steps

1. [ ] Write engineering document (`state-separation.engineering.md`)
2. [ ] Team review and approval
3. [ ] Start implementation

---

## Review Response

| ID | Review Point | Response | Action |
| --- | --- | --- | --- |
| C-01 | Migration requirements | Accepted. Added FR-04 for migration from existing `.pedal-status.json`. | Updated FR table |
| W-01 | Runtime path mismatch | Accepted. Using `~/.pedal/<repo-id>/runtime.json` to support multiple repos on the same machine. | Updated 6.2 Naming |
| W-02 | Shared filename | Accepted. Finalized as `.pedal-status.shared.json` for consistency. | Updated 6.2 Naming |
| W-03 | Append-Only logic | Accepted. Added to FR-01 as a sub-requirement for shared state. | Updated FR-01 |
| W-04 | Lock mechanism details | Accepted. Will use advisory lock and specify retry/timeout in Engineering. | Updated FR-02 |
| I-01 | Checklist cleanup | Accepted. Removed irrelevant convention items. | Updated 6.1 |
| I-02 | Scope expansion | Accepted. Explicitly mentioned `.pedal/PEDAL.md` update in Scope. | Updated 2.1 |
| I-03 | Stress test quantification| Accepted. Defined 10 concurrent x 100 iterations in NFR. | Updated 3.2 |

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini CLI |
| 1.1     | 2026-04-16 | Revised per review (Migration, Concurrency, Naming) | Gemini CLI |