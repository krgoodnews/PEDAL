# mcp-action-api Plan Review (Round 2)

> **Reviewed by**: GPT-5.4 (Cursor)
> **Date**: 2026-04-16
> **Document**: `docs/01-plan/mcp-action-api.plan.md`

## Critical

- 없음. 1차 리뷰의 핵심 차단 이슈였던 "직접 JSON 수정 허용" 문제는 해소되었습니다. 현재 문서는 모든 상태 업데이트를 `scripts/pedal-sync.sh update` 호출로 제한하고 있어 PEDAL의 필수 상태 관리 규칙과 일치합니다. — [ref](../../.pedal/PEDAL.md), [ref](../wiki/CONVENTIONS.md)

## Warning

- 1차 리뷰에서 지적한 "상태 전이 시 어떤 필드가 함께 갱신되어야 하는지 더 명시해야 한다"는 항목은 일부 개선됐지만 완전히 해소되지는 않았습니다. 현재 문서는 `phase`, `status`, `updatedAt`, `history`, `lastUpdated`를 예시로 들고 있으나, PEDAL 공용 상태 스키마의 `session.lastActivity`까지 포함한 전체 일관성 계약을 명시적으로 적어두지 않았습니다. 구현을 스크립트에 위임하는 방향 자체는 맞지만, 계획 문서에도 "API는 상태 파일을 직접 해석/수정하지 않고, `pedal-sync.sh update`가 보장하는 전체 필드 갱신 계약을 그대로 따른다"는 식의 문장이 있으면 Engineering 단계에서 해석 차이를 줄일 수 있습니다. — [ref](../../.pedal/PEDAL.md), [ref](../../.pedal-status.shared.json)

## Info / Suggestions

- 1차 리뷰의 CORS 관련 경고는 해소되었습니다. 성공 기준에서 검증 불가능한 웹 대시보드 CORS 조건이 제거되어, 사용자 요청 범위와 계획 문서의 완료 조건이 더 잘 맞아졌습니다. — [ref](mcp-action-api.prompt.md)

- 1차 리뷰의 archived report 연결성 제안은 부분 반영 수준입니다. Related Documents에 참고 문서가 추가되었지만, 이 기능이 해당 report의 어떤 설계 아이디어를 계승하는지 한 줄 정도 더 설명하면 Engineering 단계의 기준점이 더 분명해집니다. — [ref](mcp-action-api.prompt.md)

## Verdict

REVISE_REQUIRED
