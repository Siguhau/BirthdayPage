export type BirthdayDate = Readonly<{
  month: number;
  day: number;
}>;

export type BirthdayConfiguration = Readonly<{
  displayName: string;
  birthday: BirthdayDate;
  locale: string;
  timeZone: string;
}>;

export const birthdayConfig = {
  displayName: "Runar",
  birthday: {
    month: 12,
    day: 17,
  },
  locale: "nb-NO",
  timeZone: "Europe/Oslo",
} as const satisfies BirthdayConfiguration;
