---
template: plan
version: 1.0
description: PEDAL Plan phase document template with Architecture and Convention considerations
variables:
  - feature: conventions
  - date: 2026-04-12
  - author: Gemini CLI
  - project: PEDAL
  - version: 1.0.0
---

# conventions Planning Document

> **Summary**: PEDAL 워크플로 시작 시 항상 참조되는 개발 컨벤션 위치 및 접근 방식 정립
>
> **Project**: PEDAL
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-12
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

프로젝트의 개발 컨벤션(예: TDD 적용 여부 등)을 기록해둔 파일의 적절한 위치와 네이밍을 고민하고, PEDAL 워크플로의 모든 단계(Plan, Engineering, Do, Analyze)에서 AI가 이를 무조건 참조하도록 워크플로 템플릿과 시스템 프롬프트를 개선합니다.

### 1.2 Background

현재 루트 경로의 `01-plan/conventions.md` 파일에 TDD 기반의 개발 및 테스트 지침이 작성되어 있습니다. 하지만 `01-plan` 디렉터리는 본래 각 기능(feature)의 단발성 계획(plan) 문서가 위치하는 `docs/01-plan`과도 혼동될 수 있는 구조이며, 기능에 국한되지 않는 전역 컨벤션을 담기에는 적합하지 않습니다.
프로젝트 전반에 걸친 영구적이고 누적되는 지식의 저장소(SSOT)인 `docs/wiki/`에 컨벤션 문서가 위치하는 것이 구조적으로 가장 적합합니다.
또한, 워크플로 실행 시 이 컨벤션이 빠짐없이 반영되도록 템플릿과 시스템 프롬프트(지침)의 참조 경로를 수정해야 합니다.

### 1.3 Related Documents

- Wiki (project SSOT): [docs/wiki/index.md](../wiki/index.md)
- 기존 컨벤션 원본: `01-plan/conventions.md`

---

## 2. Scope

### 2.1 In Scope

- [ ] 기존 루트 `01-plan/conventions.md` 파일을 `docs/wiki/conventions.md` 로 이동
- [ ] `docs/wiki/index.md` 에 `conventions.md` 링크 추가
- [ ] `.pedal/templates/` 하위의 모든 템플릿 파일(`plan.template.md`, `engineering.template.md`, `analysis.template.md` 등)에서 기존의 유령 경로(`docs/01-plan/conventions.md`)를 `docs/wiki/conventions.md` 로 수정
- [ ] 워크플로를 주도하는 에이전트 지침(`.pedal/PEDAL.md`, `GEMINI.md`, `.cursor/rules/pedal.mdc`)에 `docs/wiki/conventions.md` 필수 참조 명시

### 2.2 Out of Scope

- 컨벤션 내용 자체에 대한 대규모 수정이나 추가 정의 (위치 이동 및 적용 보장에만 집중)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement | Priority | Status |
| ----- | ----------- | -------- | ------ |
| FR-01 | `docs/wiki/conventions.md` 생성 및 기존 내용 마이그레이션 | High | Pending |
| FR-02 | 워크플로 템플릿(`plan`, `engineering`, `analysis` 등)에서 컨벤션 문서 참조 경로 수정 | High | Pending |
| FR-03 | AI 에이전트 지침 문서(`.pedal/PEDAL.md`, `GEMINI.md`, `.cursor/rules/pedal.mdc`)의 Plan, Engineering, Do, Analyze 단계에 `docs/wiki/conventions.md` 필수 확인 명시 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
| -------- | -------- | ------------------ |
| Consistency | PEDAL의 SSOT(단일 진실 공급원) 철학 준수 | Wiki 디렉터리 내 위치 여부 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `docs/wiki/conventions.md` 위치에 컨벤션 내용이 안전하게 이동됨
- [ ] 워크플로 템플릿 파일이 `docs/wiki/conventions.md` 를 참조하도록 일괄 업데이트됨
- [ ] 관련 AI 지침(`.pedal/PEDAL.md`, `GEMINI.md`, `.cursor/rules/pedal.mdc`) 업데이트 완료
- [ ] 기존 `01-plan/conventions.md` 위치에 혼선 방지를 위한 안내 문구(stub) 남기기 또는 파일 삭제

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
| ---- | ------ | ---------- | ---------- |
| 기존 컨벤션 문서 경로 변경으로 인한 혼선 | Low | Low | 기존 파일을 이동시키고 템플릿의 참조를 업데이트함으로써 혼선을 원천 방지하며, 기존 경로를 참조하던 외부 링크 대비를 위해 파일 삭제 대신 이동 안내 문구를 남기는 방법도 고려 |

---

## 6. Convention Prerequisites

### 6.1 Existing Project Conventions

- [ ] Project config file has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (실제로는 루트 `01-plan/conventions.md` 존재)
- [ ] `docs/wiki/conventions.md` (생성 예정)

### 6.2 Conventions to Define/Verify

N/A

### 6.3 Environment Variables Needed

N/A

---

## 7. Next Steps

1. [ ] Write engineering document (`conventions.engineering.md`)
2. [ ] Team review and approval
3. [ ] Start implementation

---

## Version History

| Version | Date | Changes | Author |
| ------- | ---- | ------- | ------ |
| 0.2 | 2026-04-12 | Addressed review comments | Gemini CLI |
| 0.1 | 2026-04-12 | Initial draft | Gemini CLI |
