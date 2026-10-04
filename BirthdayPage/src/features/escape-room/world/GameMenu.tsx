import { useState } from "react";

type GameMenuProps = {
  onClearMemory: () => void;
  onResume: () => void;
};

const GameMenu = ({ onClearMemory, onResume }: GameMenuProps) => {
  const [showControls, setShowControls] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  return (
    <div
      aria-labelledby="escape-room-menu-title"
      aria-modal="true"
      className="escape-room-world__overlay"
      role="dialog"
    >
      <div className="escape-room-world__menu">
        <p className="escape-room-world__eyebrow">Spillet er satt på pause</p>
        <h1 id="escape-room-menu-title">Meny</h1>

        {showControls && (
          <p className="escape-room-world__menu-copy">
            WASD beveger deg. Space hopper. Musen ser rundt. E undersøker.
            Escape åpner denne menyen.
          </p>
        )}

        {confirmingClear ? (
          <div className="escape-room-world__confirmation">
            <p>Vil du slette all lagret fremdrift og starte på nytt?</p>
            <button onClick={onClearMemory} type="button">
              Ja, slett minnet
            </button>
            <button
              onClick={() => {
                setConfirmingClear(false);
              }}
              type="button"
            >
              Avbryt
            </button>
          </div>
        ) : (
          <div className="escape-room-world__menu-actions">
            <button autoFocus onClick={onResume} type="button">
              Fortsett
            </button>
            <button
              onClick={() => {
                setShowControls((current) => !current);
              }}
              type="button"
            >
              {showControls ? "Skjul kontroller" : "Vis kontroller"}
            </button>
            <button
              onClick={() => {
                setConfirmingClear(true);
              }}
              type="button"
            >
              Tøm minnet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMenu;
