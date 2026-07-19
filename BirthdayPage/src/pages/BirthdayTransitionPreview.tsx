import { useEffect, useState } from "react";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import BirthdayPreviewControls from "../components/preview/BirthdayPreviewControls";
import BirthdayPageView from "./BirthdayPageView";

const previewDurationMs = 5_000;

const BirthdayTransitionPreview = () => {
  const [targetDate, setTargetDate] = useState(
    () => Date.now() + previewDurationMs,
  );
  const [isBirthday, setIsBirthday] = useState(false);
  const [fireworksRenderer, setFireworksRenderer] =
    useState<FireworksRenderer>("custom");

  useEffect(() => {
    if (isBirthday) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setIsBirthday(true);
      },
      Math.max(0, targetDate - Date.now()),
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isBirthday, targetDate]);

  const restartCountdown = () => {
    setTargetDate(Date.now() + previewDurationMs);
    setIsBirthday(false);
  };

  return (
    <>
      <BirthdayPageView
        fireworksRenderer={fireworksRenderer}
        isBirthday={isBirthday}
        targetDate={targetDate}
      />
      <BirthdayPreviewControls
        fireworksRenderer={fireworksRenderer}
        isBirthday={isBirthday}
        onFireworksRendererChange={setFireworksRenderer}
        onRestartCountdown={restartCountdown}
        onShowBirthday={() => {
          setIsBirthday(true);
        }}
      />
    </>
  );
};

export default BirthdayTransitionPreview;
