import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBirthdayChecker } from "./useBirthdayChecker";

const birthday = { month: 12, day: 17 } as const;

describe("useBirthdayChecker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates when the birthday begins in the configured time zone", () => {
    vi.setSystemTime(new Date("2026-12-16T22:59:59Z"));
    const { result } = renderHook(() =>
      useBirthdayChecker(birthday, "Europe/Oslo"),
    );

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current).toBe(true);
  });

  it("clears its scheduled work when unmounted", () => {
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));
    const { unmount } = renderHook(() =>
      useBirthdayChecker(birthday, "Europe/Oslo"),
    );

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
