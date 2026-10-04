import type { ItemId } from "../state/gameTypes";

export type LongboiPhotoId =
  | "longboi-success-1"
  | "longboi-success-2"
  | "longboi-success-3"
  | "longboi-success-4"
  | "longboi-success-5"
  | "longboi-success-6"
  | "longboi-success-7"
  | "longboi-success-8"
  | "longboi-success-9"
  | "longboi-failure-1"
  | "longboi-failure-2"
  | "longboi-failure-3";

export type LongboiPhoto = {
  alt: string;
  id: LongboiPhotoId;
  kind: "failure" | "success";
  placeholderLabel: string;
  src: string | null;
};

export type SuccessfulLongboiPhoto = LongboiPhoto & {
  kind: "success";
};

export const successfulLongboiPhotos = [
  {
    alt: "Longboi-selfie med rød høstlønn i bakgrunnen",
    id: "longboi-success-1",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 1",
    src: "/images/longboi/longboi-2483.webp",
  },
  {
    alt: "Longboi-selfie med Fuji og pagode i bakgrunnen",
    id: "longboi-success-2",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 2",
    src: "/images/longboi/longboi-3103.webp",
  },
  {
    alt: "To venner foran et japansk slott",
    id: "longboi-success-3",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 3",
    src: "/images/longboi/longboi-2118.webp",
  },
  {
    alt: "Selfie foran et japansk slott",
    id: "longboi-success-4",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 4",
    src: "/images/longboi/longboi-2119.webp",
  },
  {
    alt: "Selfie foran et slott ved en innsjø",
    id: "longboi-success-5",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 5",
    src: "/images/longboi/longboi-2285.webp",
  },
  {
    alt: "Smilende selfie ved et slott og en innsjø",
    id: "longboi-success-6",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 6",
    src: "/images/longboi/longboi-2288.webp",
  },
  {
    alt: "Selfie med briller ved et slott",
    id: "longboi-success-7",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 7",
    src: "/images/longboi/longboi-2289.webp",
  },
  {
    alt: "Selfie i en bygate med en lastebil i bakgrunnen",
    id: "longboi-success-8",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 8",
    src: "/images/longboi/longboi-2359.webp",
  },
  {
    alt: "Selfie under rød høstlønn",
    id: "longboi-success-9",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 9",
    src: "/images/longboi/longboi-2481.webp",
  },
] as const satisfies readonly SuccessfulLongboiPhoto[];

export const failedLongboiPhotos = [
  {
    alt: "Portrett på en bygate om kvelden",
    id: "longboi-failure-1",
    kind: "failure",
    placeholderLabel: "Mislykket Longboi 1",
    src: "/images/longboi/longboi-1560.webp",
  },
  {
    alt: "Selfie foran et japansk slott",
    id: "longboi-failure-2",
    kind: "failure",
    placeholderLabel: "Mislykket Longboi 2",
    src: "/images/longboi/longboi-2122.webp",
  },
  {
    alt: "Portrett under en rød byport om kvelden",
    id: "longboi-failure-3",
    kind: "failure",
    placeholderLabel: "Mislykket Longboi 3",
    src: "/images/longboi/longboi-2029.webp",
  },
] as const satisfies readonly LongboiPhoto[];

export const longboiPhotoItemIds = [
  "longboi-photo-1",
] as const satisfies readonly Extract<ItemId, `longboi-photo-${string}`>[];

export const shuffleLongboiPhotos = <Photo>(
  photos: readonly Photo[],
  random: () => number = Math.random,
) => {
  const shuffled = [...photos];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

export type LongboiPhotoDeck<Photo extends { id: string }> = {
  remaining: Photo[];
  lastPhotoId: string | null;
};

export const createLongboiPhotoDeck = <
  Photo extends { id: string },
>(): LongboiPhotoDeck<Photo> => ({
  remaining: [],
  lastPhotoId: null,
});

export const drawLongboiPhoto = <Photo extends { id: string }>(
  photos: readonly Photo[],
  deck: LongboiPhotoDeck<Photo>,
  random: () => number = Math.random,
): { photo: Photo; deck: LongboiPhotoDeck<Photo> } => {
  if (photos.length === 0) {
    throw new Error("Cannot draw from an empty Longboi photo deck");
  }

  const remaining =
    deck.remaining.length > 0
      ? deck.remaining
      : shuffleLongboiPhotos(photos, random);

  // Avoid repeating the previous photo at the boundary between two full decks.
  if (
    deck.remaining.length === 0 &&
    remaining.length > 1 &&
    remaining[0].id === deck.lastPhotoId
  ) {
    [remaining[0], remaining[1]] = [remaining[1], remaining[0]];
  }

  const [photo, ...nextRemaining] = remaining;
  return {
    photo,
    deck: { remaining: nextRemaining, lastPhotoId: photo.id },
  };
};
