import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { SRGBColorSpace, TextureLoader } from "three";
import { britaImageSrc } from "../puzzles/slidingTiles";
import { slidingTilesInteraction } from "./worldConfig";

const SlidingTilesStation = ({ solved }: { solved: boolean }) => {
  const source = useLoader(TextureLoader, britaImageSrc);
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = SRGBColorSpace;
    copy.needsUpdate = true;
    return copy;
  }, [source]);
  useEffect(
    () => () => {
      texture.dispose();
    },
    [texture],
  );

  return (
    <group position={slidingTilesInteraction.position}>
      <mesh receiveShadow>
        <boxGeometry args={[2.15, 1.5, 0.12]} />
        <meshStandardMaterial
          color={solved ? "#82cba6" : "#c6a779"}
          roughness={0.65}
        />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[1.95, 1.3]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      {!solved && (
        <group position={[0, 0, 0.075]}>
          {[-1, 1].map((sign) => (
            <group key={sign}>
              <mesh position={[sign * 0.325, 0, 0]}>
                <planeGeometry args={[0.018, 1.3]} />
                <meshBasicMaterial color="#171e29" />
              </mesh>
              <mesh position={[0, (sign * 1.3) / 6, 0]}>
                <planeGeometry args={[1.95, 0.018]} />
                <meshBasicMaterial color="#171e29" />
              </mesh>
            </group>
          ))}
          <mesh position={[0.65, -1.3 / 3, 0.005]}>
            <planeGeometry args={[0.65, 1.3 / 3]} />
            <meshBasicMaterial color="#171e29" />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default SlidingTilesStation;
