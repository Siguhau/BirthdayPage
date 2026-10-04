import { useEffect, useRef } from "react";

const movementCodes = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "Space"]);

const useMovementKeys = (enabled: boolean) => {
  const pressedKeys = useRef(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled || !movementCodes.has(event.code)) return;
      event.preventDefault();
      pressedKeys.current.add(event.code);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current.delete(event.code);
    };
    const clearKeys = () => {
      pressedKeys.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearKeys);
      clearKeys();
    };
  }, [enabled]);

  return pressedKeys;
};

export default useMovementKeys;
