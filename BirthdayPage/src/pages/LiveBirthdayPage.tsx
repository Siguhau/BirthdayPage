import { useLayoutEffect, useState } from "react";
import { birthdayConfig } from "../birthdayConfig";
import { useTheme } from "../theme/useTheme";
import { useBirthdayChecker } from "../utils/useBirthdayChecker";
import { getNextValidBirthday } from "../utils/birthdayDate";
import BirthdayPageView from "./BirthdayPageView";

const LiveBirthdayPage = () => {
  const { setTheme } = useTheme();
  const [gameCompleted, setGameCompleted] = useState(false);
  const nextBirthday = getNextValidBirthday(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );
  const isBirthday = useBirthdayChecker(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );

  const page = !isBirthday
    ? "countdown"
    : gameCompleted
      ? "birthday"
      : "escape-room";

  useLayoutEffect(() => {
    setTheme(page === "escape-room" ? "escape-room" : "birthday");
  }, [page, setTheme]);

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
