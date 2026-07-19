import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import ThemeProvider from "./theme/ThemeProvider";

vi.mock("@leenguyen/react-flip-clock-countdown", () => ({
  default: ({ to }: { to: Date | number | string }) => (
    <div data-testid="countdown" data-target={String(to)} />
  ),
}));

describe("App", () => {
  const renderApp = () =>
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    );

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
    vi.useRealTimers();
  });

  it("shows the countdown view before the birthday", () => {
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));

    const { container } = renderApp();

    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("lang", "nb-NO");
    expect(screen.getByTestId("countdown")).toHaveAttribute(
      "data-target",
      new Date("2026-12-16T23:00:00Z").toString(),
    );
  });

  it("shows the escape-room entry without a countdown on the birthday", () => {
    vi.setSystemTime(new Date("2026-12-17T12:00:00Z"));

    renderApp();

    expect(
      screen.getByRole("heading", {
        name: "Velkommen til rømningsrommet, Runar",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
  });

  it("previews the countdown, escape-room entry, and birthday finale", () => {
    window.history.replaceState({}, "", "/?preview=birthday");
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));

    renderApp();

    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("countdown")).toHaveAttribute(
      "data-target",
      String(new Date("2026-12-16T12:00:05Z").getTime()),
    );
    const restartCountdownButton = screen.getByRole("button", {
      name: "Restart 5-second countdown",
    });
    expect(restartCountdownButton).toBeInTheDocument();
    const showEscapeRoomButton = screen.getByRole("button", {
      name: "Show escape room entry",
    });
    const showBirthdayButton = screen.getByRole("button", {
      name: "Show birthday finale",
    });
    expect(showEscapeRoomButton).toHaveAttribute("aria-pressed", "false");
    expect(showBirthdayButton).toHaveAttribute("aria-pressed", "false");
    const birthdayThemeButton = screen.getByRole("button", {
      name: "Birthday theme",
    });
    const escapeRoomThemeButton = screen.getByRole("button", {
      name: "Escape room theme",
    });
    expect(birthdayThemeButton).toHaveAttribute("aria-pressed", "true");
    expect(escapeRoomThemeButton).toHaveAttribute("aria-pressed", "false");
    const fireworksRenderer = screen.getByRole("combobox", {
      name: "Fireworks renderer",
    });
    expect(fireworksRenderer).toHaveValue("custom");

    fireEvent.change(fireworksRenderer, { target: { value: "combined" } });

    expect(fireworksRenderer).toHaveValue("combined");
    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4_999);
    });

    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(
      screen.getByRole("heading", {
        name: "Velkommen til rømningsrommet, Runar",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
    expect(showEscapeRoomButton).toHaveAttribute("aria-pressed", "true");
    expect(showBirthdayButton).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );

    fireEvent.click(restartCountdownButton);

    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("countdown")).toHaveAttribute(
      "data-target",
      String(new Date("2026-12-16T12:00:10Z").getTime()),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "birthday");

    fireEvent.click(showEscapeRoomButton);

    expect(
      screen.getByRole("heading", {
        name: "Velkommen til rømningsrommet, Runar",
      }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );

    fireEvent.click(screen.getByRole("button", { name: "Begynn oppdraget" }));

    expect(
      screen.getByRole("heading", { name: "Den første låsen" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Test fullføring" }));

    expect(
      screen.getByRole("heading", { name: "Oppdrag fullført" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1_199);
    });

    expect(
      screen.getByRole("heading", { name: "Oppdrag fullført" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(
      screen.getByRole("heading", {
        name: "Gratulerer med dagen Runar!",
      }),
    ).toBeInTheDocument();
    expect(showBirthdayButton).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "birthday");
  });
});
