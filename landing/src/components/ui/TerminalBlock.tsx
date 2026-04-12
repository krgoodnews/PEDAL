"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TerminalLine {
  type: "command" | "comment" | "output";
  text: string;
}

interface TerminalBlockProps {
  lines: TerminalLine[];
  title?: string;
}

export function TerminalBlock({ lines, title = "terminal" }: TerminalBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onEnter: () => {
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (i >= lines.length) clearInterval(interval);
          }, 300);
        },
        once: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="glass rounded-xl overflow-hidden font-mono text-sm"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-white/30 text-xs ml-2">{title}</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1 min-h-[160px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`transition-opacity duration-300 ${i < visibleLines ? "opacity-100" : "opacity-0"}`}
          >
            {line.type === "command" && (
              <p className="text-[#00d4ff]">
                <span className="text-white/40 mr-2">$</span>
                {line.text}
              </p>
            )}
            {line.type === "comment" && (
              <p className="text-white/30">{line.text}</p>
            )}
            {line.type === "output" && (
              <p className="text-[#a0a0b0]">{line.text}</p>
            )}
          </div>
        ))}
        {visibleLines > 0 && visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-[#00d4ff] animate-pulse" />
        )}
      </div>
    </div>
  );
}
