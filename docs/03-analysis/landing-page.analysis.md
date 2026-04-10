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

Engineering 문서에 명세된 컴포넌트, 데이터 모델, 디자인 토큰, 파일 구조, 컨벤션을 실제 구현과 비교하여 갭을 식별하고, Severity-Weighted Match Rate를 계산한다.

### 1.2 Analysis Scope

- **Engineering Document**: `docs/02-engineering/landing-page.engineering.md`
- **Implementation Path**: `landing/src/`
- **Test**: 44 tests, 7 files — all passing
- **Build**: `next build` clean, `tsc --noEmit` clean, `eslint` clean

---

## 2. Gap Analysis (Engineering vs Implementation)

### 2.1 Component Structure (§5.3)

| Engineering Component  | Implementation File                               | Status              |
| ---------------------- | ------------------------------------------------- | ------------------- |
| `RootLayout`           | `src/app/layout.tsx`                               | ✅ Match            |
| `HomePage`             | `src/app/page.tsx`                                 | ✅ Match            |
| `SmoothScrollProvider` | `src/components/providers/SmoothScrollProvider.tsx` | ✅ Match            |
| `Hero`                 | `src/components/sections/Hero.tsx`                  | ✅ Match            |
| `WhatIsPedal`          | `src/components/sections/WhatIsPedal.tsx`           | ✅ Match            |
| `WorkflowFlow`         | `src/components/sections/WorkflowFlow.tsx`          | ✅ Match            |
| `Features`             | `src/components/sections/Features.tsx`              | ✅ Match            |
| `GetStarted`           | `src/components/sections/GetStarted.tsx`            | ✅ Match            |
| `Footer`               | `src/components/sections/Footer.tsx`                | ✅ Match (Server)   |
| `GlassCard`            | `src/components/ui/GlassCard.tsx`                   | ✅ Match            |
| **`AnimatedSection`**  | —                                                  | ⚠️ Not implemented  |
| `MeshGradient`         | `src/components/ui/MeshGradient.tsx`                | ✅ Match            |
| `TerminalBlock`        | `src/components/ui/TerminalBlock.tsx`                | ✅ Match            |
| `ScrollIndicator`      | `src/components/ui/ScrollIndicator.tsx`              | ✅ Match            |

### 2.2 Data Model (§3.1)

| Engineering Type   | Implementation                 | Status             | Notes                                  |
| ------------------ | ------------------------------ | ------------------ | -------------------------------------- |
| `PedalStep`        | `PedalStep` in content.ts      | ⚠️ Modified        | `subtitle` 필드 추가 (Engineering에 없음) |
| `Feature`          | `Feature` in content.ts        | ⚠️ Modified        | `accent` 필드 추가 (Engineering에 없음) |
| `SiteContent`      | —                              | ⚠️ Not implemented | 통합 타입 미구현, 개별 export로 대체   |
| `TerminalLine`     | `TerminalLine` in content.ts   | ⚠️ Added           | Engineering에 없는 타입 추가           |

### 2.3 File Structure (§13.1)

| Expected File              | Actual                    | Status             |
| -------------------------- | ------------------------- | ------------------- |
| `src/app/not-found.tsx`    | —                         | ⚠️ Missing          |
| `src/components/ui/AnimatedSection.tsx` | —              | ⚠️ Missing          |
| `public/og-image.png`      | —                         | ❌ Missing (메타에서 참조) |
| `public/favicon.ico`       | `src/app/favicon.ico`     | ✅ (다른 위치)      |
| `pnpm-lock.yaml`           | `package-lock.json`       | ℹ️ npm 사용         |
| `.eslintrc.json`           | `eslint.config.mjs`       | ℹ️ flat config      |
| `.prettierrc`              | —                         | ⚠️ Missing          |

### 2.4 Dependencies (§2.3)

| Package                         | Engineering  | Actual     | Status     |
| ------------------------------- | ------------ | ---------- | ---------- |
| `next`                          | ^15.0.0      | 16.2.3     | ℹ️ Newer   |
| `prettier`                      | ^3.0.0       | —          | ⚠️ Missing |
| `prettier-plugin-tailwindcss`   | latest       | —          | ⚠️ Missing |
| `lucide-react`                  | ^0.400.0     | ^1.8.0     | ℹ️ Newer   |

### 2.5 Design Tokens (§7.1)

