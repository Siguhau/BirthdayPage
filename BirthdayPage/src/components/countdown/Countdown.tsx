import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { useEffect, useState } from "react";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

type CountdownProps = {
  targetDate: Date | number | string;
};

const mobileBreakpoint = 600;

const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth <= mobileBreakpoint;

const Countdown = ({ targetDate }: CountdownProps) => {
  const [isMobile, setIsMobile] = useState(isMobileViewport);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(isMobileViewport());
    };

    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const digitBlockStyle = isMobile
    ? { width: 24, height: 36, fontSize: 18 }
    : { width: 56, height: 84, fontSize: 44 };
  const labelStyle = isMobile
    ? { fontSize: 9, color: "#888" }
    : { fontSize: 16, color: "#888" };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <FlipClockCountdown
        to={targetDate}
        labels={["DAGER", "TIMER", "MINUTTER", "SEKUNDER"]}
        digitBlockStyle={digitBlockStyle}
        dividerStyle={{ color: "#222" }}
        labelStyle={labelStyle}
      />
    </div>
  );
};

export default Countdown;
