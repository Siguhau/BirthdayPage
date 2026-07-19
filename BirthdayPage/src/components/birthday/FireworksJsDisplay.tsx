import { useEffect, useRef } from "react";

type FireworksJsDisplayProps = {
  reducedDensity?: boolean;
};

const FireworksJsDisplay = ({
  reducedDensity = false,
}: FireworksJsDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let stop: (() => void) | undefined;

    void import("fireworks-js").then(({ Fireworks }) => {
      if (disposed) return;

      const fireworks = new Fireworks(container, {
        acceleration: 1.04,
        brightness: { min: 55, max: 90 },
        decay: { min: 0.012, max: 0.025 },
        delay: { min: 18, max: 35 },
        explosion: 7,
        flickering: 35,
        friction: 0.96,
        gravity: 1.6,
        hue: { min: 0, max: 360 },
        intensity: reducedDensity ? 12 : 24,
        lineStyle: "round",
        lineWidth: {
          explosion: { min: 1.5, max: 3 },
          trace: { min: 1, max: 2 },
        },
        mouse: { click: false, max: 0, move: false },
        opacity: 0.7,
        particles: 110,
        rocketsPoint: { min: 10, max: 90 },
        sound: { enabled: false, files: [], volume: { min: 0, max: 0 } },
        traceLength: 4,
        traceSpeed: 12,
      });

      fireworks.start();
      stop = () => {
        fireworks.stop(true);
      };
    });

    return () => {
      disposed = true;
      stop?.();
    };
  }, [reducedDensity]);

  return (
    <div
      aria-hidden="true"
      className="birthday-fireworks-library birthday-fireworks-library--fireworks-js"
      data-testid="fireworks-js-display"
      ref={containerRef}
    />
  );
};

export default FireworksJsDisplay;
