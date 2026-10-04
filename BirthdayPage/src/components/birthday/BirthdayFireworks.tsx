import { useEffect, useRef, useState, type CSSProperties } from "react";
import usePrefersReducedMotion from "../../utils/usePrefersReducedMotion";
import FireworksJsDisplay from "./FireworksJsDisplay";
import TsParticlesFireworks from "./TsParticlesFireworks";
import type { FireworksRenderer } from "./fireworksTypes";
const particleCount = 48;

const colorPalettes = [
  ["#ff4d6d", "#ff8fa3", "#ffd6e0"],
  ["#ffd166", "#ff9f1c", "#fff3b0"],
  ["#4cc9f0", "#4361ee", "#bde0fe"],
  ["#80ed99", "#38b000", "#c7f9cc"],
  ["#c77dff", "#7b2cbf", "#e0aaff"],
] as const;
const explosionHeights = [18, 34, 50, 26, 42] as const;
const burstPatterns = ["radial", "ring", "mixed"] as const;

type Firework = {
  id: number;
  launchDurationMs: number;
  left: number;
  palette: (typeof colorPalettes)[number];
  pattern: (typeof burstPatterns)[number];
  top: number;
};

type FireworkStyle = CSSProperties & {
  "--firework-color": string;
  "--firework-launch-duration": string;
  "--firework-left": string;
  "--firework-top": string;
};

type ParticleStyle = CSSProperties & {
  "--firework-particle-x": string;
  "--firework-particle-y": string;
  "--firework-particle-fall": string;
  "--firework-particle-life": string;
  "--firework-particle-color": string;
  "--firework-particle-orientation": string;
};

const createFirework = (id: number): Firework => ({
  id,
  launchDurationMs: 900 + Math.random() * 450,
  left: 12 + Math.random() * 76,
  palette: colorPalettes[(id - 1) % colorPalettes.length] ?? colorPalettes[0],
  pattern: burstPatterns[(id - 1) % burstPatterns.length] ?? burstPatterns[0],
  top:
    (explosionHeights[(id - 1) % explosionHeights.length] ??
      explosionHeights[0]) +
    (Math.random() - 0.5) * 8,
});

type CustomBirthdayFireworksProps = {
  reducedDensity?: boolean;
};

const CustomBirthdayFireworks = ({
  reducedDensity = false,
}: CustomBirthdayFireworksProps) => {
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const timeoutIds = new Set<number>();
    let isActive = true;

    const scheduleTimeout = (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        timeoutIds.delete(timeoutId);
        callback();
      }, delay);
      timeoutIds.add(timeoutId);
    };

    const launchFirework = () => {
      if (!isActive) return;

      nextId.current += 1;
      const firework = createFirework(nextId.current);
      const maximumActiveFireworks = reducedDensity ? 3 : 6;

      setFireworks((currentFireworks) => [
        ...currentFireworks.slice(-(maximumActiveFireworks - 1)),
        firework,
      ]);

      scheduleTimeout(() => {
        setFireworks((currentFireworks) =>
          currentFireworks.filter(
            (currentFirework) => currentFirework.id !== firework.id,
          ),
        );
      }, firework.launchDurationMs + 2_800);

      scheduleTimeout(launchFirework, 650 + Math.random() * 450);
    };

    scheduleTimeout(launchFirework, 100);
    if (!reducedDensity) {
      scheduleTimeout(launchFirework, 300);
    }

    return () => {
      isActive = false;
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, [reducedDensity]);

  return (
    <div aria-hidden="true" className="birthday-fireworks">
      {fireworks.map((firework) => {
        const fireworkStyle: FireworkStyle = {
          "--firework-color": firework.palette[0],
          "--firework-launch-duration": `${String(
            firework.launchDurationMs,
          )}ms`,
          "--firework-left": `${String(firework.left)}%`,
          "--firework-top": `${String(firework.top)}vh`,
        };

        return (
          <span
            className="birthday-firework"
            data-pattern={firework.pattern}
            data-testid="birthday-firework"
            key={firework.id}
            style={fireworkStyle}
          >
            <span className="birthday-firework__rocket" />
            <span className="birthday-firework__flash" />
            <span className="birthday-firework__burst">
              {Array.from({ length: particleCount }, (_, index) => {
                const angle = (Math.PI * 2 * index) / particleCount;
                // Project shells of varying depth, rather than a flat starburst.
                const radius =
                  firework.pattern === "ring"
                    ? 155
                    : 65 + ((index * 37 + firework.id * 13) % 120);
                const particleStyle: ParticleStyle = {
                  "--firework-particle-x": `${String(Math.cos(angle) * radius)}px`,
                  "--firework-particle-y": `${String(Math.sin(angle) * radius)}px`,
                  "--firework-particle-fall": `${String(85 + (index % 7) * 12)}px`,
                  "--firework-particle-life": `${String(1_900 + (index % 9) * 95)}ms`,
                  "--firework-particle-color":
                    firework.palette[index % firework.palette.length] ??
                    firework.palette[0],
                  "--firework-particle-orientation": `${String((angle * 180) / Math.PI + 90)}deg`,
                };

                return (
                  <span
                    className="birthday-firework__particle"
                    key={index}
                    style={particleStyle}
                  />
                );
              })}
            </span>
          </span>
        );
      })}
    </div>
  );
};

type BirthdayFireworksProps = {
  renderer?: FireworksRenderer;
};

const BirthdayFireworks = ({
  renderer = "combined",
}: BirthdayFireworksProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <>
      {(renderer === "custom" || renderer === "combined") && (
        <CustomBirthdayFireworks reducedDensity={renderer === "combined"} />
      )}
      {(renderer === "fireworks-js" || renderer === "combined") && (
        <FireworksJsDisplay reducedDensity={renderer === "combined"} />
      )}
      {(renderer === "tsparticles" || renderer === "combined") && (
        <TsParticlesFireworks reducedDensity={renderer === "combined"} />
      )}
    </>
  );
};

export default BirthdayFireworks;
