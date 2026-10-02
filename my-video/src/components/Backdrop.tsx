import { noise2D } from "@remotion/noise";
import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

type BackdropProps = {
  readonly glow?: string;
  readonly grid?: boolean;
  readonly particles?: number;
  readonly seed?: string;
};

// Shared scene background: near-black base, two slowly drifting glow orbs,
// a faint drifting grid and rising dust particles. Everything is driven by
// the frame, so it renders deterministically.
export const Backdrop: React.FC<BackdropProps> = ({
  glow = "rgba(16, 185, 129, 0.26)",
  grid = true,
  particles = 36,
  seed = "backdrop",
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A", overflow: "hidden" }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${30 + i * 40 + noise2D(`${seed}-x${i}`, frame / 260, i) * 22}%`,
            top: `${40 + i * 18 + noise2D(`${seed}-y${i}`, frame / 260, i + 7) * 20}%`,
            width: 1200,
            height: 1200,
            marginLeft: -600,
            marginTop: -600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glow} 0%, rgba(16, 185, 129, 0) 62%)`,
            opacity: i === 0 ? 1 : 0.55,
          }}
        />
      ))}
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
            backgroundPosition: `${frame * 0.4}px ${frame * 0.25}px`,
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          }}
        />
      ) : null}
      {new Array(particles).fill(true).map((_, i) => {
        const speed = 0.4 + random(`${seed}-s${i}`) * 1.2;
        const size = 2 + random(`${seed}-r${i}`) * 4;
        const y =
          (((random(`${seed}-y${i}`) * 1180 - frame * speed) % 1180) + 1180) %
          1180;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`${seed}-x${i}`) * 1920,
              top: y - 50,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "#34D399",
              opacity: 0.15 + random(`${seed}-o${i}`) * 0.35,
              boxShadow: "0 0 12px rgba(52, 211, 153, 0.8)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
