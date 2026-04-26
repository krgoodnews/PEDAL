# Feature: MCP Kanban Dashboard

## User Request

현재 MCP 서버의 status API를 칸반 형태로 볼 수 있는 프로그램 만들어줘. 
- 형태는 네가 고민해. 앱이어도 되고 웹이어도 돼.
- PEDAL 워크플로에 걸맞게 칸반의 구역을 나눠줘.
- POST(대시보드에서 데이터 변경)는 이 다음 프로세스에서 반영할거니까 일단 보는거부터 해줘.

## Original Intent

- MCP 서버가 제공하는 `/api/status` (또는 PEDAL 관리 도구의 상태 API)를 시각화하는 도구 구축.
- PEDAL 워크플로 단계(Plan, Engineering, Do, Analyze, Learn, Archived)를 칸반 컬럼으로 사용.
- 현재 프로젝트의 각 피처별 진행 상태를 한눈에 파악할 수 있도록 함.
- 초기 버전은 조회 기능에 집중.
