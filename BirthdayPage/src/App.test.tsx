import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import ThemeProvider from "./theme/ThemeProvider";
import { themeRevealStorageKey } from "./theme/themeReveal";
import { getCameraTokenBalance } from "./features/escape-room/puzzles/cameraRewards";
import type { ItemId, PuzzleId } from "./features/escape-room/state/gameTypes";

// Keep calendar scenarios stable while the live birthday is changed for testing.
vi.mock("./birthdayConfig", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./birthdayConfig")>();
  return {
    ...actual,
    birthdayConfig: {
      ...actual.birthdayConfig,
      birthday: { month: 12, day: 17 },
    },
  };
});

vi.mock("@leenguyen/react-flip-clock-countdown", () => ({
  default: ({ to }: { to: Date | number | string }) => (
    <div data-testid="countdown" data-target={String(to)} />
  ),
}));

vi.mock("./features/escape-room/support/useEscapeRoomSupport", () => ({
  default: () => ({ supported: true }),
}));

vi.mock("./features/escape-room/world/EscapeRoomWorld", () => ({
  default: ({
    installedItemIds,
    inventoryItemIds,
    solvedPuzzleIds,
  }: {
    installedItemIds: ItemId[];
    inventoryItemIds: ItemId[];
    solvedPuzzleIds: PuzzleId[];
  }) => (
    <section>
      <h1>Memory Gallery</h1>
      <output>
        Polletter:{" "}
        {getCameraTokenBalance({
          installedItems: installedItemIds,
          inventory: inventoryItemIds,
          solvedPuzzles: solvedPuzzleIds,
        })}
      </output>
    </section>
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
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
    vi.useRealTimers();
  });

  it("plays the theme reveal once and remembers it across visits", () => {
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));
    const { unmount } = renderApp();
    expect(document.documentElement).toHaveAttribute("data-theme", "birthday");
    expect(screen.getByTestId("countdown").closest("main")).toHaveAttribute(
      "data-revealed",
      "false",
    );
    expect(window.localStorage.getItem(themeRevealStorageKey)).toBeNull();
    act(() => {
      vi.advanceTimersByTime(8_200);
    });
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
    expect(window.localStorage.getItem(themeRevealStorageKey)).toBe("true");
    unmount();
    renderApp();
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
    expect(screen.getByTestId("countdown").closest("main")).toHaveAttribute(
      "data-revealed",
      "true",
    );
  });

  it("still reveals the new theme when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("Storage blocked");
    });
    const save = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage blocked");
      });
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));
    renderApp();
    act(() => {
      vi.advanceTimersByTime(8_200);
    });
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
    save.mockRestore();
  });

  it.each([
    ["escape-room", 0],
    ["birthday", 0],
    ["teaser", 0],
    ["", 0],
  ] as const)(
    "starts %s with the expected token balance",
    async (preview, tokens) => {
      window.history.replaceState(
        {},
        "",
        preview ? `/?preview=${preview}` : "/",
      );
      vi.setSystemTime(new Date("2026-12-17T00:00:00Z"));
      renderApp();
      if (preview === "teaser" || preview === "birthday") {
        fireEvent.click(screen.getByText("Preview controls"));
      }
      if (preview === "teaser") {
        fireEvent.click(
          screen.getByRole("button", { name: "Run final 10 seconds" }),
        );
      }
      if (preview === "teaser" || preview === "birthday") {
        act(() => {
          vi.advanceTimersByTime(10_000);
        });
        act(() => {
          vi.advanceTimersByTime(2_800);
        });
      }
      if (preview === "") {
        act(() => {
          vi.advanceTimersByTime(1_000);
        });
        act(() => {
          vi.advanceTimersByTime(2_800);
        });
      }
      fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));
      await act(async () => {
        await Promise.resolve();
      });
      expect(
        screen.getByText(`Polletter: ${String(tokens)}`),
      ).toBeInTheDocument();
    },
  );

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

  it("shows zero on a birthday visit before passing through the door", () => {
    vi.setSystemTime(new Date("2026-12-17T12:00:00Z"));

    renderApp();

    const countdown = screen.getByTestId("countdown");
    expect(countdown).toHaveAttribute(
      "data-target",
      new Date("2026-12-16T23:00:00Z").toString(),
    );
    expect(countdown.closest("main")).toHaveAttribute(
      "data-departing",
      "false",
    );
    expect(screen.queryByText("Åpne døren")).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(countdown.closest("main")).toHaveAttribute(
      "data-departing",
      "false",
    );
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("countdown")).toBe(countdown);
    expect(countdown.closest("main")).toHaveAttribute("data-departing", "true");
    act(() => {
      vi.advanceTimersByTime(2_800);
    });

    expect(
      screen.getByRole("heading", {
        name: "Kjelleren til mor",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
  });

  it("passes through the door at Oslo midnight before opening the escape room", () => {
    vi.setSystemTime(new Date("2026-12-16T22:59:59Z"));
    renderApp();
    const countdown = screen.getByTestId("countdown");

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.getByTestId("countdown")).toBe(countdown);
    expect(countdown.closest("main")).toHaveAttribute(
      "data-departing",
      "false",
    );
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(countdown.closest("main")).toHaveAttribute("data-departing", "true");
    expect(screen.queryByText("Åpne døren")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2_800);
    });

    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Åpne døren" }),
    ).toBeInTheDocument();
  });

  it("skips the door movement when reduced motion is requested", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    vi.setSystemTime(new Date("2026-12-16T22:59:59Z"));
    renderApp();

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.getByTestId("countdown")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Åpne døren" }),
    ).toBeInTheDocument();
  });

  it("can replay the teaser during passage without a stale handoff", () => {
    window.history.replaceState({}, "", "/?preview=teaser");
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));
    renderApp();
    fireEvent.click(screen.getByText("Preview controls"));
    fireEvent.click(
      screen.getByRole("button", { name: "Run final 10 seconds" }),
    );
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByTestId("countdown").closest("main")).toHaveAttribute(
      "data-departing",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Replay the reveal" }));
    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(screen.getByTestId("countdown").closest("main")).toHaveAttribute(
      "data-departing",
      "false",
    );
    expect(screen.queryByText("Åpne døren")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Run final 10 seconds" }),
    ).toBeEnabled();
  });

  it("previews the countdown, escape-room entry, and birthday finale", async () => {
    window.history.replaceState({}, "", "/?preview=birthday");
    vi.setSystemTime(new Date("2026-12-16T12:00:00Z"));

    renderApp();

    fireEvent.click(screen.getByText("Preview controls"));
    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("countdown")).toHaveAttribute(
      "data-target",
      String(new Date("2026-12-16T12:00:10Z").getTime()),
    );
    const restartCountdownButton = screen.getByRole("button", {
      name: "Restart 10-second countdown",
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
    const fireworksRenderer = screen.getByRole("combobox", {
      name: "Fireworks renderer",
    });
    expect(fireworksRenderer).toHaveValue("combined");

    fireEvent.change(fireworksRenderer, { target: { value: "combined" } });

    expect(fireworksRenderer).toHaveValue("combined");
    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(9_999);
    });

    expect(
      screen.getByRole("heading", { name: "Tid til Runars bursdag" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByTestId("countdown").closest("main")).toHaveAttribute(
      "data-departing",
      "true",
    );

    act(() => {
      vi.advanceTimersByTime(2_800);
    });

    expect(
      screen.getByRole("heading", {
        name: "Kjelleren til mor",
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
      String(new Date("2026-12-16T12:00:22.800Z").getTime()),
    );
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );

    fireEvent.click(showEscapeRoomButton);

    expect(
      screen.getByRole("heading", {
        name: "Kjelleren til mor",
      }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );

    fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByRole("heading", { name: "Memory Gallery" }),
    ).toBeInTheDocument();

    fireEvent.click(showBirthdayButton);

    expect(
      screen.getByRole("heading", {
        name: "Gratulerer med dagen Runar!",
      }),
    ).toBeInTheDocument();
    expect(showBirthdayButton).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
  });
});
