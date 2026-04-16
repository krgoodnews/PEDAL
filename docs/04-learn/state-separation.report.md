---
template: learn
version: 1.0
feature: state-separation
date: 2026-04-16
author: Gemini CLI
---

# state-separation Completion Report

## 1. Project Summary

병렬 작업(Worktree/Multi-Agent) 환경에서 PEDAL 상태 충돌을 방지하기 위해, 상태 데이터를 공유 상태(Git)와 실행 상태(로컬) 2계층으로 분리하는 아키텍처를 설계하고 구현했습니다.

## 2. Implementation Details

- **Scripts**: `pedal-common.sh` (유틸), `pedal-sync.sh` (동기화 및 락)
- **Lock Mechanism**: `mkdir` 기반 Advisory Lock + PID 기반 소유권 확인 + 1분 타임아웃
- **Merge Strategy**: `jq`를 이용한 딥 머지 및 히스토리 정렬/중복 제거
- **Sync Logic**: `git show`를 활용한 원격(Default branch) 상태 동기화 추가
- **Migration**: 기존 `.pedal-status.json`에서 새로운 공유 상태 파일로의 무중단 이행 완료

## 3. Results & Verification

- **Match Rate**: 100% (Iterate 단계에서 락 메커니즘 결함 완벽 해결)
- **Stress Test**: 10 parallel x 20 updates (200 entries) 및 5 parallel x 10 updates (50 entries) 테스트를 통해 데이터 누락 없음을 확인.
- **Cross-Review**: Plan, Engineering, Analysis의 모든 Critical 지적 사항을 반영하여 최종 PASS 획득.

## 4. Key Learnings (Wiki Summary)

- **Bug Patterns**: BP-007 (셸 락 Race Condition), BP-008 (임시 파일 충돌) 등록.
- **Conventions**: `pedal-sync.sh` 사용을 강제하는 새로운 상태 관리 규칙을 Wiki에 전파.
- **Architecture**: AI 에이전트 간의 협업 시 로컬 런타임 데이터와 비즈니스 데이터의 명확한 분리가 중요함을 재확인.

## 5. Next Steps

- **Dashboard**: `runtime.json`과 `shared.json`을 읽어오는 통합 대시보드 UI 구현 (향후 과제).
- **MCP Server**: 본 시스템의 락과 동기화 로직을 래핑하는 MCP 서버 구축으로 다른 에이전트와의 호환성 확장.
