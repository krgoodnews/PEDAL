import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatIsPedal } from "@/components/sections/WhatIsPedal";
import { PEDAL_STEPS } from "@/constants/content";

describe("WhatIsPedal 섹션 (FR-02)", () => {
  it("섹션 타이틀이 렌더링되어야 한다", () => {
    render(<WhatIsPedal />);
    expect(screen.getByText(/What is PEDAL/)).toBeInTheDocument();
  });

  it("PEDAL 5단계 카드가 모두 렌더링되어야 한다", () => {
    render(<WhatIsPedal />);
    PEDAL_STEPS.forEach((step) => {
      expect(screen.getByText(step.letter)).toBeInTheDocument();
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it("각 단계의 설명이 렌더링되어야 한다", () => {
    render(<WhatIsPedal />);
    PEDAL_STEPS.forEach((step) => {
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  it("섹션에 id='what-is-pedal'이 있어야 한다 (Hero CTA 앵커 링크 대상)", () => {
    const { container } = render(<WhatIsPedal />);
    const section = container.querySelector("#what-is-pedal");
    expect(section).toBeInTheDocument();
  });
});
