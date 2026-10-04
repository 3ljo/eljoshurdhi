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
import { FONT, INK } from "../brand";
import { useSafeBox } from "../layout";
import { clamp, fitSize, Photo, RedBar, shake, snap, useFontsReady } from "../parts";

// Pain (scene frames 0-134): three questions an owner recognises, each a hard
// cut onto its own darkened black-and-white shot, each stamped with a huge red
// cross 10 frames after it lands. Then the turn: the acid panel wipes up and
// "LET'S FIX THAT." lands by frame 96 and holds.

type PainSceneProps = {
  readonly question1?: string;
  readonly question2?: string;
  readonly question3?: string;
  readonly turn?: string;
  readonly style?: React.CSSProperties;
};

// Scene-local frames the soundtrack hits on.
const Q1 = 0;
const Q2 = 30;
const Q3 = 60;
const STAMP = 10;
const TURN = 90;
const LANDED = 96;

// Anton set 7% extended with a hair of stroke, like the hook and the site.
const EXTEND = 1.07;
const LEAD = 0.92;
const Q_MAX = 270;
const RULE_W = 300;
const RULE_H = 26;
const RULE_GAP = 34;

// "PHONE NOT / RINGING?": a "/" in the copy marks a line break.
const split = (text: string) =>
  text
    .split("/")
    .map((l) => l.trim())
    .filter(Boolean);

const lineStyle = (size: number, color: string): React.CSSProperties => ({
  fontFamily: FONT.display,
  fontSize: size,
  lineHeight: LEAD,
  height: size * LEAD,
  letterSpacing: "0.005em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  color,
  WebkitTextStroke: `0.012em ${color}`,
});

const extended: React.CSSProperties = {
  display: "inline-block",
  scale: `${EXTEND} 1`,
  transformOrigin: "0% 50%",
};

// The red cross: two flat print-red bars, square ends, stamped at a slight
// angle. It slams from 1.7x and settles in ~6 frames.
const Cross: React.FC<{ readonly at: number; readonly size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const p = snap(frame, at, fps);
  const bar = size * 0.12;
  const length = size * Math.SQRT2 - bar;
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        scale: interpolate(p, [0, 1], [1.7, 1]),
        rotate: `${interpolate(p, [0, 1], [-16, -5])}deg`,
      }}
    >
      {[45, -45].map((deg) => (
        <div
          key={deg}
          style={{
            position: "absolute",
            left: (size - length) / 2,
            top: (size - bar) / 2,
            width: length,
            height: bar,
            backgroundColor: INK.red,
            rotate: `${deg}deg`,
          }}
        />
      ))}
    </div>
  );
};

// One question beat: the line punches in on the cut, the cross stamps in
// behind it at STAMP, and the line stays fully readable on top.
const Question: React.FC<{ readonly text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = useSafeBox();
  const lines = split(text);
  const size = Math.min(Q_MAX, ...lines.map((l) => fitSize(l, box.width / EXTEND, Q_MAX)));
  const textH = lines.length * size * LEAD;
  const cross = Math.min(box.width, box.height) * 0.9;
  const cy = box.top + box.height / 2;
  const hit = shake(frame, STAMP, 16, `pain-${text}`);
  return (
    <AbsoluteFill style={{ translate: hit }}>
      <div
        style={{
          position: "absolute",
          left: box.left + (box.width - cross) / 2,
          top: cy - cross / 2,
          width: cross,
          height: cross,
        }}
      >
        <Cross at={STAMP} size={cross} />
      </div>
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: cy - textH / 2,
          width: box.width,
          transformOrigin: "0% 50%",
          scale: interpolate(snap(frame, 0, fps), [0, 1], [1.12, 1]),
        }}
      >
        {lines.map((line) => (
          <div key={line} style={lineStyle(size, INK.paper)}>
            <span style={extended}>{line}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// The shot behind a question: darkened, pushing in slowly, with a kick when
// the cross lands.
const Shot: React.FC<{ readonly children: React.ReactNode; readonly dim: number }> = ({ children, dim }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale:
            interpolate(frame, [0, 36], [1.04, 1.12], clamp) +
            interpolate(frame, [STAMP, STAMP + 1, STAMP + 9], [0, 0.035, 0], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
        }}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: INK.ink, opacity: dim }} />
    </AbsoluteFill>
  );
};

