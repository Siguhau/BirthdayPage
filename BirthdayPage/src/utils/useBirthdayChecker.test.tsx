import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBirthdayChecker } from "./useBirthdayChecker";

describe("useBirthdayChecker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates when the birthday begins at midnight", () => {
    vi.setSystemTime(new Date("2026-12-16T23:59:59Z"));
    const birthday = new Date("2026-12-17T00:00:00Z");
    const { result } = renderHook(() => useBirthdayChecker(birthday));

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current).toBe(true);
  });

  it("clears its scheduled work when unmounted", () => {
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));
    const birthday = new Date("2026-12-17T00:00:00Z");
    const { unmount } = renderHook(() => useBirthdayChecker(birthday));

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
