---
feature: notification-fix
phase: engineering
status: in_progress
updatedAt: 2026-04-16T08:50:00Z
---

# notification-fix Engineering Document

## 1. Context & Goals
알림 시스템의 오작동 및 사용자 경험 저하 요소를 제거한다.

## 2. Technical Design

### 2.1 scripts/pedal-notification.sh 수정
- **변수 치환 (Fix 1)**: 현재 `TITLE=${1:-"PEDAL"}` 및 `MESSAGE=${2:-"{feature} {action} task completed"}`로 되어 있는데, `${1}`, `${2}`가 아닌 문자열 리터럴 `{feature}`가 들어오고 있음. 이를 `${1}`, `${2}` 인자로 직접 받아 처리하도록 함. 
  - (참고: 호출하는 쪽에서 `${feature}`를 넣어주지 않는다면, 스크립트 내부에서 `sed` 등을 써서 치환해줄 수도 있으나, 인자 전달 방식을 명확히 하는 것이 좋음.)
- **Focus 제어 (Fix 2)**: 현재 무조건 `Cursor`를 활성화하게 되어 있어 작업 도중 창이 튀어나옴. 이 부분을 삭제하거나 주석 처리함.
- **Click Behavior (Fix 3)**: `display notification`은 비동기로 동작하며 클릭 여부를 반환하지 않음. 클릭했을 때의 동작을 제어하려면 `terminal-notifier` 같은 도구가 필요하지만, 기본 `osascript`만 사용한다면 현재로서는 "알림 후 즉시 포커스 이동"을 제거하는 것으로 사용자 불만을 해소함. 
  - (추가 연구: `display dialog`는 응답을 기다리지만 작업 흐름을 방해하므로 사용하지 않음.)

### 2.2 GEMINI.md 수정
- **리뷰어 명령어 (Fix 4)**: `agent -p` -> `agent --model auto -p`로 일괄 변경.

## 3. Implementation Plan

### 3.1 scripts/pedal-notification.sh 개편
```bash
#!/bin/bash

# 사용법: ./pedal-notification.sh "{feature}" "{action}"
FEATURE=${1:-"Feature"}
ACTION=${2:-"Task"}
TITLE="PEDAL - $FEATURE"
MESSAGE="$FEATURE $ACTION completed."

# 1. 알림 생성
osascript -e "display notification (quoted form of \"$MESSAGE\") with title (quoted form of \"$TITLE\")"

# 2. 강제 Focus 이동 제거
# osascript -e 'tell application "Cursor" to activate'  <-- 삭제
```

### 3.2 GEMINI.md 개편
- `agent -p` 문자열을 검색하여 `agent --model auto -p`로 교체.

## 4. UI/UX Intent (ASCII Art)
```text
[ Notification ]
+------------------------------------+
| PEDAL - notification-fix           |
| notification-fix Plan completed.   |
+------------------------------------+
(No sudden window jumps! No weird script clicks!)
```

## 5. Verification Plan
1. **변수 테스트**: `./scripts/pedal-notification.sh "test-feature" "Analyze"` 실행 후 알림 내용 확인.
2. **Focus 테스트**: 알림 발생 시 현재 보고 있는 창(Terminal 등)이 유지되는지 확인.
3. **GEMINI.md 확인**: `grep`을 통해 모든 `agent -p`가 변경되었는지 확인.
