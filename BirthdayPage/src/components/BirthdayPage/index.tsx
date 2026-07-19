import PageLayout from "../PageLayout";
import WelcomeText from "../WelcomeText";

type BirthdayPageProps = {
  locale: string;
  userName: string;
};

const BirthdayPage = ({ locale, userName }: BirthdayPageProps) => (
  <PageLayout locale={locale}>
    <WelcomeText userName={userName} isBirthday />
  </PageLayout>
);

export default BirthdayPage;
