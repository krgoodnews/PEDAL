---
template: engineering
version: 1.0
description: /pedal plan 시 자동으로 전용 워크트리를 생성하고 관리하는 기술 상세 설계
variables:
  - feature: auto-worktree
  - date: 2026-04-16
  - author: Gemini CLI
  - project: pedal
  - version: 1.0.0
---

# auto-worktree Engineering Document

> **Summary**: `/pedal plan` 실행 시 상위 디렉토리에 전용 워크트리를 자동으로 생성하고, `/pedal archive` 시 이를 자동으로 제거하는 기술적 메커니즘 설계
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-16
> **Status**: Draft
> **Planning Doc**: [auto-worktree.plan.md](../01-plan/auto-worktree.plan.md)

### Related Documents

| Document                                 | Status    |
| ---------------------------------------- | --------- |
| [Wiki (SSOT)](../wiki/index.md)          | ✅        |
| [Plan](../01-plan/auto-worktree.plan.md)     | ✅        |
| [Sync Script](../../scripts/pedal-sync.sh) | ✅        |

---

## 1. Overview

### 1.1 Engineering Goals

- **워크트리 자동화**: 사용자가 수동으로 `git worktree` 명령어를 칠 필요 없이 `/pedal plan` 하나로 작업 환경을 구축함.
- **리소스 정리**: 프로젝트가 종료(Archive)될 때 물리적인 워크트리 폴더와 Git 등록 정보를 자동으로 제거하여 파일 시스템을 깨끗하게 유지함.
- **경로 무결성**: 중앙 저장소의 `shared.json`과 각 워크트리의 에이전트가 단일한 상태를 공유하도록 절대 경로 시스템을 강화함.

---

## 2. Architecture

### 2.1 File System Layout

```
/Users/yunsu/DEV/
├── PEDAL/                  <-- Main Repository (Primary Worktree)
│   ├── .pedal-status.shared.json
│   └── scripts/pedal-sync.sh
├── pedal-feature-A/        <-- Auto-created Worktree A
└── pedal-feature-B/        <-- Auto-created Worktree B
```

### 2.2 Worktree Lifecycle

1. **Creation (`plan`)**: 
   - `git worktree add ../pedal-{feature} -b feature/{feature}`
2. **Operation (`do`, `analyze`, `learn`)**:
   - 각 워크트리 폴더 내에서 `pedal-sync.sh` 호출 시 중앙 `SHARED_FILE` 경로 감지 및 업데이트.
3. **Deletion (`archive`)**:
   - `git worktree remove ../pedal-{feature}` (중요: 커밋되지 않은 파일 체크)

---

## 3. Implementation Specification

### 3.1 `pedal-sync.sh` 확장 명령

#### `pedal-sync plan --feature {id}`
1. 현재 위치가 메인 저장소인지 확인 (`git rev-parse --is-bare-repository` 등 활용).
2. 브랜치 존재 여부 확인 (`git rev-parse --verify feature/{id}`).
3. 워크트리 생성: `git worktree add ../pedal-{id} -b feature/{id}`.
4. `runtime.json`에 `activeWorktrees` 정보 업데이트.
5. 에이전트에게 새 폴더로의 이동 안내 출력.

#### `pedal-sync archive --feature {id}`
1. 해당 피처의 워크트리 경로를 `runtime.json`에서 조회.
2. 워크트리가 존재할 경우: `git worktree remove {path}`.
3. `runtime.json`에서 해당 정보 삭제.
4. `shared.json`의 상태를 `archived`로 변경.

### 3.2 Error Handling

- **Duplicate Path**: `../pedal-{id}` 폴더가 이미 존재하면 에러 출력 후 중단.
- **Branch Conflict**: 브랜치가 이미 존재하지만 워크트리가 없는 경우, 기존 브랜치를 사용하여 워크트리 생성 시도.
- **Dirty Worktree**: 아카이브 시 워크트리에 커밋되지 않은 변경 사항이 있으면 `git worktree remove`가 실패하므로, 사용자에게 경고 및 `--force` 옵션 안내.

---

## 4. Test Plan

### 4.1 워크트리 생성 테스트
- **Scenario**: 메인 폴더에서 `/pedal plan test-feature` 실행.
- **Success**: `../pedal-test-feature` 폴더가 생성되고, 그 안에서 `git branch` 결과가 `feature/test-feature`로 나옴.

### 4.2 아카이브 및 제거 테스트
- **Scenario**: 작업 완료 후 `/pedal archive test-feature` 실행.
- **Success**: 상위 폴더의 `pedal-test-feature` 디렉토리가 삭제되고, 메인 폴더의 `git worktree list`에서 해당 항목이 제거됨.

---

## 5. Instruction Updates

### 5.1 GEMINI.md / PEDAL.md
- "/pedal plan 시 자동으로 상위 폴더에 워크트리가 생성됩니다." 안내 문구 추가.
- "작업 완료 후 반드시 /pedal archive를 호출하여 워크트리를 정리해 주세요." 강조.

---

## 6. Implementation Guide

### 6.1 Implementation Order

1. [ ] `pedal-sync.sh`에 `plan` 및 `archive` 서브 커맨드 로직 추가
2. [ ] `runtime.json` 경로 조회 유틸리티 강화
3. [ ] 전체 워크플로 테스트

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini CLI |
