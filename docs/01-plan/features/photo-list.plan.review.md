# photo-list Plan Review

> **Reviewed by**: Cursor (Composer)
> **Date**: 2026-04-06
> **Document**: docs/01-plan/features/photo-list.plan.md

## Critical

- 이번 검토에서 **차단 수준(Critical)**으로 분류할 사실 오류·보안 결함·필수 요구사항 누띙은 없습니다. 사용자 프롬프트 대비 기능 범위(리스트, 3열 그리드, 세로 스크롤, 상세 이동)는 플랜에 반영되어 있습니다.

## Warning

- **환경 변수 접두사와 빌드 도구 가정** — 플랜은 `REACT_APP_API_URL`만 명시하고 있습니다. 이는 Create React App 계열에서 흔한 패턴이나, Vite는 `VITE_` 접두사와 `import.meta.env`를 사용합니다. 현재 저장소에 `package.json`/스캐폴드가 없어 도구가 미정인 상태이므로, Engineering 단계 전에 채택할 번들러에 맞는 변수명·노출 방식을 플랜 또는 컨벤션에 고정하지 않으면 구현 시 불일치가 납니다. — [ref](https://vitejs.dev/guide/env-and-mode.html) · [ref](https://create-react-app.dev/docs/adding-custom-environment-variables/)

- **대량 데이터(약 5,000건) 로딩 전략과 요구사항의 정합성** — [JSONPlaceholder Photos](https://jsonplaceholder.typicode.com/photos)는 대량 레코드를 반환합니다. Out of Scope에서 무한 스크롤을 제외하면서 “기본 페이징 또는 전체 로드 우선”이라고 했으나, FR/DoD에는 “전체 로드인지, 첫 N개만인지, 서버측 페이징이 아닌 클라이언트 슬라이스인지”가 명문화되어 있지 않습니다. Risks 표와 NFR(지연 로딩)만으로는 구현 범위가 열려 있어, 성능 목표와 맞지 않는 선택이 나올 수 있습니다. DoD 또는 FR에 최소한의 로딩·렌더링 상한(예: 초기 페이지 크기)을 한 줄이라도 적는 것을 권장합니다. — [ref](https://jsonplaceholder.typicode.com/)

- **Context API 선택의 근거** — 아키텍처에서 Context API를 선택했으나, 리스트·상세 정도의 범위에서는 React Router 기준 라우트 단위 fetch·로컬 state만으로도 충분한 경우가 많습니다. Context는 prop drilling이 실제로 문제일 때 도입하는 편이 단순성과 테스트 용이성에 유리합니다. “전역으로 공유할 상태가 무엇인지”를 한 문장으로 플랜에 박아 두지 않으면 Engineering에서 과설계로 이어질 수 있습니다. — [ref](https://react.dev/learn/passing-data-deeply-with-context)

## Info / Suggestions

- **섹션 7 Convention Prerequisites** — 체크리스트가 모두 미체크인 것은 초안으로 타당하나, Engineering 착수 전에 실제 레포의 ESLint/Prettier 존재 여부를 채워 넣으면 DoD의 “Lint 최소화”와 연결됩니다.

- **상세 페이지에 표시할 필드** — API는 `albumId`, `id`, `title`, `url`, `thumbnailUrl`을 제공합니다. FR-05가 “상세 정보”로 포괄적이라, Engineering에서 `albumId` 표시 여부 등을 결정해야 합니다. 플랜에 선택 필드를 나열할 필요는 없으나, 사용자에게 보여줄 최소 필드만 명시하면 스코프가 더 선명해집니다. — [ref](https://jsonplaceholder.typicode.com/)

- **이미지 지연 로딩** — NFR에서 lazy loading을 언급했습니다. 표준 HTML `loading="lazy"`만으로도 목표에 부합할 수 있어, Engineering에서 과도한 라이브러리 도입 없이도 충족 가능함을 참고하면 됩니다. — [ref](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes)

## Verdict

**REVISE_REQUIRED**

환경 변수·빌드 도구 정합성과 초기 로딩 분량(페이징 vs 전체 중 무엇을 “이번 단계”에 채택하는지)을 FR 또는 DoD에 한두 문장으로 확정하기 전까지는 구현 착수 시 해석 분산이 생길 수 있습니다. 위 항목을 반영하거나, 의도적으로 배제할 경우 그 **거절 사유**를 플랜에 짧게 남기면 다음 단계로 진행해도 됩니다.
