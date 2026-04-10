# PEDAL Landing Page 기획 문서

> **Summary**: PEDAL 워크플로우를 소개하는 모던 랜딩 페이지 (Dark Glassmorphism + 스크롤 애니메이션)
>
> **Project**: PEDAL
> **Author**: AI Agent (Cursor)
> **Date**: 2026-04-10
> **Status**: Reviewed

---

## 1. Overview

### 1.1 Purpose

PEDAL 워크플로우(Plan → Engineering → Do → Analyze → Learn)를 외부에 소개하고 홍보하기 위한 랜딩 페이지를 구축한다. 스크롤 기반의 유려한 애니메이션으로 각 단계를 시각적으로 매력적이게 전달하여 방문자의 이해와 관심을 이끌어낸다.

### 1.2 Background

- PEDAL은 PDCA 사이클에서 영감을 받은 AI 에이전트 기반 개발 워크플로우
- 현재 README.md와 `.pedal/PEDAL.md` 문서로만 설명되어 있어 시각적 소개 수단이 부족
- 별도의 랜딩 페이지를 통해 PEDAL의 가치를 효과적으로 전달할 필요

### 1.3 Related Documents

- PEDAL 스펙: [.pedal/PEDAL.md](../../.pedal/PEDAL.md)
- README: [README.md](../../README.md)

---

## 2. Scope

### 2.1 In Scope

- [ ] 루트 디렉토리 내 별도 폴더(`landing/`)에 독립 프로젝트 구성
- [ ] 스크롤 기반 섹션별 애니메이션 (GSAP ScrollTrigger)
- [ ] Dark Glassmorphism UI 테마 적용
- [ ] PEDAL 5단계(P-E-D-A-L) 시각적 소개 섹션
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] Vercel 배포 구성
- [ ] SEO 기본 설정 (메타 태그, OG 이미지)

### 2.2 Out of Scope

- 사용자 인증/로그인 기능
- 백엔드 API 서버
- CMS 또는 블로그 기능
- 다국어 지원 (1차는 한국어 + 영어 병행, 국제화 프레임워크는 미포함)
  - 단, 향후 확장을 위해 텍스트 데이터는 별도 상수 파일로 분리 관리
- 결제/구독 기능

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement                                          | Priority | Status  |
| ----- | ---------------------------------------------------- | -------- | ------- |
| FR-01 | Hero 섹션: 타이틀 + 서브타이틀 + CTA 버튼           | High     | Pending |
| FR-02 | PEDAL 워크플로우 5단계 시각적 소개 섹션              | High     | Pending |
| FR-03 | 각 섹션 진입 시 스크롤 트리거 애니메이션             | High     | Pending |
| FR-04 | PEDAL 플로우 다이어그램/인포그래픽                    | High     | Pending |
| FR-05 | Feature Highlights 섹션 (Cross-review, Wiki 등)      | Medium   | Pending |
| FR-06 | GitHub 저장소 링크 + "Get Started" CTA               | Medium   | Pending |
| FR-07 | Footer (라이선스, 링크)                               | Low      | Pending |
| FR-08 | 부드러운 스크롤 (Lenis Smooth Scroll)                | Medium   | Pending |
| FR-09 | 이미지 최적화 (next/image, priority 속성, LCP 대응)  | Medium   | Pending |
| FR-10 | 텍스트 콘텐츠 상수 파일 분리 (향후 i18n 확장 대비)   | Low      | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                                     | Measurement Method         |
| ------------- | -------------------------------------------- | -------------------------- |
| Performance   | Lighthouse Performance ≥ 90                  | Lighthouse CI              |
| Performance   | LCP < 2.5s, FID < 100ms, CLS < 0.1          | Core Web Vitals            |
| Accessibility | WCAG 2.1 AA 준수                             | Lighthouse Accessibility   |
| SEO           | Lighthouse SEO ≥ 90                          | Lighthouse CI              |
| 호환성        | Chrome, Safari, Firefox, Edge 최신 2버전     | 브라우저 테스트            |
| 반응형        | 모바일(360px) ~ 데스크톱(1920px) 대응         | 반응형 테스트              |

---

## 4. 기술 스택

### 4.1 선정 기술 스택

| Category         | Technology                | Version   | Rationale                                                           |
| ---------------- | ------------------------- | --------- | ------------------------------------------------------------------- |
| **Framework**    | Next.js (App Router)      | 15.x      | Vercel 최적화, SSG 지원, 이미지 최적화, 최신 React 19 기반          |
| **Language**      | TypeScript                | 5.x       | 타입 안전성, DX 향상                                                |
| **Styling**      | Tailwind CSS              | 4.x       | 유틸리티 퍼스트, 빠른 프로토타이핑, Dark 테마 네이티브 지원         |
| **Animation**    | GSAP + ScrollTrigger      | 3.x       | 스크롤 애니메이션 성능 최고 (60fps, CPU 2-3%), 번들 경량            |
| **Smooth Scroll** | Lenis                    | latest    | 부드러운 네이티브 스크롤, GSAP과 호환 우수                          |
| **Deployment**   | Vercel                    | -         | Next.js 공식 호스팅, Edge 배포, 무료 티어 사용 가능                 |
| **Package Mgr**  | pnpm                      | 9.x       | 빠른 설치, 디스크 효율, 엄격한 의존성 관리                          |

