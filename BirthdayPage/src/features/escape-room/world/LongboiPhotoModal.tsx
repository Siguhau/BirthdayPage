import { useEffect } from "react";
import type { LongboiPhoto } from "../puzzles/longboiPhotos";

export type LongboiPhotoResult = {
  details: string;
  photo: LongboiPhoto;
  savedToInventory: boolean;
};

type LongboiPhotoModalProps = {
  onClose: () => void;
  result: LongboiPhotoResult;
};

const LongboiPhotoModal = ({ onClose, result }: LongboiPhotoModalProps) => {
  const successful = result.photo.kind === "success";

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
        aria-labelledby="longboi-photo-title"
        aria-modal="true"
        className="escape-room-world__photo-modal"
        role="dialog"
      >
        <p className="escape-room-world__photo-modal-eyebrow">
          {successful ? "Longboi fanget" : "Nesten en Longboi"}
        </p>
        <h2 id="longboi-photo-title">
          {successful
            ? result.savedToInventory
              ? "Et Longboi-bilde"
              : "Et nytt Longboi-bilde"
            : "Bildet ble ikke godkjent"}
        </h2>

        <div
          className="escape-room-world__longboi-photo"
          data-result={result.photo.kind}
        >
          {result.photo.src === null ? (
            <div className="escape-room-world__longboi-placeholder">
              <span>Fotoplassholder</span>
              <strong>{result.photo.placeholderLabel}</strong>
            </div>
          ) : (
            <img alt={result.photo.alt} src={result.photo.src} />
          )}
        </div>

        <p className="escape-room-world__photo-modal-details">
          {result.details}
        </p>
        {result.savedToInventory && (
          <p className="escape-room-world__photo-modal-reward">
            Longboi-bildet er lagt i inventaret.
          </p>
        )}

        <button autoFocus onClick={onClose} type="button">
          Tilbake til rommet
        </button>
      </section>
    </div>
  );
};

export default LongboiPhotoModal;
