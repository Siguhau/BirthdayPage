import type {
  AreaId,
  WorldArea,
  WorldBox,
  WorldDoor,
  WorldInteraction,
  WorldLight,
} from "./worldTypes";

const wallThickness = 0.65;

export const worldGravity: [number, number, number] = [0, -9.81, 0];

export const worldAreas = [
  {
    bounds: { maxX: 4, maxZ: 11, minX: -4, minZ: -11 },
    id: "memory-gallery",
    label: "Memory Gallery",
    theme: {
      accent: "#f2b84b",
      background: "#1b2946",
      panel: "rgba(24, 38, 66, 0.9)",
      text: "#fff6dc",
    },
  },
  {
    bounds: { maxX: -4, maxZ: 4, minX: -10, minZ: -4 },
    id: "memory-archive",
    label: "Memory Archive",
    theme: {
      accent: "#ff8f7a",
      background: "#1d4d57",
      panel: "rgba(20, 62, 70, 0.92)",
      text: "#e9ffff",
    },
  },
  {
    bounds: { maxX: 10, maxZ: 4, minX: 4, minZ: -4 },
    id: "oddities-workshop",
    label: "Oddities Workshop",
    theme: {
      accent: "#fff34f",
      background: "#37134d",
      panel: "rgba(79, 24, 96, 0.92)",
      text: "#fff8cf",
    },
  },
  {
    bounds: { maxX: -4, maxZ: 9.5, minX: -9, minZ: 5.5 },
    id: "photo-studio",
    label: "Photo Studio",
    theme: {
      accent: "#ffea63",
      background: "#55215f",
      panel: "rgba(83, 28, 91, 0.92)",
      text: "#fff5cc",
    },
  },
  {
    bounds: { maxX: -9, maxZ: 8, minX: -11, minZ: 7 },
    id: "hidden-photo-room",
    label: "Hidden Castle Room",
    theme: {
      accent: "#73f0c0",
      background: "#163f45",
      panel: "rgba(17, 62, 67, 0.94)",
      text: "#ecfff8",
    },
  },
  {
    bounds: { maxX: 4, maxZ: -11.05, minX: -4, minZ: -21 },
    id: "basement",
    label: "Cold Storage Basement",
    theme: {
      accent: "#63e6ff",
      background: "#071a26",
      panel: "rgba(5, 28, 40, 0.94)",
      text: "#e6fbff",
    },
  },
] as const satisfies readonly WorldArea[];

export const defaultAreaId: AreaId = "memory-gallery";

export const worldFloors = [
  {
    color: "#3a4c6c",
    id: "gallery-floor-main",
    position: [0, -0.25, 1.75],
    size: [8, 0.5, 18.5],
  },
  {
    color: "#3a4c6c",
    id: "gallery-floor-north-west",
    position: [-2.65, -0.25, -9],
    size: [2.7, 0.5, 3],
  },
  {
    color: "#3a4c6c",
    id: "gallery-floor-north-east",
    position: [2.65, -0.25, -9],
    size: [2.7, 0.5, 3],
  },
  {
    color: "#3a4c6c",
    id: "gallery-floor-north-cap",
    position: [0, -0.25, -10.75],
    size: [8, 0.5, 0.5],
  },
  {
    color: "#42656d",
    id: "archive-floor",
    position: [-7, -0.25, 0],
    size: [6, 0.5, 8],
  },
  {
    color: "#69416f",
    id: "workshop-floor",
    position: [7, -0.25, 0],
    size: [6, 0.5, 8],
  },
  {
    color: "#a3448f",
    id: "photo-studio-floor",
    position: [-6.5, -0.25, 7.5],
    size: [5, 0.5, 4],
  },
  {
    color: "#255d5d",
    id: "hidden-photo-room-floor",
    position: [-10, -0.25, 7.5],
    size: [2.65, 0.5, 1.65],
  },
  {
    color: "#173747",
    id: "basement-floor",
    position: [0, -3.25, -14.25],
    size: [8, 0.5, 13.5],
  },
] as const satisfies readonly WorldBox[];

export const basementLadderPosition = [0, -1.45, -7.82] as const;
export const basementLadderClimbBounds = {
  maxX: 1.15,
  maxY: 0.95,
  maxZ: -7.5,
  minX: -1.15,
  minY: -2.45,
  minZ: -10.5,
} as const;

