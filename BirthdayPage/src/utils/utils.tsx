import type { BirthdayDate } from "../birthdayConfig";

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

const millisecondsPerHour = 60 * 60 * 1_000;

const createDateFormatter = (timeZone: string): Intl.DateTimeFormat =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

const readNumericPart = (
  parts: Intl.DateTimeFormatPart[],
  type: "year" | "month" | "day",
): number => {
  const value = parts.find((part) => part.type === type)?.value;

  if (value === undefined) {
    throw new RangeError(`Unable to read ${type} from formatted date`);
  }

  return Number(value);
};

const getCalendarDate = (
  date: Date,
  formatter: Intl.DateTimeFormat,
): CalendarDate => {
  const parts = formatter.formatToParts(date);

  return {
    year: readNumericPart(parts, "year"),
    month: readNumericPart(parts, "month"),
    day: readNumericPart(parts, "day"),
  };
};

const getCalendarDateKey = ({ year, month, day }: CalendarDate): number =>
  year * 10_000 + month * 100 + day;

const getStartOfCalendarDate = (
  calendarDate: CalendarDate,
  timeZone: string,
): Date => {
  const formatter = createDateFormatter(timeZone);
  const targetKey = getCalendarDateKey(calendarDate);
  const approximateNoonUtc = Date.UTC(
    calendarDate.year,
    calendarDate.month - 1,
    calendarDate.day,
    12,
  );
  let lowerBound = approximateNoonUtc - 36 * millisecondsPerHour;
  let upperBound = approximateNoonUtc + 36 * millisecondsPerHour;

  while (lowerBound < upperBound) {
    const midpoint = lowerBound + Math.floor((upperBound - lowerBound) / 2);
    const midpointKey = getCalendarDateKey(
      getCalendarDate(new Date(midpoint), formatter),
    );

    if (midpointKey < targetKey) {
      lowerBound = midpoint + 1;
    } else {
      upperBound = midpoint;
    }
  }

  const result = new Date(lowerBound);
  if (getCalendarDateKey(getCalendarDate(result, formatter)) !== targetKey) {
    throw new RangeError(
      "The configured birthday is not a valid calendar date",
    );
  }

  return result;
};

export const isBirthdayDate = (
  date: Date,
  birthday: BirthdayDate,
  timeZone: string,
): boolean => {
  const calendarDate = getCalendarDate(date, createDateFormatter(timeZone));

  return (
    calendarDate.month === birthday.month && calendarDate.day === birthday.day
  );
};

export const getNextValidBirthday = (
  birthday: BirthdayDate,
  timeZone: string,
  now = new Date(),
): Date => {
  const currentDate = getCalendarDate(now, createDateFormatter(timeZone));
  const currentMonthAndDay = currentDate.month * 100 + currentDate.day;
  const birthdayMonthAndDay = birthday.month * 100 + birthday.day;
  const year =
    currentMonthAndDay <= birthdayMonthAndDay
      ? currentDate.year
      : currentDate.year + 1;

  return getStartOfCalendarDate(
    { year, month: birthday.month, day: birthday.day },
    timeZone,
  );
};

export const getNextZonedMidnight = (
  timeZone: string,
  now = new Date(),
): Date => {
  const currentDate = getCalendarDate(now, createDateFormatter(timeZone));
  const nextDate = new Date(
    Date.UTC(currentDate.year, currentDate.month - 1, currentDate.day + 1),
  );

  return getStartOfCalendarDate(
    {
      year: nextDate.getUTCFullYear(),
      month: nextDate.getUTCMonth() + 1,
      day: nextDate.getUTCDate(),
    },
    timeZone,
  );
};
