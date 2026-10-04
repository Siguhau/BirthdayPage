import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { BeveledBox } from "./PropGeometry";

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
        <mesh castShadow receiveShadow position={[0, -0.43, -0.02]}>
          <BeveledBox size={[1.24, 1.24, 0.8]} radius={0.055} />
          <meshStandardMaterial color="#251438" roughness={0.32} />
        </mesh>
        <mesh castShadow position={[0, 0.4, -0.16]} rotation={[-0.12, 0, 0]}>
          <BeveledBox size={[1.18, 1.22, 0.55]} radius={0.04} />
          <meshStandardMaterial color="#30233e" roughness={0.48} />
        </mesh>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0, 0.405]}>
            <BeveledBox size={[0.035, 1.95, 0.035]} radius={0.014} />
            <meshStandardMaterial
              color="#d773b8"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        ))}
        <mesh castShadow position={[0, 0.83, 0.25]}>
          <BeveledBox size={[1.32, 0.36, 0.46]} radius={0.045} />
          <meshStandardMaterial color="#21182d" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.83, 0.49]}>
          <BeveledBox size={[1.18, 0.22, 0.025]} radius={0.018} />
          <meshStandardMaterial
            color="#e65fc6"
            emissive="#e65fc6"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0.33, 0.37]} rotation={[-0.24, 0, 0]}>
          <BeveledBox size={[1.09, 0.88, 0.12]} radius={0.045} />
          <meshStandardMaterial color="#0f1520" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.33, 0.44]} rotation={[-0.24, 0, 0]}>
          <BeveledBox size={[0.94, 0.72, 0.045]} radius={0.06} />
          <meshStandardMaterial
            color="#10272c"
            emissive={solved ? "#15482d" : "#173d43"}
            emissiveIntensity={powered ? 0.65 : 0.03}
            roughness={0.92}
          />
        </mesh>
        {powered && (
          <group position={[0, 0.33, 0.469]} rotation={[-0.24, 0, 0]}>
            {[-0.065, 0, 0.065].flatMap((x) =>
              [-0.1, -0.035, 0.03, 0.095, 0.16].map((y) => (
                <mesh key={`${String(x)}-${String(y)}`} position={[x, y, 0]}>
                  <planeGeometry args={[0.052, 0.052]} />
                  <meshBasicMaterial color={solved ? "#a3ee93" : "#ffdc6b"} />
                </mesh>
              )),
            )}
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                position={[side * 0.09, -0.1, 0.005]}
                rotation={[0, 0, side * -0.5]}
              >
                <planeGeometry args={[0.06, 0.24]} />
                <meshBasicMaterial color="#73bc81" />
              </mesh>
            ))}
            <mesh position={[0, -0.27, 0]}>
              <planeGeometry args={[0.52, 0.015]} />
              <meshBasicMaterial color={glow} />
            </mesh>
          </group>
        )}
        <mesh position={[0, -0.37, 0.5]} rotation={[-0.14, 0, 0]}>
          <BeveledBox size={[1.18, 0.26, 0.46]} radius={0.045} />
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
        <mesh position={[0, -0.78, 0.403]}>
          <BeveledBox size={[0.4, 0.3, 0.035]} radius={0.025} />
          <meshStandardMaterial
            color="#151923"
            metalness={0.5}
            roughness={0.45}
          />
        </mesh>
        <mesh position={[-0.07, -0.73, 0.425]}>
          <boxGeometry args={[0.13, 0.027, 0.015]} />
          <meshStandardMaterial
            color="#8d99a5"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.1, -0.8, 0.428]}>
          <BeveledBox size={[0.06, 0.07, 0.02]} radius={0.01} />
          <meshStandardMaterial color="#ed9953" roughness={0.3} />
        </mesh>
        {[-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.61, 0.47]}>
            <boxGeometry args={[0.035, 0.04, 0.012]} />
            <meshStandardMaterial color="#101622" roughness={0.8} />
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
        intensity={solved ? 2 : powered ? 5 : 0}
        position={[0, 0.35, 1.25]}
      />
    </group>
  );
};

export default CornArcadeStation;
