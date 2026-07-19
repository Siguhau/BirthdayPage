import { useEffect } from "react";
import BirthdayConfetti from "./BirthdayConfetti";
import "./BirthdayWelcomeText.css";

type BirthdayWelcomeTextProps = {
  userName: string;
};

const BirthdayWelcomeText = ({ userName }: BirthdayWelcomeTextProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="birthday-welcome">
      <BirthdayConfetti />
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
