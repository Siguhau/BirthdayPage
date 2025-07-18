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
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #232526 0%, #414345 40%, #23243a 100%)',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <WelcomeText userName={TARGET_NAME} isBirthday={isBirthday} />
      {!isBirthday && <Countdown targetDate={nextBirthday} />}
    </div>
  )
}

export default App
