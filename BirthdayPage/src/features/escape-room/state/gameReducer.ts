import {
  initialGameState,
  puzzleIds,
  type GameAction,
  type GameState,
} from "./gameTypes";

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case "START_GAME":
      return state.stage === "introduction"
        ? { ...state, stage: puzzleIds[0] }
        : state;
    case "SOLVE_PUZZLE":
      if (
        state.stage !== action.puzzleId ||
        state.solvedPuzzles.includes(action.puzzleId)
      ) {
        return state;
      }

      return {
        solvedPuzzles: [...state.solvedPuzzles, action.puzzleId],
        stage: puzzleIds[puzzleIds.indexOf(action.puzzleId) + 1] ?? "complete",
      };
    case "RESET_GAME":
      return initialGameState;
  }
};
