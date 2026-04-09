#!/bin/bash

# 사용법: ./pedal-notification.sh "{feature}" "{action} task completed"
TITLE=${1:-"PEDAL"}
MESSAGE=${2:-"{feature} {action} task completed"}

# 1. 알림 생성
osascript -e "display notification (quoted form of \"$MESSAGE\") with title (quoted form of \"$TITLE\")"

# 2. 현재 터미널 앱으로 포커스 이동 (Cursor, iTerm2, Terminal 등 대응)
# 알림 확인 후 즉시 터미널로 돌아오게 하려면 아래 명령이 필요합니다.
osascript -e 'tell application "System Events" to set frontApp to name of first process whose frontmost is true' \
          -e 'tell application "Cursor" to activate' # Cursor를 기본 타겟으로 설정 (또는 iTerm2 등)

