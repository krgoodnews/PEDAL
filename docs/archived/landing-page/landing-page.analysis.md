# landing-page Analysis Report

> **Analysis Type**: Gap Analysis / Code Quality / Convention Compliance
>
> **Project**: PEDAL
> **Version**: 0.1.0
> **Analyst**: AI Agent (Cursor)
> **Date**: 2026-04-10
> **Engineering Doc**: [landing-page.engineering.md](../02-engineering/landing-page.engineering.md)

### Related Documents (for verification)

| Document                                                  | Verification Target   |
| --------------------------------------------------------- | --------------------- |
| [Plan](../01-plan/landing-page.plan.md)                   | Requirements match    |
| [Engineering](../02-engineering/landing-page.engineering.md) | Implementation match |

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

v0.2 Analyze (87.3%, ITERATE REQUIRED) → Iterate 수행 후 잔존 갭 재확인. v0.2의 4개 Warning 해소 여부를 중점 점검한다.

### 1.2 Analysis Scope

- **Engineering Document**: `docs/02-engineering/landing-page.engineering.md`
- **Implementation Path**: `landing/src/`
- **Test**: 44 tests, 7 files — all passing
- **Build**: `next build` clean, `tsc --noEmit` clean, `eslint` clean

---

## 2. v0.2 Warning 해결 현황

| # | v0.2 Warning | 현재 상태 | 상세 |
|---|-------------|----------|------|
| 1 | `prefers-reduced-motion` 미연결 | ✅ 해결 | Hero, WhatIsPedal, WorkflowFlow, Features, GetStarted 모두 `getAnimationConfig()` 호출. `enabled: false` 시 애니메이션 스킵 |
| 2 | 섹션 헤드라인 인라인 | ✅ 해결 | `SECTION_COPY` 객체로 모든 섹션 헤드라인 중앙화 (whatIsPedal, workflow, features, getStarted, footer) |
| 3 | `SiteContent.getStarted` shape 불일치 | ✅ 해결 | `SiteContent` 인터페이스를 실제 구조(`eyebrow`, `titleAccent` 등)에 맞게 재정의 |
| 4 | Engineering §13.2 `AnimatedSection` 잔존 | ✅ 해결 | Engineering 문서에서 해당 언급 삭제됨 |

---

## 3. Gap Analysis (Engineering vs Implementation) — v0.3

### 3.1 Component Structure (§5.3)

| Engineering Component  | Implementation File                                 | Status          |
| ---------------------- | --------------------------------------------------- | --------------- |
| `RootLayout`           | `src/app/layout.tsx`                                | ✅ Match        |
| `HomePage`             | `src/app/page.tsx`                                  | ✅ Match        |
| `SmoothScrollProvider` | `src/components/providers/SmoothScrollProvider.tsx` | ✅ Match        |
| `Hero`                 | `src/components/sections/Hero.tsx`                  | ✅ Match        |
| `WhatIsPedal`          | `src/components/sections/WhatIsPedal.tsx`           | ✅ Match        |
| `WorkflowFlow`         | `src/components/sections/WorkflowFlow.tsx`          | ✅ Match        |
| `Features`             | `src/components/sections/Features.tsx`              | ✅ Match        |
| `GetStarted`           | `src/components/sections/GetStarted.tsx`            | ✅ Match        |
| `Footer`               | `src/components/sections/Footer.tsx`                | ✅ Match        |
| `GlassCard`            | `src/components/ui/GlassCard.tsx`                   | ✅ Match        |
| `MeshGradient`         | `src/components/ui/MeshGradient.tsx`                | ✅ Match        |
| `TerminalBlock`        | `src/components/ui/TerminalBlock.tsx`               | ✅ Match        |
| `ScrollIndicator`      | `src/components/ui/ScrollIndicator.tsx`             | ✅ Match        |

**13/13 Match** — 모든 컴포넌트 파일 존재 및 역할 일치.

### 3.2 Data Model (§3.1)

| Engineering Type | Implementation | Status | Notes |
| ---------------- | -------------- | ------ | ----- |
| `PedalStep` | `PedalStep` | ℹ️ Enriched | `subtitle` 필드 추가 (UI 개선) |
| `Feature` | `Feature` | ℹ️ Enriched | `accent` 필드 추가 (glow 색상 분기) |
| `TerminalLine` | `TerminalLine` | ℹ️ Added | 터미널 타이핑 효과를 위한 구조화 타입 |
| `SiteContent` | `SiteContent` | ℹ️ Redefined | 실제 데이터 구조에 맞게 인터페이스 재정의. 단, 인터페이스를 감싸는 단일 export는 없고 `HERO_CONTENT`, `SECTION_COPY`, `SITE_META` 등 다수 named export 사용 |

### 3.3 Content Centralization (§14.2)

