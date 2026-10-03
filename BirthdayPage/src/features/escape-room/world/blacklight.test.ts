import { describe, expect, it } from "vitest";
import { isSpawnBlacklightActive } from "./blacklight";

describe("isSpawnBlacklightActive", () => {
  it("requires both the hidden switch and a hung Longboi photo", () => {
    expect(isSpawnBlacklightActive(new Set(["hidden-photo-switch"]), [])).toBe(
      false,
    );
    expect(isSpawnBlacklightActive(new Set(), ["longboi-photo-1"])).toBe(false);
    expect(
      isSpawnBlacklightActive(new Set(["hidden-photo-switch"]), [
        "longboi-photo-2",
      ]),
    ).toBe(true);
  });
});
