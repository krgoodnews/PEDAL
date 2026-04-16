---
template: engineering
version: 1.1
description: 상태 데이터를 공유 상태(Git)와 실행 상태(로컬) 2계층으로 분리하기 위한 상세 기술 설계
variables:
  - feature: state-separation
  - date: 2026-04-16
  - author: Gemini CLI
  - project: pedal
  - version: 1.1.0
---

# state-separation Engineering Document

> **Summary**: 병렬 작업을 지원하기 위해 PEDAL 상태 관리 아키텍처를 로컬 런타임과 Git 공유 계층으로 분리하고, 동시성 제어를 위한 동기화 스크립트를 구현함.
>
> **Project**: pedal
> **Version**: 1.1.0
> **Author**: Gemini CLI
> **Date**: 2026-04-16
> **Status**: Draft (Revised)
> **Planning Doc**: [state-separation.plan.md](../01-plan/state-separation.plan.md)

### Related Documents

| Document                                 | Status    |
| ---------------------------------------- | --------- |
| [Wiki (SSOT)](../wiki/index.md)          | ✅        |
| [Plan](../01-plan/state-separation.plan.md)     | ✅        |
| [Conventions](../wiki/CONVENTIONS.md) | ✅        |
| [Prompt](../01-plan/state-separation.prompt.md) | ✅        |
| [Review](./state-separation.engineering.review.md) | ✅        |

---

## 1. Overview

### 1.1 Engineering Goals

- **상태 분리**: Git에 커밋되는 협업 상태와 로컬 머신에 국한된 실행 상태를 명확히 분리함.
- **동시성 보장**: 여러 에이전트가 동시에 상태를 변경할 때 데이터 유실(Race Condition)을 방지함.
- **병렬성 지원**: Git Worktree 기반의 병렬 작업 환경에서 단일한 진행 상황 뷰(View)를 제공함.
- **자동 이행**: 기존 단일 파일 구조에서 새로운 2계층 구조로의 무중단 전환을 지원함.

### 1.2 Engineering Principles

- **Single Source of Truth (SSOT)**: 런타임 정보는 로컬 파일, 비즈니스 진행 상황은 Git 파일로 단일화함.
- **Advisory Locking**: 셸 스크립트 수준에서 파일 시스템 락을 활용해 로컬 내 원자적(Atomic) 연산을 보장함.
- **Robust Sync**: Git 브랜치 이름에 의존하지 않고 기본 브랜치를 동적으로 찾아 병합함.

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
2. 스크립트가 `~/.pedal/<repo-id>/runtime.lock` 생성 시도 (Advisory Lock, 로컬 전용)
3. **Shared Read**: `.pedal-status.shared.json` 읽기
4. **Runtime Read**: `runtime.json` 읽기
5. **Logic (Merge)**: 
   - `jq`를 사용하여 `features` 객체는 딥 머지(Deep Merge) 수행.
   - `history` 배열은 시간 순으로 정렬하여 중복 제거 후 추가(Append).
6. **Shared Sync (Optional)**: 
   - 기본 브랜치(예: `main`, `master`)의 최신 상태를 `git show`로 읽어와 로컬 변경분과 `jq`로 병합.
7. **Write**: `shared.json` 및 `runtime.json` 쓰기
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

### 4.1 Repository ID & Branch Detection

- **Repo ID**: `printf "%s" "$(git rev-parse --show-toplevel)" | shasum -a 256 | cut -c1-8`
- **Default Branch**: `git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'` (없을 경우 `master`, `main` 순차 확인)

### 4.2 Lock Mechanism (`pedal-sync.sh`)

- **Lock Path**: `~/.pedal/${REPO_ID}/runtime.lock`
- **Acquire**: `mkdir -p "$(dirname "${LOCK_PATH}")" && mkdir "${LOCK_PATH}"`
- **Stale Lock**: 1분 이상 경과한 락은 무효화(Timeout 우선). PID 존재 확인은 보조 수단으로 활용.

### 4.3 JSON Merge Strategy (`jq`)

- **Features**: `features = (old_features * new_features)` (딥 머지)
- **History**: `history = (old_history + new_history) | unique_by(.timestamp, .feature, .action) | sort_by(.timestamp)`

### 4.4 Migration Logic

1. `.pedal-status.json` 존재 시 데이터를 읽어 `.pedal-status.shared.json`으로 변환 저장.
2. 기존 파일을 `.pedal-status.json.bak`으로 이름 변경.
3. 에이전트에게 마이그레이션 완료 메시지 출력.

---

## 5. Instruction Updates (GEMINI.md / PEDAL.md)

### 5.1 GEMINI.md 업데이트

- 모든 상태 변경은 `scripts/pedal-sync.sh`를 통해서만 수행하도록 `GEMINI.md` 본문에 명시.
- 직접적인 파일 수정 시도 금지 지침 추가.

### 5.2 PEDAL.md 업데이트

- "2-Tier State Management" 섹션 추가: 로컬 런타임 상태와 협업 공유 상태의 역할을 구분하여 설명.
- 병렬 작업을 위한 `git worktree` 사용 가이드 추가.

---

## 6. Test Plan

### 6.1 스트레스 테스트 (Concurrency)

- **Scenario**: 10개의 병렬 프로세스가 각기 다른 피처 ID로 동시 업데이트 수행.
- **Success**: `history` 배열 누락 없음, JSON 스키마 유효성 유지.

### 6.2 마이그레이션 테스트

- **Scenario**: 기존 프로젝트 환경에서 `pedal-sync.sh init` 실행.
- **Success**: 분리된 두 파일이 생성되고 기존 파일이 백업됨.

---

## Review Response

| ID | Review Point | Response | Action |
| --- | --- | --- | --- |
| C-01 | 하드코딩된 브랜치 | 수용. 동적 브랜치 감지 로직으로 대체. | 섹션 4.1 업데이트 |
| C-02 | Git 충돌/동기화 위험 | 수용. 체크아웃 방식 대신 `git show`와 `jq`를 이용한 메모리 병합 후 쓰기 방식 채택. | 섹션 2.2 업데이트 |
| W-01 | JSON 병합 로직 미비 | 수용. `jq`를 활용한 딥 머지 및 히스토리 정렬/중복 제거 로직 정의. | 섹션 4.3 업데이트 |
| W-02 | 락 범위 명시 | 수용. 로컬 전용 락임을 명시. | 섹션 1.2, 2.2 업데이트 |
| I-01 | 디렉토리 초기화 | 수용. `mkdir -p` 명시. | 섹션 4.2 업데이트 |
| I-02 | Stale Lock 견고함 | 수용. 1분 타임아웃을 주된 판단 기준으로 상향. | 섹션 4.2 업데이트 |

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-16 | Initial draft | Gemini CLI |
| 1.1     | 2026-04-16 | Revised per review (Dynamic branch, JQ merge, Stale lock) | Gemini CLI |