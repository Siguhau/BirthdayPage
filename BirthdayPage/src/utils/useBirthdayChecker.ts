import { useEffect, useState } from "react";
import type { BirthdayDate } from "../birthdayConfig";
import { getNextZonedMidnight, isBirthdayDate } from "./birthdayDate";

export function useBirthdayChecker(
  birthday: BirthdayDate,
  timeZone: string,
): boolean {
  const birthdayDay = birthday.day;
  const birthdayMonth = birthday.month;
  const [isBirthday, setIsBirthday] = useState<boolean>(() => {
    return isBirthdayDate(new Date(), birthday, timeZone);
  });

  useEffect(() => {
    const configuredBirthday = {
      day: birthdayDay,
      month: birthdayMonth,
    };
    const updateBirthday = () => {
      setIsBirthday(isBirthdayDate(new Date(), configuredBirthday, timeZone));
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

    updateBirthday();
    scheduleNextUpdate();

    return () => {
      clearTimeout(timeout);
    };
  }, [birthdayDay, birthdayMonth, timeZone]);

  return isBirthday;
}
