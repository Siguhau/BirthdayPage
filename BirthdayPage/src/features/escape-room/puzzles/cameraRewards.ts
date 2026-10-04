import type { GameState, ItemId, PuzzleId } from "../state/gameTypes";

export const cameraRewards = [
  { itemId: "tripod", label: "Kamerastativ" },
  { itemId: "camera", label: "Kamera" },
  { itemId: "camera-battery", label: "Kamerabatteri" },
] as const;
export type CameraRewardId = (typeof cameraRewards)[number]["itemId"];
export const tokenPuzzles = [
  { puzzleId: "vase-captcha", label: "Er det en vase?" },
  { puzzleId: "just-dance-wasd", label: "WiiMonday" },
  { puzzleId: "brita-sliding-tiles", label: "Brita i biter" },
] as const satisfies readonly { puzzleId: PuzzleId; label: string }[];

export const isCameraReward = (itemId: ItemId): itemId is CameraRewardId =>
  cameraRewards.some((reward) => reward.itemId === itemId);

export const getCameraTokenBalance = (
  state: Pick<GameState, "solvedPuzzles" | "inventory" | "installedItems">,
) => {
  const earned = tokenPuzzles.filter(({ puzzleId }) =>
    state.solvedPuzzles.includes(puzzleId),
  ).length;
  const spent = cameraRewards.filter(
    ({ itemId }) =>
      state.inventory.includes(itemId) || state.installedItems.includes(itemId),
  ).length;
  return Math.max(0, earned - spent);
};
