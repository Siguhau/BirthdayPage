import { useEffect, useState } from "react";
import Countdown from "./components/Countdown";
import "./App.css";
import BirthdayPreviewControls from "./components/BirthdayPreviewControls";
import WelcomeText from "./components/WelcomeText";
import { birthdayConfig } from "./birthdayConfig";
import { getNextValidBirthday } from "./utils/utils";
import { useBirthdayChecker } from "./utils/useBirthdayChecker";

const previewDurationMs = 5_000;

type BirthdayPageViewProps = {
  isBirthday: boolean;
  targetDate: Date | number | string;
};

const BirthdayPageView = ({
  isBirthday,
  targetDate,
}: BirthdayPageViewProps) => (
  <div
    lang={birthdayConfig.locale}
    style={{
      minHeight: "100vh",
      width: "100vw",
      background:
        "linear-gradient(135deg, #232526 0%, #414345 40%, #23243a 100%)",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <WelcomeText
      userName={birthdayConfig.displayName}
      isBirthday={isBirthday}
    />
    {!isBirthday && <Countdown targetDate={targetDate} />}
  </div>
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
