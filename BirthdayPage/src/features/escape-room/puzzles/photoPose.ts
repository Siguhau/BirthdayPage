export const photoPoseLimits = {
  maximumDistance: 0.6,
  maximumHorizontalAngle: 20,
  maximumPitch: 70,
  minimumDistance: 0.1,
  minimumPitch: 40,
} as const;

type VectorTuple = readonly [number, number, number];

export type PhotoPoseResult = {
  distance: number;
  horizontalAngle: number;
  pitch: number;
  success: boolean;
};

const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;
const clamp = (value: number) => Math.min(1, Math.max(-1, value));

export const evaluatePhotoPose = ({
  lensPosition,
  lookDirection,
  playerPosition,
}: {
  lensPosition: VectorTuple;
  lookDirection: VectorTuple;
  playerPosition: VectorTuple;
}): PhotoPoseResult => {
  const toLens = [
    lensPosition[0] - playerPosition[0],
    lensPosition[1] - playerPosition[1],
    lensPosition[2] - playerPosition[2],
  ] as const;
  const distance = Math.hypot(...toLens);
  const lookLength = Math.hypot(...lookDirection);
  const pitch =
    lookLength === 0
      ? 0
      : radiansToDegrees(Math.asin(clamp(lookDirection[1] / lookLength)));

  const horizontalLookLength = Math.hypot(lookDirection[0], lookDirection[2]);
  const horizontalLensLength = Math.hypot(toLens[0], toLens[2]);
  const horizontalAngle =
    horizontalLookLength === 0 || horizontalLensLength === 0
      ? 180
      : radiansToDegrees(
          Math.acos(
            clamp(
              (lookDirection[0] * toLens[0] + lookDirection[2] * toLens[2]) /
                (horizontalLookLength * horizontalLensLength),
            ),
          ),
        );

  return {
    distance,
    horizontalAngle,
    pitch,
    success:
      distance >= photoPoseLimits.minimumDistance &&
      distance <= photoPoseLimits.maximumDistance &&
      pitch >= photoPoseLimits.minimumPitch &&
      pitch <= photoPoseLimits.maximumPitch &&
      horizontalAngle <= photoPoseLimits.maximumHorizontalAngle,
  };
};
