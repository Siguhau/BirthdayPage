import { describe, expect, it } from "vitest";
import { getPhotoFailureHint } from "./photoFailureHint";
import type { PhotoPoseResult } from "./photoPose";

const failedResult = (
  overrides: Partial<PhotoPoseResult>,
): PhotoPoseResult => ({
  distance: 0.3,
  horizontalAngle: 0,
  pitch: 50,
  success: false,
  ...overrides,
});

describe("getPhotoFailureHint", () => {
  it.each([
    [{ pitch: 30 }, "Næh, det ble for rett på"],
    [{ distance: 0.8 }, "Stod for langt unna kameraet"],
    [{ pitch: 80 }, "Jeg lente meg kanskje litt langt bak."],
    [{ horizontalAngle: 35 }, "Jeg så litt for mye til siden"],
  ])("uses a natural hint for the relevant error", (overrides, expected) => {
    expect(getPhotoFailureHint(failedResult(overrides), 1)).toBe(expected);
  });

  it("does not reveal degrees during the first six failures", () => {
    const result = failedResult({ horizontalAngle: 35 });

    expect(getPhotoFailureHint(result, 6)).not.toContain("°");
  });

  it("adds precise measurements from the seventh failure", () => {
    const result = failedResult({ horizontalAngle: 35 });
    const hint = getPhotoFailureHint(result, 7);

    expect(hint).toContain("35°");
    expect(hint).toContain("maks 20°");
  });
});
