import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { tripodCupboardPosition } from "./worldConfig";

const wood = "#53301f";
const woodTrim = "#7b4c2d";
const tripodMetal = "#9099a8";

type TripodCupboardProps = {
  collected: boolean;
};

const PackedTripod = () => (
  <group position={[0, 0.2, 0]}>
    {[-0.08, 0, 0.08].map((x) => (
      <mesh castShadow key={x} position={[x, 0.72, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 1.28, 8]} />
        <meshStandardMaterial
          color={tripodMetal}
          metalness={0.72}
          roughness={0.32}
        />
      </mesh>
    ))}
    <mesh castShadow position={[0, 1.38, 0]}>
      <boxGeometry args={[0.32, 0.16, 0.2]} />
      <meshStandardMaterial color="#262c38" metalness={0.6} roughness={0.35} />
    </mesh>
  </group>
);

const TripodCupboard = ({ collected }: TripodCupboardProps) => (
  <RigidBody colliders={false} position={tripodCupboardPosition} type="fixed">
    <CuboidCollider args={[0.55, 1, 0.32]} position={[0, 1, 0]} />
    <group>
      <mesh castShadow receiveShadow position={[0, 1, -0.29]}>
        <boxGeometry args={[1.1, 2, 0.08]} />
        <meshStandardMaterial color={wood} roughness={0.86} />
      </mesh>
      <mesh castShadow position={[-0.52, 1, 0]}>
        <boxGeometry args={[0.08, 2, 0.65]} />
        <meshStandardMaterial color={woodTrim} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0.52, 1, 0]}>
        <boxGeometry args={[0.08, 2, 0.65]} />
        <meshStandardMaterial color={woodTrim} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.65]} />
        <meshStandardMaterial color={woodTrim} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 1.96, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.65]} />
        <meshStandardMaterial color={woodTrim} roughness={0.78} />
      </mesh>

      {!collected && <PackedTripod />}

      <group
        position={[-0.27, 1, 0.34]}
        rotation={[0, collected ? -1.15 : 0, 0]}
      >
        <mesh castShadow position={[0.27, 0, 0]}>
          <boxGeometry args={[0.52, 1.84, 0.08]} />
          <meshStandardMaterial color={wood} roughness={0.82} />
        </mesh>
        <mesh position={[0.46, 0, 0.06]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#d7ae55" metalness={0.7} />
        </mesh>
      </group>
      <group position={[0.27, 1, 0.34]} rotation={[0, collected ? 1.15 : 0, 0]}>
        <mesh castShadow position={[-0.27, 0, 0]}>
          <boxGeometry args={[0.52, 1.84, 0.08]} />
          <meshStandardMaterial color={wood} roughness={0.82} />
        </mesh>
        <mesh position={[-0.46, 0, 0.06]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#d7ae55" metalness={0.7} />
        </mesh>
      </group>
    </group>
  </RigidBody>
);

export default TripodCupboard;
