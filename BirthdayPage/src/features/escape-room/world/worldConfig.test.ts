import { describe, expect, it } from "vitest";
import {
  getArea,
  getAreaAtPosition,
  basementLadderClimbBounds,
  basementLadderPosition,
  photoCameraPosition,
  photoWallX,
  trapdoorPosition,
  worldAreas,
  worldCeilings,
  worldDoors,
  worldGravity,
  worldInteractions,
  worldLights,
  worldWalls,
} from "./worldConfig";

describe("worldConfig", () => {
  it("uses unique area IDs", () => {
    const ids = worldAreas.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("selects the configured area from a world position", () => {
    expect(getAreaAtPosition(0, 0)).toBe("memory-gallery");
    expect(getAreaAtPosition(-7, 0)).toBe("memory-archive");
    expect(getAreaAtPosition(7, 0)).toBe("oddities-workshop");
  });

  it("returns the area-specific interface theme", () => {
    expect(getArea("oddities-workshop").theme.accent).toBe("#fff34f");
  });

  it("configures two sliding doors and a separate basement trapdoor", () => {
    const doorIds = worldDoors.map(({ id }) => id);
    const doorInteractionIds = worldInteractions
      .filter(({ action }) => action.type === "open-door")
      .map(({ action }) =>
        action.type === "open-door" ? action.doorId : undefined,
      );

    expect(new Set(doorIds)).toEqual(
      new Set(["archive-door", "workshop-door"]),
    );
    expect(new Set(doorInteractionIds)).toEqual(
      new Set(["archive-door", "workshop-door"]),
    );
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "open-trapdoor-lock" },
        id: "open-basement-trapdoor",
      }),
    );
  });

  it("encloses and lights every configured area", () => {
    expect(worldCeilings).toHaveLength(worldAreas.length);
    expect(worldLights.length).toBeGreaterThanOrEqual(worldAreas.length);
  });

  it("uses Earth gravity in meters per second squared", () => {
    expect(worldGravity).toEqual([0, -9.81, 0]);
  });

  it("places the photo camera 1.5 meters from the studio wall", () => {
    expect(photoCameraPosition[0] - photoWallX).toBeCloseTo(1.5);
    expect(photoCameraPosition[2]).toBe(7.5);
  });

  it("connects the camera shutter to the photo timer puzzle", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "start-photo", puzzleId: "photo-timer" },
        id: "photo-studio-camera",
      }),
    );
  });

  it("places a collectible camera battery in the archive", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "pick-up-item", itemId: "camera-battery" },
        id: "archive-camera-battery",
      }),
    );
  });

  it("places the collectible camera in the workshop", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "pick-up-item", itemId: "camera" },
        id: "workshop-camera",
      }),
    );
  });

  it("hides a collectible packed tripod in the archive cupboard", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "pick-up-item", itemId: "tripod" },
        id: "archive-tripod-cupboard",
      }),
    );
  });

  it("provides a typed wall toggle for a later hidden-room puzzle", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: {
          switchId: "hidden-photo-switch",
          type: "toggle-wall-switch",
        },
        id: "hidden-photo-room-wall-toggle",
      }),
    );
  });

  it("provides a main-gallery hook for a successful Longboi photo", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "hang-longboi-photo" },
        id: "gallery-longboi-photo-hook",
      }),
    );
  });

  it("makes the Caesar bust plaque inspectable in the archive", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "inspect-cipher-plaque" },
        id: "archive-cipher-bust-plaque",
      }),
    );
  });

  it("adds a distinct studio and a hidden 1 by 2 meter room", () => {
    expect(getAreaAtPosition(-6.5, 7.5)).toBe("photo-studio");
    expect(getAreaAtPosition(-10, 7.5)).toBe("hidden-photo-room");
    expect(
      worldAreas.find(({ id }) => id === "hidden-photo-room")?.bounds,
    ).toEqual({ maxX: -9, maxZ: 8, minX: -11, minZ: 7 });
    expect(getArea("hidden-photo-room").theme.background).toBe("#163f45");
    expect(
      worldWalls.find(({ id }) => id === "hidden-photo-room-north")
        ?.position[0],
    ).toBe(-10.1);
  });

  it("adds a lower basement with a door, laser panel, mirrors, and chest reward", () => {
    expect(getAreaAtPosition(0, -17)).toBe("basement");
    expect(worldInteractions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: { type: "open-laser-panel" } }),
        expect.objectContaining({
          action: { itemId: "mirror-1", type: "place-or-rotate-mirror" },
        }),
        expect.objectContaining({ action: { type: "collect-pepsi" } }),
      ]),
    );
  });

  it("uses a straight climbable ladder instead of basement stairs", () => {
    expect(basementLadderPosition).toEqual([0, -1.45, -7.82]);
    expect(basementLadderClimbBounds).toMatchObject({
      maxY: 0.95,
      minY: -2.45,
    });
    expect(worldWalls.some(({ id }) => id.includes("stairwell"))).toBe(false);
  });

  it("places the carpeted trapdoor over the gallery floor opening", () => {
    expect(trapdoorPosition).toEqual([0, 0.04, -9]);
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "open-trapdoor-lock" },
        id: "open-basement-trapdoor",
      }),
    );
  });

  it("closes the old stair opening with a continuous basement wall", () => {
    const entranceWalls = worldWalls.filter(({ id }) =>
      id.startsWith("basement-south"),
    );

    expect(entranceWalls).toEqual([
      expect.objectContaining({
        id: "basement-south",
        position: [0, -1.5, -7.5],
        size: [8, 3.5, 0.65],
      }),
    ]);
  });

  it("connects the archive terminal to the captcha puzzle", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "open-puzzle", puzzleId: "vase-captcha" },
        id: "archive-captcha-terminal",
      }),
    );
  });

  it("connects the workshop console to the dance puzzle", () => {
    expect(worldInteractions).toContainEqual(
      expect.objectContaining({
        action: { type: "open-puzzle", puzzleId: "just-dance-wasd" },
        id: "workshop-dance-console",
      }),
    );
  });
});
