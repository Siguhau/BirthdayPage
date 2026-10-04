import {
  mirrorItemIds,
  type ItemId,
  type MirrorItemId,
  type MirrorOrientations,
} from "../state/gameTypes";

export const laserCode = "1996";
export const mirrorOrientationCount = 4;

export const correctMirrorOrientations: MirrorOrientations = {
  "mirror-1": 1,
  "mirror-2": 3,
  "mirror-3": 2,
};

export const rotateMirror = (
  orientations: MirrorOrientations,
  itemId: MirrorItemId,
): MirrorOrientations => ({
  ...orientations,
  [itemId]: (orientations[itemId] + 1) % mirrorOrientationCount,
});

export const getLaserProgress = ({
  installedItems,
  laserPowered,
  mirrorOrientations,
}: {
  installedItems: readonly ItemId[];
  laserPowered: boolean;
  mirrorOrientations: MirrorOrientations;
}) => {
  if (!laserPowered) return 0;

  let progress = 1;
  for (const mirrorId of mirrorItemIds) {
    if (
      !installedItems.includes(mirrorId) ||
      mirrorOrientations[mirrorId] !== correctMirrorOrientations[mirrorId]
    ) {
      break;
    }
    progress += 1;
  }
  return progress;
};

export const isChestOpen = (state: {
  installedItems: readonly ItemId[];
  laserPowered: boolean;
  mirrorOrientations: MirrorOrientations;
}) => getLaserProgress(state) === mirrorItemIds.length + 1;
