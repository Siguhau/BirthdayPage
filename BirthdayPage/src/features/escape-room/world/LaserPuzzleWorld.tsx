import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import { getLaserProgress } from "../puzzles/laserPuzzle";
import {
  type ItemId,
  type MirrorItemId,
  type MirrorOrientations,
} from "../state/gameTypes";
import {
  laserBeamPoints,
  mirrorPickups,
  mirrorSocketInteractions,
  mirrorStandHeight,
  mirrorStandRadius,
  pepsiChestPosition,
  pepsiChestPanelPosition,
  pepsiChestPanelSize,
} from "./worldConfig";

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
  installed,
  orientation,
  position,
}: {
  itemId: MirrorItemId;
  installed: boolean;
  orientation: number;
  position: readonly [number, number, number];
}) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, -mirrorStandHeight + 0.08, 0]}>
      <cylinderGeometry args={[0.28, mirrorStandRadius, 0.16, 24]} />
      <meshStandardMaterial color="#173747" metalness={0.4} roughness={0.65} />
    </mesh>
    <mesh castShadow position={[0, -mirrorStandHeight / 2, 0]}>
      <cylinderGeometry args={[0.065, 0.09, mirrorStandHeight - 0.16, 16]} />
      <meshStandardMaterial color="#244c61" metalness={0.55} roughness={0.4} />
    </mesh>
    <mesh castShadow position={[0, -0.08, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
      <meshStandardMaterial color="#8b764d" metalness={0.65} roughness={0.35} />
    </mesh>
    {installed && (
      <mesh
        castShadow
        rotation={[
          0,
          orientation * (Math.PI / 4) + (itemId === "mirror-2" ? 0.2 : -0.2),
          0,
        ]}
      >
        <boxGeometry args={[0.9, itemId === "mirror-3" ? 1.1 : 0.78, 0.08]} />
        <meshStandardMaterial
          color="#bceeff"
          metalness={0.9}
          roughness={0.08}
        />
      </mesh>
    )}
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
        return (
          <Mirror
            itemId={itemId}
            installed={installedItemIds.includes(itemId)}
            key={itemId}
            orientation={mirrorOrientations[itemId]}
            position={socket.position}
          />
        );
      })}

      {Array.from({ length: beamProgress }, (_, index) => (
        <OrientedBeamSegment
          end={laserBeamPoints[index + 1]}
          key={`beam-${String(index)}`}
          start={laserBeamPoints[index]}
        />
      ))}

      <group position={pepsiChestPosition}>
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
        <mesh position={pepsiChestPanelPosition}>
          <boxGeometry args={pepsiChestPanelSize} />
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
