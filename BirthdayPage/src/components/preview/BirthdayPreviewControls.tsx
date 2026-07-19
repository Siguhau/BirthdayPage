import { useTheme } from "../../theme/useTheme";
import "./BirthdayPreviewControls.css";

type BirthdayPreviewControlsProps = {
  isBirthday: boolean;
  onRestartCountdown: () => void;
  onShowBirthday: () => void;
};

const BirthdayPreviewControls = ({
  isBirthday,
  onRestartCountdown,
  onShowBirthday,
}: BirthdayPreviewControlsProps) => {
  const { setTheme, theme } = useTheme();

  return (
    <div
      aria-label="Birthday preview controls"
      className="birthday-preview-controls"
      role="group"
    >
      <button
        aria-pressed={!isBirthday}
        className="birthday-preview-controls__button"
        onClick={onRestartCountdown}
        type="button"
      >
        Restart 5-second countdown
      </button>
      <button
        aria-pressed={isBirthday}
        className="birthday-preview-controls__button"
        onClick={onShowBirthday}
        type="button"
      >
        Show birthday greeting
      </button>
      <span aria-hidden="true" className="birthday-preview-controls__divider" />
      <button
        aria-pressed={theme === "birthday"}
        className="birthday-preview-controls__button"
        onClick={() => {
          setTheme("birthday");
        }}
        type="button"
      >
        Birthday theme
      </button>
      <button
        aria-pressed={theme === "escape-room"}
        className="birthday-preview-controls__button"
        onClick={() => {
          setTheme("escape-room");
        }}
        type="button"
      >
        Escape room theme
      </button>
    </div>
  );
};

export default BirthdayPreviewControls;
