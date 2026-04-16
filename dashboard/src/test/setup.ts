import "@testing-library/jest-dom";
import { vi } from "vitest";

// GSAP은 브라우저 환경이 필요하므로 mock 처리
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
    })),
    from: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    utils: { toArray: vi.fn(() => []) },
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
    context: vi.fn(() => ({ revert: vi.fn() })),
  },
  gsap: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: vi.fn(),
    update: vi.fn(),
    refresh: vi.fn(),
    isTouch: 0,
  },
}));

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn((fn: () => void) => fn()),
}));

vi.mock("lenis", () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  })),
}));

// window.matchMedia mock
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
