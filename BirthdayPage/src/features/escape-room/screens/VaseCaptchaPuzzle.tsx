import { useState, type SubmitEvent } from "react";
import PuzzleLayout from "../components/PuzzleLayout";
import {
  correctVaseTileIds,
  vaseCaptchaTiles,
  type VaseCaptchaTile,
} from "../puzzles/vaseCaptchaConfig";

const requiredTileCount = 16;

type VaseCaptchaPuzzleProps = {
  correctTileIds?: readonly string[];
  onSolve: () => void;
  tiles?: readonly VaseCaptchaTile[];
};

const VaseCaptchaPuzzle = ({
  correctTileIds = correctVaseTileIds,
  onSolve,
  tiles = vaseCaptchaTiles,
}: VaseCaptchaPuzzleProps) => {
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false);
  const isConfigured =
    tiles.length === requiredTileCount &&
    correctTileIds.length > 0 &&
    tiles.every((tile) => tile.imageSrc !== undefined);

  const toggleTile = (tileId: string) => {
    setShowIncorrectMessage(false);
    setSelectedTileIds((currentTileIds) =>
      currentTileIds.includes(tileId)
        ? currentTileIds.filter((currentTileId) => currentTileId !== tileId)
        : [...currentTileIds, tileId],
    );
  };

  const submitSelection = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isConfigured) return;

    const hasSelectedEveryVase = correctTileIds.every((tileId) =>
      selectedTileIds.includes(tileId),
    );
    const hasSelectedOnlyVases =
      selectedTileIds.length === correctTileIds.length;

    if (hasSelectedEveryVase && hasSelectedOnlyVases) {
      onSolve();
      return;
    }

    setShowIncorrectMessage(true);
  };

  return (
    <PuzzleLayout
      description="Velg alle rutene som inneholder en vase. Trykk deretter på Bekreft."
      puzzleNumber={1}
      title="Er det en vase?"
    >
      <form className="vase-captcha" onSubmit={submitSelection}>
        <div
          aria-label="Bilder som kan inneholde vaser"
          className="vase-captcha__grid"
          role="group"
        >
          {tiles.map((tile, index) => {
            const isSelected = selectedTileIds.includes(tile.id);

            return (
              <button
                aria-label={`${tile.alt}. ${
                  isSelected ? "Valgt" : "Ikke valgt"
                }`}
                aria-pressed={isSelected}
                className="vase-captcha__tile"
                key={tile.id}
                onClick={() => {
                  toggleTile(tile.id);
                }}
                type="button"
              >
                {tile.imageSrc === undefined ? (
                  <span className="vase-captcha__placeholder">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ) : (
                  <img
                    alt=""
                    className="vase-captcha__image"
                    src={tile.imageSrc}
                  />
                )}
                <span aria-hidden="true" className="vase-captcha__selection">
                  ✓
                </span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="vase-captcha__feedback">
          {!isConfigured && "Bildene til denne gåten er ikke lagt inn ennå."}
          {isConfigured &&
            showIncorrectMessage &&
            "Ikke helt. Se nøye og prøv igjen."}
          {isConfigured &&
            !showIncorrectMessage &&
            `${String(selectedTileIds.length)} bilder valgt`}
        </p>

        <button
          className="escape-room-game__action vase-captcha__submit"
          disabled={!isConfigured}
          type="submit"
        >
          Bekreft
        </button>
      </form>
    </PuzzleLayout>
  );
};

export default VaseCaptchaPuzzle;
