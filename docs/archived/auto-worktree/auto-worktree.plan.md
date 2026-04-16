---
template: plan
version: 1.0
description: /pedal plan 시 자동으로 전용 워크트리를 생성하고 관리하는 시스템 설계
variables:
  - feature: auto-worktree
  - date: 2026-04-16
  - author: Gemini CLI
  - project: pedal
  - version: 1.0.0
---

# auto-worktree Planning Document

> **Summary**: `/pedal plan` 실행 시 상위 디렉토리에 전용 워크트리를 자동으로 생성하여 병렬 작업을 지원하고, 아카이브 시 이를 자동 정리하는 매커니즘 구현
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-16
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

사용자가 여러 기능을 동시에 개발할 때 브랜치를 전환하며 발생하는 컨텍스트 스위칭 비용을 최소화하고, 2계층 상태 관리 시스템(Shared/Runtime)을 활용하여 각 워크트리의 진행 상황을 중앙에서 안전하게 관리하기 위함입니다.

### 1.2 Background

현재는 `/pedal plan` 시 로컬 브랜치만 생성하므로, 다른 기능을 보려면 현재 작업을 커밋하거나 스태시(Stash)해야 하는 불편함이 있습니다. `git worktree`를 활용하면 물리적으로 분리된 폴더에서 여러 기능을 동시에 열어두고 작업할 수 있습니다.

### 1.3 Related Documents

- Wiki (SSOT): [docs/wiki/index.md](../wiki/index.md)
- Engineering: [state-separation.engineering.md](../02-engineering/state-separation.engineering.md)

---

## 2. Scope

### 2.1 In Scope

- [ ] `/pedal plan` 명령어 시 `../pedal-{feature}` 경로에 워크트리 자동 생성 로직 구현
- [ ] 생성된 워크트리 내의 `runtime.json`에 정확한 절대 경로 기록 및 연동
- [ ] `/pedal archive` 명령어 시 해당 워크트리를 안전하게 제거(`git worktree remove`)하는 로직 구현
- [ ] 이미 동일한 이름의 워크트리나 브랜치가 존재할 경우의 예외 처리
- [ ] `PEDAL.md` 및 `GEMINI.md` 가이드라인 최신화

### 2.2 Out of Scope

- 워크트리 간 소스코드 자동 동기화 (각 워크트리는 독립된 브랜치로 간주함)
- 워크트리 폴더 외부의 파일 시스템 변경 사항 감시

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority | Status  |
| ----- | ------------------------- | -------- | ------- |
| FR-01 | `/pedal plan` 시 `git worktree add` 자동 수행 | High | Pending |
| FR-02 | `runtime.json`에 워크트리 경로 및 PID 실시간 업데이트 | High | Pending |
| FR-03 | `/pedal archive` 시 `git worktree remove` 및 폴더 삭제 | High | Pending |
| FR-04 | 워크트리 생성 전 브랜치 존재 여부 확인 및 충돌 방지 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                        | Measurement Method    |
| ------------- | ------------------------------- | --------------------- |
| Safety        | 아카이브 시 커밋되지 않은 파일이 있으면 경고 후 중단 | `git worktree remove` 시 `--force` 미사용 기본값 |
| Consistency   | 어떤 워크트리에서든 중앙 `shared.json` 접근 보장 | `pedal-sync.sh`의 경로 계산 로직 검증 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `/pedal plan` 실행 후 상위 폴더에 새 워크트리가 생성되고 에이전트가 상태를 기록함
- [ ] 생성된 워크트리 폴더 안에서 작업 시 중앙 `shared.json`과 정상 동기화됨
- [ ] `/pedal archive` 실행 후 해당 워크트리가 `git worktree list`에서 사라지고 폴더가 삭제됨
- [ ] `GEMINI.md`에 워크트리 기반 작업 가이드가 업데이트됨

---

## 5. Risks and Mitigation

| Risk     | Impact | Likelihood | Mitigation |
| -------- | ------ | ---------- | ---------- |
| 상위 디렉토리에 폴더가 무분별하게 생성됨 | Medium | High | 아카이브 시 자동 제거 로직을 필수화하여 'Ghost Worktree' 방지 |
| 워크트리 제거 시 작업 내용 유실 | High | Low | `git worktree remove` 전 상태 체크 로직 추가 및 사용 승인 절차 마련 |
| 상대 경로(`../`) 인식 오류 | Medium | Low | 모든 스크립트에서 `git rev-parse --show-toplevel`을 통한 절대 경로 사용 |

---

## 6. Next Steps

1. [ ] Write engineering document (`auto-worktree.engineering.md`)
2. [ ] Implement `worktree` commands in `pedal-sync.sh`
3. [ ] Update phase hooks for Plan and Archive

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini CLI |
