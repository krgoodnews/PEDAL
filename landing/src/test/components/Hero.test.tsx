import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

describe("Hero 섹션 (FR-01)", () => {
  it("PEDAL 타이틀이 렌더링되어야 한다", () => {
    render(<Hero />);
    expect(screen.getByText("PEDAL")).toBeInTheDocument();
  });

  it("서브타이틀 텍스트가 렌더링되어야 한다", () => {
    render(<Hero />);
    expect(screen.getByText(/Plan → Engineering → Do → Analyze → Learn/)).toBeInTheDocument();
  });

  it("'GitHub에서 시작하기' CTA 링크가 있어야 한다", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /GitHub에서 시작하기/ });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", expect.stringContaining("github.com"));
  });

  it("'더 알아보기' CTA 링크가 있어야 한다", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /더 알아보기/ });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#what-is-pedal");
  });

  it("스크롤 인디케이터가 렌더링되어야 한다", () => {
    render(<Hero />);
    expect(screen.getByText("scroll")).toBeInTheDocument();
  });

  it("통계 항목(5단계, 크로스 리뷰, 90%)이 표시되어야 한다", () => {
    render(<Hero />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("크로스 리뷰")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
  });
});