| Section | Status | Source |
| ------- | ------ | ------ |
| Hero | ✅ | `HERO_CONTENT` — 완전 분리 |
| WhatIsPedal | ✅ | `SECTION_COPY.whatIsPedal` + `PEDAL_STEPS` |
| WorkflowFlow | ✅ (텍스트) / ℹ️ (SVG 좌표) | `SECTION_COPY.workflow` 사용. `NODES` SVG 좌표는 컴포넌트 내부 (레이아웃 데이터) |
| Features | ✅ | `SECTION_COPY.features` + `FEATURES` |
| GetStarted | ✅ | `SECTION_COPY.getStarted` + `TERMINAL_LINES` + `SITE_META` |
| Footer | ✅ | `SECTION_COPY.footer` + `SITE_META` |

### 3.4 File Structure (§13.1)

| Expected | Actual | Status |
| -------- | ------ | ------ |
| `src/app/not-found.tsx` | ✅ 존재 | ✅ |
| `public/og-image.png` | ✅ 존재 (1.2MB) | ✅ |
| `public/favicon.ico` | `src/app/favicon.ico` | ℹ️ Next.js App Router 컨벤션 |
| `.prettierrc` | ✅ 존재 | ✅ |
| `pnpm-lock.yaml` | `package-lock.json` | ℹ️ npm 사용 |
| `.eslintrc.json` | `eslint.config.mjs` | ℹ️ ESLint flat config |

### 3.5 Dependencies (§2.3)

| Package | Engineering | Actual | Status |
| ------- | ----------- | ------ | ------ |
| `next` | ^15.0.0 | 16.2.3 | ℹ️ Major 업그레이드 |
| `lucide-react` | ^0.400.0 | ^1.8.0 | ℹ️ Major 업그레이드 |
| `prettier` | ^3.0.0 | ^3.8.2 | ✅ |
| `prettier-plugin-tailwindcss` | latest | ^0.7.2 | ✅ |
| `vitest` + Testing Library | 미기재 | 설치됨 | ℹ️ Engineering 문서에 누락 |

### 3.6 Design Tokens (§7.1)

| Token Category | Status |
| -------------- | ------ |
| `--color-bg-*`, `--color-accent-*`, `--color-text-*` | ✅ 전체 일치 |
| `--color-glass`, `--color-glass-border`, `--color-glass-hover` | ✅ |
| `--gradient-accent`, `--gradient-glass` | ✅ |
| `--shadow-glow-*`, `--shadow-glass-inset` | ✅ |
| `@keyframes float-*`, `bounce-slow` | ✅ |

### 3.7 Animation (§6.2, §6.3)

| Item | Status | Notes |
| ---- | ------ | ----- |
| Hero 입장 애니메이션 | ✅ | `gsap.set()+to()` 패턴, `clearProps` 포함 |
| Hero 패럴랙스 scrub | ✅ | |
| WhatIsPedal 좌우 교차 | ✅ | 홀수/짝수 분기 + step-letter scale |
| WorkflowFlow SVG path drawing | ✅ | main-flow-path + iterate-path 별도 |
| Features 카드 stagger | ✅ | 개별 ScrollTrigger, set+to 패턴 |
| GetStarted 터미널 타이핑 | ✅ | `setInterval` 기반 순차 reveal |
| ScrollIndicator bounce | ✅ | GSAP yoyo 반복 |
| `prefers-reduced-motion` 지원 | ✅ | 5개 섹션 모두 `getAnimationConfig()` 호출 |
| 모바일 폴백 (reduced duration) | ✅ | `isTouch || isMobile → duration: 0.5` |

---

## 4. Code Quality

### 4.1 Build & Lint

| Check | Result |
| ----- | ------ |
| `npm run build` | ✅ Clean (SSG 4 pages) |
| `tsc --noEmit` | ✅ Clean |
| `npx eslint src/` | ✅ Clean |

### 4.2 Security

| Item | Status |
| ---- | ------ |
| X-Frame-Options | ✅ DENY |
| X-Content-Type-Options | ✅ nosniff |
| Referrer-Policy | ✅ strict-origin-when-cross-origin |
| Permissions-Policy | ✅ camera, mic, geo 차단 |
| CSP | ℹ️ 미설정 (Engineering §9에서도 미체크) |

---

## 5. Test Coverage

| Metric | Result | Status |
| ------ | ------ | ------ |
| Test Files | 7 passed (7) | ✅ |
| Tests | 44 passed (44) | ✅ |

### Covered Components

- Hero, WhatIsPedal, Features (섹션 렌더링)
- GlassCard, TerminalBlock (UI 컴포넌트)
- animation-utils (유닛)
- content (상수 데이터 무결성)

### Uncovered Components

- `WorkflowFlow.tsx` — SVG 렌더링 테스트 없음
- `GetStarted.tsx` — 컴포넌트 렌더링 테스트 없음
- `Footer.tsx` — Server Component 테스트 없음
- `SmoothScrollProvider.tsx` — Lenis 초기화 테스트 없음
- `ScrollIndicator.tsx` — 렌더링 테스트 없음

---

## 6. Severity-Weighted Match Rate

### 6.1 Issue Summary

