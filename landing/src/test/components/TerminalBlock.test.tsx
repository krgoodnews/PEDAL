import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import type { TerminalLine } from "@/constants/content";

const mockLines: TerminalLine[] = [
  { type: "comment", text: "# 설치 방법" },
  { type: "command", text: "cp -r .pedal/ your-project/" },
  { type: "output", text: "✓ Done" },
];

describe("TerminalBlock (FR-08 터미널 UI)", () => {
  it("타이틀 바가 렌더링되어야 한다", () => {
    render(<TerminalBlock lines={mockLines} title="test-terminal" />);
    expect(screen.getByText("test-terminal")).toBeInTheDocument();
  });

  it("기본 타이틀이 'terminal'이어야 한다", () => {
    render(<TerminalBlock lines={mockLines} />);
    expect(screen.getByText("terminal")).toBeInTheDocument();
  });

  it("macOS 스타일 트래픽 라이트 버튼 3개가 있어야 한다", () => {
    const { container } = render(<TerminalBlock lines={mockLines} />);
    // red, yellow, green 3개 dot
    const dots = container.querySelectorAll(".rounded-full.bg-red-500\\/60, .rounded-full.bg-yellow-500\\/60, .rounded-full.bg-green-500\\/60");
    expect(dots.length).toBe(3);
  });

  it("라인 텍스트들이 DOM에 존재해야 한다 (초기 opacity-0이어도)", () => {
    render(<TerminalBlock lines={mockLines} />);
    expect(screen.getByText("# 설치 방법")).toBeInTheDocument();
    expect(screen.getByText("cp -r .pedal/ your-project/")).toBeInTheDocument();
    expect(screen.getByText("✓ Done")).toBeInTheDocument();
  });

  it("command 타입 라인은 $ 프롬프트를 포함해야 한다", () => {
    const { container } = render(<TerminalBlock lines={mockLines} />);
    const prompt = container.querySelector(".text-white\\/40");
    expect(prompt?.textContent).toContain("$");
  });
});
