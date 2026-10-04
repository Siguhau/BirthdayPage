import { extend, type ThreeElement } from "@react-three/fiber";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

extend({ RoundedBoxGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    roundedBoxGeometry: ThreeElement<typeof RoundedBoxGeometry>;
  }
}

// Keep bevels inexpensive; rounding is built into geometry so mesh transforms
// and R3F's normal geometry disposal continue to work as usual.
export const BeveledBox = ({
  size,
  radius = 0.03,
}: {
  size: readonly [number, number, number];
  radius?: number;
}) => <roundedBoxGeometry args={[...size, 2, radius]} />;
