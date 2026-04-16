---
feature: notification-fix
phase: plan
status: in_progress
updatedAt: 2026-04-16T08:45:00Z
---

# notification-fix Planning Document

## 1. Goals
알림(Notification) 시스템의 변수 치환 오류를 수정하고, 사용자 경험(Focus 및 Click behavior)을 개선하며, 리뷰어 호출 명령어를 최적화한다.

## 2. Scope
- **scripts/pedal-notification.sh**:
    - `{feature}`, `{action}` 변수가 실제 값으로 치환되지 않는 문제 수정.
    - 알림 발생 시 Cursor IDE가 강제로 활성화(Focus)되는 현상 제거.
    - 알림 클릭 시 적절한 프로그램(Terminal/IDE)으로 이동하도록 개선.
- **GEMINI.md**:
    - 리뷰어 호출 시 `agent --model auto` 옵션 추가.
- **.cursor/rules/pedal.mdc**:
    - (선택 사항) 리뷰어 관련 설정 업데이트 확인.

## 3. Requirements (Fix List)
- **Fix 1 (Variable Substitution)**: `pedal-notification.sh` 내의 `${1}`, `${2}`를 사용하여 전달된 인자가 `{feature}`, `{action}` 자리에 올바르게 들어가도록 수정.
- **Fix 2 (Focus Removal)**: `osascript -e 'tell application "Cursor" to activate'` 코드가 무조건 실행되지 않도록 수정하거나 삭제.
- **Fix 3 (Click Behavior)**: 
    - macOS 알림에서 '클릭' 시 이벤트를 감지하여, 알림을 보낸 터미널 앱으로 focus를 줄 수 있는지 검토.
    - `display notification`만으로는 클릭 시 특정 앱 활성화가 어려울 수 있으므로, `terminal-notifier` 같은 외부 도구 없이 `osascript`만으로 가능한 최선의 방법(예: 알림 발생 직후가 아닌, 사용자가 반응했을 때만 동작하도록)을 모색.
- **Fix 4 (Reviewer Command)**: `GEMINI.md`의 `agent -p` 명령어를 `agent --model auto -p`로 변경.

## 4. Risks & Constraints
- `osascript`를 통한 알림 클릭 이벤트 핸들링은 기본적으로 한계가 있음 (단방향 알림). 
- 특정 터미널 앱(iTerm, Terminal, Warp, Cursor Terminal)을 범용적으로 지원해야 함.
- 샌드박스 환경(`../PEDAL-feature` 접근 제한)으로 인해 워크트리 없이 작업해야 하는 현재 상황을 고려.

## 5. Success Criteria
- [ ] 알림 메시지에 실제 기능 이름과 단계 이름이 표시됨.
- [ ] 알림이 떴을 때 Cursor 창이 갑자기 앞으로 튀어나오지 않음.
- [ ] 리뷰어 호출 시 `--model auto`가 적용됨.
- [ ] 알림 클릭 시 (가능하다면) 원래 작업하던 터미널로 돌아옴.

## 6. Proposed Milestones
1. **Engineering**: `osascript` 기능 및 `GEMINI.md` 수정안 확정.
2. **Do**: 스크립트 및 문서 수정.
3. **Analyze**: 알림 테스트 및 변수 확인.
4. **Learn**: 변경 사항 전파.
