import { useRef, useState, type KeyboardEvent } from "react";
import PuzzleLayout from "../components/PuzzleLayout";
import HeartConfetti from "../components/HeartConfetti";
import {
  britaImageSrc,
  canSlideTile,
  createSlidingBoard,
  isSlidingBoardSolved,
  slideTile,
  slidingGridSize,
} from "../puzzles/slidingTiles";
import "./SlidingTilesPuzzle.css";

type SlidingTilesPuzzleProps = {
  onSolve: () => void;
};

const SlidingTilesPuzzle = ({ onSolve }: SlidingTilesPuzzleProps) => {
  const [initialBoard] = useState(createSlidingBoard);
  const [board, setBoard] = useState(initialBoard);
  const [moves, setMoves] = useState(0);
  const submitted = useRef(false);
  const solved = isSlidingBoardSolved(board);

  const moveTile = (index: number) => {
    if (solved || !canSlideTile(board, index)) return;
    setBoard(slideTile(board, index));
    setMoves(moves + 1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const offsets: Partial<Record<string, number>> = {
      ArrowUp: -slidingGridSize,
      ArrowDown: slidingGridSize,
      ArrowLeft: -1,
      ArrowRight: 1,
    };
    const offset = offsets[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    moveTile(board.indexOf(0) + offset);
  };

  return (
    <PuzzleLayout
      description="Brita har blitt stokket om! Skyv brikkene på plass og sett sammen bildet igjen."
      puzzleNumber={5}
      title="Brita i biter"
    >
      {solved && <HeartConfetti />}
      <div className="sliding-tiles">
        <div className="sliding-tiles__workspace">
          <div>
            <div
              aria-label="Skyvepuslespill med Brita"
              aria-describedby="sliding-tiles-controls"
              className="sliding-tiles__board"
              onKeyDown={handleKeyDown}
              role="group"
              tabIndex={0}
            >
              {solved ? (
                <img
                  className="sliding-tiles__completed"
                  src={britaImageSrc}
                  alt="Det ferdige bildet av Brita"
                />
              ) : (
                board.map((tile, index) =>
                  tile === 0 ? (
                    <div
                      aria-label={`Tom rute, rad ${String(Math.floor(index / 3) + 1)}, kolonne ${String((index % 3) + 1)}`}
                      className="sliding-tiles__blank"
                      style={{
                        left: `${String(((index % 3) * 100) / 3)}%`,
                        top: `${String((Math.floor(index / 3) * 100) / 3)}%`,
                      }}
                      key={tile}
                    />
                  ) : (
                    <button
                      aria-disabled={!canSlideTile(board, index)}
                      aria-label={`Brikke ${String(tile)}, rad ${String(Math.floor(index / 3) + 1)}, kolonne ${String((index % 3) + 1)}`}
                      className="sliding-tiles__tile"
                      key={tile}
                      onClick={() => {
                        moveTile(index);
                      }}
                      style={{
                        left: `${String(((index % 3) * 100) / 3)}%`,
                        top: `${String((Math.floor(index / 3) * 100) / 3)}%`,
                        backgroundImage: `url(${britaImageSrc})`,
                        backgroundPosition: `${String(((tile - 1) % 3) * 50)}% ${String(Math.floor((tile - 1) / 3) * 50)}%`,
                      }}
                      type="button"
                    ></button>
                  ),
                )
              )}
            </div>
            <p className="sliding-tiles__status" role="status">
              {solved
                ? `Der er Brita! Bildet er på plass etter ${String(moves)} trekk.`
                : `${String(moves)} trekk · én tom rute`}
            </p>
          </div>
          <aside className="sliding-tiles__controls">
            <p id="sliding-tiles-controls">
              Klikk på en brikke ved siden av den tomme ruten. Du kan også bruke
              Tab og Enter, eller piltastene for å flytte den tomme ruten.
            </p>
          </aside>
        </div>
        {solved ? (
          <button
            className="escape-room-game__action"
            onClick={() => {
              if (submitted.current) return;
              submitted.current = true;
              onSolve();
            }}
            type="button"
          >
            Tilbake til rommet
          </button>
        ) : (
          <button
            className="sliding-tiles__reset"
            onClick={() => {
              setBoard(initialBoard);
              setMoves(0);
            }}
            type="button"
          >
            Start bildet på nytt
          </button>
        )}
      </div>
    </PuzzleLayout>
  );
};

export default SlidingTilesPuzzle;
