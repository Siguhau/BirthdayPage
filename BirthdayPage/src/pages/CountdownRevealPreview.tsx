import { useEffect, useState } from "react";
import { birthdayConfig } from "../birthdayConfig";
import { getNextValidBirthday } from "../utils/birthdayDate";
import BirthdayPageView from "./BirthdayPageView";
import type { BirthdayExperiencePage } from "./birthdayExperiencePage";
import PreviewControlsPanel from "../components/preview/PreviewControlsPanel";

const CountdownRevealPreview = () => {
  const [replay, setReplay] = useState(0);
  const [targetDate, setTargetDate] = useState<Date | number>(() =>
    getNextValidBirthday(birthdayConfig.birthday, birthdayConfig.timeZone),
  );
  const [ending, setEnding] = useState(false);
  const [page, setPage] = useState<BirthdayExperiencePage>("countdown");

  useEffect(() => {
    if (!ending || page !== "countdown") return;
    const timeout = window.setTimeout(
      () => {
        setPage("escape-room");
      },
      Math.max(0, new Date(targetDate).getTime() - Date.now()),
    );
    return () => {
      window.clearTimeout(timeout);
    };
  }, [ending, page, targetDate]);

  return (
    <>
      <BirthdayPageView
        replayThemeTransition={replay > 0}
        key={replay}
        onEscapeRoomComplete={() => {
          setPage("birthday");
        }}
        page={page}
        targetDate={targetDate}
      />
      <PreviewControlsPanel>
        <button
          className="birthday-preview-controls__button"
          onClick={() => {
            setEnding(false);
            setPage("countdown");
            setTargetDate(
              getNextValidBirthday(
                birthdayConfig.birthday,
                birthdayConfig.timeZone,
              ),
            );
            setReplay((value) => value + 1);
          }}
          type="button"
        >
          Replay the reveal
        </button>
        <button
          className="birthday-preview-controls__button"
          disabled={ending}
          onClick={() => {
            setTargetDate(Date.now() + 10_000);
            setEnding(true);
          }}
          type="button"
        >
          Run final 10 seconds
        </button>
      </PreviewControlsPanel>
    </>
  );
};

export default CountdownRevealPreview;
