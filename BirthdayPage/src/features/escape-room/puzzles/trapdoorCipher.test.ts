import { describe, expect, it } from "vitest";
import {
  applyCaesarShift,
  trapdoorCipherBlacklightLabel,
  trapdoorCipherPlaintext,
  trapdoorCipherShift,
  trapdoorCode,
} from "./trapdoorCipher";

describe("trapdoorCipher", () => {
  it("encrypts JUNAR to the trapdoor password with the blacklight shift", () => {
    expect(applyCaesarShift(trapdoorCipherPlaintext, trapdoorCipherShift)).toBe(
      trapdoorCode,
    );
    expect(trapdoorCipherShift).toBe(30);
    expect(trapdoorCipherBlacklightLabel).toBe("K = 30");
    expect(trapdoorCode).toBe("nyrev");
  });

  it("wraps shifts greater than the alphabet length", () => {
    expect(applyCaesarShift("junar", 30)).toBe("nyrev");
  });
});
