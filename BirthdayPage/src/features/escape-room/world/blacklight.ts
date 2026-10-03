import { longboiPhotoItemIds } from "../puzzles/longboiPhotos";
import type { ItemId } from "../state/gameTypes";
import type { WorldSwitchId } from "./worldTypes";

export const isSpawnBlacklightActive = (
  activeSwitchIds: ReadonlySet<WorldSwitchId>,
  installedItemIds: readonly ItemId[],
) =>
  activeSwitchIds.has("hidden-photo-switch") &&
  longboiPhotoItemIds.some((itemId) => installedItemIds.includes(itemId));
