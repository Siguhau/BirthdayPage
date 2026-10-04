import { useEffect, type PropsWithChildren } from "react";

type PuzzleOverlayProps = PropsWithChildren<{
  onClose: () => void;
}>;

const PuzzleOverlay = ({ children, onClose }: PuzzleOverlayProps) => {
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
    <div className="escape-room-puzzle-overlay">
      <div
        aria-label="Aktiv gåte"
        aria-modal="true"
        className="escape-room-puzzle-overlay__dialog"
        role="dialog"
      >
        <button
          autoFocus
          className="escape-room-puzzle-overlay__close"
          onClick={onClose}
          type="button"
        >
          Lukk gåten
        </button>
        {children}
      </div>
    </div>
  );
};

export default PuzzleOverlay;
