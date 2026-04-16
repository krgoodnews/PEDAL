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

## 프론트엔드 서비스 아키텍처

PEDAL 생태계는 사용자 경험과 관리 효율성을 위해 랜딩 페이지와 칸반 대시보드를 분리하여 운영합니다.

### 1. Landing Web (`landing/`)
- **역할**: PEDAL 워크플로 소개 및 마케팅.
- **특징**: 정적 콘텐츠 위주의 고성능 Next.js 앱. 백엔드(MCP Server) 의존성을 제거하여 경량화됨.

### 2. Kanban Dashboard (`dashboard/`)
- **역할**: 실시간 PEDAL 상태 모니터링.
- **특징**: `mcp-server`의 REST API를 Client-side fetch 방식으로 구독하여 실시간성을 확보함.
- **경로**: 프로젝트 루트의 `dashboard/` 디렉토리에 위치한 독립된 Next.js 앱.

## 개발 컨벤션 (Frontend)
- **Shared Types**: PEDAL 상태 스키마는 `dashboard/src/lib/types.ts`를 기준으로 하며, MCP 서버의 응답 포맷과 1:1 대응함.
- **API Base URL**: `NEXT_PUBLIC_API_BASE_URL` 환경 변수를 사용하여 백엔드 위치를 지정함.
- **Styling**: Tailwind CSS 4와 GSAP을 사용하여 일관된 디자인 시스템을 유지함.

## 향후 확장 계획
- `git worktree` 제어 도구(Tools) 추가
- LangChain 기반의 과거 PEDAL 리포트 분석 에이전트 탑재
- 대시보드 액션(Write) API 구현
