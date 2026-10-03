import { describe, expect, it } from "vitest";
import { getLaserProgress, rotateMirror } from "./laserPuzzle";
import { initialGameState } from "../state/gameTypes";

describe("laserPuzzle", () => {
  it("draws only the beam segments backed by correctly placed mirrors", () => {
    const firstAligned = rotateMirror(
      initialGameState.mirrorOrientations,
      "mirror-1",
    );

    expect(
      getLaserProgress({
        installedItems: ["mirror-1", "mirror-2", "mirror-3"],
        laserPowered: true,
        mirrorOrientations: firstAligned,
      }),
    ).toBe(2);
  });

  it("shows no beam while the wall laser is off", () => {
    expect(
      getLaserProgress({
        installedItems: ["mirror-1", "mirror-2", "mirror-3"],
        laserPowered: false,
        mirrorOrientations: {
          "mirror-1": 1,
          "mirror-2": 3,
          "mirror-3": 2,
        },
      }),
    ).toBe(0);
  });
});
