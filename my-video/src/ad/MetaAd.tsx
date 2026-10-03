import type React from "react";
import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { AdSound } from "./AdSound";
import { INK } from "./brand";
import { Grain } from "./parts";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { OfferScene } from "./scenes/OfferScene";
import { PainScene } from "./scenes/PainScene";
import { ProofScene } from "./scenes/ProofScene";

// The 20-second Meta ad. One component renders all three formats (9:16
// Reels/Stories, 4:5 feed, 1:1 square); each scene lays itself out inside
// useSafeBox(). Hard cuts land on beats of the 120 BPM bed (see brand.ts).
export const MetaAd: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: INK.ink }}>
      <Series>
        <Series.Sequence name="Hook" durationInFrames={90} premountFor={fps}>
          <HookScene />
        </Series.Sequence>
        <Series.Sequence name="Pain" durationInFrames={135} premountFor={fps}>
          <PainScene />
        </Series.Sequence>
        <Series.Sequence name="Proof" durationInFrames={165} premountFor={fps}>
          <ProofScene />
        </Series.Sequence>
        <Series.Sequence name="Offer" durationInFrames={105} premountFor={fps}>
          <OfferScene />
        </Series.Sequence>
        <Series.Sequence name="Call to action" durationInFrames={105} premountFor={fps}>
          <CtaScene />
        </Series.Sequence>
      </Series>
      <Grain />
      <AdSound />
    </AbsoluteFill>
  );
};
