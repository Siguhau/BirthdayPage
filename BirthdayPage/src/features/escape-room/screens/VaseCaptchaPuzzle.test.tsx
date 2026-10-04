import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  correctVaseTileIds,
  vaseCaptchaTiles,
  type VaseCaptchaTile,
} from "../puzzles/vaseCaptchaConfig";
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
  it("solves with the original seven correct images", () => {
    const onSolve = vi.fn();
    render(<VaseCaptchaPuzzle onSolve={onSolve} />);

    expect(screen.getByRole("button", { name: "Bekreft" })).toBeEnabled();
    expect(document.querySelectorAll(".vase-captcha__image")).toHaveLength(16);

    expect(correctVaseTileIds).toEqual([
      "tile-02",
      "tile-04",
      "tile-06",
      "tile-09",
      "tile-11",
      "tile-14",
      "tile-16",
    ]);
    for (const tile of vaseCaptchaTiles.filter(({ id }) =>
      correctVaseTileIds.includes(id),
    )) {
      fireEvent.click(
        screen.getByRole("button", { name: `${tile.alt}. Ikke valgt` }),
      );
    }

    fireEvent.click(screen.getByRole("button", { name: "Bekreft" }));
    expect(onSolve).toHaveBeenCalledOnce();
  });

  it("rejects each new photo even when all original correct images are selected", () => {
    const onSolve = vi.fn();
    render(<VaseCaptchaPuzzle onSolve={onSolve} />);
    const newPhotos = vaseCaptchaTiles.filter(({ imageSrc }) =>
      imageSrc?.startsWith("/images/puzzles/vases/"),
    );
    expect(newPhotos).toHaveLength(9);
    for (const tile of vaseCaptchaTiles.filter(({ id }) =>
      correctVaseTileIds.includes(id),
    )) {
      fireEvent.click(
        screen.getByRole("button", { name: `${tile.alt}. Ikke valgt` }),
      );
    }
    for (const tile of newPhotos) {
      fireEvent.click(
        screen.getByRole("button", { name: `${tile.alt}. Ikke valgt` }),
      );
      fireEvent.click(screen.getByRole("button", { name: "Bekreft" }));
      expect(onSolve).not.toHaveBeenCalled();
      expect(
        screen.getByText("Ikke helt. Se nøye og prøv igjen."),
      ).toBeVisible();
      fireEvent.click(
        screen.getByRole("button", { name: `${tile.alt}. Valgt` }),
      );
    }
    fireEvent.click(screen.getByRole("button", { name: "Bekreft" }));
    expect(onSolve).toHaveBeenCalledOnce();
  });

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

  it("keeps verification disabled when an image is missing", () => {
    render(
      <VaseCaptchaPuzzle
        correctTileIds={["tile-02"]}
        onSolve={vi.fn()}
        tiles={configuredTiles.map((tile, index) =>
          index === 0 ? { ...tile, imageSrc: undefined } : tile,
        )}
      />,
    );

    expect(screen.getByRole("button", { name: "Bekreft" })).toBeDisabled();
    expect(
      screen.getByText("Bildene til denne gåten er ikke lagt inn ennå."),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Bilde \d+\. Ikke valgt/ }),
    ).toHaveLength(16);
  });
});
