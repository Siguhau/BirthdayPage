import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { BeveledBox } from "./PropGeometry";

const marble = "#c8c0b0";
const marbleShadow = "#958d82";
const brass = "#b78a3d";

const CipherBust = () => (
  <RigidBody colliders={false} position={[-5.25, 0, 3.05]} type="fixed">
    <CuboidCollider args={[0.42, 0.75, 0.38]} position={[0, 0.75, 0]} />

    <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
      <BeveledBox size={[0.72, 0.84, 0.62]} radius={0.025} />
      <meshStandardMaterial color="#3f4754" roughness={0.78} />
    </mesh>
    <mesh castShadow position={[0, 0.88, 0]}>
      <BeveledBox size={[0.82, 0.1, 0.7]} radius={0.025} />
      <meshStandardMaterial color="#59616d" roughness={0.72} />
    </mesh>

    <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
      <BeveledBox size={[0.82, 0.12, 0.72]} radius={0.025} />
      <meshStandardMaterial color="#59616d" roughness={0.75} />
    </mesh>
    {[-0.24, -0.12, 0, 0.12, 0.24].map((x) => (
      <mesh key={x} position={[x, 0.33, -0.312]}>
        <boxGeometry args={[0.015, 0.33, 0.012]} />
        <meshStandardMaterial color="#303944" roughness={0.85} />
      </mesh>
    ))}
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
      <mesh castShadow position={[0, 0.73, -0.255]} scale={[0.055, 0.1, 0.075]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={marble} roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0, 0.61, -0.13]} scale={[0.16, 0.1, 0.13]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color={marble} roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.662, -0.248]}>
        <BeveledBox size={[0.105, 0.015, 0.022]} radius={0.007} />
        <meshStandardMaterial color={marbleShadow} roughness={0.95} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            castShadow
            position={[side * 0.24, 0.79, -0.015]}
            scale={[0.055, 0.092, 0.045]}
          >
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color={marble} roughness={0.88} />
          </mesh>
          <mesh
            position={[side * 0.092, 0.828, -0.238]}
            scale={[0.059, 0.023, 0.022]}
          >
            <sphereGeometry args={[1, 16, 10]} />
            <meshStandardMaterial color={marbleShadow} roughness={0.95} />
          </mesh>
          <mesh
            position={[side * 0.09, 0.825, -0.255]}
            scale={[0.036, 0.015, 0.012]}
          >
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color={marble} roughness={0.9} />
          </mesh>
          <mesh
            castShadow
            position={[side * 0.092, 0.864, -0.236]}
            rotation={[0, 0, side * 0.12]}
          >
            <BeveledBox size={[0.13, 0.028, 0.038]} radius={0.013} />
            <meshStandardMaterial color={marble} roughness={0.88} />
          </mesh>
        </group>
      ))}
      {/* Carved locks follow the crown, with an open forehead and temples. */}
      {Array.from({ length: 9 }, (_, i) => {
        const angle = (i / 8) * Math.PI;
        return (
          <mesh
            castShadow
            key={i}
            position={[
              Math.cos(angle) * 0.205,
              0.91 + Math.sin(angle) * 0.11,
              -0.04,
            ]}
            rotation={[0, 0, angle - Math.PI / 2]}
            scale={[0.075, 0.13, 0.22]}
          >
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color={marbleShadow} roughness={0.93} />
          </mesh>
        );
      })}
      <mesh castShadow position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.31, 0.34, 0.13, 32]} />
        <meshStandardMaterial color={marble} roughness={0.88} />
      </mesh>
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
