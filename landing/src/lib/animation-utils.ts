import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface AnimationConfig {
  enabled: boolean;
  reduced: boolean;
  duration: number;
}

export function getAnimationConfig(): AnimationConfig {
  if (typeof window === "undefined") {
    return { enabled: true, reduced: false, duration: 0.7 };
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    return { enabled: false, reduced: true, duration: 0 };
  }

  const isTouch = ScrollTrigger.isTouch === 1;
  const isMobile = window.innerWidth < 768;

  if (isTouch || isMobile) {
    return { enabled: true, reduced: true, duration: 0.5 };
  }

  return { enabled: true, reduced: false, duration: 0.7 };
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
