import Countdown from "../components/countdown/Countdown";
import CountdownWelcomeText from "../components/countdown/CountdownWelcomeText";
import PageLayout from "../components/layout/PageLayout";
import "./CountdownPage.css";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/useTheme";
import { hasSeenThemeReveal } from "../theme/themeReveal";
import usePrefersReducedMotion from "../utils/usePrefersReducedMotion";

type CountdownPageProps = {
  departing?: boolean;
  replayThemeTransition?: boolean;
  locale: string;
  targetDate: Date | number | string;
  userName: string;
};

const CountdownPage = ({
  departing = false,
  replayThemeTransition = false,
  locale,
  targetDate,
  userName,
}: CountdownPageProps) => {
  const { setTheme, theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(
    () =>
      !replayThemeTransition &&
      (theme === "escape-room" || hasSeenThemeReveal()),
  );
  const showNewTheme = revealed || reducedMotion;

  useLayoutEffect(() => {
    setTheme(showNewTheme ? "escape-room" : "birthday");
  }, [showNewTheme, setTheme]);

  useEffect(() => {
    if (showNewTheme) return;
    // The invitation is the last part of the existing CSS reveal (6.2s + 2s).
    const timeout = window.setTimeout(() => {
      setRevealed(true);
    }, 8_200);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [showNewTheme]);

  return (
    <main
      className="countdown-reveal"
      data-departing={departing}
      data-revealed={showNewTheme}
      lang={locale}
    >
      <PageLayout locale={locale}>
        <div aria-hidden="true" className="countdown-reveal__world" />
        <div aria-hidden="true" className="countdown-reveal__door">
          <span className="countdown-reveal__leaf countdown-reveal__leaf--left" />
          <span className="countdown-reveal__leaf countdown-reveal__leaf--right" />
          <span className="countdown-reveal__seam" />
        </div>
        <div className="countdown-reveal__content">
          <p className="countdown-reveal__eyebrow">
            Et nytt kapittel nærmer seg
          </p>
          <CountdownWelcomeText userName={userName} />
          <Countdown targetDate={targetDate} />
          <div className="countdown-reveal__invitation">
            <span aria-hidden="true" className="countdown-reveal__keyhole" />
            <p>Det er noe på den andre siden.</p>
          </div>
        </div>
      </PageLayout>
    </main>
  );
};

export default CountdownPage;
