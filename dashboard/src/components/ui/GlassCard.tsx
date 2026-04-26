import { cn } from "@/lib/animation-utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "purple" | "pink" | "none";
}

const glowColors = {
  cyan: "hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]",
  purple: "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
  pink: "hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]",
  none: "",
};

export function GlassCard({ children, className, hover = true, glow = "cyan" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10",
        "bg-white/5 backdrop-blur-xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        hover && "transition-all duration-300 hover:bg-white/[0.08]",
        hover && glow !== "none" && glowColors[glow],
        className
      )}
    >
      {children}
    </div>
  );
}
