import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { successfulLongboiPhotos } from "../puzzles/longboiPhotos";
import LongboiPhotoModal from "./LongboiPhotoModal";

describe("LongboiPhotoModal", () => {
  it("shows the first successful photo as the puzzle reward", () => {
    render(
      <LongboiPhotoModal
        onClose={vi.fn()}
        result={{
          details: "Bildet er lagt i inventaret.",
          photo: successfulLongboiPhotos[0],
          savedToInventory: true,
        }}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Et Longboi-bilde" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: successfulLongboiPhotos[0].alt }),
    ).toHaveAttribute("src", successfulLongboiPhotos[0].src);
    expect(
      screen.getByText("Longboi-bildet er lagt i inventaret."),
    ).toBeInTheDocument();
  });

  it("shows later successful photos without adding another inventory reward", () => {
    render(
      <LongboiPhotoModal
        onClose={vi.fn()}
        result={{
          details: "Ta gjerne flere bilder for å se flere Longboi-øyeblikk.",
          photo: successfulLongboiPhotos[1],
          savedToInventory: false,
        }}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Et nytt Longboi-bilde" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Longboi-bildet er lagt i inventaret."),
    ).not.toBeInTheDocument();
  });

  it("closes with Escape", () => {
    const onClose = vi.fn();
    render(
      <LongboiPhotoModal
        onClose={onClose}
        result={{
          details: "Bildet er lagt i inventaret.",
          photo: successfulLongboiPhotos[0],
          savedToInventory: true,
        }}
      />,
    );

    fireEvent.keyDown(window, { code: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
