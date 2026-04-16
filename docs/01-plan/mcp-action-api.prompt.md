# Feature: MCP Action API

## User Request

mcp 서버에서, PEDAL의 각 단계로 티켓들을 이동할 수 있도록 POST API를 만들어. @docs/archived/mcp-fastapi-backend/mcp-fastapi-backend.report.md 에 POST API 관련 내용이 있을텐데, 참고해서 만들어봐.

## Original Intent

- MCP 서버가 제공하는 REST API를 확장하여 피처의 상태를 업데이트하는 기능 추가.
- `scripts/pedal-sync.sh update`와 유사한 로직을 서버 내부에 구현하거나 호출.
- 피처 ID, 대상 단계(phase), 선택적 설명을 입력으로 받아 `.pedal-status.shared.json` 업데이트.
- AI 에이전트와 대시보드 모두에서 상태 변경이 가능하도록 함.
