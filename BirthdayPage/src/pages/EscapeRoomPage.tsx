import EscapeRoomGame from "../features/escape-room/EscapeRoomGame";
import PageLayout from "../components/layout/PageLayout";
import { useLayoutEffect } from "react";
import { useTheme } from "../theme/useTheme";

type EscapeRoomPageProps = {
  locale: string;
  onComplete: () => void;
  userName: string;
};

const EscapeRoomPage = ({
  locale,
  onComplete,
  userName,
}: EscapeRoomPageProps) => {
  const { setTheme } = useTheme();
  useLayoutEffect(() => {
    setTheme("escape-room");
  }, [setTheme]);
  return (
    <PageLayout locale={locale} variant="immersive">
      <EscapeRoomGame onComplete={onComplete} userName={userName} />
    </PageLayout>
  );
};

export default EscapeRoomPage;
