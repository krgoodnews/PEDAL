# mcp-kanban Engineering Review

> **Reviewed by**: GPT-5.4 (Cursor)
> **Date**: 2026-04-17
> **Document**: `docs/02-engineering/mcp-kanban.engineering.md`

## Critical

- None.

## Warning

- 문서가 `Next.js App Router`에서 이 대시보드를 **클라이언트 fetch**로 만들지, **서버 fetch/프록시**로 만들지 명시하지 않았습니다. 그런데 이 결정은 `NEXT_PUBLIC_API_BASE_URL` 필요 여부, CORS가 실제로 브라우저 경계에서 문제인지 여부, 로딩/에러 처리 위치를 모두 바꿉니다. 현재 `2.2 Data Flow`, `4. API Specification`, `7. Security Considerations`는 브라우저가 MCP 서버를 직접 호출하는 듯 서술하지만, `page.tsx`가 서버 컴포넌트로 구현되면 이 전제는 달라집니다. 이 경계가 설계에 고정되지 않으면 `Do` 단계에서 데이터 접근 방식이 흔들릴 가능성이 큽니다. — [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

- `1.1 Engineering Goals`는 "실시간 상태 데이터"를 목표로 하고 `5.1`에는 `Refresh` UI도 보이지만, 실제 최신성을 어떻게 보장할지 설계가 없습니다. App Router의 `fetch`는 캐시 동작을 명시하지 않으면 기대와 다른 정적/캐시 응답이 나올 수 있으므로, 최소한 `manual refresh only`, `cache: 'no-store'`, `revalidate`, `polling` 중 어떤 전략을 쓰는지와 그 이유를 문서에 적어야 합니다. 지금 상태로는 구현자가 새로고침 버튼만 만들고도 "실시간" 요구를 충족했다고 오해할 수 있습니다. — [Next.js Fetching, Caching, and Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching), [MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)

- Plan 문서의 비기능 요구사항에는 접근성(`키보드 내비게이션`, `적정 명도 대비`)이 포함되어 있지만, Engineering 문서는 이를 설계/테스트 항목으로 구체화하지 않았습니다. 현재 `5. UI/UX Design`와 `8. Test Plan & TDD Strategy`에는 컬럼/카드의 시맨틱 구조, 키보드 탐색 순서, 색상에만 의존하지 않는 상태 표현, 새로고침 버튼의 접근 가능한 이름 같은 기준이 없어 Plan 대비 요구사항 추적이 끊깁니다. 구현 전에 최소 기준을 적어 두지 않으면 접근성은 후순위로 밀릴 가능성이 큽니다. — [WCAG 2.2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/), [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## Info / Suggestions

- 테스트 계획에 도구와 배치 기준을 한 줄만 더 고정하면 구현자가 덜 헤맵니다. 현재 저장소의 `landing` 앱은 `Vitest`와 `Testing Library`를 이미 사용 중이므로, `8.1` 또는 `9.1`에 이를 명시하고 새 테스트를 기존 `components`/`unit` 구조와 어떻게 맞출지 정리하면 좋습니다. — [Vitest Guide](https://vitest.dev/guide/), [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)

## Verdict

REVISE_REQUIRED