export const worldCeilings = [
  {
    color: "#273a58",
    id: "gallery-ceiling",
    position: [0, 3.25, 0],
    size: [8.65, 0.5, 22.65],
  },
  {
    color: "#345860",
    id: "archive-ceiling",
    position: [-7, 3.25, 0],
    size: [6.65, 0.5, 8.65],
  },
  {
    color: "#51265f",
    id: "workshop-ceiling",
    position: [7, 3.25, 0],
    size: [6.65, 0.5, 8.65],
  },
  {
    color: "#6f2f72",
    id: "photo-studio-ceiling",
    position: [-6.5, 3.25, 7.5],
    size: [5.65, 0.5, 4.65],
  },
  {
    color: "#214f54",
    id: "hidden-photo-room-ceiling",
    position: [-10, 3.25, 7.5],
    size: [2.65, 0.5, 1.65],
  },
  {
    color: "#102d3c",
    id: "basement-ceiling",
    position: [0, 0.5, -17],
    size: [8.65, 0.5, 8.65],
  },
] as const satisfies readonly WorldBox[];

export const worldWalls = [
  {
    color: "#304464",
    id: "gallery-left-north",
    position: [-4, 1.5, -6.15],
    size: [wallThickness, 3, 9.7],
  },
  {
    color: "#304464",
    id: "gallery-left-photo-south",
    position: [-4, 1.5, 4.03],
    size: [wallThickness, 3, 5.45],
  },
  {
    color: "#304464",
    id: "gallery-left-photo-north",
    position: [-4, 1.5, 9.63],
    size: [wallThickness, 3, 2.75],
  },
  {
    color: "#7f397e",
    id: "gallery-photo-door-header",
    position: [-4, 2.6, 7.5],
    size: [wallThickness, 0.8, 1.5],
  },
  {
    color: "#304464",
    id: "gallery-right-north",
    position: [4, 1.5, -6.15],
    size: [wallThickness, 3, 9.7],
  },
  {
    color: "#304464",
    id: "gallery-right-south",
    position: [4, 1.5, 6.15],
    size: [wallThickness, 3, 9.7],
  },
  {
    color: "#3c5375",
    id: "gallery-left-door-header",
    position: [-4, 2.6, 0],
    size: [wallThickness, 0.8, 2.6],
  },
  {
    color: "#3c5375",
    id: "gallery-right-door-header",
    position: [4, 2.6, 0],
    size: [wallThickness, 0.8, 2.6],
  },
  {
    color: "#3b5274",
    id: "gallery-start",
    position: [0, 1.5, 11],
    size: [8, 3, wallThickness],
  },
  {
    color: "#354b6c",
    id: "gallery-end-left",
    position: [-2.55, 1.5, -11],
    size: [2.9, 3, wallThickness],
  },
  {
    color: "#354b6c",
    id: "gallery-end-right",
    position: [2.55, 1.5, -11],
    size: [2.9, 3, wallThickness],
  },
  {
    color: "#3c5375",
    id: "gallery-basement-shaft-header",
    position: [0, 2.1, -11],
    size: [2.2, 2.2, wallThickness],
  },
  {
    color: "#47707a",
    id: "archive-west",
    position: [-10, 1.5, 0],
    size: [wallThickness, 3, 8],
  },
  {
    color: "#47707a",
    id: "archive-north",
    position: [-7, 1.5, -4],
    size: [6, 3, wallThickness],
  },
  {
    color: "#47707a",
    id: "archive-south",
    position: [-7, 1.5, 4],
    size: [6, 3, wallThickness],
  },
  {
    color: "#71347d",
    id: "workshop-east",
    position: [10, 1.5, 0],
    size: [wallThickness, 3, 8],
  },
  {
    color: "#347348",
    id: "workshop-north",
    position: [7, 1.5, -4],
    size: [6, 3, wallThickness],
  },
  {
    color: "#b85b2e",
    id: "workshop-south",
    position: [7, 1.5, 4],
    size: [6, 3, wallThickness],
  },
  {
    color: "#d45c9d",
    id: "photo-studio-north",
    position: [-6.5, 1.5, 5.5],
    size: [5, 3, wallThickness],
  },
  {
    color: "#f08b52",
    id: "photo-studio-south",
    position: [-6.5, 1.5, 9.5],
    size: [5, 3, wallThickness],
  },
  {
    color: "#7d3c84",
    id: "photo-studio-west-north",
    position: [-9, 1.5, 6.25],
    size: [wallThickness, 3, 1.5],
  },
  {
    color: "#7d3c84",
    id: "photo-studio-west-south",
    position: [-9, 1.5, 8.75],
    size: [wallThickness, 3, 1.5],
  },
  {
    color: "#b967b6",
    id: "photo-studio-picture-header",
    position: [-9, 2.6, 7.5],
    size: [wallThickness, 0.8, 1],
  },
  {
    color: "#2f6869",
    id: "hidden-photo-room-west",
    position: [-11.43, 1.5, 7.5],
    size: [wallThickness, 3, 1.65],
  },
  {
    color: "#367879",
    id: "hidden-photo-room-north",
    position: [-10.1, 1.5, 6.67],
    size: [2.65, 3, wallThickness],
  },
  {
    color: "#367879",
    id: "hidden-photo-room-south",
    position: [-10.1, 1.5, 8.33],
    size: [2.65, 3, wallThickness],
  },
  {
    color: "#15394a",
    id: "basement-west",
    position: [-4, -1.5, -14.25],
    size: [wallThickness, 3.5, 13.5],
  },
  {
    color: "#15394a",
    id: "basement-east",
    position: [4, -1.5, -14.25],
    size: [wallThickness, 3.5, 13.5],
  },
  {
    color: "#102f40",
    id: "basement-north",
    position: [0, -1.5, -21],
    size: [8, 3.5, wallThickness],
  },
  {
    color: "#173f50",
    id: "basement-south",
    position: [0, -1.5, -7.5],
    size: [8, 3.5, wallThickness],
  },
  {
    color: "#1b4050",
    id: "trapdoor-shaft-west",
    position: [-1.3, -1.625, -8.9],
    size: [0.4, 3.45, 3],
  },
  {
    color: "#1b4050",
    id: "trapdoor-shaft-east",
    position: [1.3, -1.625, -8.9],
    size: [0.4, 3.45, 3],
  },
] as const satisfies readonly WorldBox[];

