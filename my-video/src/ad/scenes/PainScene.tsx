import { Video } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { INK } from "../brand";
import { type SafeBox, useSafeBox } from "../layout";
import { clamp, fitSize, Photo, RedBar, shake, Slam, snap, useFontsReady } from "../parts";

// Three questions an owner recognises, each on its own black-and-white shot
// and stamped with a red cross, then the turn: "Let's fix that."
type PainSceneProps = {
  readonly question1?: string;
  readonly question2?: string;
  readonly question3?: string;
  readonly turn?: string;
  readonly style?: React.CSSProperties;
};

// Scene-local frames the soundtrack hits on.
const CUTS = [0, 30, 60];
const STAMP_AFTER = 10;
const TURN = 90;

// "PHONE NOT / RINGING?": a "/" in the copy marks a line break.
const split = (text: string) => text.split("/").map((l) => l.trim());

const Cross: React.FC<{ readonly at: number; readonly size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = snap(frame, at, fps);
  if (frame < at) return null;
  const draw = (delay: number) =>
    interpolate(frame, [at + delay, at + delay + 4], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        scale: interpolate(p, [0, 1], [1.8, 1]),
        rotate: "-8deg",
        translate: shake(frame, at, 16, `x${at}`),
      }}
    >
      <path d="M14 14 L86 86" stroke={INK.red} strokeWidth={17} strokeLinecap="square" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(0)} />
      <path d="M86 14 L14 86" stroke={INK.red} strokeWidth={17} strokeLinecap="square" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(2)} />
    </svg>
  );
};

const Question: React.FC<{
  readonly text: string;
  readonly box: SafeBox;
  readonly stampAt: number;
}> = ({ text, box, stampAt }) => {
  const frame = useCurrentFrame();
  const lines = split(text);
  const size = Math.min(...lines.map((l) => fitSize(l, box.width, 300)));
  const blockH = lines.length * size * 0.9 + (lines.length - 1) * 8;
  const fit = Math.min(1, (box.height * 0.62) / blockH);
  const cross = Math.min(300, box.height * 0.3);
  return (
    <div
      style={{
        position: "absolute",
        left: box.left,
        top: box.top + box.height * 0.5 - (blockH * fit) / 2 + cross * 0.25,
        width: box.width,
        transformOrigin: "0% 0%",
        scale: fit * interpolate(frame, [0, 30], [1, 1.03], clamp),
      }}
    >
      {lines.map((line, i) => (
        <Slam key={line} at={-12} size={size} color={INK.paper} enter="scale" style={{ marginTop: i ? 8 : 0 }}>
          {line}
        </Slam>
      ))}
      <div style={{ position: "absolute", right: -10, top: -cross * 0.92 / fit }}>
        <Cross at={stampAt} size={cross / fit} />
      </div>
    </div>
  );
};

const PainSceneInner: React.FC<PainSceneProps> = ({
  question1 = "No / website?",
  question2 = "Phone not / ringing?",
  question3 = "Competitors / look better?",
  turn = "Let's / fix / that.",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const box = useSafeBox();
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ backgroundColor: INK.ink, ...style }} />;

  const shade = (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.35) 45%, rgba(13,13,13,0.8) 100%)",
      }}
    />
  );

  const turnLines = split(turn);
  const turnSize = Math.min(...turnLines.map((l) => fitSize(l, box.width, 360)));
  const turnH = turnLines.length * turnSize * 0.9 + 30;
  const turnFit = Math.min(1, (box.height * 0.92) / turnH);
  const wipe = interpolate(frame, [TURN, TURN + 6], [height, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: INK.ink, overflow: "hidden", ...style }}>
      <Sequence name="No website" from={CUTS[0]} durationInFrames={30} premountFor={fps}>
        <Photo src="ad/img/posters-2048.webp" duration={30} zoom={[1.18, 1.08]} position="58% 50%" style={{ filter: "brightness(0.8) contrast(1.1)" }} />
        {shade}
        <Question text={question1} box={box} stampAt={STAMP_AFTER} />
      </Sequence>
      <Sequence name="Phone not ringing" from={CUTS[1]} durationInFrames={30} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("ad/video/payphone.mp4")}
            muted
            objectFit="cover"
            trimBefore={30}
            style={{
              width: "100%",
              height: "100%",
              filter: "brightness(0.95) contrast(1.15)",
              scale: interpolate(frame, [CUTS[1], CUTS[1] + 30], [1.14, 1.06], clamp),
            }}
          />
        </AbsoluteFill>
        {shade}
        <Question text={question2} box={box} stampAt={STAMP_AFTER} />
      </Sequence>
      <Sequence name="Competitors look better" from={CUTS[2]} durationInFrames={TURN - CUTS[2] + 6} premountFor={fps}>
        <Photo src="ad/img/shopper-2048.webp" duration={36} zoom={[1.1, 1.18]} position="60% 40%" style={{ filter: "brightness(0.85) contrast(1.1)" }} />
        {shade}
        <Question text={question3} box={box} stampAt={STAMP_AFTER} />
      </Sequence>

      <AbsoluteFill style={{ backgroundColor: INK.acid, translate: `0px ${wipe}px` }}>
        <div
          style={{
            position: "absolute",
            left: box.left,
            top: box.top + (box.height - turnH * turnFit) / 2,
            width: box.width,
            transformOrigin: "0% 0%",
            scale: turnFit * interpolate(frame, [TURN + 6, TURN + 44], [1, 1.04], clamp),
          }}
        >
          {turnLines.map((line, i) => (
            <Slam key={line} at={TURN + 2 + i * 2} size={turnSize} color={INK.ink} enter="up" style={{ marginTop: i ? 4 : 0 }}>
              {line}
            </Slam>
          ))}
          <RedBar at={TURN + 8} width={box.width * 0.4} height={22} style={{ marginTop: 12 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const painSchema = {
  question1: { type: "text-content", default: "No / website?", description: "Question 1 (/ = line break)" },
  question2: { type: "text-content", default: "Phone not / ringing?", description: "Question 2" },
  question3: { type: "text-content", default: "Competitors / look better?", description: "Question 3" },
  turn: { type: "text-content", default: "Let's / fix / that.", description: "The turn" },
} as const satisfies InteractivitySchema;

export const PainScene = Interactive.withSchema({
  Component: PainSceneInner,
  componentName: "<PainScene>",
  schema: painSchema,
  wrapInSequence: true,
});
