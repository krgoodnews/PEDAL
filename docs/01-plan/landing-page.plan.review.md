# landing-page Plan Review

> **Reviewed by**: Gemini CLI (flash)
> **Date**: 2026-04-10
> **Document**: docs/01-plan/landing-page.plan.md

## Critical

- **Next.js 15 & React 19 호환성 주의**: Next.js 15는 React 19을 기반으로 하며, 현재 GSAP 및 Lenis의 일부 라이브러리가 React 19의 엄격한 모드(Strict Mode)나 서버 컴포넌트 환경에서 예기치 않은 동작을 보일 수 있음. 특히 `useLayoutEffect` 대신 `useGSAP` 훅 사용 권장 — [ref](https://gsap.com/resources/React/)
- **Tailwind CSS v4 정식 출시 상태 확인**: Tailwind CSS v4는 현재 개발 중이거나 초기 알파/베타 단계일 수 있으므로, 안정적인 프로젝트 구축을 위해서는 v3.4+ 사용을 고려하거나 v4의 변경사항(PostCSS 제거 등)에 따른 빌드 환경 설정을 구체화해야 함 — [ref](https://tailwindcss.com/blog/tailwindcss-v4-alpha)

## Warning

- **Vercel Monorepo 설정 누락**: 루트 디렉토리가 아닌 하위 폴더(`landing/`)에서 프로젝트를 진행하므로, Vercel 배포 시 `Root Directory` 설정을 `landing`으로 지정해야 함. `vercel.json`에 대한 구체적인 설정 예시가 부족함 — [ref](https://vercel.com/docs/projects/overview#root-directory)
- **GSAP ScrollTrigger와 Lenis의 충돌 가능성**: 두 라이브러리를 함께 사용할 때 스크롤 위치 계산 방식의 차이로 인해 `ScrollTrigger.refresh()` 호출 타이밍이나 `lenis.on('scroll', ScrollTrigger.update)` 설정이 필수적임. 이에 대한 기술적 구현 전략이 Engineering 단계에서 상세히 다뤄져야 함 — [ref](https://github.com/darkroomengineering/lenis#instance-methods)

## Info / Suggestions

- **Aceternity UI 활용 제안**: 디자인 레퍼런스로 언급된 Aceternity UI는 이미 Framer Motion을 기본으로 사용하고 있음. GSAP으로 직접 구현할 경우 Aceternity의 시각적 효과를 재현하는 데 공수가 많이 들 수 있으므로, 핵심 애니메이션에 한해 Framer Motion 병행 사용도 검토 가능함.
- **이미지 에셋 전략**: "유려한 애니메이션으로 원하는 이미지나 컨텐츠가 보이게 해줘"라는 요청에 대응하기 위해, 고해상도 이미지 사용 시 `next/image`의 `priority` 속성 활용 및 LCP 최적화 전략이 필요함.
- **다국어 확장성**: Out of Scope에 다국어를 넣었으나, 향후 확장을 고려해 텍스트 데이터를 별도 JSON이나 상수 파일로 분리하여 관리할 것을 권장함.

## Verdict

**REVISE_REQUIRED**

> **Rationale**: 기술 스택(Next 15, Tailwind v4)의 최신 버전에 따른 안정성 검토와 하위 폴더 배포 전략(Vercel Root Directory)에 대한 보완이 필요합니다. 특히 애니메이션 라이브러리 간의 연동 설정은 이 프로젝트의 핵심이므로 Engineering 단계 이전에 명확한 가이드라인이 제시되어야 합니다.
