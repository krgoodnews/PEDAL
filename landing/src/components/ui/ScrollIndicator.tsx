"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin();

export function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(ref.current, {
        y: 10,
        duration: 1.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 text-white/30"
      aria-hidden="true"
    >
      <span className="text-xs font-mono tracking-widest uppercase">scroll</span>
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
        <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6.5" y="5" width="3" height="6" rx="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
