# mcp-action-api Engineering Review

> **Reviewed by**: Codex 5.3
> **Date**: 2026-04-17
> **Document**: docs/02-engineering/mcp-action-api.engineering.md

## Critical

- 인증/인가가 `Auth: N/A`로 설계되어 있어, 네트워크 접근이 가능한 임의 클라이언트가 PEDAL 상태를 변경할 수 있습니다. 상태 전이 API는 워크플로우 무결성에 직접 영향을 주므로 최소한 토큰 기반 인증(또는 내부망 제한 + 서비스 간 인증) 요구사항이 엔지니어링 단계에서 명시되어야 합니다. — [OWASP API Security Top 10 - API1 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- `subprocess`로 `scripts/pedal-sync.sh update ...`를 호출하지만, 문서상으로는 `feature_id`/`description` 길이 제한, 허용 문자 집합, 타임아웃, 동시 실행 제어(락/큐) 요구사항이 없습니다. 입력 검증과 실행 제어가 없으면 DoS(장문 입력/지연 프로세스) 및 상태 파일 경합으로 인한 무결성 손상이 발생할 수 있습니다. — [Python subprocess.run timeout](https://docs.python.org/3/library/subprocess.html#subprocess.run), [CWE-400 Uncontrolled Resource Consumption](https://cwe.mitre.org/data/definitions/400.html)

## Warning

- 오류 코드 정의가 문서 내부에서 충돌합니다. `4.2 Error Responses`는 유효성 실패를 `400`으로, `6.1 Error Code Definition`은 `422`로 정의합니다. FastAPI/Pydantic 기본 동작과 일치하도록 하나로 통일해야 구현/테스트/클라이언트 계약이 어긋나지 않습니다. — [FastAPI Handling Errors](https://fastapi.tiangolo.com/tutorial/handling-errors/), [FastAPI Request Validation](https://fastapi.tiangolo.com/tutorial/body/)
- `.pedal-status.shared.json` 업데이트를 스크립트에 위임한다고만 되어 있고, API 응답에 반영되는 성공 기준(예: 스크립트 종료코드 + 상태파일 검증 재조회)과 재시도/롤백 정책이 없습니다. 실패 경계가 불명확하면 API는 성공을 반환했지만 실제 상태는 미반영인 불일치가 생길 수 있습니다. — [RFC 9110 - 9.3.3 POST](https://www.rfc-editor.org/rfc/rfc9110.html#name-post)
- 테스트 계획이 단위 테스트 3건 중심이라, 동시 요청 시나리오(같은 `feature_id`에 대해 연속 phase 변경), 비정상 스크립트 출력(JSON 파싱 실패), 타임아웃/취소 케이스를 놓치고 있습니다. 운영 리스크를 줄이려면 경계/경합 테스트를 포함해야 합니다. — [pytest fixtures and parametrization](https://docs.pytest.org/en/stable/how-to/fixtures.html)

## Info / Suggestions

- 원문 의도(`AI 에이전트와 대시보드 모두에서 상태 변경`)는 반영되었으나, 역할별 사용 시나리오(예: 대시보드는 사람 주도 전이, 에이전트는 자동 전이)와 감사 로그 필드(actor, source, correlation id)를 추가하면 추적성이 높아집니다. — [OpenTelemetry Trace Context](https://www.w3.org/TR/trace-context/)
- API 경로와 MCP Tool 입력 스키마는 잘 정리되어 있으나, phase 전이 규칙(예: `plan -> engineering` 허용, `plan -> learn` 금지)을 명시하면 잘못된 워크플로우 점프를 사전에 차단할 수 있습니다. — [Finite-state machine (개념 참고)](https://en.wikipedia.org/wiki/Finite-state_machine)

## Verdict

REVISE_REQUIRED
