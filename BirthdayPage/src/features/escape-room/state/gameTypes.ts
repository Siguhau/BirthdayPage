export const puzzleIds = ["vase-captcha"] as const;

export type PuzzleId = (typeof puzzleIds)[number];

export type GameStage = "introduction" | PuzzleId | "complete";

export type GameState = {
  solvedPuzzles: PuzzleId[];
  stage: GameStage;
};

export type GameAction =
  | { type: "START_GAME" }
  | { type: "SOLVE_PUZZLE"; puzzleId: PuzzleId }
  | { type: "RESET_GAME" };

export const initialGameState: GameState = {
  solvedPuzzles: [],
  stage: "introduction",
};
