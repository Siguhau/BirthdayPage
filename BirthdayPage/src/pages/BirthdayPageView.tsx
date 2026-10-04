import { birthdayConfig } from "../birthdayConfig";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import BirthdayPage from "./BirthdayPage";
import CountdownPage from "./CountdownPage";
import EscapeRoomPage from "./EscapeRoomPage";
import type { BirthdayExperiencePage } from "./birthdayExperiencePage";
import usePrefersReducedMotion from "../utils/usePrefersReducedMotion";

const doorPassageDurationMs = 2_800;

type BirthdayPageViewProps = {
  replayThemeTransition?: boolean;
  transitionThroughDoor?: boolean;
  fireworksRenderer?: FireworksRenderer;
  onEscapeRoomComplete: () => void;
  page: BirthdayExperiencePage;
  targetDate: Date | number | string;
};

const BirthdayPageView = ({
  replayThemeTransition = false,
  transitionThroughDoor = true,
  fireworksRenderer,
  onEscapeRoomComplete,
  page,
  targetDate,
}: BirthdayPageViewProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const [transition, setTransition] = useState({
    requestedPage: page,
    departing: false,
    arrived: false,
    celebrating: false,
  });

  // Preserve the mounted countdown while crossing the threshold.
  // Preview navigation can still open a page immediately.
  if (transition.requestedPage !== page) {
    setTransition({
      requestedPage: page,
      departing:
        transition.requestedPage === "countdown" &&
        page === "escape-room" &&
        transitionThroughDoor &&
        !reducedMotion,
      arrived: false,
      celebrating:
        transition.requestedPage === "escape-room" && page === "birthday",
    });
  }

  useEffect(() => {
    if (!transition.departing) return;

    const timeout = window.setTimeout(() => {
      setTransition((current) => ({
        ...current,
        departing: false,
        arrived: true,
      }));
    }, doorPassageDurationMs);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [transition.departing]);

  const departing = transition.departing && !reducedMotion;

  switch (departing ? "countdown" : page) {
    case "birthday":
      return (
        <BirthdayPage
          enterFromGame={transition.celebrating}
          fireworksRenderer={fireworksRenderer}
          locale={birthdayConfig.locale}
          userName={birthdayConfig.displayName}
        />
      );
    case "escape-room":
      return (
        <div
          className={transition.arrived ? "birthday-door-arrival" : undefined}
        >
          <EscapeRoomPage
            locale={birthdayConfig.locale}
            onComplete={onEscapeRoomComplete}
            userName={birthdayConfig.displayName}
          />
        </div>
      );
    case "countdown":
      return (
        <CountdownPage
          replayThemeTransition={replayThemeTransition}
          departing={departing}
          locale={birthdayConfig.locale}
          targetDate={targetDate}
          userName={birthdayConfig.displayName}
        />
      );
  }
};

export default BirthdayPageView;
import { useEffect, useState } from "react";
