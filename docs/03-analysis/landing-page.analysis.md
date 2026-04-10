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
| [Conventions](../../01-plan/conventions.md)                | Convention compliance |

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

v0.1 Analyze → Iterate 이후 잔존 갭을 재확인하고, Severity-Weighted Match Rate를 재계산한다.

### 1.2 Analysis Scope

- **Engineering Document**: `docs/02-engineering/landing-page.engineering.md`
- **Implementation Path**: `landing/src/`
- **Test**: 44 tests, 7 files — all passing
- **Build**: `next build` clean, `tsc --noEmit` clean, `eslint` clean

---

## 2. Iterate 이후 해결된 항목

| 항목 | 처리 |
| ---- | ---- |
| `og-image.png` 없음 | `public/og-image.png` 추가, OG height 634 반영 |
| `not-found.tsx` 없음 | Dark Glassmorphism 404 페이지 구현 |
| Hero 텍스트 하드코딩 | `HERO_CONTENT` 상수로 분리 |
| `SiteContent` 타입 없음 | `content.ts`에 통합 타입 정의 |
| Design tokens 7개 누락 | `globals.css`에 glass/gradient/shadow 토큰 추가 |
| `prettier` 미설치 | 설치 + `.prettierrc` 생성 |
| `AnimatedSection` 미구현 | Engineering 문서에서 삭제 |
| Hero animation `from()` 부작용 | `gsap.set()+to()` 패턴으로 변경, `clearProps` 추가 |
| Features 카드 미표시 | 카드별 개별 ScrollTrigger로 변경 |
| WorkflowFlow 화살표 위치 | 노드 간 중앙(140/300/460/620)으로 수정 |
| Hydration mismatch 경고 | `suppressHydrationWarning` 추가 |
| Severity 공식(×3/×2/×1) 노출 | UI 텍스트에서 수치 제거 |

---

## 3. Gap Analysis (Engineering vs Implementation) — v0.2

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

### 3.2 Data Model (§3.1)

| Engineering Type | Implementation | Status | Notes |
| ---------------- | -------------- | ------ | ----- |
| `PedalStep` | `PedalStep` | ⚠️ Modified | `subtitle` 필드 추가 |
| `Feature` | `Feature` | ⚠️ Modified | `accent` 필드 추가 |
| `TerminalLine` | `TerminalLine` | ⚠️ Added | Engineering에 없는 타입 |
| `SiteContent` | `SiteContent` | ✅ Added | 통합 타입 정의됨 |
| `getStarted.codeSnippet` | `TERMINAL_LINES[]` | ⚠️ Shape diverge | 인터페이스 shape 불일치 |

### 3.3 Content Centralization (§14.2)

| Section | Status | Notes |
| ------- | ------ | ----- |
| Hero | ✅ `HERO_CONTENT` | 완전 분리 |
| WhatIsPedal | ⚠️ Partial | `PEDAL_STEPS` 사용, 섹션 헤드라인은 인라인 |
| WorkflowFlow | ⚠️ Partial | `NODES` 상수가 컴포넌트 내부에 정의 |
| Features | ✅ `FEATURES` | 완전 분리 |
| GetStarted | ⚠️ Partial | `TERMINAL_LINES` 사용, 헤드라인 인라인 |
| Footer | ⚠️ Partial | `SITE_META.githubUrl` 사용, 링크 라벨 인라인 |

### 3.4 File Structure (§13.1)

| Expected | Actual | Status |
| -------- | ------ | ------ |
| `src/app/not-found.tsx` | ✅ 존재 | ✅ |
| `public/og-image.png` | ✅ 존재 | ✅ |
| `.prettierrc` | ✅ 존재 | ✅ |
| `pnpm-lock.yaml` | `package-lock.json` | ℹ️ npm 사용 |
| `.eslintrc.json` | `eslint.config.mjs` | ℹ️ flat config |
| §13.2 Step 4 `AnimatedSection` 언급 | 삭제 안 됨 | ⚠️ 문서 잔존 |

### 3.5 Dependencies (§2.3)

| Package | Engineering | Actual | Status |
| ------- | ----------- | ------ | ------ |
| `next` | ^15.0.0 | 16.2.3 | ℹ️ Newer |
| `prettier` | ^3.0.0 | ✅ 설치됨 | ✅ |
| `prettier-plugin-tailwindcss` | latest | ✅ 설치됨 | ✅ |
| Vitest / Testing Library | — | 설치됨 | ⚠️ 문서 미기재 |

### 3.6 Design Tokens (§7.1)

| Token | Status |
| ----- | ------ |
| `--color-bg-*`, `--color-accent-*`, `--color-text-*` | ✅ |
| `--color-glass`, `--color-glass-border`, `--color-glass-hover` | ✅ |
| `--gradient-accent`, `--gradient-glass` | ✅ |
| `--shadow-glow-*`, `--shadow-glass-inset` | ✅ |

### 3.7 Animation (§6.2, §6.3)

| Item | Status | Notes |
| ---- | ------ | ----- |
| Hero 입장 애니메이션 | ✅ | `gsap.set()+to()` 패턴 |
| Hero 패럴랙스 scrub | ✅ | |
| WhatIsPedal 좌우 교차 | ✅ | |
| WorkflowFlow SVG path drawing | ✅ | |
| Features 카드 stagger | ✅ | 개별 trigger로 구현 |
| GetStarted 터미널 타이핑 | ✅ | |
| `prefers-reduced-motion` 지원 | ⚠️ | `getAnimationConfig()` 정의됨, 컴포넌트에 미연결 |

