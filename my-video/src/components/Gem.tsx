import { ThreeCanvas } from "@remotion/three";
import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Faceted emerald icosahedron with two orbit rings. All motion is derived
// from the frame, as required for deterministic Three.js renders.
export const Gem: React.FC<{
  readonly appearAt: number;
  readonly size: number;
}> = ({ appearAt, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = Math.max(
    0.0001,
    interpolate(frame, [appearAt - 2, appearAt + 0.8 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.spring({ damping: 11 }),
    }),
  );

  return (
    <ThreeCanvas
      width={size}
      height={size}
      camera={{ position: [0, 0, 8.6], fov: 42 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={2.4} />
      <directionalLight
        position={[-6, -3, 2]}
        intensity={1.2}
        color="#34D399"
      />
      <pointLight position={[-4, -2, 4]} intensity={40} color="#10B981" />
      <group
        scale={grow}
        rotation={[0.45 + Math.sin(frame / 45) * 0.12, frame * 0.02, 0.1]}
      >
        <mesh>
          <icosahedronGeometry args={[1.55, 0]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#064e3b"
            emissiveIntensity={0.9}
            metalness={0.35}
            roughness={0.3}
            flatShading
          />
        </mesh>
        <mesh scale={1.012}>
          <icosahedronGeometry args={[1.55, 0]} />
          <meshBasicMaterial
            color="#6EE7B7"
            wireframe
            transparent
            opacity={0.75}
          />
        </mesh>
      </group>
      <group rotation={[1.2, frame * 0.01, 0.35]} scale={grow}>
        <mesh>
          <torusGeometry args={[2.3, 0.014, 8, 160]} />
          <meshBasicMaterial color="#34D399" transparent opacity={0.6} />
        </mesh>
      </group>
      <group rotation={[-0.9, -frame * 0.014, -0.5]} scale={grow}>
        <mesh>
          <torusGeometry args={[2.65, 0.01, 8, 160]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.35} />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};
