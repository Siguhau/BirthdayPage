import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, DoubleSide, type Group, type Mesh } from "three";
import usePrefersReducedMotion from "../../../utils/usePrefersReducedMotion";

type WorkshopDiscoProps = {
  active: boolean;
};

const discoBeams = [
  { color: "#63ecff", position: [1.15, 1.35, 0] },
  { color: "#ff4fdb", position: [-1.15, 1.35, 0] },
  { color: "#fff45e", position: [0, 1.35, 1.15] },
  { color: "#7dff72", position: [0, 1.35, -1.15] },
] as const;

const WorkshopDisco = ({ active }: WorkshopDiscoProps) => {
  const rotatingLights = useRef<Group>(null);
  const discoBall = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame(({ clock }, delta) => {
    if (!active || prefersReducedMotion) return;

    if (rotatingLights.current !== null) {
      rotatingLights.current.rotation.y += delta * 0.75;
      const pulse = 1 + Math.sin(clock.elapsedTime * 6) * 0.08;
      rotatingLights.current.scale.set(pulse, 1, pulse);
    }
    if (discoBall.current !== null) {
      discoBall.current.rotation.y += delta * 1.1;
      discoBall.current.rotation.z += delta * 0.18;
    }
  });

  if (!active) return null;

  return (
    <group position={[7, 0, 0]}>
      <mesh position={[0, 2.9, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
        <meshStandardMaterial
          color="#aab5c4"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
      <mesh castShadow position={[0, 2.55, 0]} ref={discoBall}>
        <sphereGeometry args={[0.38, 16, 12]} />
        <meshStandardMaterial
          color="#eaf4ff"
          emissive="#a9d8ff"
          emissiveIntensity={0.65}
          flatShading
          metalness={0.95}
          roughness={0.16}
        />
      </mesh>
      <pointLight
        color="#eaf4ff"
        distance={6}
        intensity={8}
        position={[0, 2.5, 0]}
      />

      <group ref={rotatingLights}>
        {discoBeams.map(({ color, position }) => (
          <group key={color} position={position}>
            <mesh>
              <coneGeometry args={[0.72, 2.5, 18, 1, true]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={color}
                depthWrite={false}
                opacity={0.11}
                side={DoubleSide}
                transparent
              />
            </mesh>
            <pointLight
              color={color}
              decay={2}
              distance={5}
              intensity={9}
              position={[0, -0.95, 0]}
            />
          </group>
        ))}
      </group>

      {discoBeams.map(({ color, position }) => (
        <mesh
          key={`floor-${color}`}
          position={[position[0], 0.035, position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.24, 0.42, 20]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={color}
            opacity={0.8}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

export default WorkshopDisco;
