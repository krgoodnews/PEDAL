# PEDAL — AI Agent를 위한 구조화된 개발 워크플로

![PEDAL Cycle](public/PEDAL.png)

**PEDAL**은 AI Agent 기반 소프트웨어 개발에 최적화된 워크플로입니다.

전통적인 PDCA(Plan-Do-Check-Act) 사이클에서 영감을 받았습니다.

## PEDAL의 특징 3가지

> PEDAL — 페달은 밟으면 앞으로 나아갑니다. 한 바퀴 돌 때마다 더 나은 코드가 됩니다.

- **크로스 리뷰**: 같은 Agent가 결과물을 검증할 때의 편향 발생을 최소화합니다.
- **LLM Wiki**: `Learn` 단계에서 Wiki로 지식을 축적하여 Agent가 재활용합니다.
- **의도적인 Human Approval**: AI Agent가 내 의도와 벗어날 때의 비용을 줄일 수 있습니다.

---

## PEDAL 사이클

```
[Plan] → [Review] → [Engineering] → [Review] → [Do] → [Analyze] → [Review] → [Learn] → [Review] → [Archive]
                                                        │    ↑
                                                        ↓    │
                                                      [Iterate]
                                          (matchRate < 90% OR Critical)
```

| 단계            | 역할                                   | 산출물                                     |
| --------------- | -------------------------------------- | ------------------------------------------ |
| **P**lan        | 목표, 범위, 요구사항, 리스크 정의      | `{feature}.plan.md`                        |
| **E**ngineering | 설계, 아키텍처, API, UI 의도 명세      | `{feature}.engineering.md`                 |
| **D**o          | Engineering 문서 기반 구현             | 소스 코드                                  |
| **A**nalyze     | 설계 vs 구현 갭 분석 + 품질 측정       | `{feature}.analysis.md`                    |
| **L**earn       | Wiki 업데이트 + 완료 보고서 + 인수인계 | `{feature}.wiki.md`, `{feature}.report.md` |

**Iterate**는 Analyze와 Do 사이의 개선 루프이며, **Archive**는 완료된 산출물을 보관하는 단계입니다.

---

## 핵심 메커니즘

### 1. 크로스 리뷰 — 다른 회사의 AI로 에코 챔버를 깬다

PEDAL의 가장 차별화된 특징은 **문서를 작성한 Agent와 다른 회사의 AI Agent가 리뷰**한다는 점입니다.

```
                 ┌─────────────┐
  Cursor(Claude) │  문서 작성    │
                 └──────┬──────┘
                        ▼
                 ┌─────────────┐
  Gemini CLI     │  크로스 리뷰   │  ← 다른 회사의 AI
                 └──────┬──────┘
                        ▼
                 ┌─────────────┐
  Cursor(Claude) │  비판적 수용   │  ← 맹목적 수용 금지
                 └─────────────┘
```

같은 모델이 자기 결과물을 검증하면 동일한 사고 패턴에 갇힙니다. 서로 다른 회사의 모델은 학습 데이터와 추론 방식이 다르기에, **한쪽이 놓친 맹점을 다른 쪽이 잡아냅니다.** 이것은 마치 코드 리뷰에서 동료 개발자가 코드를 리뷰하는 것과 같은 원리입니다.

리뷰 결과는 Critical / Warning / Info로 분류되며, 작성 Agent는 각 피드백을 **비판적으로 평가**하여 수용 또는 근거를 들어 거절합니다.

### 2. Learn 단계의 Agent 지식화

**Learn** 단계에서 Wiki 문서(`{feature}.wiki.md`)를 생성하여, 해당 기능에 대한 **검증된 사실**을 Agent 친화적인 구조로 기록합니다.

```
docs/wiki/
├── user-auth.wiki.md      ← 인증 기능의 아키텍처, 구현 세부사항, 파일 위치
├── payment.wiki.md        ← 결제 기능의 API 명세, 설정 방법
└── notification.wiki.md   ← 알림 시스템의 컴포넌트 구조
```

이 Wiki는 다음 PEDAL 사이클에서 Agent의 **컨텍스트**가 됩니다. Agent가 새 기능을 개발할 때, 이전에 축적된 Wiki를 참조하여 프로젝트의 구조와 관례를 이해한 상태에서 작업합니다. 매번 "처음부터 파악"하는 비효율이 사라집니다.

