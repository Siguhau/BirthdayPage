const plateColor = "#eee9dc";
const switchColor = "#f8f5ec";

type HiddenRoomWallToggleProps = {
  active: boolean;
};

const HiddenRoomWallToggle = ({ active }: HiddenRoomWallToggleProps) => (
  <group position={[-11.08, 1.3, 7.5]}>
    <mesh castShadow>
      <boxGeometry args={[0.018, 0.15, 0.1]} />
      <meshStandardMaterial
        color={plateColor}
        metalness={0.05}
        roughness={0.7}
      />
    </mesh>

    {[-0.055, 0.055].map((y) => (
      <mesh key={y} position={[0.014, y, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.007, 0.007, 0.005, 10]} />
        <meshStandardMaterial
          color="#a5a39d"
          metalness={0.72}
          roughness={0.3}
        />
      </mesh>
    ))}

    <mesh position={[0.016, 0, 0]}>
      <boxGeometry args={[0.012, 0.09, 0.06]} />
      <meshStandardMaterial color="#b9b5aa" roughness={0.78} />
    </mesh>
    <group rotation={[0, 0, active ? 0.32 : -0.32]}>
      <mesh castShadow position={[0.035, 0, 0]}>
        <boxGeometry args={[0.04, 0.07, 0.045]} />
        <meshStandardMaterial color={switchColor} roughness={0.68} />
      </mesh>
    </group>
  </group>
);

export default HiddenRoomWallToggle;
