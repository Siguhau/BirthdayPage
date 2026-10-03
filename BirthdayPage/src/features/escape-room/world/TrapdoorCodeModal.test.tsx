import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TrapdoorCodeModal from "./TrapdoorCodeModal";

describe("TrapdoorCodeModal", () => {
  it("unlocks with the encrypted word KVOBS", () => {
    const onUnlock = vi.fn();
    render(<TrapdoorCodeModal onClose={vi.fn()} onUnlock={onUnlock} />);

    fireEvent.change(screen.getByLabelText("Kryptert passord"), {
      target: { value: "KVOBS" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lås opp lemmen" }));

    expect(onUnlock).toHaveBeenCalledOnce();
  });

  it("shows a Caesar hint after a wrong answer", () => {
    render(<TrapdoorCodeModal onClose={vi.fn()} onUnlock={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Kryptert passord"), {
      target: { value: "junar" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lås opp lemmen" }));

    expect(screen.getByText(/Flytt hver bokstav i JUNAR/)).toBeVisible();
  });
});
