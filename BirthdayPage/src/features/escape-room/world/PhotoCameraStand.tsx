import { Quaternion, Vector3 } from "three";
import PhotoCameraBody from "./PhotoCameraBody";
import { photoCameraPosition, photoCameraRotation } from "./worldConfig";

const cameraMetal = "#262c38";
const cameraTrim = "#8893a4";
const tripodHub = new Vector3(0, 0.66, 0);

type TripodLegProps = {
  end: readonly [number, number, number];
};

const TripodLeg = ({ end }: TripodLegProps) => {
  const endPosition = new Vector3(...end);
  const direction = endPosition.clone().sub(tripodHub);
  const midpoint = tripodHub.clone().add(endPosition).multiplyScalar(0.5);
  const rotation = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    direction.clone().normalize(),
  );

  return (
    <group>
      <mesh
        castShadow
        position={[midpoint.x, midpoint.y, midpoint.z]}
        quaternion={rotation}
      >
        <cylinderGeometry args={[0.04, 0.055, direction.length(), 10]} />
        <meshStandardMaterial
          color={cameraMetal}
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[end[0], end[1], end[2]]}>
        <boxGeometry args={[0.18, 0.06, 0.16]} />
        <meshStandardMaterial
          color={cameraMetal}
          metalness={0.55}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};

type PhotoCameraStandProps = {
  batteryInstalled: boolean;
  cameraMounted: boolean;
};

const PhotoCameraStand = ({
  batteryInstalled,
  cameraMounted,
}: PhotoCameraStandProps) => (
  <group position={photoCameraPosition} rotation={photoCameraRotation}>
    <mesh castShadow position={[0, 0.73, 0]}>
      <cylinderGeometry args={[0.055, 0.075, 1.05, 12]} />
      <meshStandardMaterial
        color={cameraTrim}
        metalness={0.75}
        roughness={0.3}
      />
    </mesh>

    <mesh castShadow position={tripodHub}>
      <sphereGeometry args={[0.11, 14, 10]} />
      <meshStandardMaterial
        color={cameraMetal}
        metalness={0.7}
        roughness={0.32}
      />
    </mesh>
    <TripodLeg end={[0, 0.08, 0.62]} />
    <TripodLeg end={[-0.54, 0.08, -0.31]} />
    <TripodLeg end={[0.54, 0.08, -0.31]} />

    {cameraMounted && (
      <group position={[0, 1.35, 0]}>
        <PhotoCameraBody batteryInstalled={batteryInstalled} />
      </group>
    )}
  </group>
);

export default PhotoCameraStand;
