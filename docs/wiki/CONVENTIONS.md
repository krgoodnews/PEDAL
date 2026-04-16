# 개발 컨벤션 및 TDD 지침

## 1. 테스트 주도 개발 (TDD)

Engineering 단계에서 정의된 기능들을 TDD로 구현한다.

- Engineering 단계에서 정해놓은 기능들의 테스트 함수를 작성하고, 기능을 작성할 것.
- 개발 완료 후에 테스트 실행. 실패할 경우 원인 파악 후 해결
- 너무 많은 테스트 코드를 작성하지 말 것. PEDAL-Engineering 단계에 있는 항목과, Iterate 하게 될 때의 버그의 원인에 대해서만 테스트 코드를 작성해도 충분함.
- Analysis 단계에서 테스트를 수행할 것.

## 2. 상태 및 작업 공간 관리 컨벤션

여러 에이전트가 병렬로 작업할 때 충돌을 방지하기 위해 2계층 상태 구조와 자동 워크트리를 사용한다.

- **모든 상태 변경**은 반드시 `scripts/pedal-sync.sh update` 명령어를 통해서만 수행한다.
- **공유 상태(`.pedal-status.shared.json`)**는 Git에 커밋되어 팀원과 공유된다.
- **작업 공간 자동화**: 새로운 피처 시작 시 `scripts/pedal-sync.sh plan`을 통해 전용 워크트리를 생성한다.
- **리소스 정리**: `learn` 단계 완료 후 반드시 `scripts/pedal-sync.sh archive`를 호출하여 워크트리 폴더와 메타데이터를 제거한다.

## 3. Git 컨벤션

- **브랜치 명명**: `feature/{feature-name}` 또는 `fix/{issue-name}`
- **커밋 메시지**: `[type]: [gitmoji] [description]` (lowercase type)
- **PR 제목**: 커밋 메시지와 동일한 포맷을 유지한다.
- **병렬 작업**: 다수의 기능을 동시에 개발할 경우 `git worktree` 사용을 권장한다.
