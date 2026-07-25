import { describe, expect, it } from "vitest";
import { gameReducer } from "./gameReducer";
import { initialGameState } from "./gameTypes";

describe("gameReducer", () => {
  it("moves through the introduction, first puzzle, and completion", () => {
    const startedState = gameReducer(initialGameState, { type: "START_GAME" });

    expect(startedState).toEqual({
      solvedPuzzles: [],
      stage: "vase-captcha",
    });

    expect(
      gameReducer(startedState, {
        type: "SOLVE_PUZZLE",
        puzzleId: "vase-captcha",
      }),
    ).toEqual({
      solvedPuzzles: ["vase-captcha"],
      stage: "complete",
    });
  });

  it("ignores actions that are invalid for the current stage", () => {
    expect(
      gameReducer(initialGameState, {
        type: "SOLVE_PUZZLE",
        puzzleId: "vase-captcha",
      }),
    ).toBe(initialGameState);
  });

  it("resets all progress", () => {
    expect(
      gameReducer(
        { solvedPuzzles: ["vase-captcha"], stage: "complete" },
        { type: "RESET_GAME" },
      ),
    ).toBe(initialGameState);
  });
});
