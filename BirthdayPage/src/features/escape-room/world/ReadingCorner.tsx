import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import { CanvasTexture, DoubleSide, SRGBColorSpace } from "three";

import { trapdoorCipherBlacklightLabel } from "../puzzles/trapdoorCipher";
import { BeveledBox } from "./PropGeometry";

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
      <BeveledBox size={[0.9, 0.28, 0.8]} radius={0.09} />
      <meshStandardMaterial color={upholstery} roughness={0.88} />
    </mesh>
    <mesh castShadow position={[0, 0.88, 0.34]} rotation={[-0.12, 0, 0]}>
      <BeveledBox size={[0.9, 0.88, 0.22]} radius={0.09} />
      <meshStandardMaterial color={upholsteryDark} roughness={0.86} />
    </mesh>
    <mesh castShadow position={[0, 0.59, -0.04]}>
      <BeveledBox size={[0.72, 0.15, 0.68]} radius={0.065} />
      <meshStandardMaterial color="#cd7d8d" roughness={0.96} />
    </mesh>
    <mesh castShadow position={[0, 0.96, 0.17]} rotation={[-0.12, 0, 0]}>
      <BeveledBox size={[0.72, 0.58, 0.16]} radius={0.075} />
      <meshStandardMaterial color={upholstery} roughness={0.95} />
    </mesh>
    {[-0.19, 0.19].flatMap((x) =>
      [0.84, 1.08].map((y) => (
        <mesh
          key={`${String(x)}-${String(y)}`}
          position={[x, y, 0.075]}
          scale={[1, 1, 0.4]}
        >
          <sphereGeometry args={[0.024, 10, 8]} />
          <meshStandardMaterial color={upholsteryDark} roughness={1} />
        </mesh>
      )),
    )}
    {[-0.48, 0.48].map((x) => (
      <mesh castShadow key={x} position={[x, 0.64, 0]}>
        <BeveledBox size={[0.16, 0.42, 0.84]} radius={0.07} />
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
          <cylinderGeometry args={[0.045, 0.03, 0.3, 10]} />
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
      <cylinderGeometry args={[0.46, 0.48, 0.12, 40]} />
      <meshStandardMaterial color="#9a643a" roughness={0.76} />
    </mesh>
    <mesh position={[0, 0.855, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.435, 0.008, 6, 40]} />
      <meshStandardMaterial color="#d9b477" metalness={0.5} roughness={0.4} />
    </mesh>
    <group position={[-0.08, 0.88, 0.03]} rotation={[0, 0.3, 0]}>
      <mesh castShadow>
        <BeveledBox size={[0.36, 0.06, 0.26]} radius={0.01} />
        <meshStandardMaterial color="#254f57" roughness={0.8} />
      </mesh>
      <mesh position={[0.015, 0, 0]}>
        <boxGeometry args={[0.34, 0.035, 0.24]} />
        <meshStandardMaterial color="#eadcc0" roughness={1} />
      </mesh>
    </group>
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

const BlacklightClue = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#dba5ff";
      context.font = "bold 148px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        trapdoorCipherBlacklightLabel,
        canvas.width / 2,
        canvas.height / 2,
      );
    }
    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    return nextTexture;
  }, []);
  useEffect(
    () => () => {
      texture.dispose();
    },
    [texture],
  );

  return (
    <mesh position={[3.66, 1.46, 5.43]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[1.28, 0.43]} />
      <meshStandardMaterial
        emissive="#8b39ff"
        emissiveIntensity={3.5}
        map={texture}
        roughness={0.38}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
};

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
