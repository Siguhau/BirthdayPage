import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CipherPlaqueModal from "./CipherPlaqueModal";

describe("CipherPlaqueModal", () => {
  it("explains Caesar shifts without solving the key", () => {
    render(<CipherPlaqueModal onClose={vi.fn()} />);

    expect(
      screen.getByRole("dialog", { name: "Cæsars kode" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Alle bokstavene flyttes like langt/),
    ).toBeVisible();
    expect(screen.getByText("encrypt(C) = (C + K) mod 26")).toBeInTheDocument();
    expect(screen.getByText("decrypt(C) = (C − K) mod 26")).toBeInTheDocument();
    expect(screen.getByText("A = 0, B = 1, … Z = 25")).toBeInTheDocument();
    expect(screen.queryByText("K=30")).not.toBeInTheDocument();
  });

  it("closes with Escape", () => {
    const onClose = vi.fn();
    render(<CipherPlaqueModal onClose={onClose} />);

    fireEvent.keyDown(window, { code: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
  });
});
