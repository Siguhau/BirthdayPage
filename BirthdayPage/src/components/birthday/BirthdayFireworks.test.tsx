import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BirthdayFireworks from "./BirthdayFireworks";

const mockReducedMotionPreference = (matches: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation(() => ({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
};

describe("BirthdayFireworks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("launches a rocket that bursts into colorful particles", () => {
    mockReducedMotionPreference(false);
    render(<BirthdayFireworks renderer="custom" />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const firework = screen.getByTestId("birthday-firework");
    expect(firework).toHaveAttribute("data-pattern", "radial");
    expect(firework.style.getPropertyValue("--firework-color")).not.toBe("");
    expect(firework.style.getPropertyValue("--firework-left")).toMatch(/%$/);
    expect(firework.style.getPropertyValue("--firework-top")).toMatch(/vh$/);
    expect(
      firework.querySelector(".birthday-firework__rocket"),
    ).toBeInTheDocument();
    expect(
      firework.querySelectorAll(".birthday-firework__particle"),
    ).toHaveLength(48);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getAllByTestId("birthday-firework")[1]).toHaveAttribute(
      "data-pattern",
      "ring",
    );
  });

  it("does not schedule fireworks when reduced motion is preferred", () => {
    mockReducedMotionPreference(true);

    render(<BirthdayFireworks renderer="custom" />);

    expect(document.querySelector(".birthday-fireworks")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("renders each library and all effects in combined mode", () => {
    mockReducedMotionPreference(false);

    const { rerender } = render(<BirthdayFireworks renderer="fireworks-js" />);

    expect(screen.getByTestId("fireworks-js-display")).toBeInTheDocument();
    expect(screen.queryByTestId("tsparticles-display")).not.toBeInTheDocument();

    rerender(<BirthdayFireworks renderer="tsparticles" />);

    expect(
      screen.queryByTestId("fireworks-js-display"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("tsparticles-display")).toBeInTheDocument();

    rerender(<BirthdayFireworks />);

    expect(vi.getTimerCount()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId("birthday-firework")).toBeInTheDocument();
    expect(screen.getByTestId("fireworks-js-display")).toBeInTheDocument();
    expect(screen.getByTestId("tsparticles-display")).toBeInTheDocument();
  });

  it("clears its scheduled launches when unmounted", () => {
    mockReducedMotionPreference(false);
    const { unmount } = render(<BirthdayFireworks renderer="custom" />);

    expect(vi.getTimerCount()).toBe(2);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