### 4.2 기술 선정 근거

#### Next.js 15 (vs Astro, Vite+React)
- Vercel에 배포하므로 **가장 자연스러운 선택** (zero-config 배포)
- `next/image`로 이미지 자동 최적화 (WebP/AVIF 변환, lazy loading)
- App Router의 Server Components로 초기 JS 번들 최소화
- 정적 생성(SSG)으로 CDN 캐싱 극대화
- ⚠️ React 19 기반이므로 GSAP 연동 시 `useGSAP` 훅 사용 필수 (Strict Mode 호환)

#### GSAP + ScrollTrigger (vs Framer Motion)
- **복잡한 스크롤 애니메이션**에서 Framer Motion 대비 우수한 성능:
  - CPU 사용률: GSAP 2-3% vs Framer Motion 4-6%
  - 프레임 레이트: GSAP 안정적 60fps vs Framer Motion 복합 애니메이션 시 ~45fps 하락
  - 번들 크기: GSAP ~34KB vs Framer Motion ~42-60KB
- ScrollTrigger 플러그인으로 스크롤 위치 기반 애니메이션 정밀 제어
- Timeline 기반으로 복잡한 시퀀스 애니메이션 오케스트레이션 가능

#### Tailwind CSS v4
- JIT 컴파일로 프로덕션 CSS 최소화
- `dark:` variant로 다크 테마 네이티브 지원
- `backdrop-blur`, `bg-white/5` 등 glassmorphism 유틸리티 내장
- shadcn/ui, Aceternity UI 등 인기 컴포넌트 라이브러리와 호환

#### Lenis (vs Locomotive Scroll)
- Locomotive Scroll v5 대비 경량이고 GSAP ScrollTrigger 연동이 매끄러움
- 네이티브 스크롤바 유지 (접근성 우수)
- requestAnimationFrame 기반으로 60fps 부드러운 스크롤
- ⚠️ ScrollTrigger와 함께 사용 시 `lenis.on('scroll', ScrollTrigger.update)` 연동 필수 — Engineering에서 상세 구현 전략 기술 예정

### 4.3 UI 테마: Dark Glassmorphism

2026년 가장 인기 있고 모던한 UI 테마로 **Dark Glassmorphism**을 선정한다.

#### 핵심 디자인 원칙

