# PEDAL Engineering: mcp-fastapi-backend

## System Architecture

본 문서는 FastAPI와 MCP Python SDK를 결합하여 대시보드(REST)와 AI 에이전트(SSE)를 동시에 지원하는 하이브리드 백엔드 구조 및 환경 설정을 정의합니다.

### 1. 기술 스택 및 의존성 (`pyproject.toml`)
- **Python 3.12**: 최신 MCP SDK와의 호환성을 위해 선택.
- **uv**: 패키지 관리 및 가상환경(venv) 자동 구성을 위한 초고속 도구.
- **FastAPI**: 대시보드 앱과의 RESTful 통신을 위한 고성능 비동기 프레임워크.
- **mcp [server]**: 공식 MCP SDK. SSE 전송 계층(`SseServerTransport`)을 포함합니다.
- **uvicorn**: ASGI 서버로 FastAPI 앱 구동.

### 2. 프로젝트 구조 및 모듈 책임
- `mcp-server/pyproject.toml`: 의존성 및 프로젝트 메타데이터 정의.
- `mcp-server/server.py`: 단일 엔트리 포인트.
  - **FastAPI App**: 엔드포인트 라우팅 및 CORS 설정 관리.
  - **MCP Server**: 도구(Tools) 및 리소스(Resources) 정의.
  - **SSE Transport**: 클라이언트별 세션 및 스트림 관리.

### 3. 주요 엔드포인트 설계
| 엔드포인트 | 방식 | 설명 |
| :--- | :--- | :--- |
| `/api/status` | GET | `.pedal-status.shared.json` 파일을 읽어 프로젝트 전체 상태 반환. |
| `/mcp/sse` | GET | MCP SSE 연결 시작. 클라이언트에게 메시지 엔드포인트(`endpoint`) 이벤트 전달. |
| `/mcp/messages` | POST | MCP 프로토콜 메시지 수신 및 처리. |

### 4. 환경 설정 및 실행
- **상태 파일 경로**: `os.path.abspath`를 사용하여 프로젝트 루트의 `.pedal-status.shared.json`을 안전하게 참조합니다.
- **CORS 설정**: 개발 단계에서는 `allow_origins=["*"]`를 사용하며, 운영 시 환경 변수로 제한이 필요합니다.
- **실행 명령**:
  ```bash
  uv run python server.py
  # 또는
  uv run uvicorn server:app --host 0.0.0.0 --port 8000
  ```

## Verification Details
- **REST API**: `curl http://localhost:8000/api/status` 호출 시 JSON 상태 데이터 반환 확인.
- **MCP SSE**: `curl -i -N http://localhost:8000/mcp/sse` 호출 시 `text/event-stream` 타입의 응답 및 세션 ID 포함 `endpoint` 데이터 확인.
