import type { ComponentType } from "react";
import CornChasePuzzle from "../screens/CornChasePuzzle";
import JustDancePuzzle from "../screens/JustDancePuzzle";
import VaseCaptchaPuzzle from "../screens/VaseCaptchaPuzzle";
import type { PuzzleId } from "../state/gameTypes";

export type RegisteredPuzzleProps = {
  onSolve: () => void;
};

type PuzzleRegistration = {
  overlay?: ComponentType<RegisteredPuzzleProps>;
};

export const puzzleRegistry: Record<PuzzleId, PuzzleRegistration> = {
  "corn-chase": { overlay: CornChasePuzzle },
  "just-dance-wasd": { overlay: JustDancePuzzle },
  "photo-timer": {},
  "vase-captcha": { overlay: VaseCaptchaPuzzle },
};
