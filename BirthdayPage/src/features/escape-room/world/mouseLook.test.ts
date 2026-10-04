import { afterEach, describe, expect, it, vi } from "vitest";
import { requestMouseLook } from "./mouseLook";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("requestMouseLook", () => {
  it.each(["void", "resolved", "rejected"] as const)(
    "allows the caller to continue when pointer lock returns %s",
    async (result) => {
      const requestPointerLock = vi.fn(() => {
        if (result === "void") return undefined;
        if (result === "resolved") return Promise.resolve();
        return Promise.reject(new Error("Pointer lock denied"));
      });
      vi.stubGlobal("document", {
        pointerLockElement: null,
        documentElement: { requestPointerLock },
      });

      expect(requestMouseLook).not.toThrow();
      expect(requestPointerLock).toHaveBeenCalledOnce();
      // Let the rejection handler run; Vitest also fails on unhandled rejections.
      await Promise.resolve();
    },
  );
});
