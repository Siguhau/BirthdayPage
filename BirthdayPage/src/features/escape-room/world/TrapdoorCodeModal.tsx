import { useEffect, useState, type SyntheticEvent } from "react";
import { trapdoorCode } from "../puzzles/trapdoorCipher";

type TrapdoorCodeModalProps = {
  onClose: () => void;
  onUnlock: () => void;
};

const TrapdoorCodeModal = ({ onClose, onUnlock }: TrapdoorCodeModalProps) => {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Escape") return;
      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [onClose]);

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.trim().toLowerCase() === trapdoorCode) {
      onUnlock();
      return;
    }
    setFeedback("Feil kode.");
    setCode("");
  };

  return (
    <div className="escape-room-world__photo-modal-backdrop">
      <section
        aria-labelledby="trapdoor-code-title"
        aria-modal="true"
        className="escape-room-world__photo-modal escape-room-world__trapdoor-code"
        role="dialog"
      >
        <p className="escape-room-world__photo-modal-eyebrow">Cæsarlås</p>
        <h2 id="trapdoor-code-title">Kjellerlem</h2>
        <p>Skriv inn det krypterte passordet.</p>
        <form onSubmit={submit}>
          <label htmlFor="trapdoor-code">Kryptert passord</label>
          <input
            autoComplete="off"
            autoFocus
            id="trapdoor-code"
            maxLength={5}
            onChange={(event) => {
              setCode(event.target.value.replace(/[^a-zæøå]/gi, ""));
              setFeedback("");
            }}
            spellCheck={false}
            value={code}
          />
          <button disabled={code.length !== 5} type="submit">
            Lås opp lemmen
          </button>
        </form>
        <p aria-live="polite" className="escape-room-world__panel-feedback">
          {feedback}
        </p>
        <button onClick={onClose} type="button">
          Lukk låsen
        </button>
      </section>
    </div>
  );
};

export default TrapdoorCodeModal;