export const worldLights = [
  {
    color: "#ffd58a",
    distance: 13,
    id: "gallery-light-south",
    intensity: 12,
    position: [0, 2.7, 6],
  },
  {
    color: "#ffc96b",
    distance: 13,
    id: "gallery-light-north",
    intensity: 12,
    position: [0, 2.7, -6],
  },
  {
    color: "#65e7ff",
    distance: 10,
    id: "archive-light",
    intensity: 14,
    position: [-7, 2.65, 0],
  },
  {
    color: "#ff55dd",
    distance: 8,
    id: "workshop-light-magenta",
    intensity: 11,
    position: [6, 2.65, -1.5],
  },
  {
    color: "#f8f04f",
    distance: 8,
    id: "workshop-light-yellow",
    intensity: 10,
    position: [8, 2.65, 1.5],
  },
  {
    color: "#ff72cb",
    distance: 8,
    id: "photo-studio-light",
    intensity: 13,
    position: [-6.4, 2.65, 7.5],
  },
  {
    color: "#6fffd2",
    distance: 5,
    id: "hidden-photo-room-light",
    intensity: 8,
    position: [-10.1, 2.35, 7.5],
  },
  {
    color: "#54d8ff",
    distance: 10,
    id: "basement-light",
    intensity: 7,
    position: [0, -0.2, -17],
  },
] as const satisfies readonly WorldLight[];

export const worldDoors = [
  {
    color: "#b98f42",
    id: "archive-door",
    openPosition: [-4, 1.2, 3],
    position: [-4, 1.2, 0],
  },
  {
    color: "#b9a63f",
    id: "workshop-door",
    openPosition: [4, 1.2, 3],
    position: [4, 1.2, 0],
  },
] as const satisfies readonly WorldDoor[];

export const trapdoorPosition = [0, 0.04, -9] as const;

