import { CuboidCollider, RigidBody } from "@react-three/rapier";

const CornArcadeStation = ({
  powered,
  solved,
}: {
  powered: boolean;
  solved: boolean;
}) => {
  const glow = solved ? "#78e86c" : powered ? "#ffd84d" : "#3b435a";
  return (
    <group position={[2, 1.05, -9.3]}>
      <RigidBody colliders={false} type="fixed">
        <CuboidCollider args={[0.62, 1.05, 0.42]} />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.24, 2.1, 0.84]} />
          <meshStandardMaterial color="#251438" roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.83, 0.46]}>
          <boxGeometry args={[1.32, 0.28, 0.12]} />
          <meshStandardMaterial
            color="#e65fc6"
            emissive="#e65fc6"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0.33, 0.46]} rotation={[-0.24, 0, 0]}>
          <boxGeometry args={[1.02, 0.82, 0.08]} />
          <meshStandardMaterial
            color="#173d43"
            emissive={glow}
            emissiveIntensity={1.35}
          />
        </mesh>
        <mesh position={[0, -0.37, 0.5]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[1.18, 0.35, 0.46]} />
          <meshStandardMaterial color="#4f2671" roughness={0.26} />
        </mesh>
        <mesh position={[-0.28, -0.15, 0.68]}>
          <cylinderGeometry args={[0.08, 0.08, 0.34, 10]} />
          <meshStandardMaterial
            color="#ffe15b"
            emissive="#e39a18"
            emissiveIntensity={0.7}
          />
        </mesh>
        <mesh position={[-0.28, 0.05, 0.68]}>
          <sphereGeometry args={[0.14, 12, 10]} />
          <meshStandardMaterial
            color="#f4cf32"
            emissive="#f4cf32"
            emissiveIntensity={0.8}
          />
        </mesh>
        {[-0.02, 0.22].map((x) => (
          <mesh key={x} position={[x, -0.14, 0.68]}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
            <meshStandardMaterial
              color="#ff5b72"
              emissive="#ff5b72"
              emissiveIntensity={0.9}
            />
          </mesh>
        ))}
      </RigidBody>
      {powered && (
        <mesh position={[0.7, -0.85, -0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 2.1, 8]} />
          <meshStandardMaterial color="#171923" />
        </mesh>
      )}
      <mesh position={[1.2, 0.15, -1.2]}>
        <boxGeometry args={[0.34, 0.48, 0.08]} />
        <meshStandardMaterial
          color="#f4ead1"
          emissive={powered ? glow : "#000000"}
          emissiveIntensity={0.35}
        />
      </mesh>
      <pointLight
        color={glow}
        distance={4}
        intensity={solved ? 2 : 5}
        position={[0, 0.35, 0.5]}
      />
    </group>
  );
};

export default CornArcadeStation;
