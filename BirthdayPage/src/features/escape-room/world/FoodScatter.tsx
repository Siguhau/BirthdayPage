import type { ReactNode } from "react";
import { BeveledBox } from "./PropGeometry";
import { roomFoods } from "./worldConfig";

type PartProps = {
  children?: ReactNode;
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

const Part = ({ children, color, ...transform }: PartProps) => (
  <mesh castShadow receiveShadow {...transform}>
    {children ?? <sphereGeometry args={[1, 16, 12]} />}
    <meshStandardMaterial color={color} roughness={0.78} />
  </mesh>
);

const Disk = ({
  radius,
  height,
  ...props
}: PartProps & { radius: number; height: number }) => (
  <Part {...props}>
    <cylinderGeometry args={[radius, radius, height, 24]} />
  </Part>
);

const FoodModel = ({ id }: { id: string }) => {
  switch (id) {
    case "food-burger":
      return (
        <group>
          <Part
            color="#df9d4c"
            position={[0, -0.1, 0]}
            scale={[0.24, 0.09, 0.24]}
          />
          <Disk color="#513020" radius={0.23} height={0.08} />
          <Part color="#f5ba36" position={[0, 0.055, 0]} rotation={[0, 0.3, 0]}>
            <BeveledBox size={[0.39, 0.025, 0.39]} radius={0.01} />
          </Part>
          <Disk
            color="#cf493d"
            radius={0.21}
            height={0.035}
            position={[0, 0.08, 0]}
          />
          <Part
            color="#eeb86b"
            position={[0, 0.16, 0]}
            scale={[0.245, 0.12, 0.245]}
          />
          {[-0.12, 0, 0.12].map((x) => (
            <Part
              key={x}
              color="#fff0c3"
              position={[x, 0.266 - Math.abs(x) * 0.22, 0.015]}
              scale={[0.012, 0.006, 0.026]}
            />
          ))}
        </group>
      );
    case "food-donut":
      return (
        <group rotation={[0.2, 0, 0]}>
          <Part color="#d9924c" rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.17, 0.085, 12, 28]} />
          </Part>
          <Part
            color="#ef82ad"
            position={[0, 0.035, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.17, 0.069, 12, 28]} />
          </Part>
          {Array.from({ length: 10 }, (_, i) => (
            <Part
              key={i}
              color={i % 2 ? "#fff0b0" : "#80d4d5"}
              position={[
                Math.cos(i * 2.4) * 0.17,
                0.104,
                Math.sin(i * 2.4) * 0.17,
              ]}
              rotation={[0, i, 0]}
            >
              <boxGeometry args={[0.012, 0.009, 0.035]} />
            </Part>
          ))}
        </group>
      );
    case "food-pizza":
      return (
        <group rotation={[0, 0.2, 0]}>
          <Part color="#d69b52">
            <cylinderGeometry args={[0.32, 0.32, 0.07, 3]} />
          </Part>
          <Part color="#f8cc65" position={[0, 0.044, 0]}>
            <cylinderGeometry args={[0.285, 0.285, 0.022, 3]} />
          </Part>
          {[
            [-0.1, -0.08],
            [0.1, -0.08],
            [0, 0.12],
          ].map(([x, z]) => (
            <Disk
              key={`${String(x)}-${String(z)}`}
              color="#b94335"
              radius={0.045}
              height={0.012}
              position={[x, 0.061, z]}
            />
          ))}
        </group>
      );
    case "food-fries":
      return (
        <group>
          <Part color="#c94b50" position={[0, -0.03, 0]}>
            <BeveledBox size={[0.34, 0.3, 0.22]} radius={0.025} />
          </Part>
          {Array.from({ length: 7 }, (_, i) => (
            <Part
              key={i}
              color={i % 2 ? "#efb94d" : "#ffdc77"}
              position={[
                ((i % 4) - 1.5) * 0.075,
                0.16 + (i % 3) * 0.025,
                i < 4 ? 0.055 : -0.055,
              ]}
              rotation={[0, 0, (i - 3) * 0.05]}
            >
              <BeveledBox size={[0.055, 0.32, 0.055]} radius={0.008} />
            </Part>
          ))}
          <Part color="#ffe3a0" position={[0, -0.03, 0.115]}>
            <boxGeometry args={[0.13, 0.04, 0.01]} />
          </Part>
        </group>
      );
    case "food-icecream":
      return (
        <group>
          <Part color="#c78c49" position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.14, 0.025, 0.34, 20]} />
          </Part>
          <Part
            color="#f4b5c5"
            position={[0, 0.16, 0]}
            scale={[0.18, 0.17, 0.18]}
          />
          <Part
            color="#fff0cb"
            position={[0.02, 0.31, 0]}
            scale={[0.13, 0.13, 0.13]}
          />
          <Part
            color="#be3b45"
            position={[0.02, 0.44, 0]}
            scale={[0.04, 0.04, 0.04]}
          />
        </group>
      );
    case "food-sushi":
      return (
        <group>
          {[-0.14, 0.14].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <Disk color="#243c32" radius={0.125} height={0.19} />
              <Disk
                color="#f8efce"
                radius={0.107}
                height={0.012}
                position={[0, 0.1, 0]}
              />
              <Part color="#ec906f" position={[0, 0.11, 0]}>
                <BeveledBox size={[0.09, 0.018, 0.08]} radius={0.018} />
              </Part>
              <Disk
                color="#7da64d"
                radius={0.024}
                height={0.016}
                position={[0.065, 0.11, 0.02]}
              />
            </group>
          ))}
        </group>
      );
    case "food-pancake":
      return (
        <group>
          {[0, 0.065, 0.13].map((y) => (
            <Disk
              key={y}
              color="#dfaa60"
              radius={0.25}
              height={0.055}
              position={[0, y - 0.1, 0]}
            />
          ))}
          <Disk
            color="#a86329"
            radius={0.17}
            height={0.008}
            position={[0, 0.063, 0]}
          />
          <Part color="#ffe590" position={[0, 0.085, 0]} rotation={[0, 0.4, 0]}>
            <BeveledBox size={[0.105, 0.035, 0.09]} radius={0.01} />
          </Part>
        </group>
      );
    case "food-waffle":
      return (
        <group>
          <Part color="#b97734">
            <BeveledBox size={[0.42, 0.07, 0.42]} radius={0.025} />
          </Part>
          {[-0.18, -0.09, 0, 0.09, 0.18].flatMap((offset) =>
            [0, 1].map((axis) => (
              <Part
                key={`${String(offset)}-${String(axis)}`}
                color="#edb65d"
                position={axis ? [offset, 0.043, 0] : [0, 0.043, offset]}
              >
                <boxGeometry
                  args={axis ? [0.025, 0.022, 0.4] : [0.4, 0.022, 0.025]}
                />
              </Part>
            )),
          )}
        </group>
      );
    case "food-cake":
    case "food-lasagne": {
      const cake = id === "food-cake";
      return (
        <group>
          {[0, 1, 2, 3, 4].map((layer) => (
            <Part
              key={layer}
              color={
                layer % 2
                  ? cake
                    ? "#f2abc2"
                    : "#ab4931"
                  : cake
                    ? "#fff0c7"
                    : "#edc472"
              }
              position={[0, layer * 0.047 - 0.09, 0]}
            >
              <BeveledBox size={[0.4, 0.047, 0.3]} radius={0.012} />
            </Part>
          ))}
          {cake && (
            <Part
              color="#c73b53"
              position={[0, 0.17, 0]}
              scale={[0.055, 0.065, 0.055]}
            />
          )}
        </group>
      );
    }
    case "food-taco":
      return (
        <group position={[-0.07, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <Part color="#efc563">
            <cylinderGeometry
              args={[0.23, 0.23, 0.065, 24, 1, false, 0, Math.PI]}
            />
          </Part>
          <Part color="#efc563" position={[0, 0.14, 0]}>
            <cylinderGeometry
              args={[0.23, 0.23, 0.065, 24, 1, false, 0, Math.PI]}
            />
          </Part>
          {[-0.13, 0, 0.13].map((z) => (
            <group key={z} position={[0.045, 0.07, z]}>
              <Part color="#75a74d" scale={[0.075, 0.075, 0.08]} />
              <Part
                color="#d65b40"
                position={[0.05, 0.01, 0]}
                scale={[0.035, 0.04, 0.035]}
              />
            </group>
          ))}
        </group>
      );
    case "food-burrito":
      return (
        <group rotation={[0, 0, 0.9]}>
          <Part color="#efdab1">
            <capsuleGeometry args={[0.135, 0.28, 6, 16]} />
          </Part>
          <Part color="#9faeae" position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.14, 0.11, 0.22, 16]} />
          </Part>
          <Part
            color="#6c994e"
            position={[0, 0.22, 0]}
            scale={[0.1, 0.045, 0.1]}
          />
          <Part
            color="#bf5542"
            position={[0.035, 0.245, 0.02]}
            scale={[0.035, 0.025, 0.035]}
          />
        </group>
      );
    default:
      return null;
  }
};

const foodRestOffsets: Readonly<Record<string, number>> = {
  "food-lasagne": -0.1,
  "food-pizza": -0.18,
  "food-burger": -0.025,
  "food-taco": 0.02,
  "food-donut": -0.13,
  "food-cake": -0.1,
  "food-fries": -0.035,
  "food-sushi": -0.12,
  "food-waffle": -0.18,
  "food-icecream": 0,
  "food-burrito": -0.04,
  "food-pancake": -0.09,
};

const FoodScatter = ({ eatenFoodIds }: { eatenFoodIds: readonly string[] }) => (
  <group>
    {roomFoods.map(({ id, position }) =>
      eatenFoodIds.includes(id) ? null : (
        <group key={id} position={position}>
          <group position={[0, foodRestOffsets[id] ?? 0, 0]}>
            <FoodModel id={id} />
          </group>
          <mesh receiveShadow position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.34, 0.29, 0.035, 32]} />
            <meshStandardMaterial color="#f1e8db" roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.227, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.315, 0.012, 6, 32]} />
            <meshStandardMaterial
              color="#d4af67"
              metalness={0.45}
              roughness={0.38}
            />
          </mesh>
        </group>
      ),
    )}
  </group>
);

export default FoodScatter;
