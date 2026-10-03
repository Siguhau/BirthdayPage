import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import { Vector3 } from "three";
import {
  basementLadderClimbBounds,
  getAreaAtPosition,
  worldGravity,
} from "./worldConfig";
import type { AreaId } from "./worldTypes";
import useMovementKeys from "./useMovementKeys";

const moveSpeed = 3.6;
const jumpSpeed = 4.8;
const ladderClimbSpeed = 2.5;
const groundCheckDistance = 0.95;
const cameraHeightOffset = 0.55;

type PlayerControllerProps = {
  enabled: boolean;
  onAreaChange: (areaId: AreaId) => void;
  slowed: boolean;
};

const PlayerController = ({
  enabled,
  onAreaChange,
  slowed,
}: PlayerControllerProps) => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const currentAreaRef = useRef<AreaId>("memory-gallery");
  const jumpWasPressed = useRef(false);
  const movementDirection = useRef(new Vector3());
  const pressedKeys = useMovementKeys(enabled);
  const { rapier, world } = useRapier();
  const { camera } = useThree();

  useBeforePhysicsStep((physicsWorld) => {
    const body = bodyRef.current;
    if (body === null) return;

    const forward =
      Number(pressedKeys.current.has("KeyW")) -
      Number(pressedKeys.current.has("KeyS"));
    const sideways =
      Number(pressedKeys.current.has("KeyD")) -
      Number(pressedKeys.current.has("KeyA"));
    const direction = movementDirection.current.set(sideways, 0, -forward);

    if (direction.lengthSq() > 0 && enabled) {
      direction.normalize().applyQuaternion(camera.quaternion);
      direction.y = 0;
      direction
        .normalize()
        .multiplyScalar(slowed ? moveSpeed * 0.42 : moveSpeed);
    } else {
      direction.set(0, 0, 0);
    }

    const velocity = body.linvel();
    const position = body.translation();
    const onBasementLadder =
      position.x >= basementLadderClimbBounds.minX &&
      position.x <= basementLadderClimbBounds.maxX &&
      position.y >= basementLadderClimbBounds.minY &&
      position.y <= basementLadderClimbBounds.maxY &&
      position.z >= basementLadderClimbBounds.minZ &&
      position.z <= basementLadderClimbBounds.maxZ;
    const canStepOffLadder = position.y <= -2 || position.y >= 0.65;
    const jumpPressed = pressedKeys.current.has("Space");
    const jumpRequested = jumpPressed && !jumpWasPressed.current;
    jumpWasPressed.current = jumpPressed;
    let verticalVelocity = onBasementLadder
      ? forward * ladderClimbSpeed
      : velocity.y + worldGravity[1] * physicsWorld.timestep;

    if (onBasementLadder && !canStepOffLadder) {
      direction.set(0, 0, 0);
    }

    if (enabled && jumpRequested && velocity.y <= 0.15) {
      const groundRay = new rapier.Ray(position, { x: 0, y: -1, z: 0 });
      const groundHit = world.castRay(
        groundRay,
        groundCheckDistance,
        true,
        undefined,
        undefined,
        undefined,
        body,
      );

      if (groundHit !== null) {
        verticalVelocity = jumpSpeed;
      }
    }

    body.setLinvel(
      { x: direction.x, y: verticalVelocity, z: direction.z },
      true,
    );
  });

  useFrame(() => {
    const body = bodyRef.current;
    if (body === null) return;

    const position = body.translation();
    camera.position.set(
      position.x,
      position.y + cameraHeightOffset,
      position.z,
    );

    const nextArea = getAreaAtPosition(position.x, position.z);
    if (nextArea !== currentAreaRef.current) {
      currentAreaRef.current = nextArea;
      onAreaChange(nextArea);
    }
  });

  return (
    <RigidBody
      canSleep={false}
      colliders={false}
      enabledRotations={[false, false, false]}
      friction={0}
      gravityScale={0}
      position={[0, 1, 8]}
      ref={bodyRef}
    >
      <CapsuleCollider args={[0.5, 0.35]} />
    </RigidBody>
  );
};

export default PlayerController;
