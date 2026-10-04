import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PhotoChallenge from "./PhotoChallenge";

const cameraMock = vi.hoisted(() => ({
  getWorldDirection: (direction: { set: (...values: number[]) => unknown }) =>
    direction.set(0, 0.8, -0.6),
  position: { x: 0, y: 1.55, z: -8.18 },
}));

vi.mock("@react-three/fiber", () => ({
  useThree: () => ({ camera: cameraMock }),
}));

describe("PhotoChallenge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not restart when the result callback changes after an attempt", () => {
    vi.useFakeTimers();
    const onCountdownChange = vi.fn();
    const firstOnResult = vi.fn();
    const secondOnResult = vi.fn();
    const { rerender } = render(
      <PhotoChallenge
        attemptId={1}
        onCountdownChange={onCountdownChange}
        onResult={firstOnResult}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    expect(firstOnResult).toHaveBeenCalledOnce();
    expect(onCountdownChange).toHaveBeenCalledTimes(5);

    rerender(
      <PhotoChallenge
        attemptId={1}
        onCountdownChange={onCountdownChange}
        onResult={secondOnResult}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(secondOnResult).not.toHaveBeenCalled();
    expect(onCountdownChange).toHaveBeenCalledTimes(5);

    rerender(
      <PhotoChallenge
        attemptId={2}
        onCountdownChange={onCountdownChange}
        onResult={secondOnResult}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(secondOnResult).toHaveBeenCalledOnce();
  });

  it("preserves the precise remaining time while paused", () => {
    vi.useFakeTimers();
    const onCountdownChange = vi.fn();
    const onResult = vi.fn();
    const { rerender } = render(
      <PhotoChallenge
        attemptId={1}
        onCountdownChange={onCountdownChange}
        onResult={onResult}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(1_400);
    });
    rerender(
      <PhotoChallenge
        attemptId={1}
        onCountdownChange={onCountdownChange}
        onResult={onResult}
        paused
      />,
    );
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(onResult).not.toHaveBeenCalled();

    rerender(
      <PhotoChallenge
        attemptId={1}
        onCountdownChange={onCountdownChange}
        onResult={onResult}
        paused={false}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(3_599);
    });
    expect(onResult).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onResult).toHaveBeenCalledOnce();
    expect(onCountdownChange).toHaveBeenNthCalledWith(1, 5);
    expect(onCountdownChange).toHaveBeenNthCalledWith(2, 4);
    expect(onCountdownChange).toHaveBeenNthCalledWith(3, 3);
    expect(onCountdownChange).toHaveBeenNthCalledWith(4, 2);
    expect(onCountdownChange).toHaveBeenNthCalledWith(5, 1);
  });

  it("uses a replacement result callback without restarting the attempt", () => {
    vi.useFakeTimers();
    const onCountdownChange = vi.fn();
    const firstOnResult = vi.fn();
    const secondOnResult = vi.fn();
    const { rerender } = render(
      <PhotoChallenge
        attemptId={1}
        onCountdownChange={onCountdownChange}
        onResult={firstOnResult}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(2_000);
    });
    rerender(
      <PhotoChallenge
        attemptId={1}
        onCountdownChange={onCountdownChange}
        onResult={secondOnResult}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(firstOnResult).not.toHaveBeenCalled();
    expect(secondOnResult).toHaveBeenCalledOnce();
    expect(onCountdownChange).toHaveBeenCalledTimes(5);
  });
});
