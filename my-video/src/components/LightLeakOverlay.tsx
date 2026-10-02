import { lightLeak } from "@remotion/effects/light-leak";
import type React from "react";
import { interpolate, Solid, useCurrentFrame, useVideoConfig } from "remotion";

// Plays over a cut point inside a <TransitionSeries.Overlay>. hueShift 240
// turns the default warm leak into the brand's emerald; screen blending lets
// the scenes show through the light instead of being covered by it.
export const LightLeakOverlay: React.FC<{
  readonly seed?: number;
  readonly hueShift?: number;
}> = ({ seed = 0, hueShift = 240 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, height, width } = useVideoConfig();

  return (
    <Solid
      width={width}
      height={height}
      premountFor={fps}
      style={{ mixBlendMode: "screen", opacity: 0.8 }}
      effects={[
        lightLeak({
          seed,
          hueShift,
          progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }),
      ]}
    />
  );
};
