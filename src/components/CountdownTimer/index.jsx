// countdown timer using luxon

import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

export default function CountdownTimer() {
    const [time, setTime] = useState(DateTime.local());
    const birthday = DateTime.local().set({ month: 12, day: 17, hour: 0, minute: 0 , seconds: 0 });
    const diff = birthday.diff(time, ["days", "hours", "minutes", "seconds"]);
    console.log(time.toISO());
    console.log(birthday.toISO());
    console.log(diff);
    const { days, hours, minutes, seconds } = diff.toObject();
    
    useEffect(() => {
        const timer = setInterval(() => {
        setTime(DateTime.local());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    
    
    return (
        <div>
        <p>Tid til Runar sin bursdag:</p>
        <p id="countdown">
            {days} : {hours} : {minutes} : {Math.floor(seconds)}
        </p>
        </div>
    );
    }