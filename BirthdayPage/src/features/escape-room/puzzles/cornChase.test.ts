import { describe, expect, it } from "vitest";
import {
  cornChaseLevels,
  hasEscapedCorn,
  isCaughtByCorn,
  moveCornTowardsPlayer,
  moveInMaze,
  type MazeDirection,
  type MazePosition,
} from "./cornChase";

const routes: readonly (readonly MazeDirection[])[] = [
  [
    "right",
    "right",
    "right",
    "right",
    "right",
    "right",
    "right",
    "right",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
  ],
  [
    "left",
    "left",
    "left",
    "left",
    "left",
    "left",
    "left",
    "left",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
  ],
  [
    "left",
    "left",
    "left",
    "left",
    "left",
    "left",
    "left",
    "left",
    "down",
    "down",
    "down",
    "down",
    "down",
    "down",
    "down",
    "down",
  ],
];

describe("corn chase levels", () => {
  it("keeps the player inside maze walls", () => {
    expect(
      moveInMaze(cornChaseLevels[0], cornChaseLevels[0].playerStart, "left"),
    ).toEqual(cornChaseLevels[0].playerStart);
  });

  it("moves the corn one walkable step toward Runar", () => {
    expect(
      moveCornTowardsPlayer(
        cornChaseLevels[0],
        cornChaseLevels[0].cornStarts[0],
        cornChaseLevels[0].playerStart,
      ),
    ).toEqual({ column: 6, row: 3 });
  });

  it("has a verified escape route for every level", () => {
    cornChaseLevels.forEach((level, index) => {
      let player: MazePosition = level.playerStart;
      let corns: readonly MazePosition[] = level.cornStarts;
      routes[index].forEach((direction) => {
        player = moveInMaze(level, player, direction);
        corns = corns.map((corn) => moveCornTowardsPlayer(level, corn, player));
        expect(
          corns.some((corn) => isCaughtByCorn(player, corn)),
          level.id,
        ).toBe(false);
      });
      expect(hasEscapedCorn(level, player)).toBe(true);
    });
  });
});
