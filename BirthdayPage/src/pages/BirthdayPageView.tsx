import { birthdayConfig } from "../birthdayConfig";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import BirthdayPage from "./BirthdayPage";
import CountdownPage from "./CountdownPage";
import EscapeRoomPage from "./EscapeRoomPage";
import type { BirthdayExperiencePage } from "./birthdayExperiencePage";

type BirthdayPageViewProps = {
  fireworksRenderer?: FireworksRenderer;
  onEscapeRoomComplete: () => void;
  page: BirthdayExperiencePage;
  targetDate: Date | number | string;
};

const BirthdayPageView = ({
  fireworksRenderer,
  onEscapeRoomComplete,
  page,
  targetDate,
}: BirthdayPageViewProps) => {
  switch (page) {
    case "birthday":
      return (
        <BirthdayPage
          fireworksRenderer={fireworksRenderer}
          locale={birthdayConfig.locale}
          userName={birthdayConfig.displayName}
        />
      );
    case "escape-room":
      return (
        <EscapeRoomPage
          locale={birthdayConfig.locale}
          onComplete={onEscapeRoomComplete}
          userName={birthdayConfig.displayName}
        />
      );
    case "countdown":
      return (
        <CountdownPage
          locale={birthdayConfig.locale}
          targetDate={targetDate}
          userName={birthdayConfig.displayName}
        />
      );
  }
};

export default BirthdayPageView;
