import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";
import ThemeProvider from "../../theme/ThemeProvider";
import EscapeRoomGame from "./EscapeRoomGame";
import type EscapeRoomWorld from "./world/EscapeRoomWorld";
import { releaseMouseLook } from "./world/mouseLook";

vi.mock("./support/useEscapeRoomSupport", () => ({
  default: () => ({ supported: true }),
}));
vi.mock("./world/mouseLook", () => ({
  releaseMouseLook: vi.fn(),
  requestMouseLook: vi.fn(),
}));
vi.mock("./world/EscapeRoomWorld", () => ({
  default: (props: ComponentProps<typeof EscapeRoomWorld>) => (
    <div data-testid="completion-world" data-paused={props.activePuzzleOpen}>
      <button
        onClick={() => {
          props.onEnterLaserCode("1996");
          for (const [itemId, rotations] of [
            ["mirror-1", 1],
            ["mirror-2", 3],
            ["mirror-3", 2],
          ] as const) {
            props.onPickUpItem(itemId);
            props.onInstallItem(itemId);
            for (let turn = 0; turn < rotations; turn += 1)
              props.onRotateMirror(itemId);
          }
        }}
      >
        Open test chest
      </button>
      <button
        disabled={!props.chestOpen || props.activePuzzleOpen}
        onClick={props.onCollectPepsi}
      >
        Collect Pepsi
      </button>
    </div>
  ),
}));

const completeRoom = async () => {
  fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));
  await act(async () => {
    await Promise.resolve();
  });
  fireEvent.click(screen.getByRole("button", { name: "Open test chest" }));
  fireEvent.click(screen.getByRole("button", { name: "Collect Pepsi" }));
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  window.localStorage.clear();
  window.history.replaceState({}, "", "/?preview=escape-room");
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

describe("game completion transition", () => {
  it("keeps the paused world mounted until the glow finishes, then reveals the finale", async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    );
    await completeRoom();
    const world = screen.getByTestId("completion-world");
    expect(world).toHaveAttribute("data-paused", "true");
    expect(releaseMouseLook).toHaveBeenCalledOnce();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Bursdagshilsenen låses opp",
    );
    act(() => {
      vi.advanceTimersByTime(2_399);
    });
    expect(screen.getByTestId("completion-world")).toBe(world);
    expect(
      screen.queryByRole("heading", { name: "Gratulerer med dagen Runar!" }),
    ).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByTestId("completion-world")).not.toBeInTheDocument();
    expect(
      screen
        .getByRole("heading", { name: "Gratulerer med dagen Runar!" })
        .closest(".birthday-welcome"),
    ).toHaveAttribute("data-arriving", "true");
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
  });

  it("skips the outgoing delay for reduced motion", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const onComplete = vi.fn();
    render(<EscapeRoomGame onComplete={onComplete} userName="Runar" />);
    await completeRoom();
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("cancels the handoff when leaving during the transition", async () => {
    const onComplete = vi.fn();
    const { unmount } = render(
      <EscapeRoomGame onComplete={onComplete} userName="Runar" />,
    );
    await completeRoom();
    unmount();
    act(() => {
      vi.advanceTimersByTime(3_000);
    });
    expect(onComplete).not.toHaveBeenCalled();
  });
});
