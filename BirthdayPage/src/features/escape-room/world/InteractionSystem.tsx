import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Raycaster, Vector3 } from "three";
import {
  getInteractionTargetSignature,
  isInteractionOccluded,
} from "./interactionOcclusion";
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
  const targetedSignatureRef = useRef<string | null>(null);
  const targetPosition = useRef(new Vector3());
  const directionToTarget = useRef(new Vector3());
  const lookDirection = useRef(new Vector3());
  const raycaster = useRef(new Raycaster());
  const { camera, scene } = useThree();

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
            minimumLookAlignment &&
          !isInteractionOccluded(
            raycaster.current,
            scene,
            camera.position,
            targetPosition.current,
          )
        ) {
          closestDistance = distance;
          closestTarget = interaction;
        }
      }
    }

    const nextSignature = getInteractionTargetSignature(closestTarget);
    if (nextSignature !== targetedSignatureRef.current) {
      targetedSignatureRef.current = nextSignature;
      onTargetChange(closestTarget);
    }
  });

  return null;
};

export default InteractionSystem;
