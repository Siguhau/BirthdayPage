import type { CSSProperties } from "react";
import usePrefersReducedMotion from "../../../utils/usePrefersReducedMotion";
import "./HeartConfetti.css";

const colors = ["#ff5c8a", "#ff8fab", "#ffcad4", "#fff0f3", "#e85d9e"];

const HeartConfetti = () => {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="heart-confetti"
      data-testid="heart-confetti"
      data-reduced-motion={reducedMotion}
    >
      {Array.from({ length: reducedMotion ? 12 : 100 }, (_, index) => (
        <span
          className="heart-confetti__heart"
          key={index}
          style={
            {
              "--heart-left": `${String((index * 37) % 100)}%`,
              "--heart-drift": `${String(((index * 53) % 260) - 130)}px`,
              "--heart-delay": `${String((index % 20) * 65)}ms`,
              "--heart-duration": `${String(2_800 + (index % 9) * 170)}ms`,
              "--heart-turn": `${String(((index * 47) % 600) - 300)}deg`,
              "--heart-size": `${String(12 + (index % 5) * 5)}px`,
              color: colors[index % colors.length],
            } as CSSProperties
          }
        >
          ♥
        </span>
      ))}
    </div>
  );
};

export default HeartConfetti;
