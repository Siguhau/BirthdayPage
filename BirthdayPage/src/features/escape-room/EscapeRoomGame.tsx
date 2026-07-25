import { useEffect, useReducer } from "react";
import GameShell from "./components/GameShell";
import GameComplete from "./screens/GameComplete";
import GameIntroduction from "./screens/GameIntroduction";
import VaseCaptchaPuzzle from "./screens/VaseCaptchaPuzzle";
import { gameReducer } from "./state/gameReducer";
import { initialGameState } from "./state/gameTypes";
import "./EscapeRoomGame.css";

const completionDelayMs = 1_200;

type EscapeRoomGameProps = {
  onComplete: () => void;
  userName: string;
};

const EscapeRoomGame = ({ onComplete, userName }: EscapeRoomGameProps) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  useEffect(() => {
    if (gameState.stage !== "complete") return;

    const timeout = window.setTimeout(onComplete, completionDelayMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [gameState.stage, onComplete]);

  return (
    <GameShell stage={gameState.stage}>
      {gameState.stage === "introduction" && (
        <GameIntroduction
          onStart={() => {
            dispatch({ type: "START_GAME" });
          }}
          userName={userName}
        />
      )}
      {gameState.stage === "vase-captcha" && (
        <VaseCaptchaPuzzle
          onSolve={() => {
            dispatch({ type: "SOLVE_PUZZLE", puzzleId: "vase-captcha" });
          }}
        />
      )}
      {gameState.stage === "complete" && <GameComplete />}
    </GameShell>
  );
};

export default EscapeRoomGame;
