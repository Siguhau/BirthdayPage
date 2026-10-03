import { roomFoods } from "./worldConfig";

const foodColors = ["#ef665b", "#f8bd3b", "#e9823e", "#cf4b65"];

const FoodScatter = ({ eatenFoodIds }: { eatenFoodIds: readonly string[] }) => (
  <group>
    {roomFoods.map(({ id, position }, index) =>
      eatenFoodIds.includes(id) ? null : (
        <group key={id} position={position}>
          <mesh castShadow>
            <sphereGeometry args={[0.24, 16, 12]} />
            <meshStandardMaterial
              color={foodColors[index % foodColors.length]}
              emissive="#3b1820"
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.1, 0.32, 8]} />
            <meshStandardMaterial color="#fff1bc" />
          </mesh>
        </group>
      ),
    )}
  </group>
);

export default FoodScatter;
