import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Euler, MathUtils } from "three";

const mouseSensitivity = 0.002;
const maximumPitch = Math.PI / 2 - 0.05;

type MouseLookControllerProps = {
  enabled: boolean;
};

const MouseLookController = ({ enabled }: MouseLookControllerProps) => {
  const rotation = useRef(new Euler(0, 0, 0, "YXZ"));
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!enabled || document.pointerLockElement === null) return;

      rotation.current.setFromQuaternion(camera.quaternion);
      rotation.current.y -= event.movementX * mouseSensitivity;
      rotation.current.x -= event.movementY * mouseSensitivity;
      rotation.current.x = MathUtils.clamp(
        rotation.current.x,
        -maximumPitch,
        maximumPitch,
      );
      camera.quaternion.setFromEuler(rotation.current);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, enabled]);

  return null;
};

export default MouseLookController;
