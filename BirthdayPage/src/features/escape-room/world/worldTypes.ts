import type { ItemId, MirrorItemId, PuzzleId } from "../state/gameTypes";

export type AreaId =
  | "memory-gallery"
  | "memory-archive"
  | "oddities-workshop"
  | "photo-studio"
  | "hidden-photo-room"
  | "basement";

export type DoorId = "archive-door" | "workshop-door" | "basement-trapdoor";

export type WorldSwitchId = "hidden-photo-switch";

export type AreaTheme = {
  accent: string;
  background: string;
  panel: string;
  text: string;
};

export type WorldArea = {
  bounds: {
    maxX: number;
    maxZ: number;
    minX: number;
    minZ: number;
  };
  id: AreaId;
  label: string;
  theme: AreaTheme;
};

export type WorldBox = {
  color: string;
  id: string;
  position: readonly [number, number, number];
  size: readonly [number, number, number];
};

export type WorldInteraction = {
  action:
    | { type: "open-door"; doorId: DoorId }
    | { type: "open-puzzle"; puzzleId: PuzzleId }
    | { type: "pick-up-item"; itemId: ItemId }
    | { type: "eat-food"; foodId: string }
    | { type: "plug-corn-arcade" }
    | { type: "hang-longboi-photo" }
    | { type: "inspect-cipher-plaque" }
    | { type: "open-laser-panel" }
    | { type: "open-camera-vending" }
    | { type: "open-trapdoor-lock" }
    | { type: "place-or-rotate-mirror"; itemId: MirrorItemId }
    | { type: "collect-pepsi" }
    | { type: "start-photo"; puzzleId: PuzzleId }
    | { type: "toggle-wall-switch"; switchId: WorldSwitchId };
  id: string;
  label: string;
  position: readonly [number, number, number];
};

export type WorldLight = {
  color: string;
  distance: number;
  id: string;
  intensity: number;
  position: readonly [number, number, number];
};

export type WorldDoor = {
  color: string;
  id: DoorId;
  openPosition: readonly [number, number, number];
  position: readonly [number, number, number];
  widthAxis?: "x" | "z";
};
