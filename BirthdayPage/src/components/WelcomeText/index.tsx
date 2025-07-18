
import React, { useEffect, useState } from 'react';

interface WelcomeTextProps {
    userName: string;
    isBirthday: boolean;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ userName, isBirthday }) => {

    return (
        <div>
            {isBirthday ? (
                <h2>🎉 Gratulerer med dagen {userName}! 🎉</h2>
            ) : (
                <p>
                    Tid til {userName}'s bursdag
                </p>
            )}
        </div>
    );
};

export default WelcomeText;