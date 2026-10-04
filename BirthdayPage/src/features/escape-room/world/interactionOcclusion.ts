import { Object3D, Raycaster, Vector3 } from "three";
import type { WorldInteraction } from "./worldTypes";

export const interactionOccluderKey = "blocksInteraction";

const hasInteractionOccluder = (object: Object3D | null) => {
  let current = object;
  while (current !== null) {
    if (current.userData[interactionOccluderKey] === true) return true;
    current = current.parent;
  }
  return false;
};

export const isInteractionOccluded = (
  raycaster: Raycaster,
  root: Object3D,
  origin: Vector3,
  target: Vector3,
) => {
  const direction = target.clone().sub(origin);
  const targetDistance = direction.length();
  if (targetDistance === 0) return false;

  raycaster.set(origin, direction.normalize());
  raycaster.far = Math.max(0, targetDistance - 0.02);
  return raycaster
    .intersectObject(root, true)
    .some(
      (hit) =>
        hit.distance < targetDistance - 0.02 &&
        hasInteractionOccluder(hit.object),
    );
};

export const getInteractionTargetSignature = (
  target: WorldInteraction | null,
) =>
  target === null
    ? null
    : JSON.stringify({
        action: target.action,
        id: target.id,
        label: target.label,
        position: target.position,
      });
