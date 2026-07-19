import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Countdown from "./Countdown";

vi.mock("@leenguyen/react-flip-clock-countdown", () => ({
  default: ({
    digitBlockStyle,
    labelStyle,
  }: {
    digitBlockStyle: { width: number };
    labelStyle: { fontSize: number };
  }) => (
    <div
      data-testid="flip-clock"
      data-digit-width={digitBlockStyle.width}
      data-label-font-size={labelStyle.fontSize}
    />
  ),
}));

const resizeWindow = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("Countdown", () => {
  afterEach(() => {
    resizeWindow(1024);
  });

  it("updates its responsive styles when the viewport crosses the breakpoint", () => {
    resizeWindow(800);
    render(<Countdown targetDate={new Date("2026-12-17T00:00:00Z")} />);

    expect(screen.getByTestId("flip-clock")).toHaveAttribute(
      "data-digit-width",
      "56",
    );
    expect(screen.getByTestId("flip-clock")).toHaveAttribute(
      "data-label-font-size",
      "16",
    );

    act(() => {
      resizeWindow(600);
    });

    expect(screen.getByTestId("flip-clock")).toHaveAttribute(
      "data-digit-width",
      "24",
    );
    expect(screen.getByTestId("flip-clock")).toHaveAttribute(
      "data-label-font-size",
      "9",
    );

    act(() => {
      resizeWindow(601);
    });

    expect(screen.getByTestId("flip-clock")).toHaveAttribute(
      "data-digit-width",
      "56",
    );
  });
});
