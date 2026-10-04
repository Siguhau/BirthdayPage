import { DoubleSide } from "three";
import type { SuccessfulLongboiPhoto } from "../puzzles/longboiPhotos";
import usePhotoTexture from "./usePhotoTexture";

type WallPhotoHookProps = {
  photo: SuccessfulLongboiPhoto | null;
};

const HungPhotoImage = ({ src }: { src: string }) => {
  const texture = usePhotoTexture(src);

  return (
    <mesh position={[0, 0, -0.032]}>
      <planeGeometry args={[0.47, 0.59]} />
      <meshStandardMaterial
        key={texture === null ? "backing" : "photo"}
        color={texture === null ? "#ffb4ce" : "#ffffff"}
        map={texture}
        roughness={0.7}
        side={DoubleSide}
      />
    </mesh>
  );
};

const WallPhotoHook = ({ photo }: WallPhotoHookProps) => {
  const weightedOffset = photo === null ? 0 : -0.11;

  return (
    <group position={[-1.6, 1.84 + weightedOffset, 10.61]}>
      <mesh
        castShadow
        position={[0, 0.02, -0.04]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
        <meshStandardMaterial
          color="#c9a85c"
          metalness={0.76}
          roughness={0.3}
        />
      </mesh>
      <mesh castShadow position={[0, -0.045, -0.085]}>
        <sphereGeometry args={[0.045, 12, 8]} />
        <meshStandardMaterial
          color="#d9bd70"
          metalness={0.74}
          roughness={0.28}
        />
      </mesh>

      {photo !== null && (
        <group position={[0, -0.46, -0.07]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.59, 0.72, 0.055]} />
            <meshStandardMaterial color="#d8bd84" roughness={0.72} />
          </mesh>
          {photo.src === null ? (
            <mesh position={[0, 0, -0.032]}>
              <planeGeometry args={[0.47, 0.59]} />
              <meshStandardMaterial color="#ffb4ce" roughness={0.82} />
            </mesh>
          ) : (
            <HungPhotoImage src={photo.src} />
          )}
          <mesh position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.3, 8]} />
            <meshStandardMaterial color="#6c5132" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default WallPhotoHook;
