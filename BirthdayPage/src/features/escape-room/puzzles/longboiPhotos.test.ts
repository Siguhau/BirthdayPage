import { describe, expect, it } from "vitest";
import {
  failedLongboiPhotos,
  getRepeatingPhoto,
  shuffleLongboiPhotos,
  successfulLongboiPhotos,
} from "./longboiPhotos";

describe("longboiPhotos", () => {
  it("randomizes the two successful rewards without losing either one", () => {
    const shuffled = shuffleLongboiPhotos(successfulLongboiPhotos, () => 0);

    expect(shuffled.map(({ id }) => id)).toEqual([
      "longboi-success-2",
      "longboi-success-1",
    ]);
    expect(new Set(shuffled.map(({ itemId }) => itemId)).size).toBe(2);
  });

  it("repeats only the two configured failed photos across many failures", () => {
    const seenIds = Array.from(
      { length: 8 },
      (_, attemptIndex) =>
        getRepeatingPhoto(failedLongboiPhotos, attemptIndex).id,
    );

    expect(new Set(seenIds)).toEqual(
      new Set(["longboi-failure-1", "longboi-failure-2"]),
    );
  });
});
