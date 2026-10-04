import { photoPoseLimits, type PhotoPoseResult } from "./photoPose";

export const precisePhotoHintFailureThreshold = 7;

type HintCandidate = {
  precise: string;
  severity: number;
  simple: string;
};

export const getPhotoFailureHint = (
  result: PhotoPoseResult,
  failureCount: number,
) => {
  const candidates: HintCandidate[] = [];
  const distanceRange =
    photoPoseLimits.maximumDistance - photoPoseLimits.minimumDistance;
  const pitchRange =
    photoPoseLimits.maximumPitch - photoPoseLimits.minimumPitch;

  if (result.distance > photoPoseLimits.maximumDistance) {
    candidates.push({
      precise:
        `Stod for langt unna kameraet. Avstanden var ` +
        `${result.distance.toFixed(2)} m; målet er ` +
        `${photoPoseLimits.minimumDistance.toFixed(2)}–` +
        `${photoPoseLimits.maximumDistance.toFixed(2)} m.`,
      severity:
        (result.distance - photoPoseLimits.maximumDistance) / distanceRange,
      simple: "Stod for langt unna kameraet",
    });
  }

  if (result.distance < photoPoseLimits.minimumDistance) {
    candidates.push({
      precise:
        `Jeg stod kanskje litt for nær kameraet. Avstanden var ` +
        `${result.distance.toFixed(2)} m; målet er ` +
        `${photoPoseLimits.minimumDistance.toFixed(2)}–` +
        `${photoPoseLimits.maximumDistance.toFixed(2)} m.`,
      severity:
        (photoPoseLimits.minimumDistance - result.distance) /
        photoPoseLimits.minimumDistance,
      simple: "Jeg stod kanskje litt for nær kameraet.",
    });
  }

  if (result.pitch < photoPoseLimits.minimumPitch) {
    candidates.push({
      precise:
        `Næh, det ble for rett på. Jeg så ${result.pitch.toFixed(0)}° opp; ` +
        `målet er ${String(photoPoseLimits.minimumPitch)}–` +
        `${String(photoPoseLimits.maximumPitch)}°.`,
      severity: (photoPoseLimits.minimumPitch - result.pitch) / pitchRange,
      simple: "Næh, det ble for rett på",
    });
  }

  if (result.pitch > photoPoseLimits.maximumPitch) {
    candidates.push({
      precise:
        `Jeg lente meg kanskje litt langt bak. Jeg så ` +
        `${result.pitch.toFixed(0)}° opp; målet er ` +
        `${String(photoPoseLimits.minimumPitch)}–` +
        `${String(photoPoseLimits.maximumPitch)}°.`,
      severity: (result.pitch - photoPoseLimits.maximumPitch) / pitchRange,
      simple: "Jeg lente meg kanskje litt langt bak.",
    });
  }

  if (result.horizontalAngle > photoPoseLimits.maximumHorizontalAngle) {
    candidates.push({
      precise:
        `Jeg så litt for mye til siden. Vinkelen var ` +
        `${result.horizontalAngle.toFixed(0)}°; målet er maks ` +
        `${String(photoPoseLimits.maximumHorizontalAngle)}°.`,
      severity:
        (result.horizontalAngle - photoPoseLimits.maximumHorizontalAngle) /
        photoPoseLimits.maximumHorizontalAngle,
      simple: "Jeg så litt for mye til siden",
    });
  }

  const strongestHint = candidates.reduce<HintCandidate | null>(
    (strongest, candidate) =>
      strongest === null || candidate.severity > strongest.severity
        ? candidate
        : strongest,
    null,
  );

  if (strongestHint === null) {
    return "Næh, det ble for rett på";
  }

  return failureCount >= precisePhotoHintFailureThreshold
    ? strongestHint.precise
    : strongestHint.simple;
};
