import { basementLadderPosition } from "./worldConfig";

const rungOffsets = Array.from(
  { length: 9 },
  (_, index) => -1.4 + index * 0.38,
);

const BasementLadder = () => (
  <group position={basementLadderPosition}>
    {[-0.72, 0.72].map((x) => (
      <mesh castShadow key={x} position={[x, 0, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 3.45, 12]} />
        <meshStandardMaterial
          color="#a8b5b8"
          metalness={0.72}
          roughness={0.34}
        />
      </mesh>
    ))}
    {rungOffsets.map((y) => (
      <mesh
        castShadow
        key={y}
        position={[0, y, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.055, 0.055, 1.55, 12]} />
        <meshStandardMaterial
          color="#c3cccd"
          metalness={0.68}
          roughness={0.38}
        />
      </mesh>
    ))}
  </group>
);

export default BasementLadder;
