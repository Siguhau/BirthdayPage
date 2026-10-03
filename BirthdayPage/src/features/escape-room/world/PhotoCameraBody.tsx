type PhotoCameraBodyProps = {
  batteryInstalled: boolean;
};

const PhotoCameraBody = ({ batteryInstalled }: PhotoCameraBodyProps) => (
  <group>
    <mesh castShadow>
      <boxGeometry args={[0.82, 0.5, 0.42]} />
      <meshStandardMaterial color="#262c38" metalness={0.4} roughness={0.35} />
    </mesh>
    <mesh castShadow position={[0, 0.03, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.22, 0.28, 0.38, 24]} />
      <meshStandardMaterial color="#151a22" metalness={0.7} roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.03, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.035, 24]} />
      <meshStandardMaterial
        color="#79d8ff"
        emissive="#174e70"
        emissiveIntensity={0.85}
        metalness={0.2}
        roughness={0.08}
      />
    </mesh>

    <mesh castShadow position={[-0.2, 0.3, 0]}>
      <boxGeometry args={[0.25, 0.14, 0.2]} />
      <meshStandardMaterial color="#262c38" metalness={0.35} roughness={0.4} />
    </mesh>
    <mesh position={[0.24, 0.28, 0.05]}>
      <cylinderGeometry args={[0.075, 0.075, 0.045, 18]} />
      <meshStandardMaterial
        color="#ff5b67"
        emissive="#8e101c"
        emissiveIntensity={0.8}
        roughness={0.3}
      />
    </mesh>

    <mesh position={[0.41, 0, 0]}>
      <boxGeometry args={[0.06, 0.26, 0.28]} />
      <meshStandardMaterial
        color={batteryInstalled ? "#f39a35" : "#11151c"}
        emissive={batteryInstalled ? "#7a3107" : "#000000"}
        emissiveIntensity={batteryInstalled ? 0.65 : 0}
        metalness={0.35}
        roughness={0.35}
      />
    </mesh>
    <mesh position={[0.3, 0.23, 0.22]}>
      <sphereGeometry args={[0.035, 12, 8]} />
      <meshBasicMaterial color={batteryInstalled ? "#67f29a" : "#ff5b67"} />
    </mesh>

    <pointLight
      color="#79d8ff"
      distance={2.5}
      intensity={2.5}
      position={[0, 0.03, 0.62]}
    />
  </group>
);

export default PhotoCameraBody;
