import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import { interactionOccluderKey } from "./interactionOcclusion";
import { trapdoorPosition } from "./worldConfig";

const BasementTrapdoor = ({ open }: { open: boolean }) => {
  const carpetRef = useRef<Group>(null);
  const lidPivotRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (carpetRef.current !== null) {
      carpetRef.current.position.x = MathUtils.damp(
        carpetRef.current.position.x,
        open ? 2.65 : 0,
        7,
        delta,
      );
    }
    if (lidPivotRef.current !== null) {
      lidPivotRef.current.rotation.z = MathUtils.damp(
        lidPivotRef.current.rotation.z,
        open ? Math.PI / 2 : 0,
        7,
        delta,
      );
    }
  });

  return (
    <group position={trapdoorPosition}>
      {!open && (
        <RigidBody colliders={false} type="fixed">
          <CuboidCollider args={[1.3, 0.08, 1.5]} />
        </RigidBody>
      )}

      <group position={[-1.3, 0, 0]} ref={lidPivotRef}>
        <group position={[1.3, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            userData={open ? {} : { [interactionOccluderKey]: true }}
          >
            <boxGeometry args={[2.6, 0.16, 3]} />
            <meshStandardMaterial
              color="#49301d"
              metalness={0.2}
              roughness={0.7}
            />
          </mesh>
          {[-0.95, 0, 0.95].map((x) => (
            <mesh key={x} position={[x, 0.1, 0]}>
              <boxGeometry args={[0.08, 0.06, 2.82]} />
              <meshStandardMaterial
                color="#b58a4b"
                metalness={0.65}
                roughness={0.35}
              />
            </mesh>
          ))}
        </group>
      </group>

      <group position={[0, 0.13, 0]} ref={carpetRef}>
        <mesh
          castShadow
          receiveShadow
          userData={open ? {} : { [interactionOccluderKey]: true }}
        >
          <boxGeometry args={[3, 0.05, 3.4]} />
          <meshStandardMaterial color="#7d2335" roughness={0.96} />
        </mesh>
        {[-1.2, 1.2].map((z) => (
          <mesh key={z} position={[0, 0.035, z]}>
            <boxGeometry args={[2.75, 0.025, 0.12]} />
            <meshStandardMaterial color="#d7aa55" roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default BasementTrapdoor;