export const photoWallX = -8.66;
export const photoCameraPosition = [photoWallX + 1.5, 0, 7.5] as const;
export const photoCameraRotation = [0, -Math.PI / 2, 0] as const;
export const photoLensPosition = [
  photoCameraPosition[0] - 0.57,
  1.38,
  7.5,
] as const;
export const cameraBatteryPosition = [-8.5, 0.82, 3.25] as const;
export const looseCameraPosition = [5.65, 0.85, -2.75] as const;
export const tripodCupboardPosition = [-9.35, 0, -3.25] as const;

export const cameraInteraction = {
  action: { type: "pick-up-item", itemId: "camera" },
  id: "workshop-camera",
  label: "Plukk opp kameraet",
  position: looseCameraPosition,
} as const satisfies WorldInteraction;

export const batteryInteraction = {
  action: { type: "pick-up-item", itemId: "camera-battery" },
  id: "archive-camera-battery",
  label: "Plukk opp kamerabatteriet",
  position: cameraBatteryPosition,
} as const satisfies WorldInteraction;

export const tripodInteraction = {
  action: { type: "pick-up-item", itemId: "tripod" },
  id: "archive-tripod-cupboard",
  label: "Åpne skapet og plukk opp det sammenpakkede stativet",
  position: [-9.35, 1, -2.65],
} as const satisfies WorldInteraction;

export const photoInteraction = {
  action: { type: "start-photo", puzzleId: "photo-timer" },
  id: "photo-studio-camera",
  label: "Start kameraets 5-sekunders timer",
  position: [photoCameraPosition[0] - 0.05, 1.63, 7.74],
} as const satisfies WorldInteraction;

export const danceInteraction = {
  action: { type: "open-puzzle", puzzleId: "just-dance-wasd" },
  id: "workshop-dance-console",
  label: "Start WiiMonday",
  position: [8.15, 1.15, 0],
} as const satisfies WorldInteraction;

export const cornChaseInteraction = {
  action: { type: "open-puzzle", puzzleId: "corn-chase" },
  id: "gallery-corn-arcade",
  label: "Start Maisjakten",
  position: [2, 1.2, -8.55],
} as const satisfies WorldInteraction;

export const cornArcadeSocketInteraction = {
  action: { type: "plug-corn-arcade" },
  id: "gallery-corn-arcade-socket",
  label: "Plugg Maisjakten i veggen",
  position: [3.2, 1.15, -10.25],
} as const satisfies WorldInteraction;

export const roomFoods = [
  { id: "food-lasagne", label: "Spis lasagne", position: [1.2, 0.55, 8.2] },
  { id: "food-pizza", label: "Spis pizza", position: [-1.5, 0.55, 6.5] },
  { id: "food-burger", label: "Spis burger", position: [2.2, 0.55, 4.6] },
  { id: "food-taco", label: "Spis taco", position: [-2.2, 0.55, 2.2] },
  { id: "food-donut", label: "Spis smultring", position: [1.7, 0.55, 0.5] },
  { id: "food-cake", label: "Spis kake", position: [6.2, 0.55, -2.4] },
  { id: "food-fries", label: "Spis pommes frites", position: [8.5, 0.55, 2.2] },
  { id: "food-sushi", label: "Spis sushi", position: [-6.4, 0.55, -2.5] },
  { id: "food-waffle", label: "Spis vaffel", position: [-8.2, 0.55, 1.8] },
  { id: "food-icecream", label: "Spis iskrem", position: [-6.4, 0.55, 7.2] },
  { id: "food-burrito", label: "Spis burrito", position: [5.8, 0.55, -0.8] },
  { id: "food-pancake", label: "Spis pannekake", position: [-2.6, 0.55, 8.4] },
] as const;

export const foodInteractions = roomFoods.map(({ id, label, position }) => ({
  action: { foodId: id, type: "eat-food" as const },
  id,
  label,
  position,
})) satisfies readonly WorldInteraction[];

export const captchaInteraction = {
  action: { type: "open-puzzle", puzzleId: "vase-captcha" },
  id: "archive-captcha-terminal",
  label: "Start vasekontrollen",
  position: [-9.35, 1.35, 0],
} as const satisfies WorldInteraction;

export const hiddenRoomSwitchInteraction = {
  action: {
    switchId: "hidden-photo-switch",
    type: "toggle-wall-switch",
  },
  id: "hidden-photo-room-wall-toggle",
  label: "Slå på veggbryteren",
  position: [-11.02, 1.3, 7.5],
} as const satisfies WorldInteraction;

