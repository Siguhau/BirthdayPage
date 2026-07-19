import BirthdayWelcomeText from "../components/birthday/BirthdayWelcomeText";
import PageLayout from "../components/layout/PageLayout";

type BirthdayPageProps = {
  locale: string;
  userName: string;
};

const BirthdayPage = ({ locale, userName }: BirthdayPageProps) => (
  <PageLayout locale={locale}>
    <BirthdayWelcomeText userName={userName} />
  </PageLayout>
);

export default BirthdayPage;
