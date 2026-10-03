export type EscapeRoomSupportReason =
  "mobile" | "reduced-motion" | "webgl-unavailable";

export type EscapeRoomCapabilities = {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  webglAvailable: boolean;
};

export type EscapeRoomSupport =
  { supported: true } | { reason: EscapeRoomSupportReason; supported: false };

export const getEscapeRoomSupport = ({
  isMobile,
  prefersReducedMotion,
  webglAvailable,
}: EscapeRoomCapabilities): EscapeRoomSupport => {
  if (isMobile) return { reason: "mobile", supported: false };
  if (prefersReducedMotion) {
    return { reason: "reduced-motion", supported: false };
  }
  if (!webglAvailable) {
    return { reason: "webgl-unavailable", supported: false };
  }

  return { supported: true };
};

export const detectMobileDevice = () => {
  const mobileUserAgent = /Android|iPad|iPhone|iPod|IEMobile|Mobile/i.test(
    navigator.userAgent,
  );
  const ipadDesktopMode =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return mobileUserAgent || ipadDesktopMode;
};

export const detectWebGl2Support = () => {
  try {
    const canvas = document.createElement("canvas");
    return canvas.getContext("webgl2") !== null;
  } catch {
    return false;
  }
};
