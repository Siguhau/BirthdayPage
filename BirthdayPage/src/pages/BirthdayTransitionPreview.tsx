import { useEffect, useState } from "react";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import BirthdayPreviewControls from "../components/preview/BirthdayPreviewControls";
import { useTheme } from "../theme/useTheme";
import BirthdayPageView from "./BirthdayPageView";
import type { BirthdayExperiencePage } from "./birthdayExperiencePage";

const previewDurationMs = 10_000;

const BirthdayTransitionPreview = () => {
  const [targetDate, setTargetDate] = useState(
    () => Date.now() + previewDurationMs,
  );
  const [page, setPage] = useState<BirthdayExperiencePage>("countdown");
  const [transitionThroughDoor, setTransitionThroughDoor] = useState(true);
  const [fireworksRenderer, setFireworksRenderer] =
    useState<FireworksRenderer>("combined");
  const { setTheme } = useTheme();

  useEffect(() => {
    if (page !== "countdown") {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setPage("escape-room");
        setTheme("escape-room");
      },
      Math.max(0, targetDate - Date.now()),
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [page, setTheme, targetDate]);

  const restartCountdown = () => {
    setTransitionThroughDoor(true);
    setTargetDate(Date.now() + previewDurationMs);
    setPage("countdown");
  };

  return (
    <>
      <BirthdayPageView
        transitionThroughDoor={transitionThroughDoor}
        fireworksRenderer={fireworksRenderer}
        onEscapeRoomComplete={() => {
          setPage("birthday");
          setTheme("escape-room");
        }}
        page={page}
        targetDate={targetDate}
      />
      <BirthdayPreviewControls
        fireworksRenderer={fireworksRenderer}
        page={page}
        onFireworksRendererChange={setFireworksRenderer}
        onRestartCountdown={restartCountdown}
        onShowBirthday={() => {
          setPage("birthday");
          setTheme("escape-room");
        }}
        onShowEscapeRoom={() => {
          setTransitionThroughDoor(false);
          setPage("escape-room");
          setTheme("escape-room");
        }}
      />
    </>
  );
};

export default BirthdayTransitionPreview;
