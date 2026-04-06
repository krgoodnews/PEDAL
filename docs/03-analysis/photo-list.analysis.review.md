# photo-list Analysis Review

> **Reviewed by**: Cursor (Composer)
> **Date**: 2026-04-07
> **Document**: [photo-list.analysis.md](./photo-list.analysis.md)

## Critical

- (없음) — 본 리뷰 시점에 코드(`src/lib/api.ts`, `ListPage.tsx`, `DetailPage.tsx`)를 샘플 검증한 결과, 분석 문서가 주장하는 핵심 동작(썸네일/`images[0]`, 429 시 재시도·`RATE_LIMIT_EXCEEDED`·전용 문구·Retry 버튼, happy-dom 테스트 환경)과 불일치하는 **명백한 거짓**은 확인되지 않았다.

## Warning

- **PEDAL 분석 템플릿 대비 구조·완전성 부족** — [`.pedal/templates/analysis.template.md`](../../.pedal/templates/analysis.template.md)에 정의된 **Related Documents(Plan·Conventions)**, 상세 갭 테이블(API/데이터모델/컴포넌트 분리), 코드 품질·보안·아키텍처·컨벤션 점검, **Recommended Actions**, **Engineering Document Updates**, **Next Steps** 등이 생략되어 있다. PEDAL의 Analyze 단계 산출물로 “필수 섹션 충족” 관점에서 완결성이 떨어진다. — [ref](../../.pedal/PEDAL.md) (Analyze 절·템플릿)

- **가중 점수(24항목)의 감사 불가** — `Total checked items: 24` 및 `Max possible score: 72`에 대해, 어떤 24항목인지 **열거·체크리스트가 없어** 제3자가 `weightedMatchRate = (1 - weightedScore / maxPossibleScore) × 100` 식([`.pedal/PEDAL.md`](../../.pedal/PEDAL.md) Severity-weighted scoring)을 **항목 단위로** 재현할 수 없다. “심각도 가중 매칭률이 올바르게 계산되었는가?”([`.pedal/REVIEW.md`](../../.pedal/REVIEW.md) 품질 기준)에 답하기 어렵다. — [ref](../../.pedal/PEDAL.md#severity-weighted-scoring)

- **프롬프트 로그 대비 검증 범위가 과도하게 좁음** — [photo-list.prompt.md](../01-plan/features/photo-list.prompt.md) 초기 요구(3열 그리드, 세로 스크롤, 썸네일 클릭 시 상세 이동, API 출처 변경 이력)가 §2.1 표에 **명시적으로** 매핑되지 않는다. 구현상 CSS 그리드 3열(`src/styles/components.css`의 `.photo-grid`)·라우팅은 존재하나, 분석 본문은 이를 **의도 충실도 증거**로 다루지 않아 [`.pedal/REVIEW.md`](../../.pedal/REVIEW.md)의 intent fidelity 점검이 문서만으로는 불완전하다.

- **엔지니어링 문서 본문과 표의 “Engineering Spec” 열 정합성** — 현재 [photo-list.engineering.md](../02-engineering/features/photo-list.engineering.md) 본문은 이미지 URL 규칙 중심으로 매우 짧고, 분석 표의 “Retry Strategy / Error UI / Test Env” 등은 **동일 파일의 구체 절**에서 직접 인용되지 않는다(버전 이력에만 간접 반영). Engineering vs Implementation **일관성**은 코드 기준으로는 타당해 보이나, **문서 간 추적성(traceability)**은 약하다.

- **429 대응과 `Retry-After` 헤더** — 분석은 “Header/5s” 매칭을 ✅로 단정한다. 구현은 `parseInt(retryAfter) * 1000`만 사용하는데, [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After)는 **초 단위 정수** 또는 **HTTP-date** 형식을 허용한다(RFC 9110과 MDN). date 형식이 오면 지연 계산이 깨질 수 있어, “리스크·엣지 케이스 간과”([`.pedal/REVIEW.md`](../../.pedal/REVIEW.md)) 관점에서 분석의 코드 품질/리스크 절이 얇다.

## Info / Suggestions

- **테스트 실행 근거** — “`PhotoCard.test.tsx` (1 passed)”는 리뷰 환경에서 독립 실행으로 재확인하지 못했다. 가능하면 CI 로그 또는 로컬 `vitest run` 출력을 한 줄이라도 인용하면 재현성이 좋아진다.

- **단일 단위 테스트** — API 재시도·429 분기·페이지 에러 UI는 자동 테스트가 거의 없다. 분석 §4에서 **커버리지 한계**를 한 문장이라도 명시하면 Learn 단계 전 품질 판단이 더 정직해진다.

- **엔지니어링 문서 상태** — engineering 헤더에 `Status: Draft`가 남아 있다. Analyze에서 PASS를 줄 경우, 스펙 동결과 초안 상태의 **모순**을 짚거나 Engineering 문서 상태를 갱신하라고 권고할 수 있다.

## Verdict

**REVISE_REQUIRED**

이유: 구현 대비 핵심 주장은 대체로 타당하나, PEDAL 분석 템플릿·가중 점수의 **감사 가능성**·프롬프트 로그 전 범위 **의도 검증**·엔지니어링 문서와의 **명시적 추적**이 부족하다. Critical 수준의 사실 오류는 확인되지 않았으므로, 문서 보강 후 Learn 진행이 안전하다.
