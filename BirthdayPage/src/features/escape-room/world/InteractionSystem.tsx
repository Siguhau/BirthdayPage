import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import type { WorldInteraction } from "./worldTypes";

const interactionRange = 2.7;
const minimumLookAlignment = 0.72;

type InteractionSystemProps = {
  enabled: boolean;
  interactions: readonly WorldInteraction[];
  onTargetChange: (target: WorldInteraction | null) => void;
};

const InteractionSystem = ({
  enabled,
  interactions,
  onTargetChange,
}: InteractionSystemProps) => {
  const targetedIdRef = useRef<string | null>(null);
  const targetPosition = useRef(new Vector3());
  const directionToTarget = useRef(new Vector3());
  const lookDirection = useRef(new Vector3());
  const { camera } = useThree();

  useFrame(() => {
    camera.getWorldDirection(lookDirection.current);
    let closestTarget: WorldInteraction | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    if (enabled) {
      for (const interaction of interactions) {
        targetPosition.current.set(...interaction.position);
        directionToTarget.current
          .copy(targetPosition.current)
          .sub(camera.position);
        const distance = directionToTarget.current.length();
        directionToTarget.current.normalize();

        if (
          distance <= interactionRange &&
          distance < closestDistance &&
          directionToTarget.current.dot(lookDirection.current) >=
            minimumLookAlignment
        ) {
          closestDistance = distance;
          closestTarget = interaction;
        }
      }
    }

    if (closestTarget?.id !== targetedIdRef.current) {
      targetedIdRef.current = closestTarget?.id ?? null;
      onTargetChange(closestTarget);
    }
  });

  return null;
};

export default InteractionSystem;
