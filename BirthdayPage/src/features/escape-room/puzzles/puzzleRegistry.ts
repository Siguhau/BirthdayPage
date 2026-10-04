import type { ComponentType } from "react";
import CornChasePuzzle from "../screens/CornChasePuzzle";
import JustDancePuzzle from "../screens/JustDancePuzzle";
import VaseCaptchaPuzzle from "../screens/VaseCaptchaPuzzle";
import SlidingTilesPuzzle from "../screens/SlidingTilesPuzzle";
import type { PuzzleId } from "../state/gameTypes";

export type RegisteredPuzzleProps = {
  onSolve: () => void;
};

type PuzzleRegistration = {
  overlay?: ComponentType<RegisteredPuzzleProps>;
};

export const puzzleRegistry: Record<PuzzleId, PuzzleRegistration> = {
  "brita-sliding-tiles": { overlay: SlidingTilesPuzzle },
  "corn-chase": { overlay: CornChasePuzzle },
  "just-dance-wasd": { overlay: JustDancePuzzle },
  "photo-timer": {},
  "vase-captcha": { overlay: VaseCaptchaPuzzle },
};
