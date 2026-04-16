---
template: engineering
version: 1.0
description: 상태 데이터를 공유 상태(Git)와 실행 상태(로컬) 2계층으로 분리하기 위한 상세 기술 설계
variables:
  - feature: state-separation
  - date: 2026-04-16
  - author: Gemini CLI
  - project: pedal
  - version: 1.0.0
---

# state-separation Engineering Document

> **Summary**: 병렬 작업을 지원하기 위해 PEDAL 상태 관리 아키텍처를 로컬 런타임과 Git 공유 계층으로 분리하고, 동시성 제어를 위한 동기화 스크립트를 구현함.
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-16
> **Status**: Draft
> **Planning Doc**: [state-separation.plan.md](../01-plan/state-separation.plan.md)

### Related Documents

| Document                                 | Status    |
| ---------------------------------------- | --------- |
| [Wiki (SSOT)](../wiki/index.md)          | ✅        |
| [Plan](../01-plan/state-separation.plan.md)     | ✅        |
| [Conventions](../wiki/CONVENTIONS.md) | ✅        |
| [Prompt](../01-plan/state-separation.prompt.md) | ✅        |

---

## 1. Overview

### 1.1 Engineering Goals

- **상태 분리**: Git에 커밋되는 협업 상태와 로컬 머신에 국한된 실행 상태를 명확히 분리함.
- **동시성 보장**: 여러 에이전트가 동시에 상태를 변경할 때 데이터 유실(Race Condition)을 방지함.
- **병렬성 지원**: Git Worktree 기반의 병렬 작업 환경에서 단일한 진행 상황 뷰(View)를 제공함.
- **자동 이행**: 기존 단일 파일 구조에서 새로운 2계층 구조로의 무중단 전환을 지원함.

### 1.2 Engineering Principles

- **Single Source of Truth (SSOT)**: 런타임 정보는 로컬 파일, 비즈니스 진행 상황은 Git 파일로 단일화함.
- **Advisory Locking**: 셸 스크립트 수준에서 파일 시스템 락을 활용해 원자적(Atomic) 연산을 보장함.
- **Fail-fast**: 데이터 정합성에 문제가 생길 경우 즉시 에러를 발생시켜 전파를 막음.

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────┐       ┌──────────────────────────┐
│  Agent (CLI)    │──────▶│ scripts/pedal-sync.sh    │
└─────────────────┘       └─────────────┬────────────┘
                                        │
                    ┌───────────────────┴────────────────────┐
                    ▼                                        ▼
      [Shared State (Git)]                     [Runtime State (Local)]
  .pedal-status.shared.json                ~/.pedal/<repo-id>/runtime.json
      (Tracked in Git)                        (Untracked, Global)
