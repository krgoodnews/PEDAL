# landing-page Engineering Review

> **Reviewed by**: Gemini CLI (flash)
> **Date**: Friday, April 10, 2026
> **Document**: docs/02-engineering/landing-page.engineering.md

## Critical

- **Vercel Root Directory Configuration** — The prompt explicitly requested creating the project in a separate folder (`landing/`). While the engineering doc mentions setting the Root Directory in Vercel, it lacks a specific `vercel.json` or clear instruction on how to handle the monorepo-like structure if the root also contains other files. This could lead to deployment failures if not configured precisely. — [ref](https://vercel.com/docs/concepts/projects/overview#root-directory)

## Warning

- **GSAP React 19 Compatibility** — The doc mentions React 19 and GSAP's `useGSAP`. While correct, React 19's stricter ref handling and potential concurrent rendering changes might require careful cleanup logic to avoid memory leaks or double-initialization in Strict Mode. The doc should explicitly mention `gsap.context()` or `useGSAP`'s cleanup capabilities more prominently. — [ref](https://gsap.com/resources/React)
- **Mobile Animation Fallback Strategy** — The current strategy for mobile is a "reduced" version. Given the "premium visual" goal, more specific details on how to handle touch-start/end vs scroll-trigger performance on high-refresh-rate mobile screens (e.g., ProMotion) would be beneficial. — [ref](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.isTouch())

## Info / Suggestions

- **Content Management** — While `constants/content.ts` is a good start, for a landing page, using a local markdown or JSON file could make content updates easier for non-developers without re-compiling TypeScript.
- **Icon Library Selection** — The doc mentions "Lucide icon name" but doesn't list `lucide-react` in the dependencies. Adding it explicitly would ensure consistent implementation.

## Verdict

**PASS**
