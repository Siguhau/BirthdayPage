import { describe, expect, it } from "vitest";
import { gameReducer } from "./gameReducer";
import { initialGameState, puzzleIds } from "./gameTypes";

describe("gameReducer", () => {
  it("moves from the introduction into the walking prototype", () => {
    const startedState = gameReducer(initialGameState, { type: "START_GAME" });

    expect(startedState).toEqual({
      ...initialGameState,
      stage: "exploring",
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

  it("resets earned tokens and redeemed camera rewards", () => {
    expect(
      gameReducer(
        {
          ...initialGameState,
          activePuzzleId: null,
          installedItems: ["camera-battery"],
          inventory: ["camera"],
          solvedPuzzles: ["vase-captcha", "just-dance-wasd"],
          stage: "complete",
        },
        { type: "RESET_GAME" },
      ),
    ).toBe(initialGameState);
  });

  it("ignores a puzzle solution during exploration", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });

    expect(
      gameReducer(exploringState, {
        type: "SOLVE_PUZZLE",
        puzzleId: "vase-captcha",
      }),
    ).toBe(exploringState);
  });

  it.each(puzzleIds)(
    "opens, closes, and solves %s without leaving exploration",
    (puzzleId) => {
      const exploringState = gameReducer(initialGameState, {
        type: "START_GAME",
      });
      const puzzleState = gameReducer(exploringState, {
        type: "OPEN_PUZZLE",
        puzzleId,
      });

      expect(puzzleState.activePuzzleId).toBe(puzzleId);
      expect(
        gameReducer(puzzleState, { type: "CLOSE_PUZZLE" }).activePuzzleId,
      ).toBeNull();
      expect(
        gameReducer(puzzleState, {
          type: "SOLVE_PUZZLE",
          puzzleId,
        }),
      ).toEqual({
        ...initialGameState,
        installedItems: [],
        inventory: [],
        solvedPuzzles: [puzzleId],
        stage: "exploring",
      });
    },
  );

  it("records a world-native puzzle solution during exploration", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });

    expect(
      gameReducer(exploringState, {
        type: "SOLVE_WORLD_PUZZLE",
        puzzleId: "photo-timer",
      }),
    ).toEqual({
      ...initialGameState,
      installedItems: [],
      inventory: [],
      solvedPuzzles: ["photo-timer"],
      stage: "exploring",
    });
  });

  it("redeems exactly one earned token for a camera component", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const captchaOpen = gameReducer(exploringState, {
      type: "OPEN_PUZZLE",
      puzzleId: "vase-captcha",
    });
    const earnedToken = gameReducer(captchaOpen, {
      type: "SOLVE_PUZZLE",
      puzzleId: "vase-captcha",
    });

    expect(
      gameReducer(earnedToken, {
        type: "REDEEM_CAMERA_REWARD",
        itemId: "camera",
      }),
    ).toEqual({
      ...initialGameState,
      inventory: ["camera"],
      solvedPuzzles: ["vase-captcha"],
      stage: "exploring",
    });
  });

  it.each([
    ["vase-captcha", "camera"],
    ["just-dance-wasd", "tripod"],
    ["brita-sliding-tiles", "camera-battery"],
  ] as const)("earns one token from %s", (puzzleId, itemId) => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const puzzleOpen = gameReducer(exploringState, {
      type: "OPEN_PUZZLE",
      puzzleId,
    });
    const earnedToken = gameReducer(puzzleOpen, {
      type: "SOLVE_PUZZLE",
      puzzleId,
    });

    expect(
      gameReducer(earnedToken, {
        type: "REDEEM_CAMERA_REWARD",
        itemId,
      }).inventory,
    ).toEqual([itemId]);
  });

  it("does not redeem a camera component without an earned token", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });

    expect(
      gameReducer(exploringState, {
        type: "REDEEM_CAMERA_REWARD",
        itemId: "camera",
      }),
    ).toBe(exploringState);
  });

  it("does not allow replay farming or duplicate camera component claims", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const captchaOpen = gameReducer(exploringState, {
      type: "OPEN_PUZZLE",
      puzzleId: "vase-captcha",
    });
    const solvedCaptcha = gameReducer(captchaOpen, {
      type: "SOLVE_PUZZLE",
      puzzleId: "vase-captcha",
    });
    const cameraClaimed = gameReducer(solvedCaptcha, {
      type: "REDEEM_CAMERA_REWARD",
      itemId: "camera",
    });

    expect(
      gameReducer(solvedCaptcha, {
        type: "OPEN_PUZZLE",
        puzzleId: "vase-captcha",
      }),
    ).toBe(solvedCaptcha);
    expect(
      gameReducer(cameraClaimed, {
        type: "REDEEM_CAMERA_REWARD",
        itemId: "tripod",
      }),
    ).toBe(cameraClaimed);
    expect(
      gameReducer(cameraClaimed, {
        type: "REDEEM_CAMERA_REWARD",
        itemId: "camera",
      }),
    ).toBe(cameraClaimed);
  });

  it("keeps an installed camera component spent", () => {
    const state = {
      ...initialGameState,
      installedItems: ["camera"],
      solvedPuzzles: ["vase-captcha", "just-dance-wasd", "brita-sliding-tiles"],
      stage: "exploring",
    } as const;

    expect(
      gameReducer(
        {
          ...state,
          installedItems: [...state.installedItems],
          solvedPuzzles: [...state.solvedPuzzles],
        },
        {
          type: "REDEEM_CAMERA_REWARD",
          itemId: "camera",
        },
      ),
    ).toEqual(state);
  });

  it("allows a component to be mounted after vending redemption", () => {
    const state = {
      ...initialGameState,
      inventory: ["tripod"],
      solvedPuzzles: ["vase-captcha"],
      stage: "exploring",
    } as const;

    expect(
      gameReducer(
        {
          ...state,
          inventory: [...state.inventory],
          solvedPuzzles: [...state.solvedPuzzles],
        },
        { type: "INSTALL_ITEM", itemId: "tripod" },
      ),
    ).toEqual({
      ...initialGameState,
      installedItems: ["tripod"],
      inventory: [],
      solvedPuzzles: ["vase-captcha"],
      stage: "exploring",
    });
  });

  it("stores a successful Longboi photo in inventory", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const photo = gameReducer(exploringState, {
      type: "PICK_UP_ITEM",
      itemId: "longboi-photo-1",
    });

    expect(photo.inventory).toEqual(["longboi-photo-1"]);
  });

  it("hangs the successful Longboi photo", () => {
    const state = {
      ...initialGameState,
      installedItems: [],
      inventory: ["longboi-photo-1"],
      solvedPuzzles: ["photo-timer"],
      stage: "exploring",
    } as const;

    expect(
      gameReducer(
        {
          ...state,
          installedItems: [...state.installedItems],
          inventory: [...state.inventory],
          solvedPuzzles: [...state.solvedPuzzles],
        },
        { type: "INSTALL_ITEM", itemId: "longboi-photo-1" },
      ),
    ).toEqual({
      ...initialGameState,
      installedItems: ["longboi-photo-1"],
      inventory: [],
      solvedPuzzles: ["photo-timer"],
      stage: "exploring",
    });
  });

  it("powers the laser only with 1996 and opens the chest after all reflections", () => {
    let state = gameReducer(initialGameState, { type: "START_GAME" });

    expect(gameReducer(state, { type: "ENTER_LASER_CODE", code: "1969" })).toBe(
      state,
    );
    state = gameReducer(state, { type: "ENTER_LASER_CODE", code: "1996" });
    expect(state.laserPowered).toBe(true);

    for (const itemId of ["mirror-1", "mirror-2", "mirror-3"] as const) {
      state = gameReducer(state, { type: "PICK_UP_ITEM", itemId });
      state = gameReducer(state, { type: "INSTALL_ITEM", itemId });
    }
    state = gameReducer(state, { type: "ROTATE_MIRROR", itemId: "mirror-1" });
    for (let index = 0; index < 3; index += 1) {
      state = gameReducer(state, { type: "ROTATE_MIRROR", itemId: "mirror-2" });
    }
    for (let index = 0; index < 2; index += 1) {
      state = gameReducer(state, { type: "ROTATE_MIRROR", itemId: "mirror-3" });
    }

    expect(state.chestOpen).toBe(true);
    expect(gameReducer(state, { type: "COLLECT_PEPSI" })).toMatchObject({
      pepsiCollected: true,
      stage: "complete",
    });
  });
});
