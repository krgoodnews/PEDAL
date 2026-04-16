# MCP + FastAPI 하이브리드 백엔드 인프라

이 문서는 PEDAL 워크플로의 중앙 집중식 관리를 위해 구축된 Python 기반 백엔드 시스템의 구조와 사용법을 설명합니다.

## 개요
기존의 쉘 스크립트 기반 상태 관리를 넘어, 대시보드(REST API)와 AI 에이전트(MCP SSE)가 동시에 소통할 수 있는 단일 엔진입니다.

## 기술 스택
- **Language**: Python 3.12 (mcp 라이브러리 호환성)
- **Package Manager**: [uv](https://docs.astral.sh/uv/)
- **Web Framework**: FastAPI
- **Protocol**: MCP (Model Context Protocol) via SSE Transport

## 주요 구성 요소 (`mcp-server/`)

### 1. 환경 설정 (`pyproject.toml`)
`uv`를 사용하여 의존성을 관리합니다. 프로젝트 초기화 및 실행 시 `uv` 명령어를 권장합니다.
```bash
# 서버 실행
uv run python server.py
```

### 2. 하이브리드 서버 (`server.py`)
- **REST API**: `/api/status` 엔드포인트를 통해 `.pedal-status.shared.json` 데이터를 JSON으로 제공합니다.
- **MCP SSE**: `/mcp/sse` 및 `/mcp/messages`를 통해 AI 에이전트가 도구(Tools)를 호출할 수 있는 인터페이스를 제공합니다.

## 개발 컨벤션 (Python)
- **Import 경로**: MCP SDK 1.x 이상에서는 `from mcp.server import Server` 형식을 사용합니다.
- **상태 파일 참조**: 항상 프로젝트 루트의 `.pedal-status.shared.json`을 Single Source of Truth로 사용하며, 절대 경로(`os.path.abspath`)로 참조합니다.
- **CORS**: 개발 시에는 모든 오리진을 허용하되, 운영 시 환경 변수로 제한합니다.

## 향후 확장 계획
- `git worktree` 제어 도구(Tools) 추가
- LangChain 기반의 과거 PEDAL 리포트 분석 에이전트 탑재
- 대시보드 액션(Write) API 구현