| # | Severity | Issue |
|---|----------|-------|
| 1 | 🟡 Warning | 핵심 컴포넌트 테스트 미커버: WorkflowFlow(SVG 렌더링), SmoothScrollProvider(Lenis 초기화) — 복잡 로직 검증 필요 (크로스 리뷰 반영) |
| 2 | ℹ️ Info | Engineering §2.1 Pretendard 언급 vs 구현 JetBrains Mono (§7.4와 일치, §2.1 내부 불일치) |
| 3 | ℹ️ Info | Engineering §2.3 의존성 버전 미업데이트 (next ^15→16.2.3, lucide ^0.400→^1.8, vitest 미기재) |
| 4 | ℹ️ Info | Engineering §6.2 코드 스니펫이 `from()` 패턴 기준 (구현은 `set()+to()` 패턴) |
| 5 | ℹ️ Info | `SiteContent` 인터페이스 정의되었으나 단일 wrapper export 없이 다수 named export |
| 6 | ℹ️ Info | `lang="ko"` vs Engineering `lang="en"` (한국어 콘텐츠이므로 구현이 정확) |
| 7 | ℹ️ Info | `package-lock.json` vs `pnpm-lock.yaml`, `eslint.config.mjs` vs `.eslintrc.json` (tooling 선택) |
| 8 | ℹ️ Info | WorkflowFlow `NODES` SVG 좌표 데이터가 컴포넌트 내부 정의 (레이아웃 데이터로 content.ts 분리 불필요) |
| 9 | ℹ️ Info | 단순 컴포넌트 테스트 미커버: GetStarted, Footer, ScrollIndicator (단순 구조, Learn 이후 백로그) |
| 10 | ℹ️ Info | ScrollIndicator가 `getAnimationConfig()` 미호출 (장식적 요소, 기능 영향 없음) |

### 6.2 Cross-Review 반영

| Reviewer Finding | Severity | Decision | Reason |
|-----------------|----------|----------|--------|
| 5개 미커버 컴포넌트 전체를 Warning으로 상향 | 🟡 Warning | **부분 수용** | WorkflowFlow(SVG+GSAP), SmoothScrollProvider(Lenis 초기화)는 복잡 로직으로 Warning 수용. GetStarted, Footer, ScrollIndicator는 단순 구조로 Info 유지 |
| CSP 미설정 | ℹ️ Info | **수용** | 타당한 보안 권고. 다만 Engineering §9에서도 미체크 상태이며 정적 사이트 범위에서 영향 낮음 |
| Font §2.1 업데이트 | ℹ️ Info | **수용** | 기존 분석과 동일 의견 |

### 6.3 Weighted Score

| Severity | Count | Weight | Score |
| -------- | :---: | :----: | :---: |
| 🔴 Critical | 0 | ×3 | 0 |
| 🟡 Warning | 1 | ×2 | 2 |
| ℹ️ Info | 9 | ×1 | 9 |
| **Total** | 10 | | **11** |

```
Total checked items:    42
Max possible score:     42 × 3 = 126
Weighted issue score:   11
Weighted Match Rate:    (1 - 11/126) × 100 = 91.3%
```

### 6.4 Iterate Decision

```
┌──────────────────────────────────────────────────┐
│  Weighted Match Rate: 91.3%                      │
│  🔴 Critical Issues:  0                          │
│                                                  │
│  Decision: ✅ PASS                                │
│  Reason:   matchRate 91.3% ≥ 90% AND 0 Critical │
└──────────────────────────────────────────────────┘
```

---

## 7. Engineering Document Updates Recommended

Engineering 문서의 정확성을 유지하기 위한 비필수 업데이트 권고:

| # | Section | Update |
|---|---------|--------|
| 1 | §2.1 | Pretendard 제거 → JetBrains Mono로 통일 (§7.4와 일치시키기) |
| 2 | §2.3 | 의존성 버전 업데이트: `next ^16`, `lucide-react ^1.x`, `vitest ^4.x` 추가 |
| 3 | §6.2 | Hero 코드 스니펫을 `set()+to()` 패턴으로 업데이트 |
| 4 | §3.1 | `SiteContent` 인터페이스에 `badge`, `workflowLabel`, `stats`, `terminal`, `eyebrow`, `titleAccent` 반영 |

---

## 8. v0.1 → v0.2 → v0.3 진행 요약

```
v0.1  ──→  v0.2  ──→  v0.3
80.95%     87.3%      91.3%
1 Critical 0 Critical 0 Critical
8 Warning  4 Warning  1 Warning (크로스 리뷰 반영)
5 Info     8 Info     9 Info
ITERATE    ITERATE    ✅ PASS
```

---

## Version History

| Version | Date       | Changes | Author |
| ------- | ---------- | ------- | ------ |
| 0.1     | 2026-04-10 | Initial analysis — Match Rate 80.95%, ITERATE | AI Agent (Cursor) |
| 0.2     | 2026-04-10 | Post-iterate re-analysis — Match Rate 87.3%, ITERATE | AI Agent (Cursor) |
| 0.3     | 2026-04-10 | Post-iterate re-analysis — Match Rate 91.3% (크로스 리뷰 반영), PASS | AI Agent (Cursor) |
