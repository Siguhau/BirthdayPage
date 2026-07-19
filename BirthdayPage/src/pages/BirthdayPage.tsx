import BirthdayWelcomeText from "../components/birthday/BirthdayWelcomeText";
import type { FireworksRenderer } from "../components/birthday/fireworksTypes";
import PageLayout from "../components/layout/PageLayout";

type BirthdayPageProps = {
  fireworksRenderer?: FireworksRenderer;
  locale: string;
  userName: string;
};

const BirthdayPage = ({
  fireworksRenderer,
  locale,
  userName,
}: BirthdayPageProps) => (
  <PageLayout locale={locale}>
    <BirthdayWelcomeText
      fireworksRenderer={fireworksRenderer}
      userName={userName}
    />
  </PageLayout>
);

export default BirthdayPage;
