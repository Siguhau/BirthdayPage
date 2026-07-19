import { birthdayConfig } from "../birthdayConfig";
import BirthdayPage from "./BirthdayPage";
import CountdownPage from "./CountdownPage";

type BirthdayPageViewProps = {
  isBirthday: boolean;
  targetDate: Date | number | string;
};

const BirthdayPageView = ({ isBirthday, targetDate }: BirthdayPageViewProps) =>
  isBirthday ? (
    <BirthdayPage
      locale={birthdayConfig.locale}
      userName={birthdayConfig.displayName}
    />
  ) : (
    <CountdownPage
      locale={birthdayConfig.locale}
      targetDate={targetDate}
      userName={birthdayConfig.displayName}
    />
  );

export default BirthdayPageView;
