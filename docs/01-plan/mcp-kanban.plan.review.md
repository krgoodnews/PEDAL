# mcp-kanban Plan Review

> **Reviewed by**: GPT-5.4 (Cursor CLI)
> **Date**: 2026-04-16
> **Document**: `docs/01-plan/mcp-kanban.plan.md`

## Critical

- 없음

## Warning

- 비기능 요구사항이 템플릿 및 실제 대시보드 성격에 비해 불완전합니다. 현재 `3.2 Non-Functional Requirements`에는 `Security`와 `Accessibility` 항목이 빠져 있는데, 이 기능은 상태 정보를 네트워크로 조회하는 웹 UI이므로 최소한 CORS/오리진 정책, 에러 노출 범위, 키보드 탐색/명도 대비 같은 기준이 계획 단계에서 정의되어야 다음 단계 설계와 분석 기준이 흔들리지 않습니다. 특히 템플릿도 이 두 항목을 기본 예시로 요구합니다. — [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/), [WCAG 2.1 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)

- `6.3 Environment Variables Needed` 섹션이 누락되어 있습니다. 문서 본문은 `landing` 앱의 `/dashboard`에서 MCP 서버의 `/api/status`를 호출하는 구성을 전제하고 있는데, 이 경우 배포 환경별 API base URL 또는 프록시 전략을 어떻게 관리할지 계획에 있어야 Engineering 단계에서 경로 하드코딩이나 환경별 분기 누락을 피할 수 있습니다. 환경 변수가 필요 없다면 그 판단과 이유를 명시적으로 적는 편이 맞습니다. — [Next.js Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)

- 인스코프에 포함된 "GSAP 활용 애니메이션"은 사용자 원문 요구를 넘어선 구현 방향 고정으로 보입니다. 사용자는 "형태는 네가 고민해"라고만 했고 핵심 요구는 상태 시각화와 PEDAL 단계 구분, read-only 조회입니다. 애니메이션은 UI 선택지일 수 있지만 필수 범위로 박아두면 Engineering/Do 단계에서 본질 기능보다 시각 효과가 우선되는 범위 팽창이 발생할 수 있으므로, 선택 사항으로 낮추거나 성공 기준과 분리하는 것이 더 사용자 의도에 충실합니다. — [Web Content Accessibility Guidelines: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)

- 리스크 항목의 "CORS 미들웨어 설정 확인 (이미 적용됨)"은 현재 저장소의 개발용 서버 상태를 근거로 한 구현 메모에 가깝고, 운영 제약을 가리는 표현입니다. 실제 서버는 모든 오리진을 허용하도록 설정되어 있어 개발에는 편하지만 운영 보안 기준으로는 추가 제한이 필요합니다. Plan에서는 "개발 환경에서는 허용, 운영 환경에서는 제한 정책 정의 필요"처럼 조건부 리스크로 적는 편이 더 정확합니다. — [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

## Info / Suggestions

- 사용자 의도 반영 자체는 전반적으로 양호합니다. read-only 대시보드, PEDAL 단계별 컬럼, 상태 시각화라는 핵심 요구는 빠지지 않았습니다.

- `Definition of Done`의 "실제 `.pedal-status.shared.json` 데이터가 정확히 반영됨"은 좋은 목표지만, 서버 API 응답 기준 검증인지 파일 직접 참조 검증인지 표현을 분리하면 Analyze 단계에서 판정이 더 쉬워집니다. — [REST Tutorial: Representation](https://restfulapi.net/resource-naming/)

- `2.2 Out of Scope`는 체크박스 형식보다 일반 불릿이 더 자연스럽습니다. 현재처럼 체크박스를 쓰면 향후 완료 여부를 관리하는 항목처럼 보일 수 있어 범위 정의 문서의 의미가 약간 흐려집니다.

## Verdict

REVISE_REQUIRED
