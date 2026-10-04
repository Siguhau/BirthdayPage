import { describe, expect, it } from "vitest";
import {
  canSlideTile,
  createSlidingBoard,
  isSlidingBoardSolved,
  slideTile,
  solvedSlidingBoard,
} from "./slidingTiles";

describe("sliding tiles", () => {
  it("moves only tiles adjacent to the empty space", () => {
    expect(slideTile(solvedSlidingBoard, 7)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 0, 8,
    ]);
    expect(slideTile(solvedSlidingBoard, 5)).toEqual([
      1, 2, 3, 4, 5, 0, 7, 8, 6,
    ]);
    expect(slideTile(solvedSlidingBoard, 0)).toBe(solvedSlidingBoard);
    expect(slideTile(solvedSlidingBoard, 8)).toBe(solvedSlidingBoard);
    expect(canSlideTile(solvedSlidingBoard, -1)).toBe(false);
    expect(canSlideTile(solvedSlidingBoard, 9)).toBe(false);
    expect(canSlideTile([1, 2, 0, 4, 5, 6, 7, 8, 3], 3)).toBe(false);
  });

  it("recognizes completion only when every piece is back in order", () => {
    expect(isSlidingBoardSolved(solvedSlidingBoard)).toBe(true);
    expect(isSlidingBoardSolved([1, 2, 3, 4, 5, 6, 7, 0, 8])).toBe(false);
    expect(isSlidingBoardSolved([])).toBe(false);
  });

  it("creates unsolved, solvable permutations, including with constant randomness", () => {
    let seed = 12345;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
    const boards = Array.from({ length: 100 }, () =>
      createSlidingBoard(random),
    );
    boards.push(
      createSlidingBoard(() => 0),
      createSlidingBoard(() => 0.99999),
    );
    for (const board of boards) {
      expect([...board].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(isSlidingBoardSolved(board)).toBe(false);
      const pieces = board.filter((tile) => tile !== 0);
      // A 3×3 board is reachable from the goal exactly when inversions are even.
      const inversions = pieces.reduce(
        (total, tile, index) =>
          total +
          pieces.slice(index + 1).filter((other) => other < tile).length,
        0,
      );
      expect(inversions % 2).toBe(0);
    }
    expect(new Set(boards.map((board) => board.join())).size).toBeGreaterThan(
      50,
    );
  });
});
