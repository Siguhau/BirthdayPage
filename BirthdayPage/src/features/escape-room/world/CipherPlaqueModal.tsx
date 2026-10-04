import { useEffect } from "react";

const CipherPlaqueModal = ({ onClose }: { onClose: () => void }) => {
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

  return (
    <div className="escape-room-world__photo-modal-backdrop">
      <section
        aria-labelledby="cipher-plaque-title"
        aria-modal="true"
        className="escape-room-world__photo-modal escape-room-world__cipher-plaque"
        role="dialog"
      >
        <p className="escape-room-world__photo-modal-eyebrow">
          Inskripsjon på plaketten
        </p>
        <h2 id="cipher-plaque-title">Cæsars kode</h2>
        <p>
          En bokstav kan marsjere et fast antall plasser gjennom alfabetet. Alle
          bokstavene flyttes like langt.
        </p>
        <p>
          Når du passerer slutten av alfabetet, fortsetter du fra begynnelsen.
          En stor nøkkel kan derfor gå rundt alfabetet mer enn én gang.
        </p>
        <p className="escape-room-world__cipher-formula">
          <code>encrypt(C) = (C + K) mod 26</code>
          <code>decrypt(C) = (C − K) mod 26</code>
          <span>A = 0, B = 1, … Z = 25</span>
        </p>
        <button autoFocus onClick={onClose} type="button">
          Legg fra deg plaketten
        </button>
      </section>
    </div>
  );
};

export default CipherPlaqueModal;