---

## 4. Code Quality

### 4.1 Build & Lint

| Check | Result |
| ----- | ------ |
| `npm run build` | ✅ Clean |
| `tsc --noEmit` | ✅ Clean |
| `npx eslint src/` | ✅ Clean |

### 4.2 Security

| Item | Status |
| ---- | ------ |
| Security headers (X-Frame-Options 등) | ✅ |
| CSP 미설정 | ℹ️ Engineering §9에서도 미체크 |

---

## 5. Test Coverage

| Metric | Result | Status |
| ------ | ------ | ------ |
| Test Files | 7 passed (7) | ✅ |
| Tests | 44 passed (44) | ✅ |

### Uncovered Areas

- `WorkflowFlow.tsx` — SVG 렌더링 테스트 없음
- `GetStarted.tsx` — 컴포넌트 렌더링 테스트 없음
- `Footer.tsx` — Server Component 테스트 없음
- `SmoothScrollProvider.tsx` — Lenis 초기화 테스트 없음

---

## 6. Severity-Weighted Match Rate

### 6.1 Issue Summary

| # | Severity | Issue |
|---|----------|-------|
| 1 | 🟡 Warning | `prefers-reduced-motion` 미연결 — `getAnimationConfig()` 구현됐으나 컴포넌트에서 미사용 |
| 2 | 🟡 Warning | 섹션 헤드라인/링크 라벨 일부 인라인 (WhatIsPedal, WorkflowFlow, GetStarted, Footer) |
| 3 | 🟡 Warning | `SiteContent.getStarted` shape 불일치 — 인터페이스와 실제 구현 diverge |
| 4 | 🟡 Warning | Engineering §13.2 Step 4에 `AnimatedSection` 언급 잔존 |
| 5 | ℹ️ Info | Engineering §2.3 의존성 목록 미업데이트 (next ^15, lucide 구버전, vitest 미기재) |
| 6 | ℹ️ Info | Engineering §2.1 Pretendard vs §7.4 JetBrains Mono 내부 모순 |
| 7 | ℹ️ Info | Engineering §6.2 코드 스니펫이 `from()` / `.hero-cta` 기준 (구현과 상이) |
| 8 | ℹ️ Info | `lang="ko"` vs Engineering `lang="en"` (의도적 변경) |
| 9 | ℹ️ Info | `package-lock.json` vs `pnpm-lock.yaml`, `eslint.config.mjs` vs `.eslintrc.json` |
| 10 | ℹ️ Info | WorkflowFlow `NODES` 데이터가 컴포넌트 내부에 정의 (content.ts 미분리) |
| 11 | ℹ️ Info | 테스트 미커버 영역 4개 (WorkflowFlow, GetStarted, Footer, SmoothScrollProvider) |
| 12 | ℹ️ Info | TDD 순서 미준수 (과거 이력, 수정 불가) |

### 6.2 Weighted Score

| Severity | Count | Weight | Score |
| -------- | :---: | :----: | :---: |
| 🔴 Critical | 0 | ×3 | 0 |
| 🟡 Warning | 4 | ×2 | 8 |
| ℹ️ Info | 8 | ×1 | 8 |
| **Total** | 12 | | **16** |

```
Total checked items:    42
Max possible score:     42 × 3 = 126
Weighted issue score:   16
Weighted Match Rate:    (1 - 16/126) × 100 = 87.3%
```

### 6.3 Iterate Decision

```
┌──────────────────────────────────────────────────┐
│  Weighted Match Rate: 87.3%                      │
│  🔴 Critical Issues:  0                          │
│                                                  │
│  Decision: ❌ ITERATE REQUIRED                    │
│  Reason:   matchRate 87.3% < 90%                 │
└──────────────────────────────────────────────────┘
```

---

## 7. Recommended Actions

### 7.1 Iterate — Warning (Match Rate 90% 달성을 위해)

| # | Item | Fix |
|---|------|-----|
| 1 | `prefers-reduced-motion` 미연결 | 각 섹션 컴포넌트에서 `getAnimationConfig()` 호출, `enabled: false`면 애니메이션 스킵 |
| 2 | 섹션 헤드라인 인라인 | `content.ts`에 섹션별 헤드라인 추가 |
| 3 | `SiteContent.getStarted` shape | 인터페이스 수정 또는 Engineering 문서 업데이트 |
| 4 | Engineering §13.2 `AnimatedSection` 잔존 | 해당 줄 삭제 |

### 7.2 Engineering Document Updates Needed

- [ ] §2.3 의존성 버전 업데이트 (next ^16, lucide ^1.x, vitest 추가)
- [ ] §2.1 Pretendard 제거 → JetBrains Mono로 통일
- [ ] §6.2 Hero 코드 스니펫 실제 구현 반영
- [ ] §13.2 Step 4 AnimatedSection 언급 삭제

---

## Version History

| Version | Date       | Changes | Author |
| ------- | ---------- | ------- | ------ |
| 0.1     | 2026-04-10 | Initial analysis — Match Rate 80.95%, ITERATE | AI Agent (Cursor) |
| 0.2     | 2026-04-10 | Post-iterate re-analysis — Match Rate 87.3%, ITERATE | AI Agent (Cursor) |
