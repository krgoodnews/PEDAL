"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { id: "P", label: "Plan", color: "#00d4ff", x: 60, y: 80 },
  { id: "E", label: "Engineering", color: "#8b5cf6", x: 220, y: 80 },
  { id: "D", label: "Do", color: "#ec4899", x: 380, y: 80 },
  { id: "A", label: "Analyze", color: "#00d4ff", x: 540, y: 80 },
  { id: "L", label: "Learn", color: "#8b5cf6", x: 700, y: 80 },
];

export function WorkflowFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mainPath = svgRef.current?.querySelector(".main-flow-path") as SVGPathElement | null;
      const iteratePath = svgRef.current?.querySelector(".iterate-path") as SVGPathElement | null;

      if (mainPath) {
        const len = mainPath.getTotalLength();
        gsap.set(mainPath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(mainPath, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "center 40%",
            scrub: 1.5,
          },
        });
      }

      if (iteratePath) {
        const len = iteratePath.getTotalLength();
        gsap.set(iteratePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(iteratePath, {
          strokeDashoffset: 0,
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            end: "center 30%",
            scrub: 1.5,
          },
        });
      }

      NODES.forEach((_, i) => {
        gsap.from(`.flow-node-${i}`, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top ${65 - i * 5}%`,
            toggleActions: "play none none none",
          },
        });
      });

      gsap.from(".iterate-label", {
        opacity: 0,
        y: 10,
        duration: 0.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 45%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".flow-section-title", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".flow-section-title",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flow-section-title mb-16 text-center">
          <p className="mb-3 text-sm font-mono text-[#8b5cf6] tracking-widest uppercase">Workflow</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            사이클이 돌수록
            <br />
            <span className="gradient-text">더 나은 코드</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            90% 미만이거나 Critical 이슈가 있으면 Iterate가 강제됩니다. 임계값에 도달할 때까지 자동 반복합니다.
          </p>
        </div>

        {/* SVG Flow Diagram */}
        <div className="glass rounded-2xl p-6 lg:p-10 overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox="0 0 760 200"
            className="w-full min-w-[500px]"
            aria-label="PEDAL 워크플로 다이어그램"
          >
            {/* Main flow path */}
            <path
              className="main-flow-path"
              d="M 96 80 L 184 80 M 256 80 L 344 80 M 416 80 L 504 80 M 576 80 L 664 80"
              stroke="url(#flowGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Iterate loop path */}
            <path
              className="iterate-path"
              d="M 540 100 C 540 150 380 150 380 100"
              stroke="#ec4899"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="4 3"
              opacity="0.7"
            />

            {/* Arrow markers */}
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="url(#flowGradient)" />
              </marker>
            </defs>

            {/* Arrow heads — centered between nodes */}
            {[140, 300, 460, 620].map((x, i) => (
              <polygon
                key={i}
                points={`${x - 5},76 ${x + 5},80 ${x - 5},84`}
                fill={i === 0 ? "#00d4ff" : i === 1 ? "#8b5cf6" : i === 2 ? "#ec4899" : "#8b5cf6"}
                opacity="0.8"
              />
            ))}

            {/* Iterate arrow */}
            <polygon points="376,96 384,100 376,104" fill="#ec4899" opacity="0.7" />

            {/* Nodes */}
            {NODES.map((node, i) => (
              <g key={node.id} className={`flow-node-${i}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="36"
                  fill={`${node.color}15`}
                  stroke={node.color}
                  strokeWidth="1.5"
                />
                <circle cx={node.x} cy={node.y} r="28" fill={`${node.color}10`} />
                <text
                  x={node.x}
                  y={node.y - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={node.color}
                  fontSize="18"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                >
                  {node.id}
                </text>
                <text
                  x={node.x}
                  y={node.y + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
              </g>
            ))}

            {/* Iterate label */}
            <g className="iterate-label">
              <text
                x="460"
                y="168"
                textAnchor="middle"
                fill="#ec4899"
                fontSize="9"
                fontFamily="Inter, sans-serif"
                opacity="0.8"
              >
                Iterate
              </text>
              <text
                x="460"
                y="180"
                textAnchor="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize="8"
                fontFamily="Inter, sans-serif"
              >
                {"< 90% OR Critical"}
              </text>
            </g>
          </svg>
        </div>

        {/* Score table */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { severity: "Critical", color: "#ef4444", desc: "높은 중요도 — Iterate 강제" },
            { severity: "Warning", color: "#f59e0b", desc: "중간 중요도 — 개선 권고" },
            { severity: "Info", color: "#6b7280", desc: "낮은 중요도 — 선택적 개선" },
          ].map((item) => (
            <div key={item.severity} className="glass rounded-xl p-4 flex items-center gap-4">
              <div
                className="flex h-3 w-3 flex-shrink-0 rounded-full"
                style={{ background: item.color, boxShadow: `0 0 8px ${item.color}80` }}
              />
              <div>
                <p className="text-sm font-semibold text-white">{item.severity}</p>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
