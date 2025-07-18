import React from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

type CountdownProps = {
    targetDate: Date | number | string;
};

const Countdown = ({ targetDate }: CountdownProps): React.JSX.Element => {
    return (
        <div>
            <FlipClockCountdown
                to={targetDate}
                labels={['DAGER', 'TIMER', 'MINUTTER', 'SEKUNDER']}
                digitBlockStyle={{ width: 40, height: 60, fontSize: 32 }}
                dividerStyle={{ color: '#222' }}
                labelStyle={{ fontSize: 12, color: '#888' }}
            />
        </div>
    );
};

export default Countdown;