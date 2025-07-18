import Countdown from './components/Countdown'
import './App.css'
import WelcomeText from './components/WelcomeText';
import { getNextValidBirthday } from './utils/utils';
import { useBirthdayChecker } from './utils/useBirthdayChecker';

const TARGET_DATE = new Date('2023-07-19T23:59:59');
const TARGET_NAME = 'Runar';

function App() {
  const nextBirthday = getNextValidBirthday(TARGET_DATE);
  const isBirthday = useBirthdayChecker(nextBirthday);

  return (
    <>
      <WelcomeText userName={TARGET_NAME} isBirthday={isBirthday} />
      {!isBirthday && <Countdown targetDate={nextBirthday} />}
    </>
  )
}

export default App
