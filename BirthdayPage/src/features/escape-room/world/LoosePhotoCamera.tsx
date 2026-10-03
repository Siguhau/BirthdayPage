import PhotoCameraBody from "./PhotoCameraBody";
import { looseCameraPosition } from "./worldConfig";

type LoosePhotoCameraProps = {
  collected: boolean;
};

const LoosePhotoCamera = ({ collected }: LoosePhotoCameraProps) => (
  <group position={looseCameraPosition} rotation={[0, -0.4, 0]}>
    <mesh castShadow receiveShadow position={[0, -0.32, 0]}>
      <boxGeometry args={[1.35, 0.16, 0.75]} />
      <meshStandardMaterial color="#4d244f" metalness={0.15} roughness={0.65} />
    </mesh>
    <mesh position={[-0.52, -0.7, -0.22]}>
      <boxGeometry args={[0.12, 0.72, 0.12]} />
      <meshStandardMaterial color="#27132d" roughness={0.72} />
    </mesh>
    <mesh position={[0.52, -0.7, -0.22]}>
      <boxGeometry args={[0.12, 0.72, 0.12]} />
      <meshStandardMaterial color="#27132d" roughness={0.72} />
    </mesh>
    <mesh position={[-0.52, -0.7, 0.22]}>
      <boxGeometry args={[0.12, 0.72, 0.12]} />
      <meshStandardMaterial color="#27132d" roughness={0.72} />
    </mesh>
    <mesh position={[0.52, -0.7, 0.22]}>
      <boxGeometry args={[0.12, 0.72, 0.12]} />
      <meshStandardMaterial color="#27132d" roughness={0.72} />
    </mesh>

    {!collected && (
      <group position={[0, 0, 0]}>
        <PhotoCameraBody batteryInstalled={false} />
        <pointLight
          color="#ff4fdb"
          distance={3}
          intensity={3.5}
          position={[0, 0.35, 0]}
        />
      </group>
    )}
  </group>
);

export default LoosePhotoCamera;
