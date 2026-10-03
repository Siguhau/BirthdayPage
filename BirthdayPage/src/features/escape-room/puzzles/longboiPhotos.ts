import type { ItemId } from "../state/gameTypes";

export type LongboiPhotoId =
  | "longboi-success-1"
  | "longboi-success-2"
  | "longboi-failure-1"
  | "longboi-failure-2";

export type LongboiPhoto = {
  alt: string;
  id: LongboiPhotoId;
  kind: "failure" | "success";
  placeholderLabel: string;
  src: string | null;
};

export type SuccessfulLongboiPhoto = LongboiPhoto & {
  itemId: Extract<ItemId, `longboi-photo-${string}`>;
  kind: "success";
};

export const successfulLongboiPhotos = [
  {
    alt: "Vellykket Longboi-bilde 1",
    id: "longboi-success-1",
    itemId: "longboi-photo-1",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 1",
    src: null,
  },
  {
    alt: "Vellykket Longboi-bilde 2",
    id: "longboi-success-2",
    itemId: "longboi-photo-2",
    kind: "success",
    placeholderLabel: "Vellykket Longboi 2",
    src: null,
  },
] as const satisfies readonly SuccessfulLongboiPhoto[];

export const failedLongboiPhotos = [
  {
    alt: "Mislykket Longboi-bilde 1",
    id: "longboi-failure-1",
    kind: "failure",
    placeholderLabel: "Mislykket Longboi 1",
    src: null,
  },
  {
    alt: "Mislykket Longboi-bilde 2",
    id: "longboi-failure-2",
    kind: "failure",
    placeholderLabel: "Mislykket Longboi 2",
    src: null,
  },
] as const satisfies readonly LongboiPhoto[];

export const longboiPhotoItemIds = successfulLongboiPhotos.map(
  ({ itemId }) => itemId,
);

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

export const getRepeatingPhoto = <Photo>(
  photos: readonly Photo[],
  attemptIndex: number,
) => photos[attemptIndex % photos.length];
