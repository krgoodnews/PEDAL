import { describe, it, expect, vi, beforeEach } from "vitest";
import { cn } from "@/lib/animation-utils";

describe("cn (className utility)", () => {
  it("여러 클래스를 공백으로 합쳐야 한다", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("falsy 값은 무시해야 한다", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("빈 문자열은 무시해야 한다", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("단일 클래스를 그대로 반환해야 한다", () => {
    expect(cn("only")).toBe("only");
  });

  it("모두 falsy면 빈 문자열을 반환해야 한다", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("getAnimationConfig", () => {
  beforeEach(() => {
    vi.resetModules();
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1280 });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("데스크톱에서 full animation을 반환해야 한다", async () => {
    const { getAnimationConfig } = await import("@/lib/animation-utils");
    const config = getAnimationConfig();
    expect(config.enabled).toBe(true);
    expect(config.reduced).toBe(false);
  });

  it("prefers-reduced-motion 활성 시 enabled: false를 반환해야 한다", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
    const { getAnimationConfig } = await import("@/lib/animation-utils");
    const config = getAnimationConfig();
    expect(config.enabled).toBe(false);
  });

  it("모바일 너비(360px)에서 reduced: true를 반환해야 한다", async () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 360 });
    const { getAnimationConfig } = await import("@/lib/animation-utils");
    const config = getAnimationConfig();
    expect(config.reduced).toBe(true);
    expect(config.duration).toBeLessThanOrEqual(0.5);
  });
});
