import { useEffect, useState } from "react";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import BirthdayPreviewControls from "../components/preview/BirthdayPreviewControls";
import { useTheme } from "../theme/useTheme";
import BirthdayPageView from "./BirthdayPageView";
import type { BirthdayExperiencePage } from "./birthdayExperiencePage";

const previewDurationMs = 5_000;

const BirthdayTransitionPreview = () => {
  const [targetDate, setTargetDate] = useState(
    () => Date.now() + previewDurationMs,
  );
  const [page, setPage] = useState<BirthdayExperiencePage>("countdown");
  const [fireworksRenderer, setFireworksRenderer] =
    useState<FireworksRenderer>("custom");
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
    setTargetDate(Date.now() + previewDurationMs);
    setPage("countdown");
    setTheme("birthday");
  };

  return (
    <>
      <BirthdayPageView
        fireworksRenderer={fireworksRenderer}
        onEscapeRoomComplete={() => {
          setPage("birthday");
          setTheme("birthday");
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
          setTheme("birthday");
        }}
        onShowEscapeRoom={() => {
          setPage("escape-room");
          setTheme("escape-room");
        }}
      />
    </>
  );
};

export default BirthdayTransitionPreview;
