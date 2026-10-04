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
  paused?: boolean;
};

const PhotoChallenge = ({
  attemptId,
  onCountdownChange,
  onResult,
  paused = false,
}: PhotoChallengeProps) => {
  const { camera } = useThree();
  const onCountdownChangeRef = useRef(onCountdownChange);
  const onResultRef = useRef(onResult);
  const activeAttemptIdRef = useRef(0);
  const completedAttemptIdRef = useRef(0);
  const lastCountdownRef = useRef<number | undefined>(undefined);
  const remainingMillisecondsRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    onCountdownChangeRef.current = onCountdownChange;
    onResultRef.current = onResult;
  }, [onCountdownChange, onResult]);

  useEffect(() => {
    if (attemptId === 0) return;

    if (activeAttemptIdRef.current !== attemptId) {
      activeAttemptIdRef.current = attemptId;
      completedAttemptIdRef.current = 0;
      lastCountdownRef.current = undefined;
      remainingMillisecondsRef.current = countdownSeconds * 1_000;
    }

    if (paused || completedAttemptIdRef.current === attemptId) return;

    const publishCountdown = () => {
      const seconds = Math.ceil(remainingMillisecondsRef.current / 1_000);
      if (seconds === lastCountdownRef.current) return;
      lastCountdownRef.current = seconds;
      onCountdownChangeRef.current(seconds);
    };

    const finishAttempt = () => {
      completedAttemptIdRef.current = attemptId;
      startedAtRef.current = null;
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
    };

    const scheduleNextTick = () => {
      if (remainingMillisecondsRef.current <= 0) {
        finishAttempt();
        return;
      }

      const displayedSeconds = Math.ceil(
        remainingMillisecondsRef.current / 1_000,
      );
      const millisecondsUntilNextSecond =
        remainingMillisecondsRef.current - (displayedSeconds - 1) * 1_000;

      timeout = window.setTimeout(() => {
        const now = Date.now();
        const startedAt = startedAtRef.current;
        if (startedAt === null) return;
        remainingMillisecondsRef.current = Math.max(
          0,
          remainingMillisecondsRef.current - (now - startedAt),
        );
        startedAtRef.current = now;

        if (remainingMillisecondsRef.current <= 0) {
          finishAttempt();
          return;
        }

        publishCountdown();
        scheduleNextTick();
      }, millisecondsUntilNextSecond);
    };

    publishCountdown();
    startedAtRef.current = Date.now();
    let timeout: number;
    scheduleNextTick();

    return () => {
      window.clearTimeout(timeout);
      if (startedAtRef.current !== null) {
        remainingMillisecondsRef.current = Math.max(
          0,
          remainingMillisecondsRef.current -
            (Date.now() - startedAtRef.current),
        );
        startedAtRef.current = null;
      }
    };
  }, [attemptId, camera, paused]);

  return null;
};

export default PhotoChallenge;
