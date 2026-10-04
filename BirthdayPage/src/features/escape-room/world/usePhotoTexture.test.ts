import { act, renderHook } from "@testing-library/react";
import { SRGBColorSpace, Texture, TextureLoader } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import usePhotoTexture from "./usePhotoTexture";

type LoadRequest = {
  texture: Texture;
  dispose: ReturnType<typeof vi.fn>;
  succeed: () => void;
  fail: () => void;
};

const requests: LoadRequest[] = [];

beforeEach(() => {
  requests.length = 0;
  vi.spyOn(TextureLoader.prototype, "load").mockImplementation(
    (_src, onLoad, _onProgress, onError) => {
      const texture = new Texture<HTMLImageElement>();
      const dispose = vi.fn();
      texture.addEventListener("dispose", dispose);
      requests.push({
        texture,
        dispose,
        succeed: () => onLoad?.(texture),
        fail: () => onError?.(new Error("Image unavailable")),
      });
      return texture;
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("usePhotoTexture", () => {
  it("keeps rendering without Suspense while a hung photo loads", () => {
    const { result } = renderHook(() => usePhotoTexture("/photo.webp"));
    expect(result.current).toBeNull();

    act(() => {
      requests[0].succeed();
    });
    expect(result.current).toBe(requests[0].texture);
    expect(result.current?.colorSpace).toBe(SRGBColorSpace);
  });

  it("keeps the backing visible when the photo cannot load", () => {
    const { result } = renderHook(() => usePhotoTexture("/missing.webp"));
    act(() => {
      requests[0].fail();
    });
    expect(result.current).toBeNull();
  });

  it("ignores an old request after the photo changes", () => {
    const { result, rerender } = renderHook(({ src }) => usePhotoTexture(src), {
      initialProps: { src: "/first.webp" },
    });
    rerender({ src: "/second.webp" });
    expect(requests[0].dispose).toHaveBeenCalledOnce();
    act(() => {
      requests[1].succeed();
    });
    act(() => {
      requests[0].succeed();
    });
    expect(result.current).toBe(requests[1].texture);
  });

  it("clears the previous image while loading a replacement", () => {
    const { result, rerender } = renderHook(({ src }) => usePhotoTexture(src), {
      initialProps: { src: "/first.webp" },
    });
    act(() => {
      requests[0].succeed();
    });
    rerender({ src: "/second.webp" });
    expect(result.current).toBeNull();
  });

  it("disposes a pending texture and ignores completion after unmount", () => {
    const { result, unmount } = renderHook(() =>
      usePhotoTexture("/photo.webp"),
    );
    unmount();
    expect(requests[0].dispose).toHaveBeenCalledOnce();
    act(() => {
      requests[0].succeed();
    });
    expect(result.current).toBeNull();
  });
});
