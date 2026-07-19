import { useTheme } from "../../theme/useTheme";
import type { FireworksRenderer } from "../birthday/fireworksTypes";
import "./BirthdayPreviewControls.css";

type BirthdayPreviewControlsProps = {
  fireworksRenderer: FireworksRenderer;
  isBirthday: boolean;
  onFireworksRendererChange: (renderer: FireworksRenderer) => void;
  onRestartCountdown: () => void;
  onShowBirthday: () => void;
};

const BirthdayPreviewControls = ({
  fireworksRenderer,
  isBirthday,
  onFireworksRendererChange,
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
      <span aria-hidden="true" className="birthday-preview-controls__divider" />
      <label className="birthday-preview-controls__field">
        <span>Fireworks</span>
        <select
          aria-label="Fireworks renderer"
          className="birthday-preview-controls__select"
          onChange={(event) => {
            onFireworksRendererChange(event.target.value as FireworksRenderer);
          }}
          value={fireworksRenderer}
        >
          <option value="custom">Custom</option>
          <option value="fireworks-js">fireworks-js</option>
          <option value="tsparticles">tsParticles</option>
          <option value="combined">Combined</option>
        </select>
      </label>
    </div>
  );
};

export default BirthdayPreviewControls;
