import { useEffect, useState } from "react";
import PuzzleLayout from "../components/PuzzleLayout";
import {
  cornChaseLevels,
  hasEscapedCorn,
  isCaughtByCorn,
  moveCornTowardsPlayer,
  moveInMaze,
  type MazeDirection,
  type MazePosition,
} from "../puzzles/cornChase";

type CornChasePuzzleProps = { onSolve: () => void };

const keyDirections: Partial<Record<string, MazeDirection>> = {
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  KeyA: "left",
  KeyD: "right",
  KeyS: "down",
  KeyW: "up",
};

const positionKey = ({ column, row }: MazePosition) =>
  `${String(column)}-${String(row)}`;

const CornChasePuzzle = ({ onSolve }: CornChasePuzzleProps) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = cornChaseLevels[levelIndex];
  const [corns, setCorns] = useState<readonly MazePosition[]>(level.cornStarts);
  const [message, setMessage] = useState(
    "Finn utgangen før maisen finner Runar.",
  );
  const [player, setPlayer] = useState<MazePosition>(level.playerStart);
  const [won, setWon] = useState(false);

  const reset = () => {
    setCorns(level.cornStarts);
    setMessage("Ny runde. Hold Runar unna maisen!");
    setPlayer(level.playerStart);
    setWon(false);
  };

  const movePlayer = (direction: MazeDirection) => {
    if (won) return;
    const nextPlayer = moveInMaze(level, player, direction);
    if (nextPlayer === player) {
      setMessage("Veggen holder. Finn en annen vei.");
      return;
    }
    if (hasEscapedCorn(level, nextPlayer)) {
      setPlayer(nextPlayer);
      if (levelIndex === cornChaseLevels.length - 1) {
        setWon(true);
        setMessage("Runar unnslapp alle maislabyrintene!");
        onSolve();
      } else {
        const nextLevel = cornChaseLevels[levelIndex + 1];
        setLevelIndex(levelIndex + 1);
        setCorns(nextLevel.cornStarts);
        setPlayer(nextLevel.playerStart);
        setMessage(
          `Nivå ${String(levelIndex + 2)}: Maisen har funnet en ny labyrint.`,
        );
      }
      return;
    }

    const nextCorns = corns.map((corn) =>
      moveCornTowardsPlayer(level, corn, nextPlayer),
    );
    setPlayer(nextPlayer);
    setCorns(nextCorns);
    if (nextCorns.some((corn) => isCaughtByCorn(nextPlayer, corn))) {
      setPlayer(level.playerStart);
      setCorns(level.cornStarts);
      setMessage("Maisen tok ham. Prøv igjen!");
      return;
    }
    setMessage("Maisen kommer nærmere …");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyDirections[event.code];
      if (direction === undefined || event.repeat) return;
      event.preventDefault();
      movePlayer(direction);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <PuzzleLayout
      description="Runar tåler ikke mais. Før ham gjennom arkademaskinens labyrint med piltastene eller WASD før maiskolben tar ham."
      puzzleNumber={3}
      title="Maisjakten"
    >
      <div className="corn-chase">
        <p className="corn-chase__level">
          Nivå {levelIndex + 1} av {cornChaseLevels.length}
          <strong>Kodebit: {level.codeFragment}</strong>
        </p>
        <div aria-label="Maislabyrint" className="corn-chase__maze" role="grid">
          {level.maze.map((mazeRow, row) =>
            Array.from({ length: mazeRow.length }, (_, column) => {
              const cell = mazeRow[column];
              const position = { column, row };
              const isPlayer = positionKey(position) === positionKey(player);
              const isCorn = corns.some(
                (corn) => positionKey(position) === positionKey(corn),
              );
              return (
                <span
                  aria-label={
                    isPlayer
                      ? "Runar"
                      : isCorn
                        ? "Mais"
                        : cell === "G"
                          ? "Utgang"
                          : cell === "#"
                            ? "Vegg"
                            : "Gang"
                  }
                  className="corn-chase__cell"
                  data-cell={cell === "#" ? "wall" : "path"}
                  key={positionKey(position)}
                  role="gridcell"
                >
                  {isPlayer ? "🏃" : isCorn ? "🌽" : cell === "G" ? "🚪" : ""}
                </span>
              );
            }),
          )}
        </div>
        <p aria-live="polite" className="corn-chase__message">
          {message}
        </p>
        {!won && (
          <p className="corn-chase__controls">Piltaster eller W A S D</p>
        )}
        <button
          className="escape-room-game__action corn-chase__reset"
          onClick={reset}
          type="button"
        >
          Start på nytt
        </button>
      </div>
    </PuzzleLayout>
  );
};

export default CornChasePuzzle;
