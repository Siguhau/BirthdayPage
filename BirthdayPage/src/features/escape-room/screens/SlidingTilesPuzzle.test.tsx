import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SlidingTilesPuzzle from "./SlidingTilesPuzzle";

vi.mock("../puzzles/slidingTiles", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../puzzles/slidingTiles")>()),
  createSlidingBoard: () => [1, 2, 3, 4, 5, 6, 0, 7, 8],
}));

describe("SlidingTilesPuzzle", () => {
  it("ignores non-adjacent clicks, restores the full photo, and completes once", () => {
    const onSolve = vi.fn();
    render(<SlidingTilesPuzzle onSolve={onSolve} />);
    expect(screen.queryByTestId("heart-confetti")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Brikke 1,/ }));
    expect(screen.getByRole("status")).toHaveTextContent("0 trekk");
    fireEvent.click(screen.getByRole("button", { name: /^Brikke 7,/ }));
    expect(screen.getByRole("status")).toHaveTextContent("1 trekk");
    expect(onSolve).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /^Brikke 8,/ }));
    expect(
      screen.getByRole("img", { name: "Det ferdige bildet av Brita" }),
    ).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("2 trekk");
    expect(screen.getByTestId("heart-confetti").children).toHaveLength(100);
    expect(screen.getByTestId("heart-confetti")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    const finish = screen.getByRole("button", { name: "Tilbake til rommet" });
    fireEvent.click(finish);
    fireEvent.click(finish);
    expect(onSolve).toHaveBeenCalledOnce();
  });

  it("supports arrow keys without moving beyond the board or wrapping rows", () => {
    render(<SlidingTilesPuzzle onSolve={vi.fn()} />);
    const board = screen.getByRole("group", {
      name: "Skyvepuslespill med Brita",
    });
    fireEvent.keyDown(board, { key: "ArrowLeft" });
    fireEvent.keyDown(board, { key: "ArrowDown" });
    expect(screen.getByRole("status")).toHaveTextContent("0 trekk");
    fireEvent.keyDown(board, { key: "ArrowRight" });
    fireEvent.keyDown(board, { key: "ArrowRight" });
    expect(
      screen.getByRole("img", { name: "Det ferdige bildet av Brita" }),
    ).toBeVisible();
  });

  it("resets moves and tiles without a reference image or numbered hints", () => {
    render(<SlidingTilesPuzzle onSolve={vi.fn()} />);
    expect(
      screen.queryByRole("img", { name: "Referansebilde av Brita" }),
    ).not.toBeInTheDocument();
    const piece = screen.getByRole("button", { name: /^Brikke 7,/ });
    expect(piece).toHaveTextContent("");
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    fireEvent.click(piece);
    fireEvent.click(
      screen.getByRole("button", { name: "Start bildet på nytt" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("0 trekk");
    expect(
      screen.getByRole("button", { name: "Brikke 7, rad 3, kolonne 2" }),
    ).toBeInTheDocument();
  });
});
