import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Features } from "@/components/sections/Features";
import { FEATURES } from "@/constants/content";

describe("Features 섹션 (FR-05) — Bento Grid", () => {
  it("섹션 타이틀이 렌더링되어야 한다", () => {
    render(<Features />);
    expect(screen.getByText(/핵심 메커니즘/)).toBeInTheDocument();
  });

  it("모든 피처 카드가 렌더링되어야 한다", () => {
    render(<Features />);
    FEATURES.forEach((feature) => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
    });
  });

  it("각 피처의 설명이 렌더링되어야 한다", () => {
    render(<Features />);
    FEATURES.forEach((feature) => {
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });

  it("wide 카드는 sm:col-span-2 클래스를 가져야 한다 (Bento Grid 레이아웃)", () => {
    const { container } = render(<Features />);
    const wideFeatures = FEATURES.filter((f) => f.gridSpan === "wide");
    // wide 카드 수만큼 col-span-2 클래스가 있어야 함
    const wideCards = container.querySelectorAll(".sm\\:col-span-2");
    expect(wideCards.length).toBe(wideFeatures.length);
  });
});