### 3. 체급이 낮은 Agent로도 충분한 결과

고가의 최상위 모델이 아니어도 PEDAL 프로세스를 따르면 좋은 결과를 얻을 수 있습니다. 그 이유는:

- **구조가 Agent의 역량을 보완합니다.** Plan과 Engineering 문서가 명확한 가이드라인을 제공하므로, Agent가 스스로 모든 것을 판단할 필요가 없습니다.
- **크로스 리뷰가 안전망 역할을 합니다.** 한 Agent가 실수해도 다른 Agent가 잡아내고, Iterate 루프에서 자동 수정됩니다.
- **Iterate의 자동 반복이 품질을 끌어올립니다.** 임계값(90% match rate, Critical 이슈 0건)에 도달할 때까지 기본 5회(Critical 이슈만 남은 경우 최대 10회) 자동 반복합니다.
- **축적된 Wiki가 컨텍스트를 보강합니다.** 이전 사이클에서 기록된 지식 덕분에 Agent가 프로젝트를 더 잘 이해합니다.

결국, **워크플로의 품질이 모델의 체급을 보상**합니다. 중요한 것은 단일 프롬프트의 성능이 아니라, 반복 가능한 프로세스입니다.

---

## 디렉토리 구조

```
docs/
├── 01-plan/
│   ├── {feature}.prompt.md      ← 프롬프트 로그 (append-only)
│   └── {feature}.plan.md
├── 02-engineering/
│   └── {feature}.engineering.md
├── 03-analysis/
│   └── {feature}.analysis.md
├── 04-learn/
│   └── {feature}.report.md
├── wiki/
│   └── {feature}.wiki.md
└── archived/
    └── {feature}/
```

---

## 복합 명령어

단일 단계 실행 외에, 여러 단계를 순차적으로 실행하는 복합 명령어를 지원합니다.

| 명령어    | 실행 단계                         | 게이트                                  |
| --------- | --------------------------------- | --------------------------------------- |
| **spec**  | Plan → Engineering                | ⛔ Engineering 완료 후 사용자 승인 필요 |
| **build** | Do → Analyze (+ Iterate)          | ⛔ Analyze 완료 후 사용자 승인 필요     |
| **dev**   | Plan → Engineering → Do → Analyze | 양쪽 게이트 모두 적용                   |

각 게이트에서 사용자의 명시적 승인을 요구합니다. AI Agent가 독단적으로 전체 사이클을 수행하지 않고, 핵심 의사결정 지점에서 사람이 개입합니다.

---

## 지원 도구

PEDAL은 **도구에 무관(tool-agnostic)** 하게 설계되었습니다.

| 도구           | 설정 파일                 | 비고                   |
| -------------- | ------------------------- | ---------------------- |
| **Cursor**     | `.cursor/rules/pedal.mdc` | 자연어로 단계 호출     |
| **Gemini CLI** | `GEMINI.md`               | `/pedal` 슬래시 명령어 |

크로스 리뷰 시, Cursor가 주 에이전트이면 Gemini CLI가 리뷰어가 되고, 그 반대도 가능합니다.

---

## 빠른 시작

1. **`.pedal/` 디렉토리를 프로젝트에 복사합니다.**

2. **도구별 설정을 추가합니다.**
   - Cursor: `.cursor/rules/pedal.mdc`
   - Gemini CLI: `GEMINI.md`

3. **첫 번째 사이클을 시작합니다.**

   Cursor에서:

   ```
   "user-auth 기능을 plan 해줘"
   ```

   Gemini CLI에서:

   ```
   /pedal plan user-auth
   ```

4. **단계별로 진행하며, 크로스 리뷰를 거치고, 최종 Learn까지 완료합니다.**

---

## Severity-Weighted Scoring

품질 측정은 심각도에 따른 가중치를 적용합니다.

| 심각도   | 가중치 | Iterate 조건                |
| -------- | :----: | --------------------------- |
| Critical |   x3   | **무조건** (90% 이상이어도) |
| Warning  |   x2   | match rate < 90%일 때       |
| Info     |   x1   | match rate < 90%일 때       |

```
weightedMatchRate = (1 - weightedScore / maxPossibleScore) × 100
```

**Critical 이슈가 하나라도 있으면 match rate와 무관하게 Iterate가 강제됩니다.**

---

## 라이선스

Apache License 2.0

---
