import { useState, useEffect } from 'react';


export function useBirthdayChecker(nextBirthday: Date): boolean {
    const [isBirthday, setIsBirthday] = useState<boolean>(() => {
        const now = new Date();
        return now.getMonth() === nextBirthday.getMonth() && now.getDate() === nextBirthday.getDate();
    });

    useEffect(() => {
        const updateBirthday = () => {
            const now = new Date();
            setIsBirthday(now.getMonth() === nextBirthday.getMonth() && now.getDate() === nextBirthday.getDate());
        };

        // Calculate milliseconds until next midnight
        function msUntilMidnight(): number {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0); // next midnight
            return midnight.getTime() - now.getTime();
        }

        // Set a timeout to update isBirthday at midnight
        let interval: ReturnType<typeof setInterval> | undefined;

        const timeout = setTimeout(() => {
            updateBirthday();
            // After updating at midnight, set an interval every 24h for next midnights
            interval = setInterval(updateBirthday, 24 * 60 * 60 * 1000);
        }, msUntilMidnight());

        // Cleanup timeout on unmount or nextBirthday change
        return () => {
            clearTimeout(timeout);
            if (interval !== undefined) {
                clearInterval(interval);
            }
        };
    }, [nextBirthday]);

    return isBirthday;
}
