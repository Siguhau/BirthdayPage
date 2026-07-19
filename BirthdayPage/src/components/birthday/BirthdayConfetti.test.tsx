import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BirthdayConfetti from "./BirthdayConfetti";

type ReducedMotionListener = (event: MediaQueryListEvent) => void;

const mockReducedMotionPreference = (initialValue: boolean) => {
  let matches = initialValue;
  const listeners = new Set<ReducedMotionListener>();

  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation(() => ({
      get matches() {
        return matches;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: (_event: string, listener: ReducedMotionListener) => {
        listeners.add(listener);
      },
      removeEventListener: (
        _event: string,
        listener: ReducedMotionListener,
      ) => {
        listeners.delete(listener);
      },
    })),
  );

  return (value: boolean) => {
    matches = value;
    const event = { matches: value } as MediaQueryListEvent;
    listeners.forEach((listener) => {
      listener(event);
    });
  };
};

describe("BirthdayConfetti", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("does not create confetti when reduced motion is preferred", () => {
    mockReducedMotionPreference(true);

    render(<BirthdayConfetti />);

    expect(document.querySelector(".birthday-confetti")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("stops confetti when reduced motion is enabled", () => {
    const setReducedMotion = mockReducedMotionPreference(false);
    render(<BirthdayConfetti />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(document.querySelector(".birthday-confetti")).not.toBeNull();

    act(() => {
      setReducedMotion(true);
    });

    expect(document.querySelector(".birthday-confetti")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});
