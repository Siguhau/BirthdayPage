import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { danceInteraction } from "./worldConfig";

type DanceStationProps = {
  solved: boolean;
};

const DanceStation = ({ solved }: DanceStationProps) => {
  const pulse = useRef<Group>(null);
  const glow = solved ? "#65ff98" : "#ff4fdb";

  useFrame(({ clock }) => {
    if (pulse.current === null) return;
    const scale = 1 + Math.sin(clock.elapsedTime * 5) * 0.06;
    pulse.current.scale.setScalar(scale);
  });

  return (
    <group>
      <RigidBody colliders={false} position={[8.75, 1.05, 0]} type="fixed">
        <CuboidCollider args={[0.35, 1.05, 1.05]} />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 2.1, 2.1]} />
          <meshStandardMaterial
            color="#241035"
            emissive={glow}
            emissiveIntensity={0.2}
            roughness={0.38}
          />
        </mesh>
        <group position={[-0.39, 0.2, 0]} ref={pulse}>
          <mesh>
            <boxGeometry args={[0.08, 0.9, 1.35]} />
            <meshStandardMaterial
              color={solved ? "#173d25" : "#4b165c"}
              emissive={glow}
              emissiveIntensity={1.25}
            />
          </mesh>
          <mesh position={[-0.06, 0, 0]}>
            <boxGeometry args={[0.05, 0.38, 0.38]} />
            <meshStandardMaterial
              color="#fff45e"
              emissive="#fff45e"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      </RigidBody>

      <group position={[7.05, 0.055, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[2.5, 0.1, 2.5]} />
          <meshStandardMaterial color="#160c25" roughness={0.4} />
        </mesh>
        {[
          {
            color: "#63ecff",
            position: [-0.78, 0.1, 0],
            rotation: Math.PI / 2,
          },
          {
            color: "#ff4fdb",
            position: [0.78, 0.1, 0],
            rotation: -Math.PI / 2,
          },
          {
            color: "#fff45e",
            position: [0, 0.1, -0.78],
            rotation: 0,
          },
          {
            color: "#7dff72",
            position: [0, 0.1, 0.78],
            rotation: Math.PI,
          },
        ].map(({ color, position, rotation }) => (
          <mesh
            key={color}
            position={position as [number, number, number]}
            rotation={[0, rotation, 0]}
          >
            <cylinderGeometry args={[0.64, 0.64, 0.1, 3]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={solved ? 0.35 : 0.85}
            />
          </mesh>
        ))}
      </group>

      <pointLight
        color={glow}
        distance={5}
        intensity={solved ? 3 : 7}
        position={danceInteraction.position}
      />
    </group>
  );
};

export default DanceStation;
