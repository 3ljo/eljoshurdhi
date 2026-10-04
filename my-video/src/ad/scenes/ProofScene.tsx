import { Video } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { FONT, INK } from "../brand";
import { type SafeBox, useSafeBox } from "../layout";
import {
  clamp,
  EXTEND,
  Extended,
  fitSize,
  Kicker,
  land,
  LEAD,
  Phone,
  posterLine,
  RedBar,
  shake,
  useFontsReady,
} from "../parts";

// Proof (scene frames 0-164): "REAL WORK. ALL LIVE." then three live
// projects, each pushed in from the right on its beat and laid out like the
// website's story cards: cover art up top with its cover line and red rule,
// the project and its result on the story's print colour below.

type ProofSceneProps = {
  readonly title1?: string;
  readonly title2?: string;
  readonly labelA?: string;
  readonly coverA?: string;
  readonly resultA?: string;
  readonly labelB?: string;
  readonly coverB?: string;
  readonly resultB?: string;
  readonly labelC?: string;
  readonly coverC?: string;
  readonly resultC?: string;
  readonly style?: React.CSSProperties;
};

// Scene-local frames the soundtrack hits on.
const TITLE2 = 15;
const A = 30;
const B = 75;
const C = 120;
const END = 165;

const PUSH = 6;

const split = (text: string) =>
  text
    .split("/")
    .map((l) => l.trim())
    .filter(Boolean);

type Tone = { readonly panel: string; readonly ink: string; readonly label: string };

type ProjectProps = {
  readonly at: number;
  readonly box: SafeBox;
  readonly label: string;
  readonly cover: string;
  readonly result: string;
  readonly tone: Tone;
  readonly media: React.ReactNode;
  readonly device?: (size: { width: number; height: number }) => React.ReactNode;
  readonly coverColor?: string;
};

