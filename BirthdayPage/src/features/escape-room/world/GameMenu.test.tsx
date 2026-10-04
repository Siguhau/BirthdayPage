import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GameMenu from "./GameMenu";

describe("GameMenu", () => {
  it("shows controls and resumes the game", () => {
    const onResume = vi.fn();
    render(<GameMenu onClearMemory={vi.fn()} onResume={onResume} />);

    fireEvent.click(screen.getByRole("button", { name: "Vis kontroller" }));
    expect(screen.getByText(/WASD beveger deg/)).toBeInTheDocument();
    expect(screen.getByText(/Space hopper/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fortsett" }));
    expect(onResume).toHaveBeenCalledOnce();
  });

  it("requires confirmation before clearing progress", () => {
    const onClearMemory = vi.fn();
    render(<GameMenu onClearMemory={onClearMemory} onResume={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Tøm minnet" }));
    expect(onClearMemory).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Ja, slett minnet" }));
    expect(onClearMemory).toHaveBeenCalledOnce();
  });
});
