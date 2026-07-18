import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("@leenguyen/react-flip-clock-countdown", () => ({
  default: ({ to }: { to: Date | number | string }) => (
    <div data-testid="countdown" data-target={String(to)} />
  ),
}));

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the countdown view before the birthday", () => {
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Tid til Runar's bursdag" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("countdown")).toBeInTheDocument();
  });

  it("shows the greeting without a countdown on the birthday", () => {
    vi.setSystemTime(new Date("2026-12-17T12:00:00Z"));

    const { unmount } = render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "🎉 Gratulerer med dagen Runar! 🎉",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    unmount();

    expect(document.body).toHaveStyle({ overflow: "auto" });
  });
});
