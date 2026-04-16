# limit-review-cycles Planning Document

> **Summary**: PEDAL 사이클 리뷰 횟수를 최대 2회로 제한하고, 2차 리뷰는 Critical 항목이 있을 때만 수행하도록 정책을 변경함.
>
> **Project**: PEDAL
> **Version**: 2.0
> **Author**: Gemini CLI
> **Date**: 2026-04-16
> **Status**: Approved

---

## 1. Overview

### 1.1 Purpose

PEDAL 사이클 진행 중 발생하는 리뷰 횟수가 과도하게 많아지는 것을 방지하여 개발 속도를 높이고 피로도를 줄임.

### 1.2 Background

사용자가 리뷰를 8차까지 받는 등의 비효율적인 상황이 발생함. 이를 방지하기 위해 명확한 리뷰 종료 조건을 설정할 필요가 있음.

### 1.3 Related Documents

- Wiki (project SSOT): [docs/wiki/index.md](../wiki/index.md)
- PEDAL Workflow: [.pedal/PEDAL.md](../../.pedal/PEDAL.md)
- Review Protocol: [.pedal/REVIEW.md](../../.pedal/REVIEW.md)
- Gemini CLI Hook: [GEMINI.md](../../GEMINI.md)

---

## 2. Scope

### 2.1 In Scope

- [x] 리뷰 최대 횟수를 2회로 제한하는 정책 명시
- [x] 2차 리뷰 수행 조건을 "1차 리뷰에 Critical 항목이 존재할 때"로 한정
- [ ] 2차 리뷰 후에도 Critical 항목이 남았을 경우의 명확한 종료 규칙 정의 (에스컬레이션 또는 강제 종료)
- [ ] `.pedal/PEDAL.md`, `.pedal/REVIEW.md`, `GEMINI.md` 문서 업데이트
- [ ] 이번 사이클부터 즉시 적용

### 2.2 Out of Scope

- 리뷰어 에이전트(Cursor CLI 등)의 리뷰 로직 자체 변경
- PEDAL 사이클 외의 다른 개발 프로세스 변경

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority        | Status  |
| ----- | ------------------------- | --------------- | ------- |
| FR-01 | 리뷰 횟수 상한(2회) 설정 | High | Pending |
| FR-02 | 2차 리뷰 조건(Critical 존재 시) 설정 | High | Pending |
| FR-03 | 2차 리뷰 후 Critical 미해결 시 종료 규칙 명시 | High | Pending |
| FR-04 | 관련 가이드 문서(PEDAL.md, REVIEW.md, GEMINI.md) 업데이트 | High | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                        | Measurement Method    |
| ------------- | ------------------------------- | --------------------- |
| Usability     | 변경된 정책이 명확하게 이해되어야 함 | 문서 가독성 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [x] 리뷰 횟수 및 조건 정책 정의 완료
- [ ] 관련 문서(.pedal/PEDAL.md, .pedal/REVIEW.md, GEMINI.md) 수정 완료
- [ ] 수정된 문서에 대한 리뷰 완료 (새로운 정책 적용)

---

## 5. Risks and Mitigation

| Risk     | Impact          | Likelihood      | Mitigation        |
| -------- | --------------- | --------------- | ----------------- |
| Critical 항목이 2차 리뷰에서도 해결되지 않을 경우 | Medium | Low | 2차 리뷰 후에는 사용자에게 판단을 맡기고 강제 종료하거나 명시적 승인을 받도록 함 |

---

## 6. Convention Prerequisites

### 6.1 Existing Project Conventions

- [x] `docs/wiki/CONVENTIONS.md` exists
- [x] PEDAL workflow defines review protocol in `.pedal/REVIEW.md`
- [x] `GEMINI.md` contains agent-specific commands

---

## 7. Next Steps

1. [ ] Write engineering document (`limit-review-cycles.engineering.md`)
2. [ ] Update `.pedal/PEDAL.md`, `.pedal/REVIEW.md`, and `GEMINI.md` based on engineering design
3. [ ] Final review and approval

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.2     | 2026-04-16 | Addressed review feedback (Scope, exit rules) | Gemini CLI |
| 0.1     | 2026-04-16 | Initial draft | Gemini CLI |
