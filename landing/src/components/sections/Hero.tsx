"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { SITE_META } from "@/constants/content";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { opacity: 0, y: 20, duration: 0.6 })
        .from(".hero-title", { opacity: 0, y: 40, duration: 1 }, "-=0.3")
        .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.8 }, "-=0.5")
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6, stagger: 0.15 }, "-=0.4")
        .from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      gsap.to(".hero-content", {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <MeshGradient />

      <div className="hero-content relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
          AI Agent 개발 워크플로
        </div>

        {/* Title */}
        <h1 className="hero-title text-6xl font-extrabold tracking-tight sm:text-7xl lg:text-9xl">
          <span className="gradient-text">PEDAL</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle max-w-2xl text-lg text-white/60 sm:text-xl lg:text-2xl leading-relaxed">
          <span className="text-white/90 font-medium">Plan → Engineering → Do → Analyze → Learn</span>
          <br />
          크로스 리뷰와 Wiki SSOT로 AI Agent의 품질을 보장하는 구조화된 워크플로
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <a
            href={SITE_META.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#00d4ff] via-[#8b5cf6] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            <span className="relative z-10">GitHub에서 시작하기</span>
            <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#what-is-pedal"
            className="hero-cta glass inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10"
          >
            더 알아보기
          </a>
        </div>

        {/* Stats */}
        <div className="hero-cta flex flex-wrap items-center justify-center gap-8 mt-4 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <span className="text-[#00d4ff] font-semibold">5</span>
            <span>단계 워크플로</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[#8b5cf6] font-semibold">2</span>
            <span>AI 크로스 리뷰</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[#ec4899] font-semibold">90%</span>
            <span>품질 임계값</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
