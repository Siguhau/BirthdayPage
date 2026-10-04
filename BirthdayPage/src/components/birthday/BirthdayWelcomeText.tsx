import { useEffect } from "react";
import BirthdayFireworks from "./BirthdayFireworks";
import type { FireworksRenderer } from "./fireworksTypes";
import "./BirthdayWelcomeText.css";

type BirthdayWelcomeTextProps = {
  enterFromGame?: boolean;
  fireworksRenderer?: FireworksRenderer;
  userName: string;
};

const BirthdayWelcomeText = ({
  enterFromGame = false,
  fireworksRenderer,
  userName,
}: BirthdayWelcomeTextProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="birthday-welcome" data-arriving={enterFromGame}>
      <BirthdayFireworks renderer={fireworksRenderer} />
      <h1 className="birthday-welcome__title">
        <span aria-hidden="true" className="birthday-welcome__emoji">
          🎉
        </span>
        <span className="birthday-welcome__text">
          Gratulerer med dagen {userName}!
        </span>
        <span aria-hidden="true" className="birthday-welcome__emoji">
          🎉
        </span>
      </h1>
    </div>
  );
};

export default BirthdayWelcomeText;
