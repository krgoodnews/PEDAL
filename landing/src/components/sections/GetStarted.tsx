"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { TERMINAL_LINES, SITE_META, SECTION_COPY } from "@/constants/content";
import { getAnimationConfig } from "@/lib/animation-utils";

gsap.registerPlugin(ScrollTrigger);

export function GetStarted() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { enabled, duration } = getAnimationConfig();

      if (!enabled) return;

      gsap.from(".get-started-title", {
        opacity: 0,
        y: 40,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".get-started-title",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".get-started-terminal", {
        opacity: 0,
        y: 40,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".get-started-terminal",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".get-started-cta", {
        opacity: 0,
        scale: 0.9,
        duration: duration * 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".get-started-cta",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        {/* Header */}
        <div className="get-started-title mb-12">
          <p className="mb-3 text-sm font-mono text-[#00d4ff] tracking-widest uppercase">{SECTION_COPY.getStarted.eyebrow}</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {SECTION_COPY.getStarted.title}
            <br />
            <span className="gradient-text">{SECTION_COPY.getStarted.titleAccent}</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-lg mx-auto">
            {SECTION_COPY.getStarted.description}
          </p>
        </div>

        {/* Terminal */}
        <div className="get-started-terminal mb-8 text-left">
          <TerminalBlock lines={TERMINAL_LINES} title="bash — PEDAL 빠른 시작" />
        </div>

        {/* CTA */}
        <a
          href={SITE_META.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="get-started-cta group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#00d4ff] via-[#8b5cf6] to-[#ec4899] p-px transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
        >
          <span className="flex items-center gap-2 rounded-[11px] bg-[#0a0a0f] px-6 py-3 text-sm font-semibold text-white group-hover:bg-[#12121a] transition-colors duration-300">
            <Star size={16} className="text-yellow-400" />
            {SECTION_COPY.getStarted.ctaLabel}
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </a>

        {/* Tools */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
          <span>{SECTION_COPY.getStarted.toolsLabel}</span>
          {SECTION_COPY.getStarted.tools.map((tool, i) => (
            <div key={tool} className="flex items-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: i === 0 ? "#00d4ff" : i === 1 ? "#8b5cf6" : "#ec4899" }}
              />
              <span>{tool}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