const PainSceneInner: React.FC<PainSceneProps> = ({
  question1 = "NO / WEBSITE?",
  question2 = "PHONE NOT / RINGING?",
  question3 = "COMPETITORS / LOOK BETTER?",
  turn = "LET'S FIX / THAT.",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = useSafeBox();
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ backgroundColor: INK.ink, ...style }} />;

  // The turn is set as a poster stack: each line runs the full width.
  const turnLines = split(turn);
  const turnSizes = turnLines.map((l) => fitSize(l, box.width / EXTEND, 520));
  const turnTops = turnSizes.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1] + s * LEAD], [0]);
  const turnH = turnTops[turnTops.length - 1] + RULE_GAP + RULE_H;
  const turnFit = Math.min(1, box.height / (turnH * 1.04));
  const drops = turnLines.map((_, i) => LANDED - (turnLines.length - 1 - i) * 3);

  return (
    <AbsoluteFill style={{ backgroundColor: INK.ink, overflow: "hidden", ...style }}>
      <Sequence name="No website" from={Q1} durationInFrames={Q2 - Q1} premountFor={fps}>
        <Shot dim={0.5}>
          <Photo src="ad/img/posters-2048.webp" duration={30} zoom={[1, 1]} position="78% 50%" />
        </Shot>
        <Question text={question1} />
      </Sequence>

      <Sequence name="Phone not ringing" from={Q2} durationInFrames={Q3 - Q2} premountFor={fps}>
        <Shot dim={0.2}>
          <Video
            src={staticFile("ad/video/payphone.mp4")}
            muted
            volume={0}
            objectFit="cover"
            trimBefore={24}
            premountFor={fps}
            style={{ position: "absolute", width: "100%", height: "100%", objectPosition: "16% 50%" }}
          />
        </Shot>
        <Question text={question2} />
      </Sequence>

      <Sequence name="Competitors look better" from={Q3} durationInFrames={TURN - Q3 + 6} premountFor={fps}>
        <Shot dim={0.42}>
          <Photo src="ad/img/shopper-2048.webp" duration={36} zoom={[1, 1]} position="50% 40%" />
        </Shot>
        <Question text={question3} />
      </Sequence>

      <Sequence name="Let's fix that" from={TURN} premountFor={fps}>
        <AbsoluteFill
          style={{
            backgroundColor: INK.acid,
            clipPath: `inset(${interpolate(frame, [TURN, TURN + 5], [100, 0], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            })}% 0px 0px 0px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: box.left,
              top: box.top + (box.height - turnH * turnFit) / 2,
              width: box.width,
              height: turnH,
              transformOrigin: "0% 0%",
              scale: turnFit * interpolate(frame, [LANDED, 134], [1, 1.04], clamp),
              translate: shake(frame, LANDED, 10, "pain-turn"),
            }}
          >
            {turnLines.map((line, i) => (
              <div
                key={line}
                style={{
                  ...lineStyle(turnSizes[i], INK.ink),
                  position: "absolute",
                  left: 0,
                  top: turnTops[i],
                  transformOrigin: "0% 0%",
                  opacity: interpolate(frame, [drops[i] - 3, drops[i] - 2], [0, 1], clamp),
                  scale: interpolate(frame, [drops[i] - 2, drops[i], drops[i] + 1, drops[i] + 4], [1.4, 1, 0.985, 1], {
                    ...clamp,
                    easing: [Easing.in(Easing.quad), Easing.linear, Easing.out(Easing.quad)],
                  }),
                }}
              >
                <span style={extended}>{line}</span>
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, top: turnTops[turnTops.length - 1] + RULE_GAP }}>
              <RedBar at={LANDED} width={RULE_W} height={RULE_H} />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const painSchema = {
  question1: { type: "text-content", default: "NO / WEBSITE?", description: "Question 1 (/ = line break)" },
  question2: { type: "text-content", default: "PHONE NOT / RINGING?", description: "Question 2 (/ = line break)" },
  question3: { type: "text-content", default: "COMPETITORS / LOOK BETTER?", description: "Question 3 (/ = line break)" },
  turn: { type: "text-content", default: "LET'S FIX / THAT.", description: "The turn (/ = line break)" },
} as const satisfies InteractivitySchema;

export const PainScene = Interactive.withSchema({
  Component: PainSceneInner,
  componentName: "<PainScene>",
  schema: painSchema,
  wrapInSequence: true,
});
