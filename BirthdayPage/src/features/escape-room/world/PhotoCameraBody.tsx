import { BeveledBox } from "./PropGeometry";

type PhotoCameraBodyProps = { batteryInstalled: boolean };

const PhotoCameraBody = ({ batteryInstalled }: PhotoCameraBodyProps) => (
  <group>
    <mesh castShadow receiveShadow>
      <BeveledBox size={[0.82, 0.5, 0.42]} radius={0.065} />
      <meshStandardMaterial color="#303741" metalness={0.45} roughness={0.4} />
    </mesh>
    <mesh castShadow position={[0.29, -0.025, 0.075]}>
      <BeveledBox size={[0.23, 0.43, 0.4]} radius={0.07} />
      <meshStandardMaterial color="#171d25" roughness={0.95} />
    </mesh>
    <mesh position={[0, 0.205, 0]}>
      <BeveledBox size={[0.8, 0.075, 0.41]} radius={0.025} />
      <meshStandardMaterial color="#9ba6b0" metalness={0.75} roughness={0.3} />
    </mesh>
    <group position={[-0.06, 0.015, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
      {/* Separate mount, focusing barrel and filter rim give the lens depth. */}
      {[
        { y: 0, r: 0.245, h: 0.075, color: "#aab2bd" },
        { y: 0.13, r: 0.225, h: 0.23, color: "#111923" },
        { y: 0.27, r: 0.23, h: 0.065, color: "#505965" },
      ].map(({ y, r, h, color }) => (
        <mesh castShadow key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[r, r, h, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.65}
            roughness={0.32}
          />
        </mesh>
      ))}
      {[0.06, 0.09, 0.12, 0.15, 0.18, 0.21].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.226, 0.008, 6, 32]} />
          <meshStandardMaterial
            color="#616b76"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.309, 0]}>
        <cylinderGeometry args={[0.192, 0.192, 0.012, 32]} />
        <meshPhysicalMaterial
          color="#163a51"
          metalness={0.45}
          roughness={0.12}
          clearcoat={1}
          emissive="#123f58"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 0.318, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.135, 0.006, 6, 32]} />
        <meshStandardMaterial color="#6796ad" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
    <mesh castShadow position={[-0.06, 0.3, -0.035]}>
      <BeveledBox size={[0.26, 0.16, 0.25]} radius={0.045} />
      <meshStandardMaterial color="#333c48" metalness={0.45} roughness={0.4} />
    </mesh>
    <mesh position={[-0.06, 0.31, -0.168]}>
      <BeveledBox size={[0.14, 0.075, 0.02]} radius={0.01} />
      <meshStandardMaterial color="#111824" roughness={0.16} />
    </mesh>
    <mesh position={[0.26, 0.27, 0.055]}>
      <cylinderGeometry args={[0.065, 0.075, 0.065, 20]} />
      <meshStandardMaterial color="#b8c4ce" metalness={0.8} roughness={0.25} />
    </mesh>
    <mesh position={[-0.3, 0.27, -0.045]}>
      <cylinderGeometry args={[0.075, 0.075, 0.06, 20]} />
      <meshStandardMaterial color="#161d29" metalness={0.4} roughness={0.55} />
    </mesh>
    <mesh position={[-0.075, -0.03, -0.219]}>
      <BeveledBox size={[0.46, 0.29, 0.025]} radius={0.025} />
      <meshStandardMaterial color="#0b141f" roughness={0.25} />
    </mesh>
    <mesh position={[-0.075, -0.03, -0.234]}>
      <planeGeometry args={[0.39, 0.22]} />
      <meshStandardMaterial
        color={batteryInstalled ? "#568d9e" : "#18212b"}
        emissive="#3c7080"
        emissiveIntensity={batteryInstalled ? 0.45 : 0}
        side={2}
        roughness={0.2}
      />
    </mesh>
    {[-0.1, 0.01, 0.12].map((y) => (
      <mesh key={y} position={[0.26, y, -0.217]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.023, 0.023, 0.02, 12]} />
        <meshStandardMaterial color="#8d99a5" metalness={0.6} roughness={0.4} />
      </mesh>
    ))}
    <mesh position={[0.414, -0.06, 0]}>
      <BeveledBox size={[0.025, 0.2, 0.25]} radius={0.01} />
      <meshStandardMaterial
        color={batteryInstalled ? "#c5823d" : "#0e1219"}
        metalness={0.35}
        roughness={0.55}
      />
    </mesh>
    <mesh position={[0.3, 0.17, 0.226]}>
      <sphereGeometry args={[0.025, 12, 8]} />
      <meshBasicMaterial color={batteryInstalled ? "#67f29a" : "#ff5b67"} />
    </mesh>
  </group>
);

export default PhotoCameraBody;
