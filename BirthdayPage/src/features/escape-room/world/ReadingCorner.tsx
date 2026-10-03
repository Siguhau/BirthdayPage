import { CuboidCollider, RigidBody } from "@react-three/rapier";

const upholstery = "#b65f72";
const upholsteryDark = "#7c3548";
const wood = "#6a4028";
const tableZ = 7.5;
const chairTableCenterDistance = 1.33;

const Armchair = ({
  position,
  rotationY,
}: {
  position: readonly [number, number, number];
  rotationY: number;
}) => (
  <RigidBody
    colliders={false}
    position={position}
    rotation={[0, rotationY, 0]}
    type="fixed"
  >
    <CuboidCollider args={[0.48, 0.55, 0.45]} position={[0, 0.55, 0]} />
    <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
      <boxGeometry args={[0.9, 0.28, 0.8]} />
      <meshStandardMaterial color={upholstery} roughness={0.88} />
    </mesh>
    <mesh castShadow position={[0, 0.88, 0.34]} rotation={[-0.12, 0, 0]}>
      <boxGeometry args={[0.9, 0.88, 0.22]} />
      <meshStandardMaterial color={upholsteryDark} roughness={0.86} />
    </mesh>
    {[-0.48, 0.48].map((x) => (
      <mesh castShadow key={x} position={[x, 0.64, 0]}>
        <boxGeometry args={[0.16, 0.42, 0.84]} />
        <meshStandardMaterial color={upholsteryDark} roughness={0.86} />
      </mesh>
    ))}
    {[-0.34, 0.34].flatMap((x) =>
      [-0.27, 0.27].map((z) => (
        <mesh
          castShadow
          key={`${String(x)}-${String(z)}`}
          position={[x, 0.15, z]}
        >
          <boxGeometry args={[0.09, 0.3, 0.09]} />
          <meshStandardMaterial color={wood} roughness={0.82} />
        </mesh>
      )),
    )}
  </RigidBody>
);

const SideTable = () => (
  <RigidBody colliders={false} position={[2.72, 0, tableZ]} type="fixed">
    <CuboidCollider args={[0.43, 0.42, 0.43]} position={[0, 0.42, 0]} />
    <mesh castShadow receiveShadow position={[0, 0.79, 0]}>
      <cylinderGeometry args={[0.48, 0.48, 0.12, 20]} />
      <meshStandardMaterial color="#9a643a" roughness={0.76} />
    </mesh>
    <mesh castShadow position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.11, 0.17, 0.75, 12]} />
      <meshStandardMaterial color={wood} roughness={0.8} />
    </mesh>
    <mesh castShadow position={[0, 0.08, 0]}>
      <cylinderGeometry args={[0.36, 0.42, 0.12, 16]} />
      <meshStandardMaterial color={wood} roughness={0.82} />
    </mesh>
  </RigidBody>
);

const ClueStroke = ({
  position,
  rotation = 0,
  size,
}: {
  position: readonly [number, number, number];
  rotation?: number;
  size: readonly [number, number, number];
}) => (
  <mesh position={position} rotation={[rotation, 0, 0]}>
    <boxGeometry args={size} />
    <meshStandardMaterial
      color="#dba5ff"
      emissive="#8b39ff"
      emissiveIntensity={3.5}
      roughness={0.38}
    />
  </mesh>
);

const BlacklightClue = () => (
  <group position={[0, 0, 10.86]} scale={[1, 1, -1]}>
    <ClueStroke position={[3.66, 1.46, 6.02]} size={[0.025, 0.46, 0.045]} />
    <ClueStroke
      position={[3.66, 1.58, 5.9]}
      rotation={-0.72}
      size={[0.025, 0.32, 0.045]}
    />
    <ClueStroke
      position={[3.66, 1.34, 5.9]}
      rotation={0.72}
      size={[0.025, 0.32, 0.045]}
    />

    <ClueStroke position={[3.66, 1.53, 5.65]} size={[0.025, 0.045, 0.25]} />
    <ClueStroke position={[3.66, 1.39, 5.65]} size={[0.025, 0.045, 0.25]} />

    {[1.25, 1.46, 1.67].map((y) => (
      <ClueStroke
        key={y}
        position={[3.66, y, 5.37]}
        size={[0.025, 0.045, 0.25]}
      />
    ))}
    <ClueStroke position={[3.66, 1.565, 5.25]} size={[0.025, 0.2, 0.045]} />
    <ClueStroke position={[3.66, 1.355, 5.25]} size={[0.025, 0.2, 0.045]} />

    <ClueStroke position={[3.66, 1.25, 4.96]} size={[0.025, 0.045, 0.25]} />
    <ClueStroke position={[3.66, 1.67, 4.96]} size={[0.025, 0.045, 0.25]} />
    <ClueStroke position={[3.66, 1.46, 4.84]} size={[0.025, 0.46, 0.045]} />
    <ClueStroke position={[3.66, 1.46, 5.08]} size={[0.025, 0.46, 0.045]} />
  </group>
);

const ReadingCorner = ({ blacklightActive }: { blacklightActive: boolean }) => (
  <group>
    <Armchair
      position={[2.72, 0, tableZ - chairTableCenterDistance]}
      rotationY={(Math.PI * 2) / 3}
    />
    <Armchair
      position={[2.72, 0, tableZ + chairTableCenterDistance]}
      rotationY={Math.PI / 3}
    />
    <SideTable />
    {blacklightActive && <BlacklightClue />}
  </group>
);

export default ReadingCorner;
