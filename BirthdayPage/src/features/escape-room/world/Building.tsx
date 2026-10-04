import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { worldCeilings, worldFloors, worldWalls } from "./worldConfig";
import { interactionOccluderKey } from "./interactionOcclusion";
import type { WorldBox } from "./worldTypes";

const StaticBox = ({
  color,
  position,
  size,
  blocksInteraction = false,
}: WorldBox & { blocksInteraction?: boolean }) => (
  <RigidBody colliders={false} position={position} type="fixed">
    <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
    <mesh
      castShadow
      receiveShadow
      userData={blocksInteraction ? { [interactionOccluderKey]: true } : {}}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  </RigidBody>
);

const Building = () => (
  <group>
    {worldFloors.map((box) => (
      <StaticBox blocksInteraction key={box.id} {...box} />
    ))}
    {worldCeilings.map((box) => (
      <StaticBox blocksInteraction key={box.id} {...box} />
    ))}
    {worldWalls.map((box) => (
      <StaticBox blocksInteraction key={box.id} {...box} />
    ))}
  </group>
);

export default Building;
