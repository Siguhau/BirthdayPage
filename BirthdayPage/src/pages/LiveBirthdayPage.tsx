import { useEffect, useState } from "react";
import { birthdayConfig } from "../birthdayConfig";
import { useBirthdayChecker } from "../utils/useBirthdayChecker";
import { getNextValidBirthday } from "../utils/birthdayDate";
import BirthdayPageView from "./BirthdayPageView";

const zeroCountdownDurationMs = 1_000;

const LiveBirthdayPage = () => {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [birthdayCountdownComplete, setBirthdayCountdownComplete] =
    useState(false);
  const nextBirthday = getNextValidBirthday(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );
  const isBirthday = useBirthdayChecker(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );

  useEffect(() => {
    if (!isBirthday) return;

    // Keep zero visible before opening the door, including on a fresh visit.
    const timeout = window.setTimeout(() => {
      setBirthdayCountdownComplete(true);
    }, zeroCountdownDurationMs);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isBirthday]);

  const page =
    !isBirthday || !birthdayCountdownComplete
      ? "countdown"
      : gameCompleted
        ? "birthday"
        : "escape-room";

  return (
    <BirthdayPageView
      onEscapeRoomComplete={() => {
        setGameCompleted(true);
      }}
      page={page}
      targetDate={nextBirthday}
    />
  );
};

export default LiveBirthdayPage;
