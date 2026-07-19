import { useEffect, useRef } from "react";

let presetLoadPromise: Promise<void> | undefined;

type TsParticlesFireworksProps = {
  reducedDensity?: boolean;
};

const TsParticlesFireworks = ({
  reducedDensity = false,
}: TsParticlesFireworksProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let destroy: (() => void) | undefined;
    const hasUnmounted = () => containerRef.current !== element;

    void Promise.all([
      import("@tsparticles/engine"),
      import("@tsparticles/preset-fireworks"),
    ]).then(async ([{ tsParticles }, { loadFireworksPreset }]) => {
      if (hasUnmounted()) return;

      if (!tsParticles.pluginManager.getPreset("fireworks")) {
        presetLoadPromise ??= loadFireworksPreset(tsParticles);
        await presetLoadPromise;
      }
      if (hasUnmounted()) return;

      const particles = await tsParticles.load({
        element,
        options: {
          background: { color: { value: "transparent" } },
          emitters: {
            rate: { delay: reducedDensity ? 0.6 : 0.3, quantity: 1 },
          },
          fullScreen: { enable: false },
          preset: "fireworks",
          sounds: { enable: false },
        },
      });

      if (hasUnmounted()) {
        particles?.destroy();
        return;
      }

      destroy = () => {
        particles?.destroy();
      };
    });

    return () => {
      destroy?.();
    };
  }, [reducedDensity]);

  return (
    <div
      aria-hidden="true"
      className="birthday-fireworks-library birthday-fireworks-library--tsparticles"
      data-testid="tsparticles-display"
      ref={containerRef}
    />
  );
};

export default TsParticlesFireworks;
