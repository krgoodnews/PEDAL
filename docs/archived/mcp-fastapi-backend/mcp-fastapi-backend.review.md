# mcp-fastapi-backend PEDAL Document Review

> **Reviewed by**: GPT-5.4 (Cursor CLI)
> **Date**: 2026-04-16
> **Documents**:
> - `docs/01-plan/mcp-fastapi-backend.plan.md`
> - `docs/02-engineering/mcp-fastapi-backend.engineering.md`
> - `docs/04-learn/mcp-fastapi-backend.report.md`
> - Prompt log: `docs/01-plan/mcp-fastapi-backend.prompt.md`

## Critical

- `docs/04-learn/mcp-fastapi-backend.report.md`는 "성공적으로 구축", "대시보드 UI와 AI 에이전트가 동일한 데이터를 실시간으로 공유하며 협업할 수 있는 기술적 기반 마련", "LangChain"까지 포괄하는 식으로 완료 범위를 서술하지만, 현재 구현(`mcp-server/server.py`)은 읽기 전용 `GET /api/status`, SSE 엔드포인트, 단일 MCP 툴 예시만 포함합니다. 사용자 원문은 `server.py` 구조와 환경 설정 기획이었고, 보고서 수준의 완료 선언을 뒷받침할 쓰기 경로, 대시보드 액션 API, LangChain 통합, 실시간 동기화 보장은 확인되지 않습니다. 이 상태의 Learn 보고서는 사실성 측면에서 신뢰를 깨뜨립니다. — [MCP Transports](https://modelcontextprotocol.io/docs/concepts/transports)

## Warning

- `docs/01-plan/mcp-fastapi-backend.plan.md`는 원문 요청에 없던 `POST /api/actions`, `start_pedal_phase`, `create_ticket`, 리소스 노출, 워크트리 생성 같은 운영 자동화 범위를 핵심 구현 단계로 확장합니다. 사용자는 "FastAPI + 공식 MCP SSE를 결합한 하나의 서버 구조와 환경 설정 기획"을 요청했으므로, 이런 항목은 후속 확장안으로 분리되거나 범위 확장 근거가 명시되어야 합니다. 현재 형태는 intent fidelity 관점에서 scope creep입니다. — [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/first-steps/)

- `docs/02-engineering/mcp-fastapi-backend.engineering.md`는 설계 문서라기보다 구현 완료 메모에 가깝고, 사용자 요청의 핵심이었던 환경 설정과 서버 구조 설명이 충분히 구체화되어 있지 않습니다. 예를 들어 의존성 선택 근거, 실행 명령, 모듈 책임 분리, 요청/응답 스키마, 오류 처리, 배포 시 설정값(CORS origin, 포트, 상태 파일 경로) 같은 설계 결정이 빠져 있어 재현 가능한 엔지니어링 사양으로 보기 어렵습니다. — [uv Projects Guide](https://docs.astral.sh/uv/concepts/projects/)

- `docs/02-engineering/mcp-fastapi-backend.engineering.md`의 "Verification Result"는 `curl` 테스트 성공을 기록하지만, 검증 근거가 문서 내부에 충분히 남아 있지 않고 Learn 보고서도 그 한계를 반영하지 않습니다. 특히 현재 구현에는 `/api/actions`가 없고, 분석 문서에도 "쓰기 기능 미흡"이 명시되어 있어, Engineering과 Learn은 완료 범위를 더 보수적으로 정리했어야 합니다. — [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)

- 현재 구현과 문서 모두 CORS를 `allow_origins=["*"]`로 둔 상태를 운영 제약으로만 짧게 언급합니다. 브라우저 기반 대시보드를 전제로 한 백엔드라면 허용 오리진을 환경 변수로 제한하는 운영 구성이 문서에 명시되어야 하며, 그렇지 않으면 "환경 설정 기획" 요구를 충분히 충족했다고 보기 어렵습니다. — [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

## Info / Suggestions

- `docs/04-learn/mcp-fastapi-backend.report.md`는 실제 구현 완료 항목과 향후 제안 항목을 더 엄격히 분리하는 편이 좋습니다. 예를 들어 "현재 완료: `/api/status`, `/mcp/sse`, 단일 툴 예시"와 "후속 작업: 대시보드 액션 API, LangChain 연동, 상태 쓰기/잠금 처리"로 재구성하면 분석 문서와도 더 잘 맞습니다. — [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

- `docs/02-engineering/mcp-fastapi-backend.engineering.md`에는 최소한 다음이 보강되면 좋습니다: `pyproject.toml` 의존성 목록과 선택 이유, `uv run uvicorn server:app --reload` 실행 방식, `.pedal-status.shared.json` 경로 해석 방식, MCP 세션 생명주기, 실패 시 응답 정책. 이 정도는 있어야 "구조와 환경 설정" 문서로서 재사용 가치가 생깁니다. — [FastAPI Bigger Applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/)

## Verdict

REVISE_REQUIRED
