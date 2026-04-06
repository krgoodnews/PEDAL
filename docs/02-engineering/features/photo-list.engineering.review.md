# photo-list Engineering Review

> **Reviewed by**: Cursor (Composer)
> **Date**: 2026-04-07
> **Document**: [photo-list.engineering.md](./photo-list.engineering.md)

## Critical

- 해당 없음. (보안상 즉시 차단급 누락이나 명백한 요구사항 불이행은 확인되지 않음.)

## Warning

- **플랜 대비 앱 라우트 미명시**: 플랜(FR-04)은 프런트 경로를 `/photo/:id`로 적었는데, 엔지니어링 문서는 React Router의 **앱 내** 경로 규약(예: `/`, `/photo/:id`)을 한 번도 정하지 않고 JSONPlaceholder의 REST 경로(`GET /photos/:id`)만 표로 나열합니다. 구현 시 라우트 불일치나 중복 정의로 이어질 수 있으므로, 앱 라우트 섹션을 추가하고 플랜과 동일한지 명시하는 것이 좋습니다. — [React Router — Route](https://reactrouter.com/start/framework/routing)

- **깨진 상대 링크(플랜 문서)**: 메타데이터의 Planning Doc와 Related Documents 표의 플랜 링크가 `../01-plan/features/photo-list.plan.md`로 되어 있습니다. 파일 위치가 `docs/02-engineering/features/`이면 `../`는 `docs/02-engineering/`이라 **`docs/02-engineering/01-plan/...`로 해석되어 실제 플랜 파일과 맞지 않습니다**. 올바른 예: `../../01-plan/features/photo-list.plan.md`. PEDAL에서 플랜·엔지니어링 교차 참조가 끊깁니다. — [CommonMark — Link destination](https://spec.commonmark.org/0.31.2/#link-destination)

- **API 모듈 경로 불일치**: §2.3 의존성 표는 `api/photos.ts`를 가리키지만, §9.1은 `src/lib/api`, §11.1 파일 트리는 `lib/api.ts`입니다. 단일 진실원을 정하지 않으면 스캐폴딩 단계에서 혼선이 납니다.

- **섹션 구조 중복**: "2. Architecture"와 "9. Architecture"가 제목이 동일해 목차·검색 시 혼동을 줍니다. 후자는 "레이어 구조" 등으로 구분하거나 §2에 통합하는 편이 낫습니다.

## Info / Suggestions

- **JSONPlaceholder 100건 제한**: 문서는 클라이언트 `.slice(0, 100)`와 쿼리 파라미터를 병기했습니다. JSONPlaceholder는 JSON Server 스타일 쿼리를 지원하는 경우가 많아 `?_limit=100` 등이 동작할 수 있으나, [공식 가이드](https://jsonplaceholder.typicode.com/guide/)에서 리소스별로 확인하는 것이 안전합니다. 한 가지 방식으로 확정하면 구현·테스트가 단순해집니다.

- **`Layout`과 컴포넌트 다이어그램**: §5.3·§11.1에 `Layout`이 있으나 §2.1 다이어그램에는 없습니다. 다이어그램에 `App → Layout` 또는 헤더 배치를 반영하면 아키텍처 그림과 파일 구조가 맞습니다.

- **§12 Self-Review Checklist**: "Implementation 완료 후 작성 예정"으로 비어 있어, 초안 단계에서는 타당하지만 Do 단계 진입 전에는 최소 검증 항목(라우트, 100개 슬라이스, 에러 UI 등)을 미리 두면 플랜의 DoD와 연결하기 좋습니다.

- **Vite 환경 변수**: `VITE_API_URL` 체크리스트는 Vite 규칙(`VITE_` 접두사, 클라이언트 노출)과 잘 맞습니다. 배포 시 기본값과 `.env.example` 정책을 구현 가이드 한 줄로 보강할 수 있습니다. — [Vite — Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)

## Verdict

**REVISE_REQUIRED**

플랜 문서로의 링크 수정과 플랜(FR-04)과 동일한 **앱 라우트** 명세 추가, API 모듈 경로 단일화는 구현 착수 전에 반영하는 것이 좋습니다. 그 외 항목은 품질·일관성 개선에 해당합니다.

---

## Intent fidelity (prompt log 대비)

- **충족**: `photo-list.prompt.md`의 요지(React, JSONPlaceholder 사진 API, 3열 그리드·세로 스크롤, 클릭 시 상세)는 개요·UI·데이터 흐름에서 다룹니다.
- **참고**: 프롬프트는 "웹페이지 하나" 표현이었으나, 라우팅으로 목록/상세 분리한 설계는 자연스러운 해석이며 플랜과도 정합적입니다.