```

### 2.2 Data Flow (Update State)

1. Agent가 `pedal-sync.sh update --feature auth --phase do` 호출
2. 스크립트가 `~/.pedal/<repo-id>/runtime.lock` 생성 시도 (Advisory Lock)
3. **Shared Read**: `.pedal-status.shared.json` 읽기
4. **Runtime Read**: `runtime.json` 읽기
5. **Logic**: 데이터 병합 및 업데이트 (Append history, update phase)
6. **Shared Write**: `git checkout master -- .pedal-status.shared.json` (최신본 병합 시도) 후 쓰기
7. **Runtime Write**: `runtime.json` 쓰기
8. Lock 해제

---

## 3. Data Model

### 3.1 Shared State Definition (`.pedal-status.shared.json`)

```json
{
  "version": "2.0",
  "lastUpdated": "ISO 8601 Timestamp",
  "features": {
    "{feature-id}": {
      "phase": "plan|engineering|do|analyze|learn|archived",
      "status": "pending|in_progress|completed|blocked",
      "updatedAt": "ISO 8601",
      "description": "string"
    }
  },
  "history": [
    {
      "timestamp": "ISO 8601",
      "action": "phase_start|phase_progression|archive",
      "feature": "{feature-id}",
      "details": "string"
    }
  ]
}
```

### 3.2 Runtime State Definition (`~/.pedal/<repo-id>/runtime.json`)

```json
{
  "repoRoot": "absolute path",
  "activeWorktrees": {
    "{feature-id}": "path/to/worktree"
  },
  "agentLocks": {
    "{feature-id}": {
      "pid": "number",
      "startTime": "ISO 8601",
      "terminal": "string"
    }
  },
  "lastActivity": "ISO 8601"
}
```

---

## 4. Implementation Specification

### 4.1 Repository ID Generation

`repo-id`는 저장소 루트의 절대 경로를 SHA-256 해시 처리한 앞 8자리 문자열을 사용함.
`REPO_ID=$(printf "%s" "$(git rev-parse --show-toplevel)" | shasum -a 256 | cut -c1-8)`

### 4.2 Lock Mechanism (`pedal-sync.sh`)

- **Lock Path**: `~/.pedal/${REPO_ID}/runtime.lock`
- **Acquire**: `mkdir "${LOCK_PATH}"` (원자적 연산 활용)
- **Retry**: 0.5초 간격으로 최대 20회 시도 (총 10초)
- **Stale Lock**: 락 파일 내부의 PID가 더 이상 존재하지 않거나, 생성 시간이 1분 이상 경과한 경우 강제 삭제 로직 포함.

### 4.3 Migration Logic

1. `.pedal-status.json` 존재 여부 확인.
2. 존재 시, 해당 내용을 읽어 `.pedal-status.shared.json`으로 복사.
3. `runtime.json` 초기화 (현재 워크트리를 기본값으로 설정).
4. 기존 `.pedal-status.json`을 `.pedal-status.json.bak`으로 백업 후 삭제 지시.

---

## 5. Instruction Updates (GEMINI.md / PEDAL.md)

### 5.1 GEMINI.md 업데이트

- 모든 상태 변경 명령(`/pedal plan`, `do`, 등)은 내부적으로 `scripts/pedal-sync.sh`를 호출하여 상태를 업데이트해야 함.
- 직접 JSON 파일을 수정하는 대신 스크립트를 경유하도록 강제함.

### 5.2 PEDAL.md 업데이트

- "2-Tier State Management" 섹션 추가.
- `shared.json`과 `runtime.json`의 역할을 명시하고, 병렬 작업 시 `git worktree` 사용을 권장함.

---

## 6. Test Plan

### 6.1 스트레스 테스트 (Concurrency)

- **Scenario**: 10개의 백그라운드 프로세스가 동시에 서로 다른 피처의 상태를 100회 업데이트 시도.
- **Success**: 최종 `shared.json`의 `history` 배열 길이는 1000이어야 하며, JSON 포맷이 유효해야 함.

### 6.2 마이그레이션 테스트

- **Scenario**: 기존 프로젝트에서 `pedal-sync.sh init` 실행.
- **Success**: 데이터 유실 없이 두 개의 파일로 분리 생성됨 확인.

---

## 7. Implementation Guide

### 7.1 File Structure

```
{project root}/
├── .pedal-status.shared.json (새로운 공유 상태)
├── scripts/
│   ├── pedal-sync.sh        (통합 동기화 스크립트)
│   └── pedal-common.sh      (공통 유틸리티 - 해시, 경로 계산)
└── .pedal/
    └── PEDAL.md             (문서 업데이트)
```

### 7.2 Implementation Order

1. [ ] `pedal-common.sh` 작성 (Repo ID 및 경로 계산 로직)
2. [ ] `pedal-sync.sh` 작성 (Lock 및 CRUD 로직)
3. [ ] 마이그레이션 로직 테스트 및 실행
4. [ ] `GEMINI.md`, `PEDAL.md`, Cursor Rule 업데이트
5. [ ] 스트레스 테스트 수행

---

## 8. Self-Review Criteria (Do → Analyze Gate)

### 8.1 Implementation Completeness

- `shared.json`과 `runtime.json`이 의도한 경로에 생성되는가?
- 병렬 프로세스 실행 시 Lock이 정상적으로 작동하여 충돌을 막는가?
- 기존 데이터가 유실 없이 마이그레이션되는가?

### 8.2 Ready for Analyze

```bash
/pedal analyze state-separation
```

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini CLI |
