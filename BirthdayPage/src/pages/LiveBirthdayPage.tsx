import { birthdayConfig } from "../birthdayConfig";
import { useBirthdayChecker } from "../utils/useBirthdayChecker";
import { getNextValidBirthday } from "../utils/birthdayDate";
import BirthdayPageView from "./BirthdayPageView";

const LiveBirthdayPage = () => {
  const nextBirthday = getNextValidBirthday(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );
  const isBirthday = useBirthdayChecker(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );

  return <BirthdayPageView isBirthday={isBirthday} targetDate={nextBirthday} />;
};

export default LiveBirthdayPage;
