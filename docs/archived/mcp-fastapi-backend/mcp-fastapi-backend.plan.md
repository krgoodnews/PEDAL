# PEDAL Plan: mcp-fastapi-backend

## Objective
FastAPI와 MCP Python SDK를 결합하여 Next.js 대시보드와 AI 에이전트(Cursor, LangChain)가 동시에 통신할 수 있는 하이브리드 백엔드(`mcp-server`)를 구축합니다.

## Key Files & Context
- `mcp-server/`: 새로운 Python 백엔드 디렉토리
- `mcp-server/pyproject.toml`: `uv` 기반 패키지 관리 및 의존성 설정
- `mcp-server/server.py`: FastAPI와 MCP SSE(Server-Sent Events)를 통합한 메인 서버 파일
- `.pedal-status.shared.json`: 기존 PEDAL 상태 파일과의 데이터 연동 (Single Source of Truth)

## Implementation Steps

### 1. 프로젝트 초기화 및 환경 설정
- `uv init mcp-server` 명령어로 프로젝트를 생성합니다.
- 필요한 의존성을 추가합니다:
  - `fastapi`, `uvicorn[standard]`: 고성능 웹 서버 및 API 프레임워크
  - `mcp[server]`: 공식 MCP Python SDK (SSE 전송 계층 포함)
  - `pydantic`: PEDAL 상태 데이터 모델링 및 검증

### 2. 하이브리드 서버 엔진 구현 (`server.py`)
- **FastAPI 애플리케이션 설정**: 대시보드(Next.js)와 통신을 위한 CORS 설정을 적용합니다.
- **MCP 서버 인스턴스 생성**: `mcp.server.models.Server`를 사용하여 "PEDAL-Manager" 서버를 정의합니다.
- **SSE 통신 엔드포인트 구현**:
  - `GET /mcp/sse`: AI 클라이언트(Cursor 등)의 연결을 위한 SSE 스트림 엔드포인트를 생성합니다.
  - `POST /mcp/messages`: MCP 프로토콜 기반의 메시지 수신 처리를 구현합니다.
- **대시보드 전용 REST API 구현**:
  - `GET /api/status`: 현재 프로젝트의 PEDAL 상태 및 티켓 목록을 반환합니다.
  - `POST /api/actions`: 대시보드 버튼 클릭 시 워크트리 생성 등의 시스템 명령을 수행합니다.

### 3. PEDAL 특화 기능(Tools/Resources) 등록
- **Tools**: AI가 수행할 수 있는 행동들을 등록합니다 (예: `start_pedal_phase`, `create_ticket`).
- **Resources**: 프로젝트 내의 상태 파일(`shared.json`)이나 문서 템플릿을 AI가 직접 참조할 수 있도록 리소스로 노출합니다.

## Verification & Testing
- `uv run uvicorn server:app --reload` 명령어로 서버를 가동합니다.
- `http://localhost:8000/docs` (Swagger UI)를 통해 REST API 엔드포인트의 작동을 확인합니다.
- MCP Inspector 또는 Cursor의 MCP 설정 기능을 사용하여 SSE 연결 및 도구(Tool) 호출을 테스트합니다.
