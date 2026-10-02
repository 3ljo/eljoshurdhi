import {
  visualizeAudio,
  type MediaUtilsAudioData,
} from "@remotion/media-utils";
import type React from "react";
import { AbsoluteFill, interpolate } from "remotion";

type AudioReactiveProps = {
  readonly audioData: MediaUtilsAudioData | null;
  readonly dataOffsetInSeconds: number;
  // The frame of the composition that plays the music, passed down from the
  // parent so the visualization stays continuous across sequences.
  readonly frame: number;
  readonly fps: number;
};

const spectrum = ({
  audioData,
  dataOffsetInSeconds,
  frame,
  fps,
}: AudioReactiveProps) => {
  if (!audioData) {
    return null;
  }
  return visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 128,
    optimizeFor: "speed",
    dataOffsetInSeconds,
  });
};

// Emerald light that pulses with the kick drum, layered over every scene.
export const BassGlow: React.FC<AudioReactiveProps> = (props) => {
  const frequencies = spectrum(props);
  if (!frequencies) {
    return null;
  }
  const low = frequencies.slice(0, 6);
  const bass = low.reduce((sum, v) => sum + v, 0) / low.length;

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        pointerEvents: "none",
        opacity: Math.min(0.55, bass * 1.4),
        background:
          "radial-gradient(ellipse 1200px 420px at 50% 112%, rgba(16, 185, 129, 0.9), transparent 70%), radial-gradient(ellipse 500px 700px at -8% 50%, rgba(16, 185, 129, 0.35), transparent 70%), radial-gradient(ellipse 500px 700px at 108% 50%, rgba(16, 185, 129, 0.35), transparent 70%)",
      }}
    />
  );
};

// Mirrored spectrum bars along the bottom edge, for the end card.
export const Spectrum: React.FC<
  AudioReactiveProps & { readonly opacity: number }
> = ({ opacity, ...props }) => {
  const frequencies = spectrum(props);
  if (!frequencies || opacity <= 0) {
    return null;
  }
  // Low frequencies dominate, so map to decibels for a balanced look.
  const bars = frequencies.slice(0, 40).map((v) =>
    interpolate(20 * Math.log10(v + 1e-6), [-80, -22], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const mirrored = [...bars.slice().reverse(), ...bars];

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 8,
        paddingBottom: 0,
      }}
    >
      {mirrored.map((v, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 8 + v * 150,
            borderRadius: "8px 8px 0 0",
            background:
              "linear-gradient(180deg, #6EE7B7, rgba(16, 185, 129, 0.15))",
            boxShadow: "0 0 18px rgba(16, 185, 129, 0.45)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
