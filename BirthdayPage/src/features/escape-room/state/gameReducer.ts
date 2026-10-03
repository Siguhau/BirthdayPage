import { isChestOpen, laserCode, rotateMirror } from "../puzzles/laserPuzzle";
import { initialGameState, type GameAction, type GameState } from "./gameTypes";

const withoutItem = <Item>(items: Item[], itemToRemove: Item) =>
  items.filter((item) => item !== itemToRemove);

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case "START_GAME":
      return state.stage === "introduction"
        ? { ...state, stage: "exploring" }
        : state;
    case "OPEN_PUZZLE":
      return state.stage === "exploring" &&
        state.activePuzzleId === null &&
        !state.solvedPuzzles.includes(action.puzzleId)
        ? { ...state, activePuzzleId: action.puzzleId }
        : state;
    case "CLOSE_PUZZLE":
      return state.activePuzzleId === null
        ? state
        : { ...state, activePuzzleId: null };
    case "SOLVE_PUZZLE":
      if (
        state.activePuzzleId !== action.puzzleId ||
        state.solvedPuzzles.includes(action.puzzleId)
      ) {
        return state;
      }

      return {
        ...state,
        activePuzzleId: null,
        solvedPuzzles: [...state.solvedPuzzles, action.puzzleId],
      };
    case "SOLVE_WORLD_PUZZLE":
      if (
        state.stage !== "exploring" ||
        state.activePuzzleId !== null ||
        state.solvedPuzzles.includes(action.puzzleId)
      ) {
        return state;
      }

      return {
        ...state,
        solvedPuzzles: [...state.solvedPuzzles, action.puzzleId],
      };
    case "PICK_UP_ITEM":
      if (
        state.stage !== "exploring" ||
        state.inventory.includes(action.itemId) ||
        state.installedItems.includes(action.itemId)
      ) {
        return state;
      }

      return {
        ...state,
        inventory: [...state.inventory, action.itemId],
      };
    case "INSTALL_ITEM": {
      if (
        state.stage !== "exploring" ||
        !state.inventory.includes(action.itemId) ||
        state.installedItems.includes(action.itemId)
      ) {
        return state;
      }

      const installedState = {
        ...state,
        installedItems: [...state.installedItems, action.itemId],
        inventory: withoutItem(state.inventory, action.itemId),
      };
      return {
        ...installedState,
        chestOpen: isChestOpen(installedState),
      };
    }
    case "ENTER_LASER_CODE": {
      if (state.stage !== "exploring" || action.code !== laserCode)
        return state;
      const poweredState = { ...state, laserPowered: true };
      return {
        ...poweredState,
        chestOpen: isChestOpen(poweredState),
      };
    }
    case "ROTATE_MIRROR": {
      if (
        state.stage !== "exploring" ||
        !state.installedItems.includes(action.itemId)
      ) {
        return state;
      }
      const rotatedState = {
        ...state,
        mirrorOrientations: rotateMirror(
          state.mirrorOrientations,
          action.itemId,
        ),
      };
      return {
        ...rotatedState,
        chestOpen: isChestOpen(rotatedState),
      };
    }
    case "COLLECT_PEPSI":
      return state.stage === "exploring" && state.chestOpen
        ? { ...state, pepsiCollected: true, stage: "complete" }
        : state;
    case "RESET_GAME":
      return initialGameState;
  }
};
