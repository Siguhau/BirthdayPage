import PuzzleLayout from "../components/PuzzleLayout";

type FirstPuzzleProps = {
  onSolve: () => void;
};

const FirstPuzzle = ({ onSolve }: FirstPuzzleProps) => (
  <PuzzleLayout
    description="Denne skjermen er klar for innholdet, ledetrådene og valideringen til den første ordentlige gåten."
    puzzleNumber={1}
    title="Den første låsen"
  >
    <div aria-hidden="true" className="escape-room-puzzle__placeholder">
      ?
    </div>
    {import.meta.env.DEV && (
      <button
        className="escape-room-game__action escape-room-game__action--secondary"
        onClick={onSolve}
        type="button"
      >
        Test fullføring
      </button>
    )}
  </PuzzleLayout>
);

export default FirstPuzzle;
