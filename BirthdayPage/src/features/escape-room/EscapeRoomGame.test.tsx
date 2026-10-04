import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EscapeRoomGame from "./EscapeRoomGame";
import {
  correctVaseTileIds,
  vaseCaptchaTiles,
} from "./puzzles/vaseCaptchaConfig";

const supportMock = vi.hoisted(() => vi.fn());

vi.mock("./support/useEscapeRoomSupport", () => ({
  default: supportMock,
}));

vi.mock("./world/EscapeRoomWorld", () => ({
  default: ({
    installedItemIds,
    inventoryItemIds,
    onInstallItem,
    onOpenPuzzle,
    onRedeemCameraReward,
    onReset,
  }: {
    installedItemIds: readonly string[];
    inventoryItemIds: readonly string[];
    onInstallItem: (itemId: "camera-battery") => void;
    onOpenPuzzle: (puzzleId: "vase-captcha" | "brita-sliding-tiles") => void;
    onRedeemCameraReward: (itemId: "camera-battery") => void;
    onReset: () => void;
  }) => (
    <section>
      <h1>Memory Gallery</h1>
      <button
        onClick={() => {
          onOpenPuzzle("brita-sliding-tiles");
        }}
        type="button"
      >
        Open Brita puzzle
      </button>
      <button
        onClick={() => {
          onOpenPuzzle("vase-captcha");
        }}
        type="button"
      >
        Open captcha
      </button>
      <output>
        {inventoryItemIds.includes("camera-battery")
          ? "Battery carried"
          : installedItemIds.includes("camera-battery")
            ? "Battery installed"
            : "No battery"}
      </output>
      <button
        onClick={() => {
          onRedeemCameraReward("camera-battery");
        }}
        type="button"
      >
        Redeem battery
      </button>
      <button
        onClick={() => {
          onInstallItem("camera-battery");
        }}
        type="button"
      >
        Install battery
      </button>
      <button onClick={onReset} type="button">
        Reset world
      </button>
    </section>
  ),
}));

describe("EscapeRoomGame", () => {
  beforeEach(() => {
    supportMock.mockReturnValue({ supported: true });
  });

  it("opens Brita's registered puzzle and closes it with Escape", async () => {
    render(<EscapeRoomGame onComplete={vi.fn()} userName="Runar" />);
    fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Open Brita puzzle" }),
    );
    expect(
      screen.getByRole("heading", { name: "Brita i biter" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Lukk gåten" })).toHaveFocus();
    fireEvent.keyDown(window, { code: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("starts the lazy walking prototype and can reset to the introduction", async () => {
    render(<EscapeRoomGame onComplete={vi.fn()} userName="Runar" />);

    fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));
    expect(
      await screen.findByRole("heading", { name: "Memory Gallery" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset world" }));
    expect(
      screen.getByRole("heading", {
        name: "Kjelleren til mor",
      }),
    ).toBeInTheDocument();
  });

  it("opens and closes the registered captcha puzzle from the world", async () => {
    render(<EscapeRoomGame onComplete={vi.fn()} userName="Runar" />);

    fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));
    await screen.findByRole("heading", { name: "Memory Gallery" });
    fireEvent.click(screen.getByRole("button", { name: "Open captcha" }));

    expect(
      screen.getByRole("dialog", { name: "Aktiv gåte" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Er det en vase?" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Lukk gåten" }));
    expect(
      screen.queryByRole("dialog", { name: "Aktiv gåte" }),
    ).not.toBeInTheDocument();
  });

  it("redeems an earned token for a battery and installs it", async () => {
    render(<EscapeRoomGame onComplete={vi.fn()} userName="Runar" />);

    fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));
    await screen.findByRole("heading", { name: "Memory Gallery" });

    fireEvent.click(screen.getByRole("button", { name: "Redeem battery" }));
    expect(screen.getByText("No battery")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open captcha" }));
    for (const tile of vaseCaptchaTiles) {
      if (correctVaseTileIds.includes(tile.id)) {
        fireEvent.click(
          screen.getByRole("button", { name: `${tile.alt}. Ikke valgt` }),
        );
      }
    }
    fireEvent.click(screen.getByRole("button", { name: "Bekreft" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Redeem battery" }));
    expect(screen.getByText("Battery carried")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Install battery" }));
    expect(screen.getByText("Battery installed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset world" }));
    fireEvent.click(screen.getByRole("button", { name: "Åpne døren" }));
    await screen.findByRole("heading", { name: "Memory Gallery" });
    fireEvent.click(screen.getByRole("button", { name: "Redeem battery" }));
    expect(screen.getByText("No battery")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open captcha" }));
    expect(
      screen.getByRole("dialog", { name: "Aktiv gåte" }),
    ).toBeInTheDocument();
  });

  it("explains an unsupported path before continuing to the celebration", () => {
    const onComplete = vi.fn();
    supportMock.mockReturnValue({
      reason: "mobile",
      supported: false,
    });

    render(<EscapeRoomGame onComplete={onComplete} userName="Runar" />);
    expect(
      screen.getByRole("heading", { name: "3D-rommet støttes ikke her" }),
    ).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Gå til feiringen" }));
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
