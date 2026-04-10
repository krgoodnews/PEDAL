"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GitPullRequest,
  Database,
  Gauge,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FEATURES } from "@/constants/content";

gsap.registerPlugin(ScrollTrigger);

const iconMap = { GitPullRequest, Database, Gauge, ShieldCheck, Zap, Layers };

const accentColors = {
  cyan: "#00d4ff",
  purple: "#8b5cf6",
  pink: "#ec4899",
};

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set(".features-title", { opacity: 0, y: 40 });
      gsap.to(".features-title", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 각 카드를 자기 자신의 위치 기준으로 개별 트리거
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, y: 50, scale: 0.97 });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      return () => {
        gsap.set(".features-title", { clearProps: "all" });
        cards.forEach((card) => gsap.set(card, { clearProps: "all" }));
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="features-title mb-16 text-center">
          <p className="mb-3 text-sm font-mono text-[#ec4899] tracking-widest uppercase">Features</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            품질을 보장하는
            <br />
            <span className="gradient-text">핵심 메커니즘</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            const color = accentColors[feature.accent];
            const isWide = feature.gridSpan === "wide";

            return (
              <GlassCard
                key={feature.title}
                className={`feature-card p-6 ${isWide ? "sm:col-span-2" : ""}`}
                glow={feature.accent}
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${color}20`, color }}
                >
                  {Icon && <Icon size={20} />}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
