import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import { getLaserProgress } from "../puzzles/laserPuzzle";
import {
  type ItemId,
  type MirrorItemId,
  type MirrorOrientations,
} from "../state/gameTypes";
import { mirrorPickups, mirrorSocketInteractions } from "./worldConfig";

const laserPoints = [
  [3.42, 1.42, -4.4],
  [0.8, 1.15, -5],
  [-0.8, 1.15, -7.3],
  [1.9, -2.35, -14.6],
  [0, -2.25, -18.7],
] as const;

const OrientedBeamSegment = (props: {
  end: readonly [number, number, number];
  start: readonly [number, number, number];
}) => {
  const start = useMemo(() => new Vector3(...props.start), [props.start]);
  const end = useMemo(() => new Vector3(...props.end), [props.end]);
  const midpoint = useMemo(
    () => start.clone().add(end).multiplyScalar(0.5),
    [end, start],
  );
  const direction = useMemo(() => end.clone().sub(start), [end, start]);
  const quaternion = useMemo(
    () =>
      new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        direction.clone().normalize(),
      ),
    [direction],
  );
  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.026, 0.026, direction.length(), 8]} />
      <meshBasicMaterial color="#ff315d" toneMapped={false} />
    </mesh>
  );
};

const Mirror = ({
  itemId,
  orientation,
  position,
}: {
  itemId: MirrorItemId;
  orientation: number;
  position: readonly [number, number, number];
}) => (
  <group position={position} rotation={[0, orientation * (Math.PI / 4), 0]}>
    <mesh castShadow position={[0, -0.45, 0]}>
      <cylinderGeometry args={[0.18, 0.24, 0.9, 12]} />
      <meshStandardMaterial color="#244c61" metalness={0.55} roughness={0.4} />
    </mesh>
    <mesh castShadow rotation={[0, itemId === "mirror-2" ? 0.2 : -0.2, 0]}>
      <boxGeometry args={[0.9, itemId === "mirror-3" ? 1.1 : 0.78, 0.08]} />
      <meshStandardMaterial color="#bceeff" metalness={0.9} roughness={0.08} />
    </mesh>
  </group>
);

type LaserPuzzleWorldProps = {
  chestOpen: boolean;
  installedItemIds: readonly ItemId[];
  inventoryItemIds: readonly ItemId[];
  laserPowered: boolean;
  mirrorOrientations: MirrorOrientations;
};

const LaserPuzzleWorld = ({
  chestOpen,
  installedItemIds,
  inventoryItemIds,
  laserPowered,
  mirrorOrientations,
}: LaserPuzzleWorldProps) => {
  const beamProgress = getLaserProgress({
    installedItems: installedItemIds,
    laserPowered,
    mirrorOrientations,
  });

  return (
    <group>
      <group position={[3.56, 1.38, -4.4]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.9, 0.72]} />
          <meshStandardMaterial
            color="#1a2935"
            metalness={0.4}
            roughness={0.32}
          />
        </mesh>
        <mesh position={[-0.11, 0.18, 0]}>
          <boxGeometry args={[0.04, 0.23, 0.45]} />
          <meshStandardMaterial
            color={laserPowered ? "#ff315d" : "#2c3b46"}
            emissive={laserPowered ? "#ff174d" : "#000000"}
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {mirrorPickups.map((pickup, index) => {
        const itemId = pickup.action.itemId;
        if (
          inventoryItemIds.includes(itemId) ||
          installedItemIds.includes(itemId)
        )
          return null;
        return (
          <group
            key={itemId}
            position={pickup.position}
            rotation={[-0.15, index * 0.4, 0.1]}
          >
            <mesh castShadow>
              <boxGeometry args={[0.72, 0.72, 0.08]} />
              <meshStandardMaterial
                color="#bceeff"
                metalness={0.92}
                roughness={0.08}
              />
            </mesh>
            <pointLight color="#8eeeff" distance={2} intensity={1.5} />
          </group>
        );
      })}

      {mirrorSocketInteractions.map((socket) => {
        const itemId = socket.action.itemId;
        return installedItemIds.includes(itemId) ? (
          <Mirror
            itemId={itemId}
            key={itemId}
            orientation={mirrorOrientations[itemId]}
            position={socket.position}
          />
        ) : (
          <mesh
            key={itemId}
            position={[
              socket.position[0],
              socket.position[1] - 0.62,
              socket.position[2],
            ]}
          >
            <cylinderGeometry args={[0.28, 0.34, 0.22, 12]} />
            <meshStandardMaterial
              color="#173747"
              metalness={0.4}
              roughness={0.65}
            />
          </mesh>
        );
      })}

      {Array.from({ length: beamProgress }, (_, index) => (
        <OrientedBeamSegment
          end={laserPoints[index + 1]}
          key={`beam-${String(index)}`}
          start={laserPoints[index]}
        />
      ))}

      <group position={[0, -2.5, -19.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.3, 1, 1.25]} />
          <meshStandardMaterial color="#52351f" roughness={0.72} />
        </mesh>
        <group
          position={[0, 0.55, chestOpen ? -0.48 : 0]}
          rotation={[chestOpen ? -1.08 : 0, 0, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[2.36, 0.34, 1.3]} />
            <meshStandardMaterial color="#704d2b" roughness={0.65} />
          </mesh>
        </group>
        <mesh position={[0, 0.05, 0.65]}>
          <boxGeometry args={[0.26, 0.34, 0.08]} />
          <meshStandardMaterial
            color={chestOpen ? "#8ff7ff" : "#cfaa52"}
            emissive={chestOpen ? "#48dfff" : "#000000"}
            emissiveIntensity={2}
            metalness={0.7}
          />
        </mesh>
        {chestOpen && (
          <group position={[0, 0.48, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.9, 20]} />
              <meshStandardMaterial
                color="#171d50"
                metalness={0.6}
                roughness={0.28}
              />
            </mesh>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.205, 0.205, 0.12, 20]} />
              <meshStandardMaterial color="#d8333d" metalness={0.5} />
            </mesh>
            <pointLight color="#65e7ff" distance={4} intensity={7} />
          </group>
        )}
      </group>
    </group>
  );
};

export default LaserPuzzleWorld;
