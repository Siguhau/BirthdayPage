export const dancePattern = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyW",
  "KeyD",
  "KeyS",
  "KeyA",
  "KeyW",
  "KeyS",
  "KeyD",
  "KeyA",
] as const;

export type DanceKey = (typeof dancePattern)[number];

export const danceBeatDurationMs = 1_000;