| Token                    | Engineering | Implementation | Status     |
| ------------------------ | ----------- | -------------- | ---------- |
| `--color-bg-primary`     | ✅          | ✅              | ✅ Match   |
| `--color-bg-secondary`   | ✅          | ✅              | ✅ Match   |
| `--color-glass`          | ✅          | —              | ⚠️ Missing |
| `--color-glass-border`   | ✅          | —              | ⚠️ Missing |
| `--color-glass-hover`    | ✅          | —              | ⚠️ Missing |
| `--color-accent-*`       | ✅          | ✅              | ✅ Match   |
| `--color-text-*`         | ✅          | ✅              | ✅ Match   |
| `--gradient-accent`      | ✅          | —              | ⚠️ Missing |
| `--gradient-glass`       | ✅          | —              | ⚠️ Missing |
| `--shadow-glow-*`        | ✅          | —              | ⚠️ Missing |
| `--shadow-glass-inset`   | ✅          | —              | ⚠️ Missing |

> Glass/gradient/shadow 토큰은 `.glass` 클래스와 Tailwind arbitrary value로 동일 효과를 내지만, 명시적 CSS 변수로는 정의되지 않음.

### 2.6 기타

| Item                         | Engineering     | Implementation | Status      |
| ---------------------------- | --------------- | -------------- | ----------- |
| Font: Pretendard             | §2.1 diagram    | —              | ⚠️ Missing  |
| `<html lang="en">`          | §2.1 diagram    | `lang="ko"`    | ℹ️ 의도적 변경 |
| `<html className="dark">`    | §2.1 diagram    | —              | ⚠️ Missing  |
| Hero 텍스트 하드코딩          | §14.2 "없음"    | Hero.tsx 내 직접 기입 | ⚠️ 위반 |
| Footer 링크 데이터            | §3.1 `footer.links[]` | Footer.tsx 내 직접 기입 | ⚠️ 위반 |

---

## 3. Code Quality Analysis

### 3.1 Build & Lint

| Check           | Result | Notes         |
| --------------- | ------ | ------------- |
| `npm run build` | ✅ Pass | 0 warnings    |
| `tsc --noEmit`  | ✅ Pass | 0 errors      |
| `npx eslint src/` | ✅ Pass | 0 warnings |

### 3.2 Code Smells

| Type            | File            | Description                              | Severity |
| --------------- | --------------- | ---------------------------------------- | -------- |
| Hardcoded text  | `Hero.tsx`      | 타이틀, 서브타이틀, badge, 통계 직접 기입 | 🟡       |
| Hardcoded links | `Footer.tsx`    | Docs/README 링크 직접 기입               | 🟢       |

### 3.3 Security Issues

| Severity | Issue                                  | Status |
| -------- | -------------------------------------- | ------ |
| ✅       | 외부 사용자 입력 없음                  | Clean  |
| ✅       | Security headers in next.config.ts     | 3+1 headers |
| ℹ️       | CSP 미설정 (Engineering §9에서도 미체크) | N/A   |

---

## 4. Test Coverage

| Metric        | Result          | Status |
| ------------- | --------------- | ------ |
| Test Files    | 7 passed (7)    | ✅     |
| Tests         | 44 passed (44)  | ✅     |
| Build         | Clean           | ✅     |

### Uncovered Areas

- `WorkflowFlow.tsx` — SVG 렌더링 테스트 없음 (GSAP mock 한계)
- `GetStarted.tsx` — 컴포넌트 렌더링 테스트 없음
- `Footer.tsx` — Server Component 테스트 없음
- `SmoothScrollProvider.tsx` — Lenis 초기화 테스트 없음

---

## 5. Convention Compliance

### 5.1 TDD (conventions.md)

| Requirement                   | Status            | Notes                                         |
| ----------------------------- | ----------------- | --------------------------------------------- |
| 테스트 먼저 작성 후 기능 구현 | ⚠️ Not followed   | 구현 커밋 후 테스트 커밋 (git log 확인)       |
| Engineering 항목 테스트       | ✅ Followed        | 과도하지 않은 적절한 테스트 수                |
| Analysis에서 테스트 수행      | ✅ Followed        | npm test 44/44 통과                           |

### 5.2 Naming Conventions (§12.1)

| Category          | Convention    | Files Checked | Compliance | Violations |
| ----------------- | ------------- | :-----------: | :--------: | ---------- |
| Component         | PascalCase    |      14       |   100%     | 없음       |
| File (component)  | PascalCase.tsx |     14       |   100%     | 없음       |
| File (utility)    | kebab-case.ts  |      1       |   100%     | 없음       |
| CSS variable      | kebab-case    |      10       |   100%     | 없음       |
| Constant          | UPPER_SNAKE   |       4       |   100%     | 없음       |

### 5.3 Import Order (§12.2)

전 컴포넌트에서 React/Next → Third-party → Internal → Types 순서 준수.

---

## 6. Severity-Weighted Match Rate

