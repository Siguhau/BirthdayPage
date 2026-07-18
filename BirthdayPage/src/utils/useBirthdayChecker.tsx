import { useState, useEffect } from "react";
import type { BirthdayDate } from "../birthdayConfig";
import { getNextZonedMidnight, isBirthdayDate } from "./utils";

export function useBirthdayChecker(
  birthday: BirthdayDate,
  timeZone: string,
): boolean {
  const [isBirthday, setIsBirthday] = useState<boolean>(() => {
    return isBirthdayDate(new Date(), birthday, timeZone);
  });

  useEffect(() => {
    const updateBirthday = () => {
      setIsBirthday(isBirthdayDate(new Date(), birthday, timeZone));
    };

    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNextUpdate = () => {
      const now = new Date();
      const delay =
        getNextZonedMidnight(timeZone, now).getTime() - now.getTime();

      timeout = setTimeout(() => {
        updateBirthday();
        scheduleNextUpdate();
      }, delay);
    };

    scheduleNextUpdate();

    return () => {
      clearTimeout(timeout);
    };
  }, [birthday, timeZone]);

  return isBirthday;
}
