import { describe, expect, it } from "vitest";
import {
  applyCaesarShift,
  trapdoorCipherPlaintext,
  trapdoorCipherShift,
  trapdoorCode,
} from "./trapdoorCipher";

describe("trapdoorCipher", () => {
  it("encrypts JUNAR to the trapdoor password with a +1 Caesar shift", () => {
    expect(applyCaesarShift(trapdoorCipherPlaintext, trapdoorCipherShift)).toBe(
      trapdoorCode,
    );
    expect(trapdoorCode).toBe("kvobs");
  });
});
