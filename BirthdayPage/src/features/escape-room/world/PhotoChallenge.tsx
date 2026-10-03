import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { evaluatePhotoPose, type PhotoPoseResult } from "../puzzles/photoPose";
import { photoLensPosition } from "./worldConfig";

const countdownSeconds = 5;

type PhotoChallengeProps = {
  attemptId: number;
  onCountdownChange: (seconds: number) => void;
  onResult: (result: PhotoPoseResult) => void;
};

const PhotoChallenge = ({
  attemptId,
  onCountdownChange,
  onResult,
}: PhotoChallengeProps) => {
  const { camera } = useThree();
  const onCountdownChangeRef = useRef(onCountdownChange);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onCountdownChangeRef.current = onCountdownChange;
    onResultRef.current = onResult;
  }, [onCountdownChange, onResult]);

  useEffect(() => {
    if (attemptId === 0) return;

    let secondsRemaining = countdownSeconds;
    onCountdownChangeRef.current(secondsRemaining);

    const interval = window.setInterval(() => {
      secondsRemaining -= 1;

      if (secondsRemaining > 0) {
        onCountdownChangeRef.current(secondsRemaining);
        return;
      }

      window.clearInterval(interval);
      const lookDirection = camera.getWorldDirection(new Vector3());
      onResultRef.current(
        evaluatePhotoPose({
          lensPosition: photoLensPosition,
          lookDirection: [lookDirection.x, lookDirection.y, lookDirection.z],
          playerPosition: [
            camera.position.x,
            camera.position.y,
            camera.position.z,
          ],
        }),
      );
    }, 1_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [attemptId, camera]);

  return null;
};

export default PhotoChallenge;
