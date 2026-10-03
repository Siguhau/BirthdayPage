import EscapeRoomGame from "../features/escape-room/EscapeRoomGame";
import PageLayout from "../components/layout/PageLayout";

type EscapeRoomPageProps = {
  locale: string;
  onComplete: () => void;
  userName: string;
};

const EscapeRoomPage = ({
  locale,
  onComplete,
  userName,
}: EscapeRoomPageProps) => (
  <PageLayout locale={locale} variant="immersive">
    <EscapeRoomGame onComplete={onComplete} userName={userName} />
  </PageLayout>
);

export default EscapeRoomPage;
