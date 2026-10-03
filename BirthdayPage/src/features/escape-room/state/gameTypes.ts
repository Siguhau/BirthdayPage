export const puzzleIds = [
  "vase-captcha",
  "just-dance-wasd",
  "corn-chase",
  "photo-timer",
] as const;

export type PuzzleId = (typeof puzzleIds)[number];

export const itemIds = [
  "camera",
  "camera-battery",
  "tripod",
  "longboi-photo-1",
  "longboi-photo-2",
  "mirror-1",
  "mirror-2",
  "mirror-3",
] as const;

export type ItemId = (typeof itemIds)[number];

export const mirrorItemIds = ["mirror-1", "mirror-2", "mirror-3"] as const;

export type MirrorItemId = (typeof mirrorItemIds)[number];
export type MirrorOrientations = Record<MirrorItemId, number>;

export type GameStage = "introduction" | "exploring" | "complete";

export type GameState = {
  activePuzzleId: PuzzleId | null;
  chestOpen: boolean;
  installedItems: ItemId[];
  inventory: ItemId[];
  laserPowered: boolean;
  mirrorOrientations: MirrorOrientations;
  pepsiCollected: boolean;
  solvedPuzzles: PuzzleId[];
  stage: GameStage;
};

export type GameAction =
  | { type: "START_GAME" }
  | { type: "OPEN_PUZZLE"; puzzleId: PuzzleId }
  | { type: "CLOSE_PUZZLE" }
  | { type: "SOLVE_PUZZLE"; puzzleId: PuzzleId }
  | { type: "SOLVE_WORLD_PUZZLE"; puzzleId: PuzzleId }
  | { type: "PICK_UP_ITEM"; itemId: ItemId }
  | { type: "INSTALL_ITEM"; itemId: ItemId }
  | { type: "ENTER_LASER_CODE"; code: string }
  | { type: "ROTATE_MIRROR"; itemId: MirrorItemId }
  | { type: "COLLECT_PEPSI" }
  | { type: "RESET_GAME" };

export const initialGameState: GameState = {
  activePuzzleId: null,
  chestOpen: false,
  installedItems: [],
  inventory: [],
  laserPowered: false,
  mirrorOrientations: {
    "mirror-1": 0,
    "mirror-2": 0,
    "mirror-3": 0,
  },
  pepsiCollected: false,
  solvedPuzzles: [],
  stage: "introduction",
};
