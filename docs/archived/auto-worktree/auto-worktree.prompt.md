# Prompt Log: auto-worktree

## [Plan] 2026-04-16T15:00:00Z

/pedal spec 
자동 워크트리로 규칙을 업데이트 해줘. 위의 컨텍스트를 잘 분석하고 스펙을 구현해서 리스크를 최소화해줘.
- /pedal plan 시 상위 폴더에 ../pedal-{feature} 형태의 워크트리 자동 생성
- /pedal archive 시 해당 워크트리 자동 제거
- runtime.json과 연계하여 상태 추적 보장