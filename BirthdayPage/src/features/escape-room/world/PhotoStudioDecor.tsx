import { useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader } from "three";
import { photoCameraPosition, photoWallX } from "./worldConfig";

const mountainImageUrl = "/assets/mountain-secret-passage.png?v=2";

const PhotoStudioDecor = () => {
  const mountainTexture = useLoader(TextureLoader, mountainImageUrl);

  return (
    <group>
      <group position={[photoWallX, 1.42, 7.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[0.94, 1.82]} />
          <meshStandardMaterial
            map={mountainTexture}
            roughness={0.72}
            side={DoubleSide}
          />
        </mesh>
        <mesh position={[0, 1, 0.025]}>
          <boxGeometry args={[1.12, 0.12, 0.1]} />
          <meshStandardMaterial color="#ffd95a" metalness={0.2} />
        </mesh>
        <mesh position={[0, -1, 0.025]}>
          <boxGeometry args={[1.12, 0.12, 0.1]} />
          <meshStandardMaterial color="#ffd95a" metalness={0.2} />
        </mesh>
        <mesh position={[0, -1.24, -0.01]}>
          <boxGeometry args={[1.04, 0.38, 0.07]} />
          <meshStandardMaterial color="#7d3c84" roughness={0.86} />
        </mesh>
        <mesh position={[0, -1.36, 0.025]}>
          <boxGeometry args={[1.16, 0.13, 0.11]} />
          <meshStandardMaterial color="#57275f" roughness={0.78} />
        </mesh>
        <mesh position={[-0.53, 0, 0.025]}>
          <boxGeometry args={[0.12, 1.9, 0.1]} />
          <meshStandardMaterial color="#ffd95a" metalness={0.2} />
        </mesh>
        <mesh position={[0.53, 0, 0.025]}>
          <boxGeometry args={[0.12, 1.9, 0.1]} />
          <meshStandardMaterial color="#ffd95a" metalness={0.2} />
        </mesh>
      </group>

      <group position={photoCameraPosition}>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.58, 32]} />
          <meshBasicMaterial color="#fff178" side={DoubleSide} />
        </mesh>
        <pointLight
          color="#fff178"
          distance={2.4}
          intensity={2.2}
          position={[0, 0.18, 0]}
        />
      </group>

      <mesh position={[-6.45, 1.5, 5.84]}>
        <boxGeometry args={[3.7, 1.9, 0.08]} />
        <meshStandardMaterial color="#ff6aa9" roughness={0.75} />
      </mesh>
      <mesh position={[-6.45, 1.5, 9.16]}>
        <boxGeometry args={[3.7, 1.9, 0.08]} />
        <meshStandardMaterial color="#ff9b54" roughness={0.75} />
      </mesh>
    </group>
  );
};

export default PhotoStudioDecor;
