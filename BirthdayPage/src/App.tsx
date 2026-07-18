import Countdown from "./components/Countdown";
import "./App.css";
import WelcomeText from "./components/WelcomeText";
import { birthdayConfig } from "./birthdayConfig";
import { getNextValidBirthday } from "./utils/utils";
import { useBirthdayChecker } from "./utils/useBirthdayChecker";

function App() {
  const nextBirthday = getNextValidBirthday(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );
  const isBirthday = useBirthdayChecker(
    birthdayConfig.birthday,
    birthdayConfig.timeZone,
  );

  return (
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
      {!isBirthday && <Countdown targetDate={nextBirthday} />}
    </div>
  );
}

export default App;
