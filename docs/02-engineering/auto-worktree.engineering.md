---
template: engineering
version: 1.1
description: /pedal plan 시 자동으로 전용 워크트리를 생성하고 관리하는 기술 상세 설계
variables:
  - feature: auto-worktree
  - date: 2026-04-16
  - author: Gemini CLI
  - project: pedal
  - version: 1.1.0
---

# auto-worktree Engineering Document

> **Summary**: `/pedal plan` 실행 시 상위 디렉토리에 전용 워크트리를 자동으로 생성하고, `/pedal archive` 시 이를 자동으로 제거하는 기술적 메커니즘 설계 (리뷰 반영 완료)
>
> **Project**: pedal
> **Version**: 1.1.0
> **Author**: Gemini CLI
> **Date**: 2026-04-16
> **Status**: Draft (Revised)
> **Planning Doc**: [auto-worktree.plan.md](../01-plan/auto-worktree.plan.md)

### Related Documents

| Document                                 | Status    |
| ---------------------------------------- | --------- |
| [Wiki (SSOT)](../wiki/index.md)          | ✅        |
| [Plan](../01-plan/auto-worktree.plan.md)     | ✅        |
| [Sync Script](../../scripts/pedal-sync.sh) | ✅        |
| [Review](./auto-worktree.engineering.review.md) | ✅        |

---

## 1. Overview

### 1.1 Engineering Goals

- **워크트리 자동화**: 사용자가 수동으로 `git worktree` 명령어를 칠 필요 없이 `/pedal plan` 하나로 작업 환경을 구축함.
- **리소스 정리**: 프로젝트가 종료(Archive)될 때 물리적인 워크트리 폴더와 Git 등록 정보를 자동으로 제거하여 파일 시스템을 깨끗하게 유지함.
- **경로 무결성**: 중앙 저장소의 `shared.json`과 각 워크트리의 에이전트가 단일한 상태를 공유하도록 **절대 경로(Absolute Path)** 시스템을 강화함.

---

## 2. Architecture

### 2.1 File System Layout (Absolute Pathing)

워크트리는 항상 **메인 저장소(Primary Worktree)의 상위 디렉토리**를 기준으로 생성됨.
`WORKSPACE_ROOT=$(dirname "$(git rev-parse --show-toplevel)")`

```
${WORKSPACE_ROOT}/
├── {repo-name}/            <-- Main Repository (Primary Worktree)
│   ├── .pedal-status.shared.json
│   └── scripts/pedal-sync.sh
├── {repo-name}-{feature-A}/ <-- Auto-created Worktree A
└── {repo-name}-{feature-B}/ <-- Auto-created Worktree B
```

### 2.2 Worktree Lifecycle

1. **Creation (`plan`)**: 
   - `git worktree add ${WORKSPACE_ROOT}/{repo-name}-{feature} -b feature/{feature}`
2. **Operation (`do`, `analyze`, `learn`)**:
   - 각 워크트리 내 `runtime.json`에 **절대 경로**로 워크트리 위치 기록.
3. **Deletion (`archive`)**:
   - `git worktree remove ${WORKSPACE_ROOT}/{repo-name}-{feature}`
   - `git worktree prune` (잔여 메타데이터 정리)

---

## 3. Implementation Specification

### 3.1 `pedal-sync.sh` 확장 명령

#### `pedal-sync plan --feature {id}`
1. **Lock Acquire**: `acquire_lock`을 호출하여 병렬 생성 충돌 방지.
2. **Path Resolution**: `WORKSPACE_ROOT`와 `TARGET_PATH`를 절대 경로로 계산.
3. **Existence Check**: `git worktree list` 및 디렉토리 존재 여부 확인.
4. **Worktree Add**: `git worktree add "${TARGET_PATH}" -b "feature/${id}"`.
5. **Runtime Update**: `activeWorktrees`에 절대 경로 저장.

#### `pedal-sync archive --feature {id}`
1. `runtime.json`에서 해당 피처의 **절대 경로** 조회.
2. `git worktree remove "${TARGET_PATH}"` 실행 (Dirty check 자동 수행).
3. `git worktree prune`으로 메타데이터 정리.
4. `runtime.json` 및 `shared.json` 업데이트.

### 3.2 Error Handling

- **Context-Free**: 어떤 워크트리 폴더에서 실행하더라도 `$(git rev-parse --show-toplevel)`을 통해 메인 저장소를 기준으로 경로를 일관되게 계산함.
- **Atomic Move**: `git worktree remove` 실패 시(Dirty 상태) 사용자에게 `git commit` 또는 `--force` 사용 안내 메시지 출력.

---

## 4. Test Plan

### 4.1 절대 경로 생성 테스트
- **Scenario**: 하위 워크트리 폴더(`../repo-A`)에서 `/pedal plan feature-B` 실행.
- **Success**: `../repo-B`가 메인 저장소와 나란히 생성됨 (중첩 생성 방지).

### 4.2 아카이브 및 메타데이터 정리 테스트
- **Scenario**: `/pedal archive feature-A` 후 `git worktree list` 실행.
- **Success**: 해당 항목이 완전히 사라짐 (`prune` 효과 확인).

---

## Review Response

| ID | Review Point | Response | Action |
| --- | --- | --- | --- |
| W-01 | Context-Dependent Path | 수용. 상위 디렉토리를 절대 경로로 계산하여 중첩 생성 방지. | 섹션 2.1, 3.1 업데이트 |
| W-02 | Runtime Schema Clarity | 수용. `runtime.json`에 모든 경로를 절대 경로로 기록하도록 명시. | 섹션 1.1, 2.2 업데이트 |
| W-03 | Race Condition | 수용. `git worktree` 명령 전 `acquire_lock` 호출을 필수화. | 섹션 3.1 업데이트 |
| I-01 | Metadata Pruning | 수용. 아카이브 시 `git worktree prune` 추가. | 섹션 2.2, 3.1 업데이트 |
| I-02 | Repo Naming | 수용. `pedal-` 접두사 대신 실제 저장소 폴더명을 기반으로 워크트리 명명. | 섹션 2.1 업데이트 |

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini CLI |
| 1.1     | 2026-04-16 | Revised per review (Absolute pathing, Pruning, Lock) | Gemini CLI |
