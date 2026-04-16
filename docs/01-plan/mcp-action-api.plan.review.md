# mcp-action-api Plan Review

> **Reviewed by**: GPT-5.4 (Cursor)
> **Date**: 2026-04-16
> **Document**: `docs/01-plan/mcp-action-api.plan.md`

## Critical

- 계획 문서가 상태 업데이트 방식을 "`scripts/pedal-sync.sh` 호출 또는 직접 JSON 수정"으로 열어두고 있어, PEDAL의 필수 상태 관리 규칙과 정면으로 충돌합니다. 이 프로젝트는 모든 상태 전이를 `scripts/pedal-sync.sh`를 통해서만 수행하도록 강제하고 있으므로, 직접 `.pedal-status.shared.json`을 수정하는 구현 옵션은 계획 단계에서 제거되어야 합니다. 그렇지 않으면 동시성 보호, 원자적 병합, 공유 상태 일관성 보장이 깨질 수 있습니다. — [ref](../../.pedal/PEDAL.md), [ref](../wiki/CONVENTIONS.md)

## Warning

- 성공 기준에 "`대시보드(웹)에서 API 요청 시 CORS 문제 없이 상태가 변경됨`"이 포함되어 있는데, 원래 사용자 요청은 MCP 서버의 POST API 추가와 archived report 참고가 핵심이며 웹 대시보드 CORS 대응은 직접 요구되지 않았습니다. AI 에이전트와 대시보드 모두에서 사용 가능해야 한다는 의도는 맞지만, 현재 계획 문서에는 대시보드 호출 경로, 배포 형태, 허용 origin 정책이 정의되어 있지 않아 검증 가능한 완료 조건으로 보기 어렵습니다. 이 항목은 별도 요구사항으로 구체화하거나, 현재 범위에서 제외하는 편이 더 일관적입니다. — [ref](../../.pedal/REVIEW.md), [ref](mcp-action-api.prompt.md)

- 기능 요구사항과 완료 기준이 "phase 변경"에 집중되어 있지만, PEDAL 상태 스키마상 실제 상태 전이는 `features.{name}.phase`뿐 아니라 `status`, `updatedAt`, 전역 `lastUpdated`, `session.lastActivity`, `history`까지 함께 다뤄야 일관성이 유지됩니다. 문서에는 history와 timestamp 일부만 언급되어 있어, 어떤 필드를 어떤 규칙으로 갱신할지 계획 단계에서 더 명시해야 이후 Engineering/Do 단계의 해석 차이를 줄일 수 있습니다. — [ref](../../.pedal/PEDAL.md), [ref](../../.pedal-status.shared.json)

## Info / Suggestions

- Related Documents에 archived report를 넣은 점은 좋지만, 이번 기능이 해당 문서를 어떻게 계승하는지 한 줄 정도 추가하면 intent fidelity가 더 분명해집니다. 예를 들어 "archived backend 설계의 POST 액션 경로/도구 등록 아이디어를 현재 저장소 구조에 맞게 구체화한다" 수준의 연결 설명이 있으면 Engineering 단계에서 참고 기준이 더 명확해집니다. — [ref](mcp-action-api.prompt.md)

## Verdict

REVISE_REQUIRED
