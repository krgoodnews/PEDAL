# Landing Page Engineering Document

> **Summary**: PEDAL 소개 랜딩 페이지의 상세 기술 설계 — 컴포넌트, 애니메이션, 반응형, 배포
>
> **Project**: PEDAL
> **Author**: AI Agent (Cursor)
> **Date**: 2026-04-10
> **Status**: Reviewed
> **Planning Doc**: [landing-page.plan.md](../01-plan/landing-page.plan.md)

### Related Documents

| Document                                          | Status |
| ------------------------------------------------- | ------ |
| [Plan](../01-plan/landing-page.plan.md)           | ✅      |
| [Prompt](../01-plan/landing-page.prompt.md)       | ✅      |
| Wiki (SSOT)                                       | N/A    |

---

## 1. Overview

### 1.1 Engineering Goals

- PEDAL 워크플로우를 시각적으로 매력적이게 소개하는 Single Page Landing 구축
- GSAP ScrollTrigger 기반 섹션별 스크롤 애니메이션으로 몰입감 있는 UX 제공
- Dark Glassmorphism 테마로 2026년 트렌드에 부합하는 프리미엄 비주얼
- Vercel 배포 최적화 (SSG, 이미지 최적화, Core Web Vitals 충족)

### 1.2 Engineering Principles

- **Performance First**: 애니메이션 60fps 유지, Lighthouse ≥ 90
- **Progressive Enhancement**: `prefers-reduced-motion` 지원, JS 비활성화 시에도 콘텐츠 접근 가능
- **Component Isolation**: 각 섹션 컴포넌트는 독립적, 애니메이션 로직 분리
- **Mobile First**: 모바일 레이아웃 기준 설계 후 데스크톱 확장

---

## 2. Architecture

### 2.1 Component Diagram

```
┌──────────────────────────────────────────────────────────┐
│  RootLayout (layout.tsx)                                 │
│  ├── <html lang="en" className="dark">                   │
│  ├── Font Loading (Inter + Pretendard)                   │
│  ├── Metadata (SEO, OG)                                  │
│  └── SmoothScrollProvider                                │
│       └── <body>                                         │
│            └── Page (page.tsx)                            │
│                 ├── Hero                                  │
│                 ├── WhatIsPedal                           │
│                 ├── WorkflowFlow                          │
│                 ├── Features                              │
│                 ├── GetStarted                            │
│                 └── Footer                                │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
Static Content (constants/content.ts)
        │
        ▼
  Server Component (page.tsx)    ← SSG로 빌드 시점에 HTML 생성
        │
        ▼
  Client Components (각 섹션)    ← "use client" — GSAP 애니메이션 바인딩
        │
        ▼
  GSAP ScrollTrigger             ← 스크롤 위치에 따라 애니메이션 실행
        │
        ▼
  Lenis Smooth Scroll            ← 부드러운 스크롤 보간
```

### 2.3 Dependencies

| Package              | Version  | Purpose                            | Bundle Impact |
| -------------------- | -------- | ---------------------------------- | ------------- |
| `next`               | ^15.0.0  | Framework (App Router, SSG)        | Framework     |
| `react` / `react-dom`| ^19.0.0 | UI Library                         | Framework     |
| `typescript`         | ^5.0.0   | Type safety                        | Dev only      |
| `tailwindcss`        | ^4.0.0   | Utility CSS                        | CSS only      |
| `gsap`               | ^3.12.0  | Animation engine                   | ~34KB gzip    |
| `@gsap/react`        | ^2.1.0   | React 19 호환 `useGSAP` 훅        | ~2KB gzip     |
| `lenis`              | ^1.1.0   | Smooth scroll                      | ~8KB gzip     |
| `lucide-react`       | ^0.400.0 | 아이콘 라이브러리 (tree-shakeable)  | ~per icon 1KB |
| `@next/font`         | built-in | Font optimization                  | 0 (built-in)  |
| `eslint`             | ^9.0.0   | Linting                            | Dev only      |
| `prettier`           | ^3.0.0   | Formatting                         | Dev only      |
| `prettier-plugin-tailwindcss` | latest | Tailwind class sorting    | Dev only      |

