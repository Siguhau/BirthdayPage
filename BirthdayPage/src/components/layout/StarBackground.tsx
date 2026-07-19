import type { CSSProperties } from "react";

const starCount = 72;

type StarStyle = CSSProperties & {
  "--star-delay": string;
  "--star-duration": string;
  "--star-opacity": string;
  "--star-size": string;
  "--star-x": string;
  "--star-y": string;
};

const StarBackground = () => (
  <div aria-hidden="true" className="star-background">
    {Array.from({ length: starCount }, (_, index) => {
      const isBright = index % 13 === 0;
      const starStyle: StarStyle = {
        "--star-delay": `${String(-((index * 0.37) % 4.5))}s`,
        "--star-duration": `${String(2.4 + (index % 7) * 0.45)}s`,
        "--star-opacity": String(0.35 + (index % 5) * 0.13),
        "--star-size": `${String(isBright ? 3 : 1 + (index % 3) * 0.5)}px`,
        "--star-x": `${String((index * 37 + 11) % 100)}%`,
        "--star-y": `${String((index * 61 + 17) % 100)}%`,
      };

      return (
        <span
          className={`star-background__star${
            isBright ? " star-background__star--bright" : ""
          }`}
          key={index}
          style={starStyle}
        />
      );
    })}
  </div>
);

export default StarBackground;
