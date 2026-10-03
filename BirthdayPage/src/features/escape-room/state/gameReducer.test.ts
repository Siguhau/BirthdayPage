import { describe, expect, it } from "vitest";
import { gameReducer } from "./gameReducer";
import { initialGameState } from "./gameTypes";

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

  it("resets all progress", () => {
    expect(
      gameReducer(
        {
          ...initialGameState,
          activePuzzleId: null,
          installedItems: ["camera-battery"],
          inventory: [],
          solvedPuzzles: ["vase-captcha"],
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

  it("opens, closes, and solves the active puzzle without leaving exploration", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const puzzleState = gameReducer(exploringState, {
      type: "OPEN_PUZZLE",
      puzzleId: "vase-captcha",
    });

    expect(puzzleState.activePuzzleId).toBe("vase-captcha");
    expect(
      gameReducer(puzzleState, { type: "CLOSE_PUZZLE" }).activePuzzleId,
    ).toBeNull();
    expect(
      gameReducer(puzzleState, {
        type: "SOLVE_PUZZLE",
        puzzleId: "vase-captcha",
      }),
    ).toEqual({
      ...initialGameState,
      installedItems: [],
      inventory: [],
      solvedPuzzles: ["vase-captcha"],
      stage: "exploring",
    });
  });

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

  it("picks up and installs the camera before its battery", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const carryingCamera = gameReducer(exploringState, {
      type: "PICK_UP_ITEM",
      itemId: "camera",
    });
    const carryingBoth = gameReducer(carryingCamera, {
      type: "PICK_UP_ITEM",
      itemId: "camera-battery",
    });

    expect(carryingBoth.inventory).toEqual(["camera", "camera-battery"]);

    const mountedCamera = gameReducer(carryingBoth, {
      type: "INSTALL_ITEM",
      itemId: "camera",
    });
    expect(mountedCamera).toEqual({
      ...initialGameState,
      installedItems: ["camera"],
      inventory: ["camera-battery"],
      solvedPuzzles: [],
      stage: "exploring",
    });

    expect(
      gameReducer(mountedCamera, {
        type: "INSTALL_ITEM",
        itemId: "camera-battery",
      }),
    ).toEqual({
      ...initialGameState,
      installedItems: ["camera", "camera-battery"],
      inventory: [],
      solvedPuzzles: [],
      stage: "exploring",
    });
  });

  it("moves the packed tripod from the cupboard into its studio position", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const carryingTripod = gameReducer(exploringState, {
      type: "PICK_UP_ITEM",
      itemId: "tripod",
    });

    expect(carryingTripod.inventory).toEqual(["tripod"]);
    expect(
      gameReducer(carryingTripod, {
        type: "INSTALL_ITEM",
        itemId: "tripod",
      }),
    ).toEqual({
      ...initialGameState,
      installedItems: ["tripod"],
      inventory: [],
      solvedPuzzles: [],
      stage: "exploring",
    });
  });

  it("stores both successful Longboi photos as separate inventory items", () => {
    const exploringState = gameReducer(initialGameState, {
      type: "START_GAME",
    });
    const firstPhoto = gameReducer(exploringState, {
      type: "PICK_UP_ITEM",
      itemId: "longboi-photo-1",
    });
    const bothPhotos = gameReducer(firstPhoto, {
      type: "PICK_UP_ITEM",
      itemId: "longboi-photo-2",
    });

    expect(bothPhotos.inventory).toEqual([
      "longboi-photo-1",
      "longboi-photo-2",
    ]);
  });

  it("hangs one Longboi photo while keeping the other in inventory", () => {
    const state = {
      ...initialGameState,
      installedItems: [],
      inventory: ["longboi-photo-1", "longboi-photo-2"],
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
      inventory: ["longboi-photo-2"],
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
