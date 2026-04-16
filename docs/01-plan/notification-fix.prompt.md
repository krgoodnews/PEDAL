# Prompt Log: notification-fix

## [Plan] 2026-04-16T08:35:00Z

pedal의 각 단계가 끝나면 알림이 오는데 거기에 문제가 있어. 
- fix 1: {feature} {action}이 그대로 들어옴. feature에는 적절한 PEDAL 기능 이름을 넣고, Action에는 'Plan, Engineering, Do, Analyze, Learn' 등 적절한 단계 이름이 와야해. 
- fix 2: 알림이 오는것과 동시에 Cursor IDE가 노출돼. 특정 프로그램으로 이동하지 않도록 해줘. 
- fix 3: 알림을 클릭하면 이상한 스크립트를 보여줘. 알림을 보낸 프로그램 (IDE, Terminal)으로 이동할 수 있는지 판단해주고. 불가능하다면 아무것도 하지 말고 가능하다면 해줘.
- fix 4: 리뷰어에게 요청할 때 auto 모드로 요청하게 수정해. Cursor Reviewer의 경우 'agent --model auto -p "{PROMPT}"'
