# photo-list Analysis Review

> **Reviewed by**: Cursor (Composer)
> **Date**: 2026-04-07
> **Document**: [photo-list.analysis.md](./photo-list.analysis.md)

## Critical

- 해당 없음. (구현이 프롬프트의 핵심 요구—DummyJSON 전환, 아이콘 URL, 목록/상세 흐름—를 충족하지 못한다는 식의 **차단급 갭**은 코드·문서 대조만으로는 확인되지 않음. 다만 아래 Warning은 분석 보고서의 **정확성·재현성**과 직결됨.)

## Warning

- **엔지니어링 명세 vs 테스트 환경 표기 불일치**: `photo-list.engineering.md` §8.1은 `vite.config.ts`의 테스트 환경을 **`environment: 'jsdom'`**으로 기술하고 있으나, 저장소의 `vite.config.ts`는 **`happy-dom`**을 사용합니다. 분석 보고서 §2.2는 Engineering Spec 열에 `Vitest/Happy-dom`을 적어 **엔지니어링 원문과 다른 기준**을 Match로 처리한 형태입니다. 갭 분석으로서는 (1) 엔지니어링 문서를 구현에 맞게 수정하거나, (2) ⚠️ 문서 드리프트로 명시해야 합니다. 현재 표기는 **일관성(Engineering ↔ Analysis)** 측면에서 오해의 소지가 큽니다. — [Vitest — `test.environment`](https://vitest.dev/config/#environment)

- **`total_checked_items = 22`의 근거 부재**: §5.2는 `Max possible score: 66`(= 22×3)을 전제로 가중치 100%를 산출하지만, 보고서 본문에 **22개 점검 항목의 목록·출처(엔지니어링 섹션·플랜 ID 등)**가 없어 제3자가 점수를 검증할 수 없습니다. PEDAL의 가중치 공식은 `total_checked_items`에 민감하므로, 부록 표나 §2에 항목별 체크리스트를 두는 것이 필요합니다. — [.pedal/PEDAL.md — Severity-weighted scoring](../../.pedal/PEDAL.md) (동 저장소 규격)

- **의도 충실도(프롬프트) 표의 범위**: `photo-list.prompt.md` 초기 요구에는 **3열 그리드·세로 스크롤·썸네일 클릭 시 상세 이동** 등이 포함됩니다. §2.1은 API 교체·이미지 URL 위주만 표로 남기고, 상기 UX·라우팅 요구가 **명시적으로 Pass/Fail로 추적**되지 않습니다. 이후 회귀 시 “프롬프트 대비 무엇을 검증했는지”가 불명확해질 수 있습니다.

- **`.env`와 버전 관리**: 분석 §3은 `.env`의 `VITE_API_URL` 사용을 “정상”으로만 서술합니다. 프로젝트 `.gitignore`에는 **`.env` 제외 규칙이 없어**, 저장소 정책에 따라 환경 파일이 추적될 경우 실수로 민감값이 커밋될 위험이 있습니다(현재 값이 공개 URL이라도 **관행** 차원의 갭). 분석 또는 학습 단계에서 `.env.example` + `.gitignore` 권장을 한 줄이라도 남기는 편이 안전합니다. — [Vite — Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)

## Info / Suggestions

- **분석 템플릿 대비 축약**: `.pedal/templates/analysis.template.md`의 Related Documents(Plan·Conventions), 코드 스멜/컨벤션/아키텍처 절은 생략·압축되어 있습니다. 소규모 기능이라도 **Plan 교차 링크·conventions.md 존재 시 준수 여부** 한 줄이 있으면 Analyze 단계 완결성이 좋아집니다.

- **`src/lib/api.ts`의 `product: any`**: 타입 안전성·유지보수 관점에서 DummyJSON 응답용 최소 타입 또는 스키마를 두는지 여부는 Info 수준의 개선 제안입니다.

- **`product.images[0]`**: 상품에 `images`가 비어 있으면 상세/목록의 `url`이 `undefined`가 될 수 있습니다. DummyJSON 샘플에서는 드물 수 있으나, 분석의 “엣지 케이스” 절이 없다면 향후 Info/Warning 후보입니다.

- **테스트 범위**: `PhotoCard.test.tsx` 단일 케이스 통과는 사실이나, Retry·fetch 실패 경로·라우팅은 자동 검증에서 다루지 않습니다. PASS 판정이 “기능 완성”이 아니라 “문서화된 갭 없음”에 한정된다는 한 줄이 있으면 Learn 단계와 기대치가 맞습니다.

## Verdict

**REVISE_REQUIRED**

가중치 산식 자체(이슈 0건일 때 100%)는 PEDAL 정의와 합치하나, **22항목의 감사 가능한 나열**과 **엔지니어링 문서(jsdom) 대 실제 설정(happy-dom) 불일치에 대한 정직한 갭 또는 문서 정정**이 빠져 있어, 분석 보고서를 **그대로 최종 감사 증적**으로 쓰기에는 부족합니다. 위 Warning을 반영하거나, 의도적으로 수용하지 않는 항목은 **거절 근거**를 분석 문서에 남긴 뒤 Learn으로 진행하는 것이 좋습니다.

---

## Intent fidelity (prompt log 대비)

- **[Iterate] DummyJSON·아이콘 URL**: 구현(`api.ts`)과 §2.1 서술이 대체로 일치합니다.
- **초기 [Plan]의 그리드·스크롤·상세 이동**: 코드 상 `PhotoGrid`·CSS 3열·라우터 사용으로 충족되는 것으로 보이나, **분석 본문의 표에는 반영되지 않음** — 위 Warning 참고.
