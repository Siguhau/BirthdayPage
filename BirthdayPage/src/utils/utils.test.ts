import { describe, expect, it } from "vitest";
import {
  getNextValidBirthday,
  getNextZonedMidnight,
  isBirthdayDate,
} from "./utils";

const birthday = { month: 12, day: 17 } as const;

describe("isBirthdayDate", () => {
  it("matches the configured month and day regardless of year or time", () => {
    expect(
      isBirthdayDate(new Date("2026-12-17T12:00:00Z"), birthday, "UTC"),
    ).toBe(true);
    expect(
      isBirthdayDate(new Date("2026-12-18T00:00:00Z"), birthday, "UTC"),
    ).toBe(false);
  });

  it("uses the configured time zone at a date boundary", () => {
    const date = new Date("2026-12-16T23:30:00Z");

    expect(isBirthdayDate(date, birthday, "Europe/Oslo")).toBe(true);
    expect(isBirthdayDate(date, birthday, "America/New_York")).toBe(false);
  });
});

describe("getNextValidBirthday", () => {
  it("returns the birthday in the current year when it is upcoming", () => {
    const result = getNextValidBirthday(
      birthday,
      "UTC",
      new Date("2026-06-01T12:00:00Z"),
    );

    expect(result).toEqual(new Date("2026-12-17T00:00:00Z"));
  });

  it("moves the birthday to the next year after it has passed", () => {
    const result = getNextValidBirthday(
      birthday,
      "UTC",
      new Date("2026-12-18T00:00:00Z"),
    );

    expect(result).toEqual(new Date("2027-12-17T00:00:00Z"));
  });

  it("returns midnight in the configured time zone", () => {
    const result = getNextValidBirthday(
      birthday,
      "Europe/Oslo",
      new Date("2026-06-01T12:00:00Z"),
    );

    expect(result).toEqual(new Date("2026-12-16T23:00:00Z"));
  });
});

describe("getNextZonedMidnight", () => {
  it("accounts for daylight-saving transitions", () => {
    const firstMidnight = getNextZonedMidnight(
      "Europe/Oslo",
      new Date("2026-03-28T12:00:00Z"),
    );
    const followingMidnight = getNextZonedMidnight(
      "Europe/Oslo",
      firstMidnight,
    );

    expect(firstMidnight).toEqual(new Date("2026-03-28T23:00:00Z"));
    expect(followingMidnight).toEqual(new Date("2026-03-29T22:00:00Z"));
    expect(followingMidnight.getTime() - firstMidnight.getTime()).toBe(
      23 * 60 * 60 * 1_000,
    );
  });
});
