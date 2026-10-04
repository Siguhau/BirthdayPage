import { cameraBatteryPosition } from "./worldConfig";

type CameraBatteryProps = {
  collected: boolean;
};

const CameraBattery = ({ collected }: CameraBatteryProps) => (
  <group position={cameraBatteryPosition}>
    <mesh castShadow receiveShadow position={[0, -0.24, 0.18]}>
      <boxGeometry args={[1.15, 0.12, 0.48]} />
      <meshStandardMaterial color="#264b51" metalness={0.25} roughness={0.6} />
    </mesh>
    <mesh position={[-0.48, -0.38, 0.38]}>
      <boxGeometry args={[0.1, 0.34, 0.1]} />
      <meshStandardMaterial color="#17343a" metalness={0.3} roughness={0.7} />
    </mesh>
    <mesh position={[0.48, -0.38, 0.38]}>
      <boxGeometry args={[0.1, 0.34, 0.1]} />
      <meshStandardMaterial color="#17343a" metalness={0.3} roughness={0.7} />
    </mesh>

    {!collected && (
      <group rotation={[0, -0.18, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.58, 0.28, 0.34]} />
          <meshStandardMaterial
            color="#f39a35"
            emissive="#7a3107"
            emissiveIntensity={0.55}
            metalness={0.25}
            roughness={0.38}
          />
        </mesh>
        <mesh position={[-0.14, 0.18, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.09, 12]} />
          <meshStandardMaterial
            color="#d9e1e8"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.14, 0.18, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.09, 12]} />
          <meshStandardMaterial
            color="#d9e1e8"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        <pointLight
          color="#ffb547"
          distance={3}
          intensity={4}
          position={[0, 0.25, 0]}
        />
      </group>
    )}
  </group>
);

export default CameraBattery;
