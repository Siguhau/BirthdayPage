import { worldLights } from "./worldConfig";

const blacklightColor = "#8b4dff";

const LightFixtures = ({
  spawnBlacklightActive,
}: {
  spawnBlacklightActive: boolean;
}) => (
  <group>
    {worldLights.map(({ color, distance, id, intensity, position }) => {
      const isSpawnLight = id === "gallery-light-south";
      const activeColor =
        isSpawnLight && spawnBlacklightActive ? blacklightColor : color;

      return (
        <group key={id} position={position}>
          <pointLight
            color={activeColor}
            decay={2}
            distance={distance}
            intensity={
              isSpawnLight && spawnBlacklightActive ? intensity + 4 : intensity
            }
          />
          <mesh>
            <cylinderGeometry args={[0.22, 0.3, 0.12, 20]} />
            <meshStandardMaterial
              color="#272530"
              emissive={activeColor}
              emissiveIntensity={1.8}
            />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.12, 16, 10]} />
            <meshBasicMaterial color={activeColor} />
          </mesh>
        </group>
      );
    })}
  </group>
);

export default LightFixtures;
