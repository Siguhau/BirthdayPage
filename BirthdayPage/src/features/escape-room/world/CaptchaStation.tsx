import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { captchaInteraction } from "./worldConfig";

type CaptchaStationProps = {
  solved: boolean;
};

const CaptchaStation = ({ solved }: CaptchaStationProps) => {
  const innerSquare = useRef<Group>(null);
  const accent = solved ? "#67f29a" : "#67e8ff";

  useFrame((_, delta) => {
    if (innerSquare.current !== null) {
      innerSquare.current.rotation.x += delta * 0.7;
    }
  });

  return (
    <group position={captchaInteraction.position}>
      <mesh castShadow position={[-0.05, 0, 0]}>
        <boxGeometry args={[0.22, 1.65, 1.65]} />
        <meshStandardMaterial
          color="#102f38"
          emissive={accent}
          emissiveIntensity={0.14}
          roughness={0.45}
        />
      </mesh>

      <group position={[0.1, 0, 0]}>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[0.12, 0.09, 1.55]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh position={[0, -0.72, 0]}>
          <boxGeometry args={[0.12, 0.09, 1.55]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh position={[0, 0, 0.72]}>
          <boxGeometry args={[0.12, 1.55, 0.09]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh position={[0, 0, -0.72]}>
          <boxGeometry args={[0.12, 1.55, 0.09]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.8}
          />
        </mesh>

        <group ref={innerSquare}>
          <mesh>
            <boxGeometry args={[0.18, 0.78, 0.78]} />
            <meshStandardMaterial
              color={solved ? "#183b2a" : "#ff5f86"}
              emissive={solved ? "#67f29a" : "#ff315f"}
              emissiveIntensity={1.1}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0.11, 0, 0]}>
            <boxGeometry args={[0.08, 0.42, 0.42]} />
            <meshStandardMaterial
              color="#fff5c4"
              emissive="#ffd95c"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      </group>

      <pointLight color={accent} distance={4} intensity={solved ? 4 : 7} />
    </group>
  );
};

export default CaptchaStation;
