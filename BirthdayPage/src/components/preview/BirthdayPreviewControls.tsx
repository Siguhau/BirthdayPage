import type { FireworksRenderer } from "../birthday/fireworksTypes";
import type { BirthdayExperiencePage } from "../../pages/birthdayExperiencePage";
import PreviewControlsPanel from "./PreviewControlsPanel";

type BirthdayPreviewControlsProps = {
  fireworksRenderer: FireworksRenderer;
  page: BirthdayExperiencePage;
  onFireworksRendererChange: (renderer: FireworksRenderer) => void;
  onRestartCountdown: () => void;
  onShowBirthday: () => void;
  onShowEscapeRoom: () => void;
};

const BirthdayPreviewControls = ({
  fireworksRenderer,
  page,
  onFireworksRendererChange,
  onRestartCountdown,
  onShowBirthday,
  onShowEscapeRoom,
}: BirthdayPreviewControlsProps) => {
  return (
    <PreviewControlsPanel>
      <button
        aria-pressed={page === "countdown"}
        className="birthday-preview-controls__button"
        onClick={onRestartCountdown}
        type="button"
      >
        Restart 10-second countdown
      </button>
      <button
        aria-pressed={page === "escape-room"}
        className="birthday-preview-controls__button"
        onClick={onShowEscapeRoom}
        type="button"
      >
        Show escape room entry
      </button>
      <button
        aria-pressed={page === "birthday"}
        className="birthday-preview-controls__button"
        onClick={onShowBirthday}
        type="button"
      >
        Show birthday finale
      </button>
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
    </PreviewControlsPanel>
  );
};

export default BirthdayPreviewControls;