// One project, laid out inside the safe box. It sits in its own Sequence, so
// `at` is 0 (the cut) and frames are counted from there.
const Project: React.FC<ProjectProps> = ({ at, box, label, cover, result, tone, media, device, coverColor = INK.paper }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mediaBottom = box.top + box.height * 0.6;
  const lines = split(cover);
  const coverW = device ? box.width * 0.86 : box.width;
  const size = Math.min(170, ...lines.map((l) => fitSize(l, coverW / EXTEND, 170)));
  const deviceW = Math.round(Math.min(330, box.height * 0.3));
  const textW = device ? box.width - deviceW - 50 : box.width;
  const push = interpolate(frame, [at, at + PUSH], [width, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const resultIn = interpolate(frame, [at + 6, at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const deviceIn = interpolate(frame, [at + 4, at + 13], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ translate: `${push}px 0px`, backgroundColor: tone.panel, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width, height: mediaBottom, overflow: "hidden" }}>
        {media}
        <AbsoluteFill
          style={{ background: "linear-gradient(180deg, rgba(13,13,13,0.45) 0%, rgba(13,13,13,0) 45%)" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top + 10,
          translate: shake(frame, at + 2, 8, `cover-${at}`),
        }}
      >
        {lines.map((line, i) => (
          <div
            key={line}
            style={{
              ...posterLine(size, coverColor),
              transformOrigin: "0% 50%",
              ...land(frame, at + 2 + i * 2),
              filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.35))",
            }}
          >
            <Extended>{line}</Extended>
          </div>
        ))}
        <RedBar at={at + 5} width={170} height={20} style={{ marginTop: 18 }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: box.left,
          top: mediaBottom + 44,
          width: textW,
          opacity: resultIn,
          translate: `0px ${(1 - resultIn) * 40}px`,
        }}
      >
        <Kicker size={32} color={tone.label}>
          {label}
        </Kicker>
        <div
          style={{
            marginTop: 18,
            fontFamily: FONT.body,
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.1,
            color: tone.ink,
          }}
        >
          {result}
        </div>
      </div>

      {device ? (
        <div
          style={{
            position: "absolute",
            right: box.left - 6,
            top: mediaBottom - box.height * 0.16,
            translate: `0px ${deviceIn * height * 0.5}px`,
            rotate: `${interpolate(frame, [at + 4, at + 30], [4, 1.5], clamp)}deg`,
          }}
        >
          {device({ width: deviceW, height: Math.round(deviceW * 2.05) })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const ProofSceneInner: React.FC<ProofSceneProps> = ({
  title1 = "REAL WORK.",
  title2 = "ALL LIVE.",
  labelA = "Sage Commerce · Online store",
  coverA = "MORE THAN / JUST SNEAKERS",
  resultA = "Live and taking orders.",
  labelB = "AI Receptionist",
  coverB = "EVERY CALL / GETS ANSWERED",
  resultB = "Answers 24/7 and books the appointment.",
  labelC = "CV Climber",
  coverC = "CLIMB THE / LADDER FASTER",
  resultC = "Taking payments from day one.",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = useSafeBox();
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ backgroundColor: INK.paper, ...style }} />;

  const titles = [title1, title2];
  const tSizes = titles.map((t) => fitSize(t, box.width / EXTEND, 330));
  const tH = tSizes.reduce((a, s) => a + s * LEAD, 0) + 30 + 24;
  const tFit = Math.min(1, (box.height * 0.9) / tH);

  return (
    <AbsoluteFill style={{ backgroundColor: INK.paper, overflow: "hidden", ...style }}>
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top + (box.height - tH * tFit) / 2,
          transformOrigin: "0% 0%",
          scale: tFit * interpolate(frame, [0, A], [1, 1.04], clamp),
          translate: shake(frame, TITLE2, 9, "proof-title"),
        }}
      >
        <div style={{ ...posterLine(tSizes[0], INK.ink), transformOrigin: "0% 50%" }}>
          <Extended>{title1}</Extended>
        </div>
        <div style={{ ...posterLine(tSizes[1], INK.red), transformOrigin: "0% 50%", ...land(frame, TITLE2) }}>
          <Extended>{title2}</Extended>
        </div>
        <RedBar at={TITLE2} width={260} height={24} color={INK.ink} style={{ marginTop: 30 }} />
      </div>

      <Sequence name="Sage Commerce" from={A} durationInFrames={END - A} premountFor={fps}>
        <Project
          at={0}
          box={box}
          label={labelA}
          cover={coverA}
          result={resultA}
          tone={{ panel: INK.acid, ink: INK.ink, label: INK.ink }}
          media={
            <Img
              src={staticFile("ad/img/sage-2688.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "62% 70%",
                scale: interpolate(frame, [A, B], [1.12, 1.02], clamp),
              }}
            />
          }
          device={({ width }) => <Phone shot="ad/shots/sage-mobile.webp" width={width} />}
        />
      </Sequence>

      <Sequence name="AI Receptionist" from={B} durationInFrames={END - B} premountFor={fps}>
        <Project
          at={0}
          box={box}
          label={labelB}
          cover={coverB}
          result={resultB}
          coverColor={INK.acid}
          tone={{ panel: INK.ink, ink: INK.paper, label: INK.acid }}
          media={
            <Video
              src={staticFile("ad/video/payphone.mp4")}
              muted
              volume={0}
              objectFit="cover"
              trimBefore={12}
              premountFor={fps}
              style={{ position: "absolute", width: "100%", height: "100%", objectPosition: "20% 50%" }}
            />
          }
        />
      </Sequence>

      <Sequence name="CV Climber" from={C} durationInFrames={END - C} premountFor={fps}>
        <Project
          at={0}
          box={box}
          label={labelC}
          cover={coverC}
          result={resultC}
          tone={{ panel: INK.red, ink: INK.paper, label: INK.ink }}
          media={
            <Video
              src={staticFile("ad/video/stairs.mp4")}
              muted
              volume={0}
              objectFit="cover"
              trimBefore={6}
              premountFor={fps}
              style={{ position: "absolute", width: "100%", height: "100%", objectPosition: "50% 60%" }}
            />
          }
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const proofSchema = {
  title1: { type: "text-content", default: "REAL WORK.", description: "Title line 1" },
  title2: { type: "text-content", default: "ALL LIVE.", description: "Title line 2 (red)" },
  labelA: { type: "text-content", default: "Sage Commerce · Online store", description: "Project A label" },
  coverA: { type: "text-content", default: "MORE THAN / JUST SNEAKERS", description: "Project A cover line (/ = break)" },
  resultA: { type: "text-content", default: "Live and taking orders.", description: "Project A result" },
  labelB: { type: "text-content", default: "AI Receptionist", description: "Project B label" },
  coverB: { type: "text-content", default: "EVERY CALL / GETS ANSWERED", description: "Project B cover line" },
  resultB: { type: "text-content", default: "Answers 24/7 and books the appointment.", description: "Project B result" },
  labelC: { type: "text-content", default: "CV Climber", description: "Project C label" },
  coverC: { type: "text-content", default: "CLIMB THE / LADDER FASTER", description: "Project C cover line" },
  resultC: { type: "text-content", default: "Taking payments from day one.", description: "Project C result" },
} as const satisfies InteractivitySchema;

export const ProofScene = Interactive.withSchema({
  Component: ProofSceneInner,
  componentName: "<ProofScene>",
  schema: proofSchema,
  wrapInSequence: true,
});
