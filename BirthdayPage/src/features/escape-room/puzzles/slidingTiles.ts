export const britaImageSrc = "/images/puzzles/brita.webp";
export const slidingGridSize = 3;
export const solvedSlidingBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0] as const;

export const isSlidingBoardSolved = (board: readonly number[]) =>
  board.length === solvedSlidingBoard.length &&
  board.every((tile, index) => tile === solvedSlidingBoard[index]);

export const canSlideTile = (board: readonly number[], index: number) => {
  if (index < 0 || index >= board.length || board[index] === 0) return false;
  const blank = board.indexOf(0);
  return (
    Math.abs(
      Math.floor(index / slidingGridSize) - Math.floor(blank / slidingGridSize),
    ) +
      Math.abs((index % slidingGridSize) - (blank % slidingGridSize)) ===
    1
  );
};

export const slideTile = (
  board: readonly number[],
  index: number,
): readonly number[] => {
  if (!canSlideTile(board, index)) return board;
  const next = [...board];
  const blank = board.indexOf(0);
  [next[index], next[blank]] = [next[blank], next[index]];
  return next;
};

export const createSlidingBoard = (random: () => number = Math.random) => {
  let board: readonly number[] = [...solvedSlidingBoard];
  let previousBlank = -1;
  // Legal moves preserve solvability. Avoid immediately undoing each move.
  for (let move = 0; move < 40; move += 1) {
    const choices = board.flatMap((_, index) =>
      index !== previousBlank && canSlideTile(board, index) ? [index] : [],
    );
    const index = choices[Math.floor(random() * choices.length)];
    previousBlank = board.indexOf(0);
    board = slideTile(board, index);
  }
  return isSlidingBoardSolved(board) ? slideTile(board, 7) : board;
};
