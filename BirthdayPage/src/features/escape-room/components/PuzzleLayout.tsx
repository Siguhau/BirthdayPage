import type { PropsWithChildren } from "react";

type PuzzleLayoutProps = PropsWithChildren<{
  description: string;
  puzzleNumber: number;
  title: string;
}>;

const PuzzleLayout = ({
  children,
  description,
  puzzleNumber,
  title,
}: PuzzleLayoutProps) => (
  <section className="escape-room-puzzle">
    <p className="escape-room-game__eyebrow">Gåte {puzzleNumber}</p>
    <h1 className="escape-room-game__title">{title}</h1>
    <p className="escape-room-game__description">{description}</p>
    <div className="escape-room-puzzle__content">{children}</div>
  </section>
);

export default PuzzleLayout;
