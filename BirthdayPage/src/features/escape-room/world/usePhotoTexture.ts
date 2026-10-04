import { useEffect, useState } from "react";
import { SRGBColorSpace, Texture, TextureLoader } from "three";

// Photos appear during play, so loading one must not suspend the physics scene.
const usePhotoTexture = (src: string) => {
  const [loaded, setLoaded] = useState<{
    src: string;
    texture: Texture;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const texture = new TextureLoader().load(
      src,
      (loadedTexture) => {
        if (!active) return;
        loadedTexture.colorSpace = SRGBColorSpace;
        setLoaded({ src, texture: loadedTexture });
      },
      undefined,
      () => {
        // Leave the backing visible if the image is unavailable.
      },
    );

    return () => {
      active = false;
      texture.dispose();
    };
  }, [src]);

  return loaded?.src === src ? loaded.texture : null;
};

export default usePhotoTexture;
