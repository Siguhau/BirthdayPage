import { useMemo } from "react";
import usePrefersReducedMotion from "../../../utils/usePrefersReducedMotion";
import {
  detectMobileDevice,
  detectWebGl2Support,
  getEscapeRoomSupport,
} from "./escapeRoomSupport";

const useEscapeRoomSupport = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return useMemo(
    () =>
      getEscapeRoomSupport({
        isMobile: detectMobileDevice(),
        prefersReducedMotion,
        webglAvailable: detectWebGl2Support(),
      }),
    [prefersReducedMotion],
  );
};

export default useEscapeRoomSupport;
