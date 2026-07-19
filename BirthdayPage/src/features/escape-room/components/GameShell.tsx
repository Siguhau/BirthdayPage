import type { PropsWithChildren } from "react";
import type { GameStage } from "../state/gameTypes";

type GameShellProps = PropsWithChildren<{
  stage: GameStage;
}>;

const GameShell = ({ children, stage }: GameShellProps) => (
  <main className="escape-room-game" data-game-stage={stage}>
    {children}
  </main>
);

export default GameShell;
