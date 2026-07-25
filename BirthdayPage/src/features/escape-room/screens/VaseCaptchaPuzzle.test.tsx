import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { VaseCaptchaTile } from "../puzzles/vaseCaptchaConfig";
import VaseCaptchaPuzzle from "./VaseCaptchaPuzzle";

const configuredTiles: readonly VaseCaptchaTile[] = Array.from(
  { length: 16 },
  (_, index) => ({
    alt: `Bilde ${String(index + 1)}`,
    id: `tile-${String(index + 1).padStart(2, "0")}`,
    imageSrc:
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  }),
);

describe("VaseCaptchaPuzzle", () => {
  it("solves after selecting every vase and no incorrect tiles", () => {
    const onSolve = vi.fn();
    render(
      <VaseCaptchaPuzzle
        correctTileIds={["tile-02", "tile-11"]}
        onSolve={onSolve}
        tiles={configuredTiles}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Bilde 2. Ikke valgt" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Bilde 11. Ikke valgt" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Bekreft" }));

    expect(onSolve).toHaveBeenCalledOnce();
  });

  it("shows feedback when the selection is incorrect", () => {
    const onSolve = vi.fn();
    render(
      <VaseCaptchaPuzzle
        correctTileIds={["tile-02"]}
        onSolve={onSolve}
        tiles={configuredTiles}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Bilde 3. Ikke valgt" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Bekreft" }));

    expect(onSolve).not.toHaveBeenCalled();
    expect(
      screen.getByText("Ikke helt. Se nøye og prøv igjen."),
    ).toBeInTheDocument();
  });

  it("keeps verification disabled until all images and answers are configured", () => {
    render(<VaseCaptchaPuzzle onSolve={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Bekreft" })).toBeDisabled();
    expect(
      screen.getByText("Bildene til denne gåten er ikke lagt inn ennå."),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Bilde \d+\. Ikke valgt/ }),
    ).toHaveLength(16);
  });
});
