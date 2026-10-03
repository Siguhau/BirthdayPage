import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { worldCeilings, worldFloors, worldWalls } from "./worldConfig";
import type { WorldBox } from "./worldTypes";

const StaticBox = ({ color, position, size }: WorldBox) => (
  <RigidBody colliders={false} position={position} type="fixed">
    <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  </RigidBody>
);

const Building = () => (
  <group>
    {worldFloors.map((box) => (
      <StaticBox key={box.id} {...box} />
    ))}
    {worldCeilings.map((box) => (
      <StaticBox key={box.id} {...box} />
    ))}
    {worldWalls.map((box) => (
      <StaticBox key={box.id} {...box} />
    ))}
  </group>
);

export default Building;
