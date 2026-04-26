# mcp-action-api Engineering Review

> **Reviewed by**: Codex 5.3
> **Date**: 2026-04-17
> **Document**: docs/02-engineering/mcp-action-api.engineering.md

## Critical

- `description` 길이 제한이 문서 내부에서 상충합니다. 데이터 모델(`StatusUpdateRequest`)은 `max_length=500`인데 MCP Tool Input Schema는 `maxLength: 50`으로 정의되어 있어, 동일 요청이 경로(REST vs MCP)에 따라 성공/실패가 달라질 수 있습니다. 이는 API 계약 위반 및 클라이언트 호환성 문제를 유발하므로 통일이 필요합니다. — [ref](https://swagger.io/docs/specification/data-models/data-types/)
- PEDAL의 공식 phase action은 `archive`인데, 본 문서는 enum에 `archived`를 API 입력 phase로 노출하고 있습니다. `archive`는 워크트리 정리까지 포함하는 별도 동작이며, 단순 `update` phase 전환과 의미가 다릅니다. action/상태 값을 혼용하면 잘못된 자동화 흐름(정리 누락 등)을 만들 수 있습니다. — [ref](https://github.com/yunsu/PEDAL-mcp-action-api/blob/feature/mcp-action-api/.pedal/PEDAL.md)

## Warning

- 인증 정책이 "localhost면 API Key 면제"로만 기술되어 있는데, 실제 배포에서 프록시/포워딩 환경을 고려한 신뢰 경계 정의(`X-Forwarded-For` 신뢰 여부, 내부망 가정 등)가 없습니다. 로컬 판별 방식이 모호하면 인증 우회 위험이 생깁니다. — [ref](https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/)
- `500 Internal Server Error` 하나로 스크립트 실패와 타임아웃을 모두 표현하도록 되어 있어 클라이언트 재시도/복구 전략 분리가 어렵습니다(예: 타임아웃은 재시도 가능, 검증 실패는 불가). 오류 분류를 명시적으로 분리하는 편이 운영 안정성에 유리합니다. — [ref](https://www.rfc-editor.org/rfc/rfc9110#name-server-error-5xx)
- 원 요청의 "참고 문서(@docs/archived/mcp-fastapi-backend/...report.md) 기반 설계"에 대한 추적성이 약합니다. 어떤 설계 결정을 참조/승계했고 무엇을 변경했는지 명시가 없어 의도 충실도 검증이 어렵습니다. — [ref](../01-plan/mcp-action-api.prompt.md)

## Info / Suggestions

- API 스펙에 `429`(락 경합/대기 초과) 또는 `503`(일시적 처리 불가) 같은 운영성 상태 코드를 추가하면 동시성 이슈 대응이 더 명확해집니다. — [ref](https://www.rfc-editor.org/rfc/rfc9110#name-429-too-many-requests)
- `feature_id` 제약(대소문자 허용 여부)을 브랜치/파일 네이밍 규칙과 함께 명시하면 운영 중 식별자 정규화 이슈를 줄일 수 있습니다. — [ref](../docs/wiki/CONVENTIONS.md)
- Test Plan에 "MCP Tool 경유 호출 시 REST와 동일한 validation/응답 보장(contract test)" 케이스를 추가하는 것이 좋습니다. — [ref](https://martinfowler.com/bliki/ContractTest.html)

## Verdict

REVISE_REQUIRED
