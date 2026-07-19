import { useEffect, useState } from "react";
import "./App.css";
import BirthdayPage from "./components/BirthdayPage";
import BirthdayPreviewControls from "./components/BirthdayPreviewControls";
import CountdownPage from "./components/CountdownPage";
import { birthdayConfig } from "./birthdayConfig";
import { getNextValidBirthday } from "./utils/utils";
import { useBirthdayChecker } from "./utils/useBirthdayChecker";

const previewDurationMs = 5_000;

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

const BirthdayTransitionPreview = () => {
  const [targetDate, setTargetDate] = useState(
    () => Date.now() + previewDurationMs,
  );
  const [isBirthday, setIsBirthday] = useState(false);

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
      <BirthdayPageView isBirthday={isBirthday} targetDate={targetDate} />
      <BirthdayPreviewControls
        isBirthday={isBirthday}
        onRestartCountdown={restartCountdown}
        onShowBirthday={() => {
          setIsBirthday(true);
        }}
      />
    </>
  );
};

function App() {
  const previewEnabled =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("preview") === "birthday";

  return previewEnabled ? <BirthdayTransitionPreview /> : <LiveBirthdayPage />;
}

export default App;
