"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Map, Cpu, Code2, BarChart3, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PEDAL_STEPS, SECTION_COPY } from "@/constants/content";
import { getAnimationConfig } from "@/lib/animation-utils";

gsap.registerPlugin(ScrollTrigger);

const iconMap = { Map, Cpu, Code2, BarChart3, BookOpen };

export function WhatIsPedal() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { enabled, duration } = getAnimationConfig();

      if (!enabled) return;

      gsap.from(".pedal-title", {
        opacity: 0,
        y: 50,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".pedal-title",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".step-card");
      cards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -80 : 80;
        gsap.from(card, {
          x: fromX,
          opacity: 0,
          duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        const letter = card.querySelector(".step-letter");
        if (letter) {
          gsap.from(letter, {
            scale: 0,
            rotation: -15,
            duration: duration * 0.7,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="what-is-pedal"
      ref={sectionRef}
      className="relative px-6 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="pedal-title mb-16 text-center">
          <p className="mb-3 text-sm font-mono text-[#00d4ff] tracking-widest uppercase">{SECTION_COPY.whatIsPedal.eyebrow}</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {SECTION_COPY.whatIsPedal.title}
            <br />
            <span className="gradient-text">{SECTION_COPY.whatIsPedal.titleAccent}</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            {SECTION_COPY.whatIsPedal.description}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {PEDAL_STEPS.map((step, i) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            const isEven = i % 2 === 0;

            return (
              <GlassCard
                key={step.letter}
                className={`step-card p-6 lg:p-8 ${isEven ? "lg:mr-16" : "lg:ml-16"}`}
                glow={step.color === "#00d4ff" ? "cyan" : step.color === "#8b5cf6" ? "purple" : "pink"}
              >
                <div className="flex items-start gap-5">
                  {/* Letter badge */}
                  <div
                    className="step-letter flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                      border: `1px solid ${step.color}33`,
                      color: step.color,
                    }}
                  >
                    {step.letter}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      <span className="text-sm text-white/40">{step.subtitle}</span>
                    </div>
                    <p className="text-white/60 mb-4 leading-relaxed">{step.description}</p>

                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-white/40">
                          <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ background: step.color }} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Icon */}
                  <div className="hidden lg:flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                    {Icon && <Icon size={20} style={{ color: step.color }} />}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
