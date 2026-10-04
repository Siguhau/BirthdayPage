import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { BeveledBox } from "./PropGeometry";
import { cameraVendingPosition } from "./worldConfig";

const CameraVendingMachine = () => {
  const sign = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#112c38";
      ctx.fillRect(0, 0, 512, 256);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffe7a6";
      ctx.font = "bold 46px sans-serif";
      ctx.fillText("AUTOMAT", 256, 105);
      ctx.font = "30px sans-serif";
      ctx.fillText("1 POLLETT", 256, 175);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);
  useEffect(
    () => () => {
      sign.dispose();
    },
    [sign],
  );
  return (
    <RigidBody colliders={false} position={cameraVendingPosition} type="fixed">
      <CuboidCollider args={[0.65, 1.15, 0.4]} position={[0, 1.15, 0]} />
      <mesh castShadow receiveShadow position={[0, 1.15, 0]}>
        <BeveledBox size={[1.3, 2.3, 0.8]} radius={0.08} />
        <meshStandardMaterial
          color="#ba7435"
          metalness={0.45}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 1.78, 0.411]}>
        <planeGeometry args={[1.15, 0.575]} />
        <meshBasicMaterial map={sign} />
      </mesh>
      <mesh position={[0, 1.05, 0.405]}>
        <boxGeometry args={[1.06, 0.65, 0.03]} />
        <meshStandardMaterial
          color="#112c38"
          emissive="#1d6870"
          emissiveIntensity={0.35}
        />
      </mesh>
      {[-0.34, 0, 0.34].map((x) => (
        <mesh key={x} position={[x, 1.06, 0.44]}>
          <boxGeometry args={[0.22, 0.34, 0.04]} />
          <meshStandardMaterial
            color="#ffe7a6"
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.38, 0.405]}>
        <boxGeometry args={[0.88, 0.26, 0.04]} />
        <meshStandardMaterial color="#161d25" />
      </mesh>
    </RigidBody>
  );
};
export default CameraVendingMachine;
