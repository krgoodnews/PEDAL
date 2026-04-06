# photo-list Analysis Review

> **Reviewed by**: Cursor (Composer)
> **Date**: 2026-04-07
> **Document**: [photo-list.analysis.md](./photo-list.analysis.md)

## Critical

- **테스트 관련 서술과 만점 배점이 사실·논리와 충돌한다.** §5에서는 Vitest로 “상세 케이스 추가 필요”라고 하면서 §8에서는 Testing 항목을 **5/5 만점**으로 집계했다. 동일 보고서 안에서 “부족함”과 “만점”은 함께 성립하지 않으며, Analyze 단계에서 요구하는 “gap 점수·심각도의 정당성”(`.pedal/REVIEW.md`)을 훼손한다.

- **「기본 Vitest 환경 구성 완료」는 현재 리포지토리 상태와 맞지 않는다.** `package.json`에 `test` 스크립트가 없고, `vite.config.ts`에 Vitest 설정이 없으며, `*.test.*` / `*.spec.*` 테스트 파일이 없다. devDependency로 `vitest`가 선언된 것과 “환경 구성 완료”는 다르다. Vitest 통합은 공식 가이드상 설정·실행 경로가 명시되는 것이 통례다. — [Vitest 구성 가이드](https://vitest.dev/config/)

## Warning

- **프롬프트 로그 대비 의도 충실도(intent fidelity) 검증이 빠져 있다.** `photo-list.prompt.md`의 요구(3열 그리드·세로 스크롤·클릭 시 상세)를 **체크리스트 형태로 구현과 대조**하지 않았다. Engineering 대비 구현 위주라, `.pedal/REVIEW.md`가 요구하는 “사용자가 실제로 요청한 것”과의 정합성은 독자가 추론에 의존해야 한다.

- **성능(§4.1)은 측정 근거 없이 목표치 대비 ✅로 단정한다.** 초기 로드 1초 미만 여부는 네트워크·기기·캐시 조건에 좌우되는데, Lighthouse/Chrome DevTools 등 **재현 가능한 측정**이나 샘플 수가 없다. 성능 주장을 감사 가능하게 하려면 방법·환경을 명시해야 한다. — [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance)

- **엔지니어링 문서 §6.1(에러 처리)와 구현의 차이가 분석에서 다뤄지지 않았다.** Engineering은 네트워크 오류 시 “재시도 버튼”을 명시하지만, `ListPage.tsx`는 메시지 표시만 하고 재시도 UI가 없다. 상세 페이지의 404·네트워크 구분도 Engineering 표와 완전히 일치하지 않는다. “전체 100% 일치”(§11) 같은 표현은 이런 세부 항목을 포함하지 않으면 과장으로 읽힌다.

- **§9의 `total_checked_items: 20`은 산출 근거가 보고서에 드러나지 않는다.** PEDAL 공식 `maxPossibleScore = total_checked_items × 3`은 타당하나(`.pedal/PEDAL.md`), 어떤 20개 항목인지 목록이 없으면 **재검증·감사**가 어렵다. — [PEDAL severity-weighted scoring](../../.pedal/PEDAL.md#severity-weighted-scoring)

- **컴포넌트 다이어그램과 구현의 이름 불일치가 언급되지 않았다.** Engineering §2.1에는 `PhotoInfo`가 있으나 §5.3 컴포넌트 목록에는 없고, 구현은 `DetailPage` 내부 마크업으로 상세를 처리한다. “구조 일치” 판단 시 다이어그램 수준의 차이를 한 줄이라도 짚는 편이 Analyze 문서의 신뢰도에 유리하다.

## Info / Suggestions

- **관련 문서 표에 Plan 링크는 있으나 본문에서 Plan 요구와의 교차검증은 생략**되어 있다. Plan이 Engineering과 동일 범위라면 “Plan ↔ 코드” 한 단락만 추가해도 완성도가 올라간다.

- **§3.1 복잡도 표가 두 페이지의 fetch 함수만 다룬다.** “코드 품질 분석”으로서는 API 모듈·라우팅·접근성 등 우선순위가 낮더라도 범위를 한정해 적어 두면 과대 주장을 피할 수 있다.

## Verdict

**REVISE_REQUIRED**

Testing 서술·만점 배점의 모순과 Vitest “구성 완료”에 대한 사실 오류는 Analyze 산출물의 신뢰를 직접적으로 깨뜨리므로, 본 문서는 수정 없이 Learn 단계로 넘기기 어렵다. 에러 처리·프롬프트 대비 검증·성능 근거는 Critical은 아니나, 수정 시 함께 보강하는 것이 좋다.
