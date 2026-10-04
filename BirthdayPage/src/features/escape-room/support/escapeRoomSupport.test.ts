import { describe, expect, it } from "vitest";
import { getEscapeRoomSupport } from "./escapeRoomSupport";

describe("getEscapeRoomSupport", () => {
  it("supports a desktop with WebGL and standard motion", () => {
    expect(
      getEscapeRoomSupport({
        isMobile: false,
        prefersReducedMotion: false,
        webglAvailable: true,
      }),
    ).toEqual({ supported: true });
  });

  it.each([
    [
      "mobile",
      {
        isMobile: true,
        prefersReducedMotion: false,
        webglAvailable: true,
      },
    ],
    [
      "reduced-motion",
      {
        isMobile: false,
        prefersReducedMotion: true,
        webglAvailable: true,
      },
    ],
    [
      "webgl-unavailable",
      {
        isMobile: false,
        prefersReducedMotion: false,
        webglAvailable: false,
      },
    ],
  ] as const)("returns the %s explanation reason", (reason, capabilities) => {
    expect(getEscapeRoomSupport(capabilities)).toEqual({
      reason,
      supported: false,
    });
  });
});
