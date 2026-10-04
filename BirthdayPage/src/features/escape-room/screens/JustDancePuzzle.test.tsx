import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { danceBeatDurationMs, dancePattern } from "../puzzles/justDanceConfig";
import JustDancePuzzle from "./JustDancePuzzle";

describe("JustDancePuzzle", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("completes a timed WASD routine", () => {
    vi.useFakeTimers();
    const onSolve = vi.fn();
    render(<JustDancePuzzle onSolve={onSolve} />);

    expect(
      screen.getByRole("heading", { name: "WiiMonday" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start dansen" }));

    dancePattern.forEach((key, index) => {
      fireEvent.keyDown(window, { code: key });
      if (index < dancePattern.length - 1) {
        act(() => {
          vi.advanceTimersByTime(danceBeatDurationMs);
        });
      }
    });

    expect(onSolve).toHaveBeenCalledOnce();
  });

  it("does not let the score fall below zero", () => {
    render(<JustDancePuzzle onSolve={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Start dansen" }));
    fireEvent.keyDown(window, { code: "KeyD" });

    expect(
      screen.getByRole("progressbar", { name: "0 av 12 poeng" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Feil farge – du mister 1 poeng.")).toBeVisible();
  });

  it("removes one point for a wrong colored key", () => {
    vi.useFakeTimers();
    render(<JustDancePuzzle onSolve={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Start dansen" }));
    fireEvent.keyDown(window, { code: "KeyW" });
    expect(
      screen.getByRole("progressbar", { name: "1 av 12 poeng" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(danceBeatDurationMs);
    });
    fireEvent.keyDown(window, { code: "KeyD" });

    expect(
      screen.getByRole("progressbar", { name: "0 av 12 poeng" }),
    ).toBeInTheDocument();
  });

  it("keeps the current cue for one second and previews the next cue", () => {
    vi.useFakeTimers();
    render(<JustDancePuzzle onSolve={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Start dansen" }));
    const currentCue = screen.getByLabelText("Nå: W");

    fireEvent.click(currentCue);
    expect(screen.getByLabelText("Nå: W")).toBeInTheDocument();
    expect(screen.getByLabelText("Deretter: A")).toBeInTheDocument();
    expect(screen.getByLabelText("A, neste")).toHaveAttribute(
      "data-next",
      "true",
    );

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.getByLabelText("Nå: W")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByLabelText("Nå: A")).toBeInTheDocument();
    expect(screen.getByLabelText("Deretter: S")).toBeInTheDocument();
    expect(screen.getByLabelText("S, neste")).toHaveAttribute(
      "data-next",
      "true",
    );
  });
});
