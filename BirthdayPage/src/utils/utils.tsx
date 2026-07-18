export const isBirthdayDate = (date: Date, birthday: Date): boolean =>
  date.getMonth() === birthday.getMonth() &&
  date.getDate() === birthday.getDate();

export const getNextValidBirthday = (
  birthday: Date,
  now = new Date(),
): Date => {
  const nextBirthday = new Date(
    now.getFullYear(),
    birthday.getMonth(),
    birthday.getDate(),
  );

  while (nextBirthday < now) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  return nextBirthday;
};
