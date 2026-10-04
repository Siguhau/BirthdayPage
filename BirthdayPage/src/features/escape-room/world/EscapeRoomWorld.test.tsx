import { fireEvent, render, screen } from "@testing-library/react";
import { useEffect, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { MirrorOrientations } from "../state/gameTypes";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@react-three/rapier", () => ({
  Physics: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("./PhotoChallenge", () => ({
  default: function PhotoChallengeMock({
    attemptId,
    onCountdownChange,
    onResult,
    paused,
  }: {
    attemptId: number;
    onCountdownChange: (seconds: number) => void;
    onResult: (result: {
      distance: number;
      horizontalAngle: number;
      pitch: number;
      success: boolean;
    }) => void;
    paused?: boolean;
  }) {
    useEffect(() => {
      if (attemptId > 0) onCountdownChange(5);
    }, [attemptId, onCountdownChange]);

    return (
      <button
        data-attempt-id={attemptId}
        data-paused={String(paused)}
        onClick={() => {
          onResult({
            distance: 0,
            horizontalAngle: 0,
            pitch: 0,
            success: true,
          });
        }}
        type="button"
      >
        Take test photo
      </button>
    );
  },
}));

vi.mock("./InteractionSystem", () => ({
  default: ({
    interactions,
    onTargetChange,
  }: {
    interactions: readonly {
      action: { type: string };
      id: string;
    }[];
    onTargetChange: (target: (typeof interactions)[number]) => void;
  }) => {
    const photoInteraction = interactions.find(
      (interaction) => interaction.action.type === "start-photo",
    );
    const puzzleInteraction = interactions.find(
      (interaction) => interaction.action.type === "open-puzzle",
    );

    return (
      <>
        {photoInteraction !== undefined && (
          <button
            onClick={() => {
              onTargetChange(photoInteraction);
            }}
            type="button"
          >
            Target camera
          </button>
        )}
        {puzzleInteraction !== undefined && (
          <button
            onClick={() => {
              onTargetChange(puzzleInteraction);
            }}
            type="button"
          >
            Target puzzle
          </button>
        )}
      </>
    );
  },
}));

vi.mock("./BasementLadder", () => ({ default: () => null }));
vi.mock("./BasementTrapdoor", () => ({ default: () => null }));
vi.mock("./Building", () => ({ default: () => null }));
vi.mock("./CameraVendingMachine", () => ({ default: () => null }));
vi.mock("./CipherBust", () => ({ default: () => null }));
vi.mock("./CornArcadeStation", () => ({ default: () => null }));
vi.mock("./DanceStation", () => ({ default: () => null }));
vi.mock("./FoodScatter", () => ({ default: () => null }));
vi.mock("./HiddenRoomWallToggle", () => ({ default: () => null }));
vi.mock("./LaserPuzzleWorld", () => ({ default: () => null }));
vi.mock("./LightFixtures", () => ({ default: () => null }));
vi.mock("./MouseLookController", () => ({ default: () => null }));
vi.mock("./PhotoCameraStand", () => ({ default: () => null }));
vi.mock("./PhotoStudioDecor", () => ({ default: () => null }));
vi.mock("./PlayerController", () => ({ default: () => null }));
vi.mock("./ReadingCorner", () => ({ default: () => null }));
vi.mock("./SlidingDoor", () => ({ default: () => null }));
vi.mock("./SlidingTilesStation", () => ({ default: () => null }));
vi.mock("./TrapdoorCipherClue", () => ({ default: () => null }));
vi.mock("./WallPhotoHook", () => ({ default: () => null }));
vi.mock("./WorkshopDisco", () => ({ default: () => null }));
vi.mock("./WorldHud", () => ({ default: () => null }));
vi.mock("./CaptchaStation", () => ({ default: () => null }));

import EscapeRoomWorld from "./EscapeRoomWorld";

const mirrorOrientations: MirrorOrientations = {
  "mirror-1": 0,
  "mirror-2": 0,
  "mirror-3": 0,
};

const createProps = () => ({
  activePuzzleOpen: false,
  chestOpen: false,
  installedItemIds: ["camera", "camera-battery", "tripod"] as const,
  inventoryItemIds: [] as const,
  laserPowered: false,
  mirrorOrientations,
  onCollectPepsi: vi.fn(),
  onEnterLaserCode: vi.fn(),
  onInstallItem: vi.fn(),
  onOpenPuzzle: vi.fn(),
  onPickUpItem: vi.fn(),
  onRedeemCameraReward: vi.fn(),
  onReset: vi.fn(),
  onRotateMirror: vi.fn(),
  onSolvePuzzle: vi.fn(),
  solvedPuzzleIds: [] as const,
});

describe("EscapeRoomWorld photo flow", () => {
  it("awards only the first successful photo while allowing later photos", () => {
    const props = createProps();
    const { rerender } = render(<EscapeRoomWorld {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Target camera" }));
    fireEvent.keyDown(window, { code: "KeyE" });
    expect(
      screen.getByRole("button", { name: "Take test photo" }),
    ).toHaveAttribute("data-attempt-id", "1");
    fireEvent.click(screen.getByRole("button", { name: "Target puzzle" }));
    fireEvent.keyUp(window, { code: "KeyE" });
    fireEvent.keyDown(window, { code: "KeyE" });
    expect(props.onOpenPuzzle).not.toHaveBeenCalled();
    expect(
      screen.getByText("Vent til kameraet har tatt bildet."),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Take test photo" }));

    expect(props.onPickUpItem).toHaveBeenCalledWith("longboi-photo-1");
    expect(props.onSolvePuzzle).toHaveBeenCalledWith("photo-timer");
    expect(
      screen.getByRole("heading", { name: "Et Longboi-bilde" }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Tilbake til rommet" }));
    rerender(
      <EscapeRoomWorld
        {...props}
        inventoryItemIds={["longboi-photo-1"]}
        solvedPuzzleIds={["photo-timer"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Target camera" }));
    fireEvent.keyUp(window, { code: "KeyE" });
    fireEvent.keyDown(window, { code: "KeyE" });
    expect(
      screen.getByRole("button", { name: "Take test photo" }),
    ).toHaveAttribute("data-attempt-id", "2");
    fireEvent.click(screen.getByRole("button", { name: "Take test photo" }));

    expect(props.onPickUpItem).toHaveBeenCalledTimes(1);
    expect(props.onSolvePuzzle).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { name: "Et nytt Longboi-bilde" }),
    ).toBeVisible();
  });

  it("passes Escape pause state to the active photo countdown", () => {
    render(<EscapeRoomWorld {...createProps()} />);

    expect(
      screen.getByRole("button", { name: "Take test photo" }),
    ).toHaveAttribute("data-paused", "false");
    fireEvent.keyDown(window, { code: "Escape" });

    expect(
      screen.getByRole("button", { name: "Take test photo" }),
    ).toHaveAttribute("data-paused", "true");
  });
});
