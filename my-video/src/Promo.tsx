import { Audio } from "@remotion/media";
import { useWindowedAudioData } from "@remotion/media-utils";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
import { pushCut } from "@remotion/transitions/push-cut";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BassGlow, Spectrum } from "./components/AudioReactive";
import { LightLeakOverlay } from "./components/LightLeakOverlay";
import { CtaScene } from "./scenes/CtaScene";
import { IntroScene } from "./scenes/IntroScene";
import { LocationScene } from "./scenes/LocationScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { ProcessScene } from "./scenes/ProcessScene";
import { WhyMeScene } from "./scenes/WhyMeScene";
import { WorkScene } from "./scenes/WorkScene";
import { SoundEffects } from "./SoundEffects";

// 50 s promo cut to a 120 BPM track. Scene starts land on bar lines:
// Intro 0, Location 180, Problem 300, Process 540, Work 780,
// Why me 1080, Call to action 1260. Each transition starts on its bar line,
// so a scene's duration is (next start - start + transition length).
export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile("audio/music.wav"),
    frame,
    fps,
    windowInSeconds: 10,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
      <TransitionSeries name="Scenes">
        <TransitionSeries.Sequence
          name="Intro"
          durationInFrames={180}
          premountFor={fps}
        >
          <IntroScene
            firstName="Eljo"
            lastName="Shurdhi"
            role="Frontend Developer"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={30} premountFor={fps}>
          <LightLeakOverlay seed={3} hueShift={240} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="Location"
          durationInFrames={135}
          premountFor={fps}
        >
          <LocationScene city="Tirana," country="Albania" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Problem"
          durationInFrames={260}
          premountFor={fps}
        >
          <ProblemScene fix="Let's fix that." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={iris({ width, height })}
          timing={linearTiming({ durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence
          name="How it works"
          durationInFrames={260}
          premountFor={fps}
        >
          <ProcessScene label="HOW IT WORKS" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence
          name="Work"
          durationInFrames={315}
          premountFor={fps}
        >
          <WorkScene label="SELECTED WORK" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={pushCut({ flashColor: "#34D399", flashOpacity: 0.35 })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Why me"
          durationInFrames={180}
          premountFor={fps}
        >
          <WhyMeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={30} premountFor={fps}>
          <LightLeakOverlay seed={7} hueShift={240} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="Call to action"
          durationInFrames={240}
          premountFor={fps}
        >
          <CtaScene
            headline="Custom websites"
            highlight="that convert."
            button="Start My Project"
            fullName="Eljo Shurdhi"
            subtitle="Frontend Developer · Tirana, Albania"
            url="eljoshurdhi.vercel.app"
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <BassGlow
        audioData={audioData}
        dataOffsetInSeconds={dataOffsetInSeconds}
        frame={frame}
        fps={fps}
      />
      <Spectrum
        audioData={audioData}
        dataOffsetInSeconds={dataOffsetInSeconds}
        frame={frame}
        fps={fps}
        opacity={interpolate(
          frame,
          [1380, 1400, 1480, 1499],
          [0, 0.9, 0.9, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )}
      />

      <Audio
        name="Music"
        src={staticFile("audio/music.wav")}
        volume={0.7}
        premountFor={fps}
      />
      <SoundEffects />
    </AbsoluteFill>
  );
};
