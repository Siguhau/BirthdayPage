export const trapdoorCipherPlaintext = "junar";
export const trapdoorCipherShift = 1;
export const trapdoorCode = "kvobs";

export const applyCaesarShift = (value: string, shift: number) =>
  Array.from(value.toLowerCase())
    .map((character) => {
      const code = character.charCodeAt(0);
      if (code < 97 || code > 122) return character;
      return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
    })
    .join("");
