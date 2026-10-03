import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import type { WorldDoor } from "./worldTypes";

const doorSpeed = 2.5;

type SlidingDoorProps = WorldDoor & {
  open: boolean;
};

const SlidingDoor = ({
  color,
  open,
  openPosition,
  position,
  widthAxis = "z",
}: SlidingDoorProps) => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const currentPosition = useRef([...position] as [number, number, number]);

  useFrame((_, delta) => {
    const body = bodyRef.current;
    if (body === null) return;

    const target = open ? openPosition : position;
    const movingAxis = widthAxis === "x" ? 0 : 2;
    const distance = target[movingAxis] - currentPosition.current[movingAxis];
    if (Math.abs(distance) < 0.005) return;

    currentPosition.current[movingAxis] +=
      Math.sign(distance) * Math.min(Math.abs(distance), doorSpeed * delta);
    body.setNextKinematicTranslation({
      x: currentPosition.current[0],
      y: position[1],
      z: currentPosition.current[2],
    });
  });

  return (
    <RigidBody
      colliders={false}
      position={position}
      ref={bodyRef}
      type="kinematicPosition"
    >
      <CuboidCollider
        args={widthAxis === "x" ? [1.4, 1.2, 0.16] : [0.16, 1.2, 1.4]}
      />
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={widthAxis === "x" ? [2.8, 2.4, 0.32] : [0.32, 2.4, 2.8]}
        />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.65} />
      </mesh>
      <mesh
        position={
          widthAxis === "x"
            ? [-0.85, 0, 0.2]
            : [position[0] < 0 ? 0.2 : -0.2, 0, -0.85]
        }
        rotation={widthAxis === "x" ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.11, 0.11, 0.035, 18]} />
        <meshStandardMaterial color="#f2d889" metalness={0.7} roughness={0.3} />
      </mesh>
    </RigidBody>
  );
};

export default SlidingDoor;
