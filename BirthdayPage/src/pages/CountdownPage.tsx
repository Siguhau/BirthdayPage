import Countdown from "../components/countdown/Countdown";
import CountdownWelcomeText from "../components/countdown/CountdownWelcomeText";
import PageLayout from "../components/layout/PageLayout";

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
    <CountdownWelcomeText userName={userName} />
    <Countdown targetDate={targetDate} />
  </PageLayout>
);

export default CountdownPage;
