import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CameraVendingModal from "./CameraVendingModal";
import {
  cameraRewards,
  getCameraTokenBalance,
  tokenPuzzles,
  type CameraRewardId,
} from "../puzzles/cameraRewards";
import { gameReducer } from "../state/gameReducer";
import { initialGameState, type GameState } from "../state/gameTypes";

afterEach(() => {
  vi.restoreAllMocks();
});

const renderMachine = (tokenBalance = 3) => {
  const onRedeem = vi.fn<(itemId: CameraRewardId) => void>();
  render(
    <CameraVendingModal
      tokenBalance={tokenBalance}
      ownedItems={[]}
      onRedeem={onRedeem}
      onClose={vi.fn()}
    />,
  );
  return onRedeem;
};

describe("CameraVendingModal", () => {
  it.each(cameraRewards.map((reward, index) => ({ ...reward, index })))(
    "can randomly dispense $label without revealing it in advance",
    ({ itemId, label, index }) => {
      vi.spyOn(Math, "random").mockReturnValue(
        (index + 0.5) / cameraRewards.length,
      );
      const onRedeem = renderMachine(1);
      expect(
        screen.queryByText(
          /fotostudio|kamerastativ|kamerabatteri|WiiMonday|Brita/i,
        ),
      ).not.toBeInTheDocument();
      const button = screen.getByRole("button", {
        name: "Sett inn en pollett",
      });
      fireEvent.click(button);
      fireEvent.click(button);
      expect(onRedeem).toHaveBeenCalledExactlyOnceWith(itemId);
      expect(
        screen.getByText(`Automaten klunker. Du fikk: ${label}.`),
      ).toBeVisible();
      expect(screen.getByRole("status")).toHaveTextContent("Polletter: 0");
      expect(button).toBeDisabled();
    },
  );

  it("dispenses each piece only once even before ownership props update", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const onRedeem = renderMachine();
    const button = screen.getByRole("button", { name: "Sett inn en pollett" });
    for (let i = 0; i < 4; i += 1) fireEvent.click(button);
    expect(onRedeem.mock.calls.map(([item]) => item)).toEqual([
      "tripod",
      "camera",
      "camera-battery",
    ]);
    expect(screen.getByRole("button", { name: "Tomt" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Polletter: 0");
  });

  it("excludes carried and installed pieces after reopening and charges one token each", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    let state: GameState = {
      ...initialGameState,
      stage: "exploring",
      solvedPuzzles: tokenPuzzles.map(({ puzzleId }) => puzzleId),
    };
    const onRedeem = vi.fn((itemId: "tripod" | "camera" | "camera-battery") => {
      state = gameReducer(state, { type: "REDEEM_CAMERA_REWARD", itemId });
    });
    const view = () => (
      <CameraVendingModal
        tokenBalance={getCameraTokenBalance(state)}
        ownedItems={[...state.inventory, ...state.installedItems]}
        onRedeem={onRedeem}
        onClose={vi.fn()}
      />
    );
    const first = render(view());
    fireEvent.click(
      screen.getByRole("button", { name: "Sett inn en pollett" }),
    );
    state = gameReducer(state, { type: "INSTALL_ITEM", itemId: "tripod" });
    first.unmount();
    const reopened = render(view());
    fireEvent.click(
      screen.getByRole("button", { name: "Sett inn en pollett" }),
    );
    reopened.rerender(view());
    expect(screen.getByRole("status")).toHaveTextContent("Polletter: 1");
    reopened.unmount();
    render(view());
    fireEvent.click(
      screen.getByRole("button", { name: "Sett inn en pollett" }),
    );
    expect(onRedeem.mock.calls.map(([item]) => item)).toEqual([
      "tripod",
      "camera",
      "camera-battery",
    ]);
    expect(getCameraTokenBalance(state)).toBe(0);
    expect(screen.getByRole("button", { name: "Tomt" })).toBeDisabled();
  });

  it("does not dispense without tokens", () => {
    const onRedeem = renderMachine(0);
    const button = screen.getByRole("button", { name: "Sett inn en pollett" });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(onRedeem).not.toHaveBeenCalled();
  });
});
