import { describe, expect, it } from "vitest";
import { getNextValidBirthday, isBirthdayDate } from "./utils";

describe("isBirthdayDate", () => {
  it("matches the month and day regardless of year or time", () => {
    const birthday = new Date("2023-12-17T12:00:00Z");

    expect(isBirthdayDate(new Date("2026-12-17T00:00:00Z"), birthday)).toBe(
      true,
    );
    expect(isBirthdayDate(new Date("2026-12-18T00:00:00Z"), birthday)).toBe(
      false,
    );
  });
});

describe("getNextValidBirthday", () => {
  const birthday = new Date("2023-12-17T12:00:00Z");

  it("returns the birthday in the current year when it is upcoming", () => {
    const result = getNextValidBirthday(
      birthday,
      new Date("2026-06-01T12:00:00Z"),
    );

    expect(result).toEqual(new Date("2026-12-17T00:00:00Z"));
  });

  it("moves the birthday to the next year after it has passed", () => {
    const result = getNextValidBirthday(
      birthday,
      new Date("2026-12-18T00:00:00Z"),
    );

    expect(result).toEqual(new Date("2027-12-17T00:00:00Z"));
  });
});
