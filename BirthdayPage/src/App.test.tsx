import { act, fireEvent, render, screen } from "@testing-library/react";
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
    window.history.replaceState({}, "", "/");
    vi.useRealTimers();
  });

  it("shows the countdown view before the birthday", () => {
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));

    const { container } = render(<App />);

    expect(
      screen.getByRole("heading", { name: "Tid til Runar's bursdag" }),
    ).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("lang", "nb-NO");
    expect(screen.getByTestId("countdown")).toHaveAttribute(
      "data-target",
      new Date("2026-12-16T23:00:00Z").toString(),
    );
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

  it("previews the transition to the birthday view after five seconds", () => {
    window.history.replaceState({}, "", "/?preview=birthday");
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Tid til Runar's bursdag" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("countdown")).toHaveAttribute(
      "data-target",
      String(new Date("2026-12-16T12:00:05Z").getTime()),
    );
    const restartCountdownButton = screen.getByRole("button", {
      name: "Restart 5-second countdown",
    });
    expect(restartCountdownButton).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show birthday greeting" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4_999);
    });

    expect(
      screen.getByRole("heading", { name: "Tid til Runar's bursdag" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(
      screen.getByRole("heading", {
        name: "🎉 Gratulerer med dagen Runar! 🎉",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();

    fireEvent.click(restartCountdownButton);

    expect(
      screen.getByRole("heading", { name: "Tid til Runar's bursdag" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("countdown")).toHaveAttribute(
      "data-target",
      String(new Date("2026-12-16T12:00:10Z").getTime()),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Show birthday greeting" }),
    );

    expect(
      screen.getByRole("heading", {
        name: "🎉 Gratulerer med dagen Runar! 🎉",
      }),
    ).toBeInTheDocument();
  });
});
