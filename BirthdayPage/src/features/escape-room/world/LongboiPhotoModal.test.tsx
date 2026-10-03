import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { successfulLongboiPhotos } from "../puzzles/longboiPhotos";
import LongboiPhotoModal from "./LongboiPhotoModal";

describe("LongboiPhotoModal", () => {
  it("shows the successful placeholder and collected reward", () => {
    render(
      <LongboiPhotoModal
        onClose={vi.fn()}
        result={{
          collectedCount: 1,
          details: "Ta ett til.",
          photo: successfulLongboiPhotos[0],
        }}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "1 av 2 samlet" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vellykket Longboi 1")).toBeInTheDocument();
    expect(
      screen.getByText("Longboi-bildet er lagt i inventaret."),
    ).toBeInTheDocument();
  });

  it("closes with Escape", () => {
    const onClose = vi.fn();
    render(
      <LongboiPhotoModal
        onClose={onClose}
        result={{
          collectedCount: 1,
          details: "Ta ett til.",
          photo: successfulLongboiPhotos[0],
        }}
      />,
    );

    fireEvent.keyDown(window, { code: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
