---
template: learn
version: 1.1
feature: state-separation
date: 2026-04-16
author: Gemini CLI
---

# state-separation Completion Report

## 1. Project Summary

병렬 작업(Worktree/Multi-Agent) 환경에서 PEDAL 상태 충돌을 방지하기 위해, 상태 데이터를 공유 상태(Git)와 실행 상태(로컬) 2계층으로 분리하는 아키텍처를 설계하고 구현했습니다.

## 2. Implementation Details

- **Scripts**: `pedal-common.sh` (유틸), `pedal-sync.sh` (동기화 및 락)
- **Lock Mechanism**: `mkdir` 기반 Advisory Lock + **소유권(PID) 확인 로직** + 1분 타임아웃 기반 Stale Lock 해제.
- **Merge Strategy**: `jq`를 이용한 객체 딥 머지(`*`) 및 **히스토리 배열(`history`)의 시간순 합산/정렬/중복 제거**(`unique_by`).
- **Sync Logic**: `git show`를 활용하여 원격(Default branch)의 최신 공유 상태를 로컬과 지능적으로 병합.
- **Migration**: 기존 `.pedal-status.json` 데이터를 `.pedal-status.shared.json`으로 안전하게 이관 및 구버전 파일 제거 완료.
- **Instruction Updates**: 
  - `GEMINI.md`: 2-Tier 관리 및 스크립트 사용 강제 규칙 추가.
  - `.cursor/rules/pedal.mdc`: Cursor용 병렬 작업 및 상태 동기화 규칙 최신화.
  - `.pedal/PEDAL.md`: 전체 워크플로 SSOT 문서 내 상태 관리 아키텍처 섹션 추가.

## 3. Results & Verification

- **Match Rate**: 100% (Iterate 단계에서 락 메커니즘 결함 완벽 해결)
- **Stress Test**: 10 parallel x 20 updates (200 entries) 및 5 parallel x 10 updates (50 entries) 테스트 수행.
  - **결과**: 데이터 유실 0건, 타임스탬프 순서 정합성 100% 확인.
- **Cross-Review**: Plan, Engineering, Analysis의 모든 Critical 지적 사항을 반영하여 최종 PASS 획득.

## 4. Key Learnings (Wiki Summary)

- **Bug Patterns**: BP-007 (셸 락 Race Condition), BP-008 (임시 파일 충돌) 등록.
- **Conventions**: `pedal-sync.sh` 사용을 강제하는 새로운 상태 관리 규칙을 Wiki에 전파.
- **Architecture**: 에이전트 간 협업 시 "진실의 원천(Shared)"과 "현재 작업 상태(Runtime)"를 분리하는 것이 병렬성의 핵심임을 확인.

## 5. Next Steps

- **Dashboard**: `runtime.json`과 `shared.json`을 시각화하는 통합 대시보드 UI 구현.
- **MCP Server**: 본 시스템의 락과 동기화 로직을 래핑하는 MCP 서버 구축으로 다른 에이전트와의 호환성 확장.

---

## Review Response

| ID | Review Point | Response | Action |
| --- | --- | --- | --- |
| C-01 | Root Config Updates | Accepted. Explicitly listed `GEMINI.md` and `.cursor/rules/pedal.mdc` updates in §2. | Updated Report §2 |
| W-01 | Array Merge Logic | Accepted. Clarified that `history` array uses concatenation + deduplication + sorting. | Updated Report §2 |
| W-02 | Lock PID Check | Accepted. Confirmed that PID check is used alongside the 1-minute timeout. | Updated Report §2 |
| I-01 | Migration Artifacts | Confirmed. Old `.pedal-status.json` was deleted after successful migration. | Mentioned in §2 |