| 요소                 | 구현                                                               |
| -------------------- | ------------------------------------------------------------------ |
| **배경**             | 깊은 다크(#0a0a0f) + 바이브런트 그라디언트 오브 (보라/시안/핑크)  |
| **Glass 패널**       | `backdrop-filter: blur(16px)` + `bg-white/5` + 미세한 보더         |
| **타이포그래피**     | 화이트 기반, 고대비, Inter/Pretendard 폰트                         |
| **액센트 컬러**      | Cyan (#00D4FF) ~ Purple (#8B5CF6) 그라디언트                       |
| **보더**             | 1px `border-white/10` 으로 glass 엣지 강조                        |
| **그림자**           | Inset shadow로 깊이감 + 외부 glow 효과                            |
| **Mesh Gradient**    | 애니메이션 메쉬 그라디언트로 배경 다이나믹 효과                    |

#### 참고 디자인 레퍼런스
- Aceternity UI (Next.js + Tailwind + Framer Motion 기반 모던 템플릿)
- Omnira UI (Glassmorphism 디자인 시스템)
- Apple Liquid Glass 디자인 언어

---

## 5. 프로젝트 구조

```
PEDAL/                          ← 기존 루트 (PEDAL 워크플로우 레포)
├── landing/                    ← 랜딩 페이지 독립 프로젝트
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── PedalSteps.tsx
│   │   │   ├── FlowDiagram.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── GetStarted.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ui/             ← 공통 Glass 컴포넌트
│   │   │       ├── GlassCard.tsx
│   │   │       └── AnimatedSection.tsx
│   │   ├── lib/
│   │   │   ├── gsap.ts         ← GSAP 초기화 + ScrollTrigger 등록
│   │   │   └── smooth-scroll.ts ← Lenis 초기화
│   │   └── assets/
│   │       └── images/
│   ├── public/
│   │   ├── og-image.png
│   │   └── favicon.ico
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── vercel.json             ← (선택) Vercel 배포 설정
├── docs/                       ← PEDAL 문서
├── .pedal/
└── README.md
```

> **⚠️ Vercel 배포 참고**: `landing/` 하위 폴더에서 독립 프로젝트를 운영하므로, Vercel 프로젝트 설정 시 **Root Directory**를 `landing`으로 지정해야 한다. Framework Preset은 Next.js가 자동 감지된다.

---

## 6. 페이지 섹션 구성

스크롤 순서대로 다음 섹션이 애니메이션과 함께 등장한다:

### Section 1: Hero
- 풀스크린 배경 (Animated Mesh Gradient)
- PEDAL 로고/타이틀 페이드인
- "AI-Powered Development Workflow" 서브타이틀
- CTA 버튼: "Get Started" / "Learn More"
- 스크롤 인디케이터 (하단 화살표 바운스 애니메이션)

### Section 2: What is PEDAL?
- PEDAL 각 글자(P-E-D-A-L)가 순차적으로 reveal
- 각 글자에 대한 한 줄 설명 + 아이콘
- Glass Card 형태로 좌우 교차 등장 애니메이션

### Section 3: Workflow Flow
- P → E → D → A → L 플로우 다이어그램
- 스크롤에 따라 단계별 하이라이트
- 연결선 애니메이션 (SVG path drawing)
- Iterate 루프 시각화 (A ↔ D 순환 화살표)

### Section 4: Feature Highlights
- Bento Grid 레이아웃
- Cross-Review, Wiki SSOT, Severity Scoring 등 핵심 기능
- 각 카드 호버 시 Glass glow 효과
- 스태거 애니메이션으로 순차 등장

### Section 5: Get Started
- GitHub 링크 + 설치 가이드 코드 스니펫
- 터미널 스타일 UI (다크 glassmorphism)
- "Star on GitHub" CTA

### Section 6: Footer
- 라이선스 정보
- GitHub / 관련 링크
- 미니멀 디자인

---

## 7. Success Criteria

### 7.1 Definition of Done

- [ ] 모든 기능 요구사항(FR-01 ~ FR-08) 구현
- [ ] Lighthouse Performance ≥ 90
- [ ] 모바일/데스크톱 반응형 정상 동작
- [ ] Vercel 배포 완료 및 접근 가능
- [ ] 스크롤 애니메이션 60fps 유지
- [ ] 주요 브라우저(Chrome, Safari, Firefox) 호환 확인

---

## 8. Risks and Mitigation

| Risk                                        | Impact | Likelihood | Mitigation                                                    |
| ------------------------------------------- | ------ | ---------- | ------------------------------------------------------------- |
| GSAP 라이선스 (상업용 제한 가능성)           | Medium | Low        | GSAP 무료 티어는 대부분의 용도 허용; 라이선스 확인 후 진행    |
| 과도한 애니메이션으로 모바일 성능 저하       | High   | Medium     | `prefers-reduced-motion` 지원, 모바일용 경량 애니메이션 폴백  |
| Dark Glassmorphism 접근성 (대비 부족)        | Medium | Medium     | WCAG 2.1 AA 기준 대비비 4.5:1 이상 보장, Glass 패널 opacity 조정 |
| Vercel 무료 티어 대역폭 초과                 | Low    | Low        | SSG로 CDN 캐싱 극대화, 이미지 최적화로 트래픽 최소화          |
| 스크롤 애니메이션이 Safari에서 이슈          | Medium | Medium     | GSAP의 크로스 브라우저 호환성 활용, Safari 별도 테스트         |

---

## 9. Convention Prerequisites

### 9.1 Existing Project Conventions

- [x] `.pedal/` 워크플로우 설정 존재
- [ ] 랜딩 프로젝트 전용 린터/포매터 설정 필요

### 9.2 Conventions to Define/Verify

| Category             | Current State | To Define                                  | Priority |
| -------------------- | ------------- | ------------------------------------------ | :------: |
| **Naming**           | Missing       | PascalCase 컴포넌트, camelCase 함수/변수   |   High   |
| **Folder structure** | Missing       | `landing/src/` 하위 구조 (위 Section 5)    |   High   |
| **Import order**     | Missing       | React → Next → 3rd party → local → styles  |  Medium  |
| **CSS Convention**   | Missing       | Tailwind 유틸리티 우선, 커스텀 CSS 최소화  |  Medium  |

### 9.3 Environment Variables Needed

| Variable                    | Purpose              | Scope  | To Be Created |
| --------------------------- | -------------------- | ------ | :-----------: |
| `NEXT_PUBLIC_SITE_URL`      | OG 이미지 절대 경로  | Client |       ☐       |
| `NEXT_PUBLIC_GA_ID`         | Google Analytics (선택) | Client |       ☐       |

---

## 10. Next Steps

1. [ ] Engineering 문서 작성 (`landing-page.engineering.md`)
2. [ ] 디자인 상세: 컴포넌트별 애니메이션 스펙, 반응형 브레이크포인트
3. [ ] 구현 시작

---

## Version History

| Version | Date       | Changes                                                    | Author              |
| ------- | ---------- | ---------------------------------------------------------- | -------------------- |
| 0.1     | 2026-04-10 | Initial draft                                              | AI Agent (Cursor)    |
| 0.2     | 2026-04-10 | Cross-review 반영: GSAP React 호환성, Vercel 배포 설정, 이미지 최적화, 텍스트 분리 추가 | AI Agent (Cursor)    |