### 6.1 Issue Summary by Severity

| Severity    | Count | Weight | Weighted Score |
| ----------- | :---: | :----: | :------------: |
| 🔴 Critical |   1   |   x3   |       3        |
| 🟡 Warning  |   8   |   x2   |      16        |
| 🟢 Info     |   5   |   x1   |       5        |
| **Total**   |  14   |        |      24        |

### 6.2 Issue Details

| # | Severity | Issue                                             |
|---|----------|---------------------------------------------------|
| 1 | 🔴       | `og-image.png` 미존재 — 메타데이터에서 참조하나 404 |
| 2 | 🟡       | `AnimatedSection.tsx` 미구현 (§5.3, §13.1)        |
| 3 | 🟡       | `SiteContent` 통합 타입 미구현 (§3.1)              |
| 4 | 🟡       | Hero 텍스트 하드코딩 — §14.2 "하드코딩 없음" 위반  |
| 5 | 🟡       | `not-found.tsx` 커스텀 404 미구현 (§8.1, §13.1)    |
| 6 | 🟡       | `prettier` / `prettier-plugin-tailwindcss` 미설치  |
| 7 | 🟡       | Design tokens 7개 미정의 (glass, gradient, shadow) |
| 8 | 🟡       | Pretendard 폰트 미적용 (§2.1 diagram)              |
| 9 | 🟡       | TDD 순서 미준수 (테스트 후작성)                     |
| 10| 🟢       | `PedalStep.subtitle`, `Feature.accent` 필드 추가   |
| 11| 🟢       | `lang="ko"` vs Engineering `lang="en"` (의도적)    |
| 12| 🟢       | `<html className="dark">` 누락                    |
| 13| 🟢       | `package-lock.json` vs `pnpm-lock.yaml`            |
| 14| 🟢       | `Permissions-Policy` 헤더 추가 (긍정적 추가)       |

### 6.3 Weighted Match Rate

```
Total checked items:    42 (components 14 + data model 4 + files 7 + deps 4 + tokens 11 + convention 2)
Max possible score:     42 × 3 = 126
Weighted issue score:   24
Weighted Match Rate:    (1 - 24/126) × 100 = 80.95%
```

### 6.4 Iterate Decision

```
┌──────────────────────────────────────────────────┐
│  Weighted Match Rate: 80.95%                     │
│  🔴 Critical Issues:  1                          │
│                                                  │
│  Decision: ❌ ITERATE REQUIRED                    │
│  Reason:  Critical > 0 → FORCE ITERATE           │
│           matchRate 80.95% < 90%                  │
└──────────────────────────────────────────────────┘
```

---

## 7. Recommended Actions

### 7.1 Immediate (Iterate — Critical)

| # | Priority | Item                      | Fix                                      |
|---|----------|---------------------------|------------------------------------------|
| 1 | 🔴       | OG 이미지 없음            | `public/og-image.png` 생성 또는 메타데이터에서 제거 |

### 7.2 Short-term (Iterate — Warning)

| # | Priority | Item                      | Fix                                      |
|---|----------|---------------------------|------------------------------------------|
| 2 | 🟡       | Hero 텍스트 하드코딩      | content.ts에 hero 섹션 데이터 추가        |
| 3 | 🟡       | AnimatedSection 미구현    | 구현 또는 Engineering 문서에서 삭제        |
| 4 | 🟡       | not-found.tsx 미구현      | Dark Glassmorphism 404 페이지 추가         |
| 5 | 🟡       | SiteContent 통합 타입     | content.ts에 SiteContent 타입 추가         |
| 6 | 🟡       | Design tokens 누락        | globals.css에 §7.1 토큰 추가              |
| 7 | 🟡       | Prettier 미설치           | npm install + .prettierrc 생성             |
| 8 | 🟡       | Pretendard 폰트           | §2.1 자체가 §7.4와 모순 → Engineering 수정 |
| 9 | 🟡       | TDD 순서                  | 이미 수정 불가 (과거); 향후 준수           |

### 7.3 Engineering Document Updates Needed

- [ ] §2.1 Pretendard 언급 제거 또는 §7.4와 통일
- [ ] §3.1 `PedalStep.subtitle`, `Feature.accent`, `TerminalLine` 반영
- [ ] §2.3 next ^15 → ^16, lucide-react ^0.400 → ^1.x 업데이트
- [ ] §2.3 vitest, @testing-library 등 테스트 의존성 추가

---

## Version History

| Version | Date       | Changes          | Author            |
| ------- | ---------- | ---------------- | ----------------- |
| 0.1     | 2026-04-10 | Initial analysis | AI Agent (Cursor) |
