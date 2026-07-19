import { birthdayConfig } from "../birthdayConfig";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import BirthdayPage from "./BirthdayPage";
import CountdownPage from "./CountdownPage";

type BirthdayPageViewProps = {
  fireworksRenderer?: FireworksRenderer;
  isBirthday: boolean;
  targetDate: Date | number | string;
};

const BirthdayPageView = ({
  fireworksRenderer,
  isBirthday,
  targetDate,
}: BirthdayPageViewProps) =>
  isBirthday ? (
    <BirthdayPage
      fireworksRenderer={fireworksRenderer}
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
