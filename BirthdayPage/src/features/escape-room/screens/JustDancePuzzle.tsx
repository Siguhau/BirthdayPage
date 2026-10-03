import { useEffect, useRef, useState } from "react";
import PuzzleLayout from "../components/PuzzleLayout";
import {
  danceBeatDurationMs,
  dancePattern,
  type DanceKey,
} from "../puzzles/justDanceConfig";
const keyDetails: Record<DanceKey, { arrow: string; label: string }> = {
  KeyA: { arrow: "←", label: "A" },
  KeyD: { arrow: "→", label: "D" },
  KeyS: { arrow: "↓", label: "S" },
  KeyW: { arrow: "↑", label: "W" },
};

type JustDancePuzzleProps = {
  onSolve: () => void;
};

const JustDancePuzzle = ({ onSolve }: JustDancePuzzleProps) => {
  const [beatIndex, setBeatIndex] = useState(0);
  const [feedback, setFeedback] = useState(
    "Trykk start, og treff tasten som lyser på hvert slag.",
  );
  const [hits, setHits] = useState(0);
  const [running, setRunning] = useState(false);
  const hitCurrentBeat = useRef(false);
  const currentKey = dancePattern[beatIndex];

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      if (!hitCurrentBeat.current) {
        setFeedback("For sent – gjør deg klar for neste slag.");
      }
      hitCurrentBeat.current = false;
      setBeatIndex((currentIndex) => (currentIndex + 1) % dancePattern.length);
    }, danceBeatDurationMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) return;
      event.preventDefault();

      if (event.repeat || hitCurrentBeat.current) return;

      if (event.code !== currentKey) {
        setHits(Math.max(0, hits - 1));
        setFeedback("Feil farge – du mister 1 poeng.");
        return;
      }

      hitCurrentBeat.current = true;
      const nextHits = hits + 1;
      setHits(nextHits);
      setFeedback(nextHits === dancePattern.length ? "Perfekt!" : "Treff!");

      if (nextHits === dancePattern.length) {
        setRunning(false);
        onSolve();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentKey, hits, onSolve, running]);

  const activeKey = keyDetails[currentKey];
  const nextDanceKey = dancePattern[(beatIndex + 1) % dancePattern.length];
  const nextKey = keyDetails[nextDanceKey];

  return (
    <PuzzleLayout
      description="Dans med fingrene. Du har ett sekund på hvert trinn. Følg rytmen med W, A, S og D."
      puzzleNumber={2}
      title="WiiMonday"
    >
      <div className="just-dance">
        <div className="just-dance__cue-stage">
          <div
            aria-label={`Nå: ${activeKey.label}`}
            className={`just-dance__cue just-dance__cue--${activeKey.label.toLowerCase()}`}
            key={`${running ? "running" : "idle"}-${String(beatIndex)}`}
          >
            <span aria-hidden="true">{activeKey.arrow}</span>
            <kbd>{activeKey.label}</kbd>
          </div>

          <div
            aria-label={`Deretter: ${nextKey.label}`}
            className={`just-dance__next just-dance__next--${nextKey.label.toLowerCase()}`}
          >
            <small>Neste tast</small>
            <span aria-hidden="true">{nextKey.arrow}</span>
            <kbd>{nextKey.label}</kbd>
          </div>
        </div>

        {running && (
          <div
            aria-hidden="true"
            className="just-dance__beat-timer"
            key={`timer-${String(beatIndex)}`}
          >
            <span />
          </div>
        )}

        <div aria-label="Dansekontroller" className="just-dance__pad">
          {(["KeyW", "KeyA", "KeyS", "KeyD"] as const).map((key) => {
            const details = keyDetails[key];
            const isActive = running && key === currentKey;
            const isNext = running && key === nextDanceKey;

            return (
              <div
                aria-label={`${details.label}${
                  isActive ? ", nå" : isNext ? ", neste" : ""
                }`}
                className={`just-dance__key just-dance__key--${details.label.toLowerCase()}`}
                data-active={isActive}
                data-next={isNext}
                key={key}
              >
                <span aria-hidden="true">{details.arrow}</span>
                <kbd>{details.label}</kbd>
              </div>
            );
          })}
        </div>

        <p className="just-dance__score">
          <strong>{hits}</strong> / {dancePattern.length} poeng
        </p>

        <div
          aria-label={`${String(hits)} av ${String(dancePattern.length)} poeng`}
          aria-valuemax={dancePattern.length}
          aria-valuemin={0}
          aria-valuenow={hits}
          className="just-dance__progress"
          role="progressbar"
        >
          <span
            style={{
              width: `${String((hits / dancePattern.length) * 100)}%`,
            }}
          />
        </div>

        <p aria-live="polite" className="just-dance__feedback">
          {feedback}
        </p>

        {!running && (
          <button
            className="escape-room-game__action just-dance__start"
            onClick={() => {
              hitCurrentBeat.current = false;
              setBeatIndex(0);
              setFeedback("Dans!");
              setHits(0);
              setRunning(true);
            }}
            type="button"
          >
            Start dansen
          </button>
        )}
      </div>
    </PuzzleLayout>
  );
};

export default JustDancePuzzle;
