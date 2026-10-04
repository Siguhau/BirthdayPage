import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TrapdoorCodeModal from "./TrapdoorCodeModal";

describe("TrapdoorCodeModal", () => {
  it("unlocks with the encrypted word NYREV", () => {
    const onUnlock = vi.fn();
    render(<TrapdoorCodeModal onClose={vi.fn()} onUnlock={onUnlock} />);

    fireEvent.change(screen.getByLabelText("Kryptert passord"), {
      target: { value: "NYREV" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lås opp lemmen" }));

    expect(onUnlock).toHaveBeenCalledOnce();
  });

  it("keeps the cipher details out of the lock after a wrong answer", () => {
    render(<TrapdoorCodeModal onClose={vi.fn()} onUnlock={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Kryptert passord"), {
      target: { value: "junar" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lås opp lemmen" }));

    expect(screen.getByText("Feil kode.")).toBeVisible();
    expect(screen.queryByText(/K =/)).not.toBeInTheDocument();
    expect(screen.queryByText(/JUNAR/)).not.toBeInTheDocument();
    expect(screen.queryByText(/ett steg/i)).not.toBeInTheDocument();
  });
});
