import { useEffect, useState } from "react";
import { laserCode } from "../puzzles/laserPuzzle";

type LaserPanelModalProps = {
  laserPowered: boolean;
  onClose: () => void;
  onEnterCode: (code: string) => void;
};

const LaserPanelModal = ({
  laserPowered,
  onClose,
  onEnterCode,
}: LaserPanelModalProps) => {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key) && code.length < 4) {
        setCode((current) => `${current}${event.key}`);
      } else if (event.key === "Backspace") {
        setCode((current) => current.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [code.length]);

  const submit = () => {
    if (code === laserCode) {
      onEnterCode(code);
      setFeedback("Koden godtas. Laseren er aktiv.");
      return;
    }
    setFeedback("Feil kode.");
    setCode("");
  };

  return (
    <div
      className="escape-room-world__photo-modal-backdrop"
      role="presentation"
    >
      <section
        aria-labelledby="laser-panel-title"
        aria-modal="true"
        className="escape-room-world__photo-modal escape-room-world__laser-panel"
        role="dialog"
      >
        <p className="escape-room-world__photo-modal-eyebrow">
          Optisk kontroll
        </p>
        <h2 id="laser-panel-title">Laserpanel</h2>
        {laserPowered ? (
          <>
            <div
              className="escape-room-world__laser-status"
              data-powered="true"
            >
              <span /> Laser aktiv
            </div>
          </>
        ) : (
          <>
            <output
              aria-label="Inntastet kode"
              className="escape-room-world__code-display"
            >
              {code.padEnd(4, "·")}
            </output>
            <div className="escape-room-world__keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                <button
                  aria-label={`Tast ${String(digit)}`}
                  disabled={code.length >= 4}
                  key={digit}
                  onClick={() => {
                    setCode((current) => `${current}${String(digit)}`);
                  }}
                  type="button"
                >
                  {digit}
                </button>
              ))}
            </div>
            <button
              className="escape-room-world__panel-submit"
              disabled={code.length !== 4}
              onClick={submit}
              type="button"
            >
              Aktiver laser
            </button>
            <p aria-live="polite" className="escape-room-world__panel-feedback">
              {feedback}
            </p>
          </>
        )}
        <button onClick={onClose} type="button">
          Lukk panelet
        </button>
      </section>
    </div>
  );
};

export default LaserPanelModal;
