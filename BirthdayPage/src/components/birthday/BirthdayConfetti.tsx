import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

const colors = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#f9ca24",
  "#6c5ce7",
  "#ff9ff3",
  "#54a0ff",
  "#5f27cd",
  "#00d2d3",
  "#ff9f43",
  "#1dd1a1",
  "#feca57",
  "#ff6348",
  "#c44569",
  "#786fa6",
] as const;

const getConfettiCount = () => {
  const width = window.innerWidth;
  if (width < 500) return 25;
  if (width < 800) return 40;
  if (width < 1200) return 55;
  return 70;
};

const createParticles = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    return index + Math.random() * 100000;
  });

const BirthdayConfetti = () => {
  const [particles, setParticles] = useState<number[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia(reducedMotionQuery).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const initialConfettiTimeout = window.setTimeout(() => {
      setParticles(createParticles(getConfettiCount()));
    }, 0);

    const confettiInterval = window.setInterval(() => {
      setParticles((currentParticles) => [
        ...currentParticles,
        ...createParticles(getConfettiCount() * 0.8),
      ]);
    }, 1500);

    const cleanupInterval = window.setInterval(() => {
      setParticles((currentParticles) => currentParticles.slice(-300));
    }, 10000);

    const handleResize = () => {
      setParticles((currentParticles) => {
        const newCount = getConfettiCount();
        return currentParticles.length > newCount
          ? currentParticles.slice(-newCount)
          : currentParticles;
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(initialConfettiTimeout);
      window.clearInterval(confettiInterval);
      window.clearInterval(cleanupInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden="true" className="birthday-confetti">
      {particles.map((particle) => (
        <span
          className="birthday-confetti__particle"
          key={particle}
          style={{
            animationDelay: `${String((particle % 10) * 0.1)}s`,
            animationDuration: `${String(8 + (particle % 4))}s`,
            backgroundColor:
              colors[
                Math.floor((particle * 17 + particle * 23) % colors.length)
              ],
            left: `${String((particle * 7 + particle * 13) % 100)}%`,
          }}
        />
      ))}
    </div>
  );
};

export default BirthdayConfetti;
