import { useState } from "react";
import PuzzleOverlay from "../overlays/PuzzleOverlay";
import { cameraRewards, type CameraRewardId } from "../puzzles/cameraRewards";
import type { ItemId } from "../state/gameTypes";

type Props = {
  tokenBalance: number;
  ownedItems: readonly ItemId[];
  onRedeem: (itemId: CameraRewardId) => void;
  onClose: () => void;
};

const CameraVendingModal = ({
  tokenBalance,
  ownedItems,
  onRedeem,
  onClose,
}: Props) => {
  const [message, setMessage] = useState("");
  const [claimedItems, setClaimedItems] = useState<CameraRewardId[]>([]);
  const isClaimed = (itemId: CameraRewardId) =>
    ownedItems.includes(itemId) || claimedItems.includes(itemId);
  const remainingRewards = cameraRewards.filter(
    ({ itemId }) => !isClaimed(itemId),
  );
  const availableTokens = Math.max(
    0,
    tokenBalance -
      claimedItems.filter((itemId) => !ownedItems.includes(itemId)).length,
  );
  return (
    <PuzzleOverlay onClose={onClose}>
      <section className="camera-vending">
        <h2>Automaten</h2>
        <p role="status">
          <strong>Polletter: {availableTokens}</strong>
        </p>
        <div className="camera-vending__rewards">
          <button
            className="escape-room-game__action"
            disabled={availableTokens < 1 || remainingRewards.length === 0}
            onClick={() => {
              if (availableTokens < 1 || remainingRewards.length === 0) return;
              const reward =
                remainingRewards[
                  Math.floor(Math.random() * remainingRewards.length)
                ];
              setClaimedItems((items) => [...items, reward.itemId]);
              onRedeem(reward.itemId);
              setMessage(`Automaten klunker. Du fikk: ${reward.label}.`);
            }}
            type="button"
          >
            {remainingRewards.length === 0 ? "Tomt" : "Sett inn en pollett"}
          </button>
        </div>
        <p aria-live="polite">{message}</p>
      </section>
    </PuzzleOverlay>
  );
};
export default CameraVendingModal;
