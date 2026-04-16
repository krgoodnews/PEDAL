#!/bin/bash

# pedal-notification.sh: 알림을 생성하고 포커스를 제어합니다.

# 1. 인자 처리
# 사용법: ./pedal-notification.sh "{feature}" "{action}"
FEATURE=${1:-"Feature"}
ACTION=${2:-"Task"}
TITLE="PEDAL - $FEATURE"
MESSAGE="$FEATURE $ACTION completed."

# 2. 알림 생성 (osascript)
# 'with title'로 제목을 넣고, 'display notification'으로 내용을 표시합니다.
# 인용 부호를 안전하게 처리하기 위해 quoted form of를 사용합니다.
osascript -e "display notification (quoted form of \"$MESSAGE\") with title (quoted form of \"$TITLE\")"

# 3. 포커스 제어 (Fix 2 & 3)
# 알림이 발생할 때 Cursor나 특정 앱을 강제로 'activate' 하는 기능을 제거합니다.
# 사용자가 현재 작업 중인 창(Terminal, Warp 등)을 방해하지 않기 위함입니다.
# 알림을 클릭했을 때의 포커스 이동은 macOS 시스템 기본 동작에 맡깁니다.
