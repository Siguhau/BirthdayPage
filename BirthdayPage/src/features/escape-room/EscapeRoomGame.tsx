import { lazy, Suspense, useEffect, useReducer } from "react";
import GameShell from "./components/GameShell";
import PuzzleOverlay from "./overlays/PuzzleOverlay";
import { puzzleRegistry } from "./puzzles/puzzleRegistry";
import GameComplete from "./screens/GameComplete";
import GameIntroduction from "./screens/GameIntroduction";
import UnsupportedEscapeRoom from "./screens/UnsupportedEscapeRoom";
import { gameReducer } from "./state/gameReducer";
import { initialGameState } from "./state/gameTypes";
import useEscapeRoomSupport from "./support/useEscapeRoomSupport";
import { releaseMouseLook, requestMouseLook } from "./world/mouseLook";
import usePrefersReducedMotion from "../../utils/usePrefersReducedMotion";
import "./EscapeRoomGame.css";

// Matches the outgoing glow in EscapeRoomGame.css.
const completionDelayMs = 2_400;
const EscapeRoomWorld = lazy(() => import("./world/EscapeRoomWorld"));

type EscapeRoomGameProps = {
  onComplete: () => void;
  userName: string;
};

const EscapeRoomGame = ({ onComplete, userName }: EscapeRoomGameProps) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const reducedMotion = usePrefersReducedMotion();
  const support = useEscapeRoomSupport();
  const ActivePuzzle =
    gameState.activePuzzleId === null
      ? null
      : (puzzleRegistry[gameState.activePuzzleId].overlay ?? null);
  const closePuzzle = () => {
    requestMouseLook();
    dispatch({ type: "CLOSE_PUZZLE" });
  };

  useEffect(() => {
    if (gameState.stage !== "complete") return;

    releaseMouseLook();
    const timeout = window.setTimeout(
      onComplete,
      reducedMotion ? 0 : completionDelayMs,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [gameState.stage, onComplete, reducedMotion]);

  if (!support.supported) {
    return (
      <GameShell stage="introduction">
        <UnsupportedEscapeRoom
          onContinue={onComplete}
          reason={support.reason}
        />
      </GameShell>
    );
  }

  return (
    <GameShell stage={gameState.stage}>
      {gameState.stage === "introduction" && (
        <GameIntroduction
          onStart={() => {
            requestMouseLook();
            dispatch({ type: "START_GAME" });
          }}
          userName={userName}
        />
      )}
      {gameState.stage !== "introduction" && (
        <Suspense
          fallback={
            <div className="escape-room-game__loading" role="status">
              Åpner døren …
            </div>
          }
        >
          <EscapeRoomWorld
            activePuzzleOpen={
              gameState.activePuzzleId !== null ||
              gameState.stage === "complete"
            }
            chestOpen={gameState.chestOpen}
            installedItemIds={gameState.installedItems}
            inventoryItemIds={gameState.inventory}
            laserPowered={gameState.laserPowered}
            mirrorOrientations={gameState.mirrorOrientations}
            onCollectPepsi={() => {
              dispatch({ type: "COLLECT_PEPSI" });
            }}
            onEnterLaserCode={(code) => {
              dispatch({ type: "ENTER_LASER_CODE", code });
            }}
            onInstallItem={(itemId) => {
              dispatch({ type: "INSTALL_ITEM", itemId });
            }}
            onPickUpItem={(itemId) => {
              dispatch({ type: "PICK_UP_ITEM", itemId });
            }}
            onRedeemCameraReward={(itemId) => {
              dispatch({ type: "REDEEM_CAMERA_REWARD", itemId });
            }}
            onReset={() => {
              dispatch({ type: "RESET_GAME" });
            }}
            onRotateMirror={(itemId) => {
              dispatch({ type: "ROTATE_MIRROR", itemId });
            }}
            onOpenPuzzle={(puzzleId) => {
              dispatch({ type: "OPEN_PUZZLE", puzzleId });
            }}
            onSolvePuzzle={(puzzleId) => {
              dispatch({ type: "SOLVE_WORLD_PUZZLE", puzzleId });
            }}
            solvedPuzzleIds={gameState.solvedPuzzles}
          />
        </Suspense>
      )}
      {ActivePuzzle !== null && gameState.activePuzzleId !== null && (
        <PuzzleOverlay onClose={closePuzzle}>
          <ActivePuzzle
            onSolve={() => {
              const solvedPuzzleId = gameState.activePuzzleId;
              if (solvedPuzzleId === null) return;
              requestMouseLook();
              dispatch({
                type: "SOLVE_PUZZLE",
                puzzleId: solvedPuzzleId,
              });
            }}
          />
        </PuzzleOverlay>
      )}
      {gameState.stage === "complete" && <GameComplete />}
    </GameShell>
  );
};

export default EscapeRoomGame;