export const longboiPhotoHookInteraction = {
  action: { type: "hang-longboi-photo" },
  id: "gallery-longboi-photo-hook",
  label: "Undersøk bildekroken",
  position: [-1.6, 1.6, 10.5],
} as const satisfies WorldInteraction;

export const cipherPlaqueInteraction = {
  action: { type: "inspect-cipher-plaque" },
  id: "archive-cipher-bust-plaque",
  label: "Les plaketten under bysten",
  position: [-5.25, 0.65, 2.65],
} as const satisfies WorldInteraction;

export const laserPanelInteraction = {
  action: { type: "open-laser-panel" },
  id: "gallery-laser-panel",
  label: "Bruk laserpanelet",
  position: [3.55, 1.35, -4.4],
} as const satisfies WorldInteraction;

export const mirrorPickups = [
  {
    action: { itemId: "mirror-1", type: "pick-up-item" },
    id: "archive-mirror",
    label: "Plukk opp det runde speilet",
    position: [-8.7, 0.72, -3.05],
  },
  {
    action: { itemId: "mirror-2", type: "pick-up-item" },
    id: "workshop-mirror",
    label: "Plukk opp det firkantede speilet",
    position: [8.65, 0.72, 3.05],
  },
  {
    action: { itemId: "mirror-3", type: "pick-up-item" },
    id: "studio-mirror",
    label: "Plukk opp det høye speilet",
    position: [-7.8, 0.72, 8.7],
  },
] as const satisfies readonly WorldInteraction[];

export const mirrorSocketInteractions = [
  {
    action: { itemId: "mirror-1", type: "place-or-rotate-mirror" },
    id: "gallery-mirror-socket",
    label: "Plasser speil 1 i sokkelen",
    position: [0.8, 1.15, -5],
  },
  {
    action: { itemId: "mirror-2", type: "place-or-rotate-mirror" },
    id: "trapdoor-mirror-socket",
    label: "Plasser speil 2 ved lemmen",
    position: [-0.8, 1.15, -7.3],
  },
  {
    action: { itemId: "mirror-3", type: "place-or-rotate-mirror" },
    id: "basement-mirror-socket",
    label: "Plasser speil 3 i kjelleren",
    position: [1.9, -2.35, -14.6],
  },
] as const satisfies readonly WorldInteraction[];

export const pepsiInteraction = {
  action: { type: "collect-pepsi" },
  id: "basement-pepsi-max",
  label: "Ta Pepsi Max fra kisten",
  position: [0, -2.3, -19.2],
} as const satisfies WorldInteraction;

export const worldInteractions = [
  {
    action: { type: "open-door", doorId: "archive-door" },
    id: "open-archive-door",
    label: "Åpne døren til Memory Archive",
    position: [-3.75, 1.2, 0],
  },
  {
    action: { type: "open-door", doorId: "workshop-door" },
    id: "open-workshop-door",
    label: "Åpne døren til Oddities Workshop",
    position: [3.75, 1.2, 0],
  },
  {
    action: { type: "open-trapdoor-lock" },
    id: "open-basement-trapdoor",
    label: "Undersøk kodelåsen på kjellerlemmen",
    position: [0, 0.35, -7.25],
  },
  captchaInteraction,
  batteryInteraction,
  tripodInteraction,
  cameraInteraction,
  danceInteraction,
  cornChaseInteraction,
  cornArcadeSocketInteraction,
  photoInteraction,
  hiddenRoomSwitchInteraction,
  longboiPhotoHookInteraction,
  cipherPlaqueInteraction,
  laserPanelInteraction,
  ...mirrorPickups,
  ...mirrorSocketInteractions,
  pepsiInteraction,
  ...foodInteractions,
] as const satisfies readonly WorldInteraction[];

export const getAreaAtPosition = (x: number, z: number): AreaId => {
  const matchingArea = worldAreas.find(
    ({ bounds }) =>
      x >= bounds.minX &&
      x <= bounds.maxX &&
      z >= bounds.minZ &&
      z <= bounds.maxZ,
  );

  return matchingArea?.id ?? defaultAreaId;
};

export const getArea = (areaId: AreaId) =>
  worldAreas.find(({ id }) => id === areaId) ?? worldAreas[0];
