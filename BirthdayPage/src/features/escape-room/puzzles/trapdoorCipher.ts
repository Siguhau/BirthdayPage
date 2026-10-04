export const trapdoorCipherPlaintext = "junar";
/** The blacklight clue in the reading corner reveals this birthday number. */
export const trapdoorCipherShift = 30;
export const trapdoorCipherBlacklightLabel = `K = ${String(trapdoorCipherShift)}`;

export const applyCaesarShift = (value: string, shift: number) =>
  Array.from(value.toLowerCase())
    .map((character) => {
      const code = character.charCodeAt(0);
      if (code < 97 || code > 122) return character;
      return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
    })
    .join("");

export const trapdoorCode = applyCaesarShift(
  trapdoorCipherPlaintext,
  trapdoorCipherShift,
);
