# Landing Page

PEDAL 소개 랜딩 페이지의 아키텍처와 기술 결정 사항을 정리한다.

## 기술 스택

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| Framework | Next.js (App Router) | 16.2.3 | Vercel 최적화, SSG, React 19 |
| Language | TypeScript | 5.x | 타입 안전성 |
| Styling | Tailwind CSS | 4.x | Utility-first, Glassmorphism 내장 지원 |
| Animation | GSAP + ScrollTrigger | 3.14.x | 스크롤 애니메이션 60fps, ~34KB gzip |
| GSAP React | @gsap/react | 2.1.x | React 19 Strict Mode 호환 `useGSAP` |
| Smooth Scroll | Lenis | 1.3.x | 네이티브 스크롤바 유지, GSAP 연동 |
| Icons | lucide-react | 1.8.x | Tree-shakeable |
| Testing | Vitest + Testing Library | 4.x / 16.x | 빠른 실행, React 19 호환 |
| Formatting | Prettier + tailwindcss plugin | 3.x | 클래스 순서 자동 정렬 |

## 컴포넌트 구조

```
landing/src/
├── app/
│   ├── layout.tsx              ← RootLayout (Inter + JetBrains Mono, SEO 메타)
│   ├── page.tsx                ← HomePage (Server Component, 섹션 조합)
│   ├── not-found.tsx           ← 커스텀 404 (Dark Glassmorphism)
│   ├── favicon.ico
│   └── globals.css             ← Tailwind v4 + 디자인 토큰
├── components/
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx  ← Lenis + GSAP ticker 연동
│   ├── sections/
│   │   ├── Hero.tsx            ← 풀스크린 히어로, 메쉬 그라디언트, 패럴랙스
│   │   ├── WhatIsPedal.tsx     ← PEDAL 5단계 좌우 교차 카드
│   │   ├── WorkflowFlow.tsx    ← SVG 플로우 다이어그램 + path drawing
│   │   ├── Features.tsx        ← Bento Grid 피처 카드
│   │   ├── GetStarted.tsx      ← 터미널 타이핑 + GitHub CTA
│   │   └── Footer.tsx          ← 라이선스, 링크 (Server Component)
│   └── ui/
│       ├── GlassCard.tsx       ← Glassmorphism 카드 (glow 색상 옵션)
│       ├── MeshGradient.tsx    ← CSS 기반 floating gradient orbs
│       ├── TerminalBlock.tsx   ← 터미널 UI (타이핑 효과)
│       └── ScrollIndicator.tsx ← 스크롤 마우스 바운스 아이콘
├── constants/
│   └── content.ts              ← 모든 텍스트 (i18n 확장 대비)
└── lib/
    └── animation-utils.ts      ← getAnimationConfig(), cn()
```

## 애니메이션 패턴

### GSAP + Lenis 연동

```
Lenis.on("scroll") → ScrollTrigger.update
gsap.ticker.add(lenis.raf)
gsap.ticker.lagSmoothing(0)
```

### 컴포넌트 공통 패턴

```
"use client"
→ useGSAP({ scope: sectionRef })
→ getAnimationConfig() 호출 (prefers-reduced-motion 체크)
→ enabled: false → 정적 상태 표시 (gsap.set + return)
→ enabled: true  → gsap.set() + gsap.to() 패턴 (from() 부작용 방지)
```

`gsap.from()` 대신 `gsap.set() + gsap.to()` 패턴을 사용하는 이유:
- React Strict Mode에서 이중 마운트 시 `from()`의 초기 상태가 남아 깜빡임 발생
- `set()`으로 명시적 초기 상태를 설정하고 `to()`로 애니메이션하면 안정적
- `clearProps: "all"`로 클린업하여 다음 마운트에 간섭 방지

### prefers-reduced-motion

`getAnimationConfig()` 반환값:

| 환경 | enabled | reduced | duration |
|------|---------|---------|----------|
| 데스크톱 | true | false | 0.7s |
| 모바일/터치 | true | true | 0.5s |
| prefers-reduced-motion | false | true | 0 |
| SSR | true | false | 0.7s |

## 디자인 시스템

### 테마: Dark Glassmorphism

- 배경: `#0a0a0f` (deep dark)
- 액센트: Cyan `#00d4ff` → Purple `#8b5cf6` → Pink `#ec4899` 그라디언트
- Glass 패널: `bg-white/5 + backdrop-blur-xl + border-white/10`
- 폰트: Inter (본문) + JetBrains Mono (코드)

### 디자인 토큰 (globals.css @theme)

색상, 글래스, 그라디언트, 그림자, 애니메이션 키프레임이 Tailwind v4 `@theme` 블록에 정의됨. 컴포넌트에서 `bg-bg-primary`, `text-accent-cyan` 등으로 참조.

## 콘텐츠 관리

모든 텍스트는 `constants/content.ts`에 중앙화:

| Export | 용도 |
|--------|------|
| `HERO_CONTENT` | Hero 섹션 (badge, title, subtitle, CTA, stats) |
| `PEDAL_STEPS` | PEDAL 5단계 데이터 |
| `FEATURES` | Feature 카드 데이터 |
| `TERMINAL_LINES` | GetStarted 터미널 명령 |
| `SECTION_COPY` | 각 섹션 헤드라인 (eyebrow, title, titleAccent, description) |
| `SITE_META` | GitHub URL, 라이선스 |

## 배포

### Vercel 설정

모노레포 구조이므로 Vercel 프로젝트 설정에서 Root Directory 지정이 필수:

```
Vercel Dashboard → Project Settings → General
  Root Directory:     landing
  Framework Preset:   Next.js (자동 감지)
  Build Command:      next build (기본값)
  Output Directory:   .next (기본값)
```

환경 변수 (선택):

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | OG 이미지 절대 경로 | `https://pedal.vercel.app` |

### 빌드 결과

- `next build` → SSG (정적 생성)
- 4 pages: `/`, `/_not-found`, favicon, OG image
- 보안 헤더: X-Frame-Options(DENY), X-Content-Type-Options(nosniff), Referrer-Policy, Permissions-Policy (`next.config.ts`)

### 주의사항

- `.gitignore`에 `landing/node_modules/`, `landing/.next/` 포함 필수
- `landing/` 디렉토리 자체는 git 추적 대상
- `package-lock.json` 사용 (npm) — Engineering 문서는 pnpm 기재였으나 npm으로 구현

## 테스트

- 44개 테스트, 7개 파일 — 전부 통과
- Vitest + @testing-library/react + jsdom
- 커버: Hero, WhatIsPedal, Features, GlassCard, TerminalBlock, animation-utils, content
- 미커버 백로그: WorkflowFlow, GetStarted, Footer, SmoothScrollProvider, ScrollIndicator
