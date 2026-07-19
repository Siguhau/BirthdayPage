import Countdown from "../Countdown";
import PageLayout from "../PageLayout";
import WelcomeText from "../WelcomeText";

type CountdownPageProps = {
  locale: string;
  targetDate: Date | number | string;
  userName: string;
};

const CountdownPage = ({
  locale,
  targetDate,
  userName,
}: CountdownPageProps) => (
  <PageLayout locale={locale}>
    <WelcomeText userName={userName} isBirthday={false} />
    <Countdown targetDate={targetDate} />
  </PageLayout>
);

export default CountdownPage;
