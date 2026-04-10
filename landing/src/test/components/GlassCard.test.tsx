import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassCard } from "@/components/ui/GlassCard";

describe("GlassCard", () => {
  it("children을 렌더링해야 한다", () => {
    render(<GlassCard>테스트 콘텐츠</GlassCard>);
    expect(screen.getByText("테스트 콘텐츠")).toBeInTheDocument();
  });

  it("glass 스타일 클래스가 적용되어야 한다", () => {
    const { container } = render(<GlassCard>내용</GlassCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("backdrop-blur-xl");
    expect(card.className).toContain("border-white/10");
  });

  it("hover=false 시 transition 클래스가 없어야 한다", () => {
    const { container } = render(<GlassCard hover={false}>내용</GlassCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("transition-all");
  });

  it("hover=true(기본값) 시 transition 클래스가 있어야 한다", () => {
    const { container } = render(<GlassCard>내용</GlassCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("transition-all");
  });

  it("className prop이 추가 적용되어야 한다", () => {
    const { container } = render(<GlassCard className="custom-class">내용</GlassCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("custom-class");
  });
});
