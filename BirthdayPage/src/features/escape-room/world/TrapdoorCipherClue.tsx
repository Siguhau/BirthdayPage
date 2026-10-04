import { trapdoorCipherPlaintext } from "../puzzles/trapdoorCipher";
import { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

const TrapdoorCipherClue = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 160;
    const context = canvas.getContext("2d");
    if (context !== null) {
      context.fillStyle = "#d5c397";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#5a4227";
      context.lineWidth = 14;
      context.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);
      context.fillStyle = "#342719";
      context.font = "bold 92px Georgia, serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        trapdoorCipherPlaintext.toUpperCase(),
        canvas.width / 2,
        canvas.height / 2 + 4,
      );
    }
    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    return nextTexture;
  }, []);

  return (
    <mesh position={[0, 0.035, -7.12]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.8, 0.56]} />
      <meshStandardMaterial map={texture} roughness={0.92} />
    </mesh>
  );
};

export default TrapdoorCipherClue;
