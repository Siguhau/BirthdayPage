import BirthdayWelcomeText from "../components/birthday/BirthdayWelcomeText";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import PageLayout from "../components/layout/PageLayout";
import { useLayoutEffect } from "react";
import { useTheme } from "../theme/useTheme";

type BirthdayPageProps = {
  enterFromGame?: boolean;
  fireworksRenderer?: FireworksRenderer;
  locale: string;
  userName: string;
};

const BirthdayPage = ({
  enterFromGame = false,
  fireworksRenderer,
  locale,
  userName,
}: BirthdayPageProps) => {
  const { setTheme } = useTheme();
  useLayoutEffect(() => {
    setTheme("escape-room");
  }, [setTheme]);
  return (
    <PageLayout locale={locale}>
      <BirthdayWelcomeText
        enterFromGame={enterFromGame}
        fireworksRenderer={fireworksRenderer}
        userName={userName}
      />
    </PageLayout>
  );
};

export default BirthdayPage;
