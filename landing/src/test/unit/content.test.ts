import { describe, it, expect } from "vitest";
import { PEDAL_STEPS, FEATURES, TERMINAL_LINES, SITE_META } from "@/constants/content";

describe("PEDAL_STEPS", () => {
  it("5개 단계가 정의되어 있어야 한다", () => {
    expect(PEDAL_STEPS).toHaveLength(5);
  });

  it("각 단계는 P-E-D-A-L 순서여야 한다", () => {
    const letters = PEDAL_STEPS.map((s) => s.letter);
    expect(letters).toEqual(["P", "E", "D", "A", "L"]);
  });

  it("각 단계는 필수 필드를 모두 가져야 한다", () => {
    PEDAL_STEPS.forEach((step) => {
      expect(step.letter).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
      expect(step.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(step.details.length).toBeGreaterThan(0);
    });
  });
});

describe("FEATURES", () => {
  it("6개 피처가 정의되어 있어야 한다", () => {
    expect(FEATURES).toHaveLength(6);
  });

  it("gridSpan은 normal | wide | tall 중 하나여야 한다", () => {
    const valid = ["normal", "wide", "tall"];
    FEATURES.forEach((f) => {
      expect(valid).toContain(f.gridSpan);
    });
  });

  it("accent는 cyan | purple | pink 중 하나여야 한다", () => {
    const valid = ["cyan", "purple", "pink"];
    FEATURES.forEach((f) => {
      expect(valid).toContain(f.accent);
    });
  });

  it("wide gridSpan이 최소 1개 이상 있어야 한다 (Bento Grid 레이아웃)", () => {
    const wideCards = FEATURES.filter((f) => f.gridSpan === "wide");
    expect(wideCards.length).toBeGreaterThanOrEqual(1);
  });
});

describe("TERMINAL_LINES", () => {
  it("터미널 라인이 존재해야 한다", () => {
    expect(TERMINAL_LINES.length).toBeGreaterThan(0);
  });

  it("각 라인은 type과 text를 가져야 한다", () => {
    const validTypes = ["command", "comment", "output"];
    TERMINAL_LINES.forEach((line) => {
      expect(validTypes).toContain(line.type);
      expect(line.text).toBeTruthy();
    });
  });

  it("command 타입 라인이 최소 1개 이상 있어야 한다", () => {
    const commands = TERMINAL_LINES.filter((l) => l.type === "command");
    expect(commands.length).toBeGreaterThanOrEqual(1);
  });
});

describe("SITE_META", () => {
  it("githubUrl이 유효한 GitHub URL이어야 한다", () => {
    expect(SITE_META.githubUrl).toMatch(/^https:\/\/github\.com\/.+\/.+/);
  });

  it("license가 정의되어 있어야 한다", () => {
    expect(SITE_META.license).toBeTruthy();
  });
});
