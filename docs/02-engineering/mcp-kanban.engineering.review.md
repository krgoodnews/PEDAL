# mcp-kanban Engineering Review

> **Reviewed by**: GPT-5.4 (Cursor)
> **Date**: 2026-04-16
> **Document**: `docs/02-engineering/mcp-kanban.engineering.md`

## Critical

- `3.1 Entity Definition`과 `3.2 Phase to Column Mapping`이 PEDAL의 실제 공유 상태 스키마와 충돌합니다. 현재 문서는 `phase`에서 `iterate`를 누락했고, `status`를 `'in_progress' | 'completed' | 'archived' | 'failed'`로 정의했지만 PEDAL 기준은 `pending | in_progress | completed | blocked | archived`입니다. 또한 실제 스키마에 있는 `activeFeatures`, `primaryFeature`, `session` 필드도 빠져 있어, 대시보드가 PEDAL 상태를 "정확히" 시각화한다는 목표와 맞지 않습니다. 이 상태로 구현하면 특정 피처가 누락되거나 잘못 분류될 수 있습니다. — [PEDAL schema](../../.pedal/PEDAL.md)

- `7. Security Considerations`의 CORS 설명은 현재 아키텍처 기준으로 사실상 잘못된 대응책입니다. 문서는 `NEXT_PUBLIC_API_BASE_URL`로 운영 시 통신 대상을 제한할 수 있다고 적었지만, 브라우저의 대상 URL 설정과 서버의 CORS 허용 정책은 별개입니다. 실제 서버는 `allow_origins=["*"]`로 모든 오리진을 허용하고 있어, 프론트엔드 환경 변수만으로는 서버 접근 정책이 제한되지 않습니다. 보안 고려사항 섹션에 잘못된 통제 수단이 문서화되어 있으면 이후 구현/운영 판단을 오도합니다. — [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

## Warning

- API 명세가 성공 응답만 정의하고 실패 계약을 빠뜨렸습니다. 실제 `mcp-server/server.py`는 파일 없음/예외 시 `{"error": ...}` 형태를 반환하지만, 문서에는 HTTP 상태 코드, 에러 바디, 프론트엔드의 분기 기준이 없습니다. 반면 `6. Error Handling`은 `FETCH_ERROR`, `PARSE_ERROR` 같은 UI 내부 코드를 제시해 두어 서버 계약과 클라이언트 정책의 경계가 흐려져 있습니다. Engineering 문서라면 `/api/status` 실패 응답의 최소 계약을 명시해야 구현과 테스트가 안정됩니다. — [FastAPI Handling Errors](https://fastapi.tiangolo.com/tutorial/handling-errors/)

- 문서 내부의 경로와 구조 설명이 서로 일관되지 않습니다. `2.1 Component Diagram`은 `landing/app/dashboard/page.tsx`를 가리키고, `5.2 Component List`는 `src/components/dashboard/`를, `9.1 File Structure`는 `landing/src/app/dashboard/page.tsx`를 가리킵니다. 실제 저장소도 `landing/src/app/...` 구조를 사용하고 있으므로, 현재 문서는 구현 대상 경로를 혼동하게 만듭니다. — [Next.js App Router Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

- PEDAL engineering 템플릿과 프로젝트 컨벤션 관점에서 필요한 설계 항목이 덜 채워져 있습니다. 특히 레이어 구조/의존성 규칙, 이 피처에 적용할 코딩 컨벤션, 그리고 TDD 관점의 구현-검증 연결이 빠져 있어 `Do` 단계에서 어떤 구조 원칙을 따라야 하는지 기준이 약합니다. 저장소 컨벤션은 Engineering 단계에서 정의한 기능을 TDD로 구현하도록 요구하므로, 테스트 전략도 그 흐름을 더 직접적으로 반영하는 편이 좋습니다. — [Engineering template](../../.pedal/templates/engineering.template.md), [Project conventions](../wiki/CONVENTIONS.md)

## Info / Suggestions

- `5.2 Component List`에 `RefreshButton`이 있지만 `9.1 File Structure`에는 해당 파일이 없습니다. 별도 컴포넌트로 둘지 `StatusHeader` 내부 액션으로 둘지 하나로 정리하면 구현 범위가 더 명확해집니다. — [React: Thinking in React](https://react.dev/learn/thinking-in-react)

- `9.2 Implementation Order`의 `SWR-like pattern`과 `GSAP animations (optional)`은 현재 문서에서 선택 기준이 불명확합니다. 조회 전용 대시보드라는 원래 요청에는 충분하지만, 어떤 경우에 단순 `fetch`/서버 컴포넌트로 충분한지, 애니메이션이 범위 밖이면 후순위로 미룰지 명시하면 scope drift를 줄일 수 있습니다. — [Next.js Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)

## Verdict

MAJOR_CONCERNS
