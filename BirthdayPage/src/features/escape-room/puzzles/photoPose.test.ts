import { describe, expect, it } from "vitest";
import { evaluatePhotoPose } from "./photoPose";

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

const lookDirection = (pitch: number, yaw: number) => {
  const pitchRadians = degreesToRadians(pitch);
  const yawRadians = degreesToRadians(yaw);

  return [
    Math.sin(yawRadians) * Math.cos(pitchRadians),
    Math.sin(pitchRadians),
    -Math.cos(yawRadians) * Math.cos(pitchRadians),
  ] as const;
};

describe("evaluatePhotoPose", () => {
  it("accepts a player close to the lens looking upward and toward it", () => {
    const result = evaluatePhotoPose({
      lensPosition: [0, 1.38, -8.43],
      lookDirection: lookDirection(50, 0),
      playerPosition: [0, 1.55, -8.18],
    });

    expect(result.success).toBe(true);
    expect(result.distance).toBeCloseTo(0.3);
    expect(result.pitch).toBeCloseTo(50);
    expect(result.horizontalAngle).toBeCloseTo(0);
  });

  it("rejects a horizontal angle outside the twenty-degree tolerance", () => {
    const result = evaluatePhotoPose({
      lensPosition: [0, 1.58, -8.43],
      lookDirection: lookDirection(50, 25),
      playerPosition: [0, 1.58, -8.18],
    });

    expect(result.success).toBe(false);
    expect(result.horizontalAngle).toBeCloseTo(25);
  });

  it("accepts the extended distance up to sixty centimeters", () => {
    const result = evaluatePhotoPose({
      lensPosition: [0, 1.38, -8.43],
      lookDirection: lookDirection(50, 0),
      playerPosition: [0, 1.38, -7.88],
    });

    expect(result.success).toBe(true);
    expect(result.distance).toBeCloseTo(0.55);
  });

  it("rejects a player outside the distance and pitch ranges", () => {
    const result = evaluatePhotoPose({
      lensPosition: [0, 1.58, -8.43],
      lookDirection: lookDirection(30, 0),
      playerPosition: [0, 1.58, -7.73],
    });

    expect(result.success).toBe(false);
    expect(result.distance).toBeCloseTo(0.7);
    expect(result.pitch).toBeCloseTo(30);
  });
});
