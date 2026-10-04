import { describe, expect, it } from "vitest";
import {
  createLongboiPhotoDeck,
  drawLongboiPhoto,
  failedLongboiPhotos,
  longboiPhotoItemIds,
  shuffleLongboiPhotos,
  successfulLongboiPhotos,
} from "./longboiPhotos";

describe("longboiPhotos", () => {
  it("shuffles all nine successful photos while retaining one puzzle reward", () => {
    const shuffled = shuffleLongboiPhotos(successfulLongboiPhotos, () => 0);

    expect(shuffled).toHaveLength(9);
    expect(new Set(shuffled.map(({ id }) => id))).toEqual(
      new Set(successfulLongboiPhotos.map(({ id }) => id)),
    );
    expect(longboiPhotoItemIds).toEqual(["longboi-photo-1"]);
  });

  it.each([
    ["successful", successfulLongboiPhotos],
    ["failed", failedLongboiPhotos],
  ] as const)("uses every %s photo before repeating any", (_kind, photos) => {
    let deck = createLongboiPhotoDeck<(typeof photos)[number]>();
    const seenIds: string[] = [];

    for (let index = 0; index < photos.length * 3; index += 1) {
      const draw = drawLongboiPhoto(photos, deck, () => 0);
      deck = draw.deck;
      seenIds.push(draw.photo.id);
    }

    for (let cycle = 0; cycle < 3; cycle += 1) {
      expect(
        new Set(
          seenIds.slice(cycle * photos.length, (cycle + 1) * photos.length),
        ),
      ).toEqual(new Set(photos.map(({ id }) => id)));
    }
    expect(seenIds[photos.length - 1]).not.toBe(seenIds[photos.length]);
  });

  it("reshuffles each new cycle", () => {
    let deck = createLongboiPhotoDeck<(typeof failedLongboiPhotos)[number]>();
    const seenIds: string[] = [];
    let randomValue = 0;

    for (let index = 0; index < failedLongboiPhotos.length * 2; index += 1) {
      const draw = drawLongboiPhoto(
        failedLongboiPhotos,
        deck,
        () => randomValue,
      );
      deck = draw.deck;
      seenIds.push(draw.photo.id);
      if (index === failedLongboiPhotos.length - 1) randomValue = 0.999;
    }

    expect(seenIds.slice(0, failedLongboiPhotos.length)).not.toEqual(
      seenIds.slice(failedLongboiPhotos.length),
    );
  });

  it("uses a distinct photo for each configured result", () => {
    const photos = [...successfulLongboiPhotos, ...failedLongboiPhotos];

    expect(photos).toHaveLength(12);
    expect(successfulLongboiPhotos).toHaveLength(9);
    expect(failedLongboiPhotos).toHaveLength(3);
    expect(successfulLongboiPhotos.map(({ src }) => src)).toEqual(
      expect.arrayContaining([
        "/images/longboi/longboi-2118.webp",
        "/images/longboi/longboi-2119.webp",
        "/images/longboi/longboi-2285.webp",
        "/images/longboi/longboi-2288.webp",
        "/images/longboi/longboi-2289.webp",
        "/images/longboi/longboi-2359.webp",
        "/images/longboi/longboi-2481.webp",
        "/images/longboi/longboi-2483.webp",
        "/images/longboi/longboi-3103.webp",
      ]),
    );
    expect(failedLongboiPhotos.map(({ src }) => src)).toEqual(
      expect.arrayContaining([
        "/images/longboi/longboi-1560.webp",
        "/images/longboi/longboi-2122.webp",
        "/images/longboi/longboi-2029.webp",
      ]),
    );
    expect(new Set(photos.map(({ src }) => src)).size).toBe(photos.length);
    expect(photos.every(({ src }) => src.endsWith(".webp"))).toBe(true);
  });
});
