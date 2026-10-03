import { CuboidCollider, RigidBody } from "@react-three/rapier";

const marble = "#c8c0b0";
const marbleShadow = "#958d82";
const brass = "#b78a3d";

const CipherBust = () => (
  <RigidBody colliders={false} position={[-5.25, 0, 3.05]} type="fixed">
    <CuboidCollider args={[0.42, 0.75, 0.38]} position={[0, 0.75, 0]} />

    <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
      <boxGeometry args={[0.72, 0.84, 0.62]} />
      <meshStandardMaterial color="#3f4754" roughness={0.78} />
    </mesh>
    <mesh castShadow position={[0, 0.88, 0]}>
      <boxGeometry args={[0.82, 0.1, 0.7]} />
      <meshStandardMaterial color="#59616d" roughness={0.72} />
    </mesh>

    <group position={[0, 1.04, 0]}>
      <mesh castShadow position={[0, 0.14, 0.03]} scale={[1.25, 0.58, 0.62]}>
        <sphereGeometry args={[0.46, 20, 14]} />
        <meshStandardMaterial color={marbleShadow} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.34, 14]} />
        <meshStandardMaterial color={marble} roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 0.79, -0.02]} scale={[0.8, 1, 0.82]}>
        <sphereGeometry args={[0.31, 22, 16]} />
        <meshStandardMaterial color={marble} roughness={0.86} />
      </mesh>
      <mesh
        castShadow
        position={[0, 0.8, -0.31]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[0.075, 0.2, 10]} />
        <meshStandardMaterial color={marble} roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 0.57, -0.18]} scale={[0.9, 0.35, 0.42]}>
        <sphereGeometry args={[0.23, 16, 10]} />
        <meshStandardMaterial color={marbleShadow} roughness={0.92} />
      </mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh
          castShadow
          key={x}
          position={[x, 0.94, 0.02]}
          rotation={[0, 0, x < 0 ? -0.35 : 0.35]}
        >
          <torusGeometry args={[0.24, 0.035, 8, 14, Math.PI * 0.8]} />
          <meshStandardMaterial color={marbleShadow} roughness={0.92} />
        </mesh>
      ))}
    </group>

    <mesh castShadow position={[0, 0.52, -0.325]} rotation={[-0.08, 0, 0]}>
      <boxGeometry args={[0.56, 0.24, 0.035]} />
      <meshStandardMaterial color={brass} metalness={0.68} roughness={0.34} />
    </mesh>
    <mesh position={[0, 0.52, -0.347]} rotation={[-0.08, 0, 0]}>
      <boxGeometry args={[0.38, 0.035, 0.012]} />
      <meshStandardMaterial
        color="#392817"
        emissive="#6b421c"
        emissiveIntensity={0.25}
      />
    </mesh>
  </RigidBody>
);

export default CipherBust;