---

## 3. Data Model

이 프로젝트는 순수 정적 랜딩 페이지이므로 DB/Entity 모델이 없다. 콘텐츠는 TypeScript 상수로 관리한다.

### 3.1 Content Types

```typescript
// src/constants/content.ts

interface PedalStep {
  letter: string;           // "P" | "E" | "D" | "A" | "L"
  title: string;            // "Plan"
  description: string;      // 한 줄 설명
  icon: string;             // Lucide icon name
  color: string;            // 액센트 컬러 (hex)
  details: string[];        // 상세 설명 bullet points
}

interface Feature {
  title: string;
  description: string;
  icon: string;
  gridSpan: "normal" | "wide" | "tall";  // Bento Grid 사이즈
}

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  steps: PedalStep[];
  features: Feature[];
  getStarted: {
    title: string;
    codeSnippet: string;
    githubUrl: string;
  };
  footer: {
    license: string;
    links: { label: string; href: string }[];
  };
}
```

---

## 4. API Specification

해당 없음. 정적 사이트로 백엔드 API 없음.

---

## 5. UI/UX Design

### 5.1 전체 페이지 레이아웃

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              ◆ ANIMATED MESH GRADIENT ◆          │
│                                                 │
│                    P E D A L                     │
│          AI-Powered Development Workflow         │
│                                                 │
│         [ Get Started ]   [ Learn More ]        │
│                                                 │
│                    ▼ scroll                      │
├─────────────────────────────────────────────────┤ ← 100vh
│                                                 │
│              What is PEDAL?                     │
│                                                 │
│  ┌─────────┐                                    │
│  │ P │ Plan │  목표, 범위, 요구사항 정의        │
│  └─────────┘                                    │
│                    ┌──────────────┐              │
│                    │ E │ Engineer │  설계, API.. │
│                    └──────────────┘              │
│  ┌─────────┐                                    │
│  │ D │ Do  │  Engineering 기반 구현             │
│  └─────────┘                                    │
│                    ┌──────────────┐              │
│                    │ A │ Analyze  │  갭 분석     │
│                    └──────────────┘              │
│  ┌─────────┐                                    │
│  │ L │ Learn│  Wiki + 보고서                    │
│  └─────────┘                                    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│              Workflow Flow                       │
│                                                 │
│   [P]──→[E]──→[D]──→[A]──→[L]                  │
│                  ↑    │                         │
│                  └────┘                         │
│                Iterate                          │
│          (< 90% OR Critical)                    │
│                                                 │
│   ← SVG path drawing animation on scroll →     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│           Feature Highlights                    │
│                                                 │
│   ┌────────────────┐  ┌───────────┐             │
│   │  Cross-Review  │  │  Wiki     │             │
│   │  (wide)        │  │  SSOT     │             │
│   ├────────┬───────┤  ├───────────┤             │
│   │Severity│ Human │  │  Low-tier │             │
│   │Scoring │ Gate  │  │  Agent OK │             │
│   └────────┴───────┘  └───────────┘             │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│             Get Started                         │
│                                                 │
│   ┌─────────────────────────────────┐           │
│   │  $ cp -r .pedal/ your-project/  │           │
│   │  $ # Configure your tool        │           │
│   │  $ /pedal plan user-auth        │           │
│   └─────────────────────────────────┘           │
│                                                 │
│          [ ⭐ Star on GitHub ]                   │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer: Apache 2.0 | GitHub | PEDAL            │
└─────────────────────────────────────────────────┘
```

### 5.2 반응형 브레이크포인트

| Breakpoint  | Width       | Layout 변경                                      |
| ----------- | ----------- | ------------------------------------------------ |
| `sm`        | ≥ 640px     | 기본 모바일 → 카드 패딩 증가                     |
| `md`        | ≥ 768px     | Bento Grid 2열, 좌우 교차 레이아웃 활성화        |
| `lg`        | ≥ 1024px    | Bento Grid 3열, 플로우 다이어그램 가로 배치      |
| `xl`        | ≥ 1280px    | 최대 콘텐츠 너비 1200px, 여백 확대               |

### 5.3 Component List

| Component              | File                              | Type            | Responsibility                                    |
| ---------------------- | --------------------------------- | --------------- | ------------------------------------------------- |
| `RootLayout`           | `src/app/layout.tsx`              | Server          | HTML 구조, 폰트, 메타데이터, SmoothScrollProvider  |
| `HomePage`             | `src/app/page.tsx`                | Server          | 섹션 컴포넌트 조합, 콘텐츠 전달                    |
| `SmoothScrollProvider` | `src/components/providers/SmoothScrollProvider.tsx` | Client | Lenis 초기화 + GSAP 연동           |
| `Hero`                 | `src/components/sections/Hero.tsx`| Client          | 풀스크린 히어로, 메쉬 그라디언트, CTA              |
| `WhatIsPedal`          | `src/components/sections/WhatIsPedal.tsx` | Client  | PEDAL 5단계 좌우 교차 소개                         |
| `WorkflowFlow`         | `src/components/sections/WorkflowFlow.tsx` | Client | SVG 플로우 다이어그램 + path drawing               |
| `Features`             | `src/components/sections/Features.tsx` | Client     | Bento Grid 피처 카드                               |
| `GetStarted`           | `src/components/sections/GetStarted.tsx` | Client   | 터미널 UI + GitHub CTA                             |
| `Footer`               | `src/components/sections/Footer.tsx` | Server        | 라이선스, 링크                                     |
| `GlassCard`            | `src/components/ui/GlassCard.tsx` | Client          | Glassmorphism 카드 (재사용)                        |
| `MeshGradient`         | `src/components/ui/MeshGradient.tsx` | Client       | CSS 기반 애니메이션 배경 그라디언트                 |
| `TerminalBlock`        | `src/components/ui/TerminalBlock.tsx` | Client       | 코드 스니펫 터미널 UI                              |
| `ScrollIndicator`      | `src/components/ui/ScrollIndicator.tsx` | Client    | 하단 스크롤 화살표 바운스                          |

---

## 6. Animation Specification

### 6.1 GSAP + Lenis 통합 전략

```typescript
// src/components/providers/SmoothScrollProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenisRef.current = lenis;

    // Lenis → GSAP ScrollTrigger 동기화
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}

// NOTE: useGSAP 훅은 내부적으로 gsap.context()를 관리하며,
// 컴포넌트 unmount 시 자동 클린업됨 → React 19 Strict Mode 안전
// ref: https://gsap.com/resources/React
```

### 6.2 섹션별 애니메이션 스펙

#### Hero (Section 1)

| Element            | Animation              | Trigger        | Duration | Ease           |
| ------------------ | ---------------------- | -------------- | -------- | -------------- |
| Mesh Gradient      | CSS `@keyframes` 루프  | 페이지 로드    | 20s loop | linear         |
| Title ("PEDAL")    | `opacity: 0→1, y: 40→0` | 페이지 로드  | 1.0s     | power3.out     |
| Subtitle           | `opacity: 0→1, y: 30→0` | 로드 + 0.3s  | 0.8s     | power3.out     |
| CTA Buttons        | `opacity: 0→1, y: 20→0` | 로드 + 0.6s  | 0.6s     | power2.out     |
| Scroll Indicator   | `y: 0→10→0` bounce    | 로드 + 1.2s    | 1.5s     | sine.inOut     |
| 스크롤 시 패럴랙스 | `y: 0→-100, opacity: 1→0` | scroll 0-50% | scrub    | none           |

```typescript
// Hero.tsx — useGSAP 사용 예시
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-title", { opacity: 0, y: 40, duration: 1 })
      .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.8 }, "-=0.5")
      .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");

    // 스크롤 패럴랙스
    gsap.to(".hero-content", {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, { scope: containerRef });

  return <section ref={containerRef}>...</section>;
}
```

#### WhatIsPedal (Section 2)

| Element                 | Animation                        | Trigger                | Duration | Ease        |
| ----------------------- | -------------------------------- | ---------------------- | -------- | ----------- |
| 섹션 타이틀             | `opacity: 0→1, y: 50→0`         | 뷰포트 진입 (top 80%)  | 0.8s     | power2.out  |
| 각 Step Card (홀수)     | `opacity: 0→1, x: -80→0`        | 뷰포트 진입 (top 75%)  | 0.7s     | power2.out  |
| 각 Step Card (짝수)     | `opacity: 0→1, x: 80→0`         | 뷰포트 진입 (top 75%)  | 0.7s     | power2.out  |
| Step Letter             | `scale: 0→1, rotation: -10→0`   | 카드 등장과 동시       | 0.5s     | back.out(2) |
| 카드 간 stagger         | 각 카드 0.15s 간격               | —                      | —        | —           |

```typescript
// WhatIsPedal.tsx
useGSAP(() => {
  const cards = gsap.utils.toArray<HTMLElement>(".step-card");
  cards.forEach((card, i) => {
    const fromX = i % 2 === 0 ? -80 : 80;
    gsap.from(card, {
      x: fromX,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });
}, { scope: sectionRef });
```

#### WorkflowFlow (Section 3)

| Element              | Animation                    | Trigger                  | Duration | Ease     |
| -------------------- | ---------------------------- | ------------------------ | -------- | -------- |
| SVG 연결선           | `strokeDashoffset` 감소      | scrub (스크롤 진행률)    | scrub    | none     |
| 각 단계 노드         | `scale: 0→1, opacity: 0→1`  | 연결선이 도달할 때       | 0.4s     | back.out |
| 단계 라벨            | `opacity: 0→1, y: 10→0`     | 노드 등장 + 0.2s        | 0.3s     | power2   |
| Iterate 화살표       | `drawSVG: 0→100%`           | A 노드 도달 시           | 0.6s     | power1   |
| 활성 단계 glow       | `boxShadow` pulse           | 각 단계 도달 시          | 반복     | sine     |

```typescript
// WorkflowFlow.tsx — SVG Path Drawing
useGSAP(() => {
  const path = document.querySelector(".flow-path") as SVGPathElement;
  const pathLength = path.getTotalLength();

  gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

  gsap.to(path, {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: ".workflow-section",
      start: "top 60%",
      end: "bottom 40%",
      scrub: 1,
    },
  });

  // 각 노드 순차 등장
  gsap.utils.toArray<HTMLElement>(".flow-node").forEach((node, i) => {
    gsap.from(node, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: ".workflow-section",
        start: `top ${60 - i * 8}%`,
        toggleActions: "play none none none",
      },
    });
  });
}, { scope: sectionRef });
```

#### Features (Section 4) — Bento Grid

| Element           | Animation                       | Trigger               | Duration | Ease       |
| ----------------- | ------------------------------- | --------------------- | -------- | ---------- |
| 섹션 타이틀       | `opacity: 0→1, y: 40→0`        | 뷰포트 진입           | 0.8s     | power2.out |
| 카드 stagger      | `opacity: 0→1, y: 60→0, scale: 0.95→1` | 뷰포트 진입 | 0.6s     | power2.out |
| stagger 간격      | 0.1s per card                   | —                     | —        | —          |
| 호버 glow         | `boxShadow: 0→ accent glow`    | mouseenter/leave      | 0.3s     | power1     |

#### GetStarted (Section 5)

| Element           | Animation                       | Trigger               | Duration | Ease       |
| ----------------- | ------------------------------- | --------------------- | -------- | ---------- |
| 터미널 블록       | `opacity: 0→1, y: 40→0`        | 뷰포트 진입           | 0.8s     | power2.out |
| 타이핑 효과       | 코드 라인 순차 reveal           | 터미널 등장 후 0.5s   | 2.0s     | steps(n)   |
| CTA 버튼          | `opacity: 0→1, scale: 0.9→1`   | 타이핑 완료 후        | 0.5s     | back.out   |

### 6.3 모바일 애니메이션 폴백

```typescript
// src/lib/animation-utils.ts
export function getAnimationConfig() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  if (prefersReduced) {
    return { enabled: false };
  }

  if (isMobile) {
    return {
      enabled: true,
      reduced: true,  // 복잡한 scrub 대신 단순 fade-in
      duration: 0.5,  // 짧은 duration
    };
  }

  return { enabled: true, reduced: false };
}
```

모바일에서는:
- SVG path drawing → 단순 순차 fade-in
- 좌우 교차 슬라이드 → 하단에서 fade-up
- scrub 패럴랙스 → 비활성화 (성능)
- hover glow → 비활성화 (터치 디바이스)
- `ScrollTrigger.isTouch` 로 터치 디바이스 감지하여 분기 처리
- 고주사율 디스플레이(120Hz+)에서도 GSAP ticker가 자동 대응하므로 별도 처리 불필요

---

## 7. Design Tokens & Styling

### 7.1 컬러 시스템

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #12121a;
  --color-glass: rgba(255, 255, 255, 0.05);
  --color-glass-border: rgba(255, 255, 255, 0.1);
  --color-glass-hover: rgba(255, 255, 255, 0.08);

  --color-accent-cyan: #00d4ff;
  --color-accent-purple: #8b5cf6;
  --color-accent-pink: #ec4899;

  --color-text-primary: #f0f0f5;
  --color-text-secondary: #a0a0b0;
  --color-text-muted: #606070;

  --gradient-accent: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ec4899 100%);
  --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);

  --shadow-glow-cyan: 0 0 40px rgba(0, 212, 255, 0.15);
  --shadow-glow-purple: 0 0 40px rgba(139, 92, 246, 0.15);
  --shadow-glass-inset: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### 7.2 Glass Card 기본 스타일

```tsx
// src/components/ui/GlassCard.tsx
export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10",
        "bg-white/5 backdrop-blur-xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        hover && "transition-all duration-300 hover:bg-white/8 hover:shadow-[0_0_40px_rgba(0,212,255,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 7.3 Mesh Gradient 배경

```tsx
// src/components/ui/MeshGradient.tsx
export function MeshGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-accent-purple/20 blur-[120px] animate-float-slow" />
      <div className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-accent-cyan/15 blur-[120px] animate-float-medium" />
      <div className="absolute -bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-accent-pink/10 blur-[120px] animate-float-fast" />
    </div>
  );
}

/* globals.css에 추가 */
/*
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
*/
```

### 7.4 타이포그래피

| Role        | Font             | Size (mobile/desktop) | Weight   | Tailwind Class    |
| ----------- | ---------------- | --------------------- | -------- | ----------------- |
| Hero Title  | Inter            | 3rem / 5rem           | 800      | `text-5xl lg:text-8xl font-extrabold` |
| Section H2  | Inter            | 2rem / 3rem           | 700      | `text-3xl lg:text-5xl font-bold` |
| Card Title  | Inter            | 1.25rem / 1.5rem      | 600      | `text-xl lg:text-2xl font-semibold` |
| Body        | Inter            | 1rem / 1.125rem       | 400      | `text-base lg:text-lg` |
| Code        | JetBrains Mono   | 0.875rem              | 400      | `font-mono text-sm` |

폰트 로딩은 `next/font`를 사용하여 FOUT 방지:
```typescript
// layout.tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
```

---

## 8. Error Handling

### 8.1 정적 사이트 에러 처리

| Scenario                  | Handling                                               |
| ------------------------- | ------------------------------------------------------ |
| JS 비활성화               | 콘텐츠 정적 HTML로 접근 가능 (애니메이션만 비활성화)    |
| 이미지 로딩 실패          | `next/image`의 `placeholder="blur"` + fallback color    |
| GSAP 로드 실패            | `try-catch` → 정적 콘텐츠 표시                          |
| 404 페이지                | `src/app/not-found.tsx` 커스텀 (Dark Glassmorphism)     |
| `prefers-reduced-motion`  | 모든 애니메이션 비활성화, 즉시 최종 상태 표시            |

---

## 9. Security Considerations

- [x] 외부 사용자 입력 없음 (정적 사이트)
- [x] 외부 API 호출 없음
- [ ] CSP (Content Security Policy) 헤더 설정 — `next.config.ts`에서 설정
- [ ] 외부 스크립트 최소화 (Google Analytics는 선택사항)
- [x] HTTPS 자동 적용 (Vercel)

```typescript
// next.config.ts — Security Headers
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];
```

---

## 10. Test Plan

### 10.1 Test Scope

| Type           | Target                          | Tool               |
| -------------- | ------------------------------- | ------------------- |
| Visual         | 섹션별 렌더링, 반응형           | 브라우저 수동 테스트 |
| Performance    | Lighthouse score, Core Web Vitals | Lighthouse CI      |
| Accessibility  | WCAG 2.1 AA, 스크린리더         | axe DevTools        |
| Cross-browser  | Chrome, Safari, Firefox, Edge   | 수동 테스트         |
| Animation      | 60fps 유지, 모바일 폴백        | Chrome DevTools FPS  |

### 10.2 Test Cases (Key)

- [ ] Hero 섹션 로드 시 타이틀 → 서브타이틀 → CTA 순차 등장
- [ ] 스크롤 시 WhatIsPedal 카드 좌우 교차 등장
- [ ] WorkflowFlow SVG path가 스크롤에 따라 그려짐
- [ ] Features Bento Grid 반응형 레이아웃 (sm: 1열, md: 2열, lg: 3열)
- [ ] GetStarted 터미널 타이핑 효과 정상 동작
- [ ] 모바일(360px)에서 모든 섹션 가독성 확인
- [ ] `prefers-reduced-motion` 활성 시 애니메이션 비활성화 확인
- [ ] Lighthouse Performance ≥ 90

---

## 11. Layer Structure

### 11.1 프로젝트 레이어

| Layer              | Responsibility                         | Location                 |
| ------------------ | -------------------------------------- | ------------------------ |
| **Presentation**   | UI 컴포넌트, 레이아웃, 스타일링        | `src/components/`, `src/app/` |
| **Content**        | 정적 콘텐츠 데이터 (텍스트, 설정)      | `src/constants/`         |
| **Animation**      | GSAP 초기화, ScrollTrigger 설정        | `src/lib/`, 각 컴포넌트 내 `useGSAP` |
| **Infrastructure** | Lenis 초기화, 폰트 로딩, 배포 설정     | `src/components/providers/`, `next.config.ts` |

---

## 12. Coding Conventions

### 12.1 Naming Conventions

| Target               | Rule                    | Example                           |
| -------------------- | ----------------------- | --------------------------------- |
| Component            | PascalCase              | `GlassCard`, `WhatIsPedal`       |
| File (component)     | PascalCase.tsx          | `GlassCard.tsx`                   |
| File (utility)       | camelCase.ts            | `animation-utils.ts`              |
| CSS variable         | kebab-case              | `--color-accent-cyan`             |
| Constant             | UPPER_SNAKE (export)    | `PEDAL_STEPS`                     |
| Hook                 | camelCase (use prefix)  | `useScrollAnimation`              |

### 12.2 Import Order

```typescript
// 1. React / Next.js
import { useRef } from "react";
import Image from "next/image";

// 2. Third-party
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// 3. Internal (absolute path)
import { GlassCard } from "@/components/ui/GlassCard";
import { PEDAL_STEPS } from "@/constants/content";

// 4. Types
import type { PedalStep } from "@/constants/content";
```

### 12.3 Component Pattern

```typescript
// 모든 섹션 컴포넌트의 공통 패턴
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  // props
}

export function SectionName({ ...props }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // GSAP animations here — scoped to sectionRef
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen px-6 py-24">
      {/* content */}
    </section>
  );
}
```

---

## 13. Implementation Guide

### 13.1 File Structure

```
landing/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← RootLayout + 폰트 + 메타데이터
│   │   ├── page.tsx                ← Server Component, 섹션 조합
│   │   ├── not-found.tsx           ← 커스텀 404
│   │   └── globals.css             ← Tailwind v4 + 커스텀 테마 토큰
│   ├── components/
│   │   ├── providers/
│   │   │   └── SmoothScrollProvider.tsx  ← Lenis + GSAP 통합
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── WhatIsPedal.tsx
│   │   │   ├── WorkflowFlow.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── GetStarted.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── GlassCard.tsx
│   │       ├── MeshGradient.tsx
│   │       ├── TerminalBlock.tsx
│   │       └── ScrollIndicator.tsx
│   ├── constants/
│   │   └── content.ts              ← 모든 텍스트 콘텐츠 (i18n 확장 대비)
│   └── lib/
│       └── animation-utils.ts      ← 애니메이션 헬퍼 (모바일 감지 등)
├── public/
│   ├── og-image.png
│   └── favicon.ico
├── next.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

### 13.2 Implementation Order

1. [ ] **프로젝트 스캐폴딩**: `create-next-app` + 의존성 설치 + Tailwind v4 설정
2. [ ] **글로벌 설정**: `layout.tsx` (폰트, 메타), `globals.css` (테마 토큰), `next.config.ts`
3. [ ] **인프라**: `SmoothScrollProvider` (Lenis + GSAP 통합)
4. [ ] **공통 UI**: `GlassCard`, `MeshGradient`, `AnimatedSection`, `TerminalBlock`
5. [ ] **콘텐츠**: `constants/content.ts` (모든 텍스트 데이터)
6. [ ] **섹션 구현** (순서대로):
   - Hero (메쉬 그라디언트 + 로드 애니메이션 + 패럴랙스)
   - WhatIsPedal (좌우 교차 카드 + stagger)
   - WorkflowFlow (SVG path drawing + 노드 등장)
   - Features (Bento Grid + hover glow)
   - GetStarted (터미널 타이핑 + CTA)
   - Footer
7. [ ] **반응형 조정**: 모바일 레이아웃 + 애니메이션 폴백
8. [ ] **성능 최적화**: 이미지, 번들, Lighthouse 튜닝
9. [ ] **배포**: Vercel 프로젝트 설정 (Root Directory: `landing`)

### 13.3 Vercel 배포 설정

```
Vercel Dashboard:
  Project Settings → General
    Root Directory: landing
    Framework Preset: Next.js (auto-detected)
    Build Command: (default) next build
    Output Directory: (default) .next
```

**모노레포 주의사항**: 루트에 `package.json`이 없으므로 Vercel이 `landing/`을 독립 프로젝트로 인식한다. `.gitignore`에 `landing/node_modules/`, `landing/.next/`를 추가하되, `landing/` 자체는 추적해야 한다.

`vercel.json` 파일은 선택사항이며, 보안 헤더나 리다이렉트가 필요할 때만 `landing/` 내부에 생성:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

---

## 14. Self-Review Criteria (Do → Analyze Gate)

> **Agent**: Verify each item below **internally** before proceeding to Analyze.

### 14.1 Implementation Completeness

- 모든 기능 요구사항(FR-01 ~ FR-10) 구현
- 6개 섹션 모두 렌더링
- GSAP 애니메이션 전 섹션에 적용
- Lenis smooth scroll 정상 동작

### 14.2 Code Quality

- TypeScript 에러 없음 (`tsc --noEmit` 통과)
- ESLint 경고 없음
- 하드코딩된 텍스트 없음 (모두 `constants/content.ts`에서 참조)
- console.log 제거

### 14.3 Performance

- Lighthouse Performance ≥ 90
- LCP < 2.5s
- 스크롤 애니메이션 60fps 유지 (Chrome DevTools로 확인)
- `prefers-reduced-motion` 지원 확인

### 14.4 Accessibility

- 모든 이미지에 alt 텍스트
- 대비비 4.5:1 이상
- 키보드 내비게이션 가능
- 시맨틱 HTML (section, nav, footer 등)

### 14.5 Ready for Analyze

```bash
/pedal analyze landing-page
```

---

## Version History

| Version | Date       | Changes                                                    | Author            |
| ------- | ---------- | ---------------------------------------------------------- | ----------------- |
| 0.1     | 2026-04-10 | Initial draft                                              | AI Agent (Cursor) |
| 0.2     | 2026-04-10 | Cross-review 반영: lucide-react 추가, useGSAP 클린업 명시, 모바일 터치 감지, Vercel 모노레포 주의사항 | AI Agent (Cursor) |
