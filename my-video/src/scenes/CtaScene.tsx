import { starburst } from "@remotion/effects/starburst";
import { evolvePath } from "@remotion/paths";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  random,
  Solid,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Gem } from "../components/Gem";
import { CursorArrow } from "../components/Icons";

type CtaSceneProps = {
  readonly headline: string;
  readonly highlight: string;
  readonly button: string;
  readonly fullName: string;
  readonly subtitle: string;
  readonly url: string;
  readonly style?: React.CSSProperties;
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// The cursor clicks on frame 90, which lands on a beat (45 s in the video).
const CLICK = 90;
const END_CARD = 112;

const ARROW = "M5 12h14M13 6l6 6-6 6";
const CHECK = "M5 13l4 4L19 7";

const CtaSceneInner: React.FC<CtaSceneProps> = ({
  headline,
  highlight,
  button,
  fullName,
  subtitle,
  url,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const leave = interpolate(frame, [END_CARD, END_CARD + 14], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const done = interpolate(frame, [CLICK + 2, CLICK + 16], [0, 1], clamp);
  const arrow = evolvePath(
    interpolate(frame, [CLICK, CLICK + 6], [1, 0], clamp),
    ARROW,
  );
  const check = evolvePath(done, CHECK);

  return (
    <AbsoluteFill
      style={{
        ...style,
        opacity: interpolate(frame, [222, 239], [1, 0], clamp),
      }}
    >
      <Backdrop seed="cta" particles={30} />
      <Solid
        width={width}
        height={height}
        premountFor={fps}
        style={{ opacity: 0.55 }}
        effects={[
          starburst({
            rays: 28,
            colors: ["#0A0A0A", "#0E2219"],
            rotation: interpolate(frame, [0, 240], [0, 40]),
            smoothness: 0.4,
          }),
        ]}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(10,10,10,0) 0%, rgba(10,10,10,0.85) 75%)",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: 1 - leave,
          translate: `0px ${-leave * 120}px`,
        }}
      >
        <Interactive.Div
          name="Headline"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 0,
            top: 200,
            width: 1920,
            textAlign: "center",
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 156,
            lineHeight: 1.06,
            letterSpacing: -5,
            color: "#F9FAFB",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                translate: interpolate(
                  frame,
                  [2, 16],
                  ["0px 180px", "0px 0px"],
                  {
                    ...clamp,
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              {headline}
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                color: "#34D399",
                translate: interpolate(
                  frame,
                  [8, 22],
                  ["0px 180px", "0px 0px"],
                  {
                    ...clamp,
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              {highlight}
            </div>
          </div>
        </Interactive.Div>

        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
        >
          {[0, 8].map((offset) => (
            <circle
              key={offset}
              cx={960}
              cy={700}
              r={interpolate(
                frame,
                [CLICK + offset, CLICK + offset + 26],
                [120, 520],
                {
                  ...clamp,
                  easing: Easing.out(Easing.cubic),
                },
              )}
              fill="none"
              stroke="#34D399"
              strokeWidth={4}
              opacity={
                frame < CLICK + offset
                  ? 0
                  : interpolate(
                      frame,
                      [CLICK + offset, CLICK + offset + 26],
                      [0.9, 0],
                      clamp,
                    )
              }
            />
          ))}
        </svg>

        <Interactive.Div
          name="CTA button"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 960,
            top: 700,
            translate: "-50% -50%",
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "38px 72px",
            borderRadius: 999,
            backgroundColor: "#10B981",
            color: "#0A0A0A",
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 70,
            whiteSpace: "nowrap",
            boxShadow: `0 0 ${60 + 40 * Math.sin(frame / 6)}px rgba(16, 185, 129, 0.55)`,
            scale: interpolate(
              frame,
              [24, 40, CLICK - 1, CLICK + 2, CLICK + 10],
              [0, 1, 1, 0.9, 1],
              {
                ...clamp,
                easing: [
                  Easing.spring({ damping: 10 }),
                  Easing.linear,
                  Easing.out(Easing.quad),
                  Easing.spring({ damping: 8 }),
                ],
                output: "perceptual-scale",
              },
            ),
          }}
        >
          {button}
          <svg width={70} height={70} viewBox="0 0 24 24" fill="none">
            <path
              d={ARROW}
              stroke="#0A0A0A"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={arrow.strokeDasharray}
              strokeDashoffset={arrow.strokeDashoffset}
            />
            <path
              d={CHECK}
              stroke="#0A0A0A"
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={check.strokeDasharray}
              strokeDashoffset={check.strokeDashoffset}
            />
          </svg>
        </Interactive.Div>

        {new Array(34).fill(true).map((_, i) => {
          const angle = random(`b-a-${i}`) * Math.PI * 2;
          const dist = 260 + random(`b-d-${i}`) * 420;
          const p = interpolate(frame, [CLICK, CLICK + 30], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 + Math.cos(angle) * dist * p,
                top: 700 + Math.sin(angle) * dist * p * 0.7 + p * p * 160,
                width: 16,
                height: 9,
                borderRadius: 2,
                backgroundColor: ["#10B981", "#34D399", "#F9FAFB", "#6EE7B7"][
                  i % 4
                ],
                rotate: `${random(`b-r-${i}`) * 360 + frame * 14}deg`,
                opacity: frame < CLICK ? 0 : 1 - p,
              }}
            />
          );
        })}

        <Interactive.Div
          name="Cursor"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            translate: interpolate(
              frame,
              [46, CLICK - 2],
              ["1880px 1150px", "1060px 716px"],
              { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) },
            ),
            scale: interpolate(
              frame,
              [CLICK - 2, CLICK, CLICK + 6],
              [1, 0.82, 1],
              clamp,
            ),
          }}
        >
          <CursorArrow size={96} />
        </Interactive.Div>
      </AbsoluteFill>

      <Interactive.Div
        name="Logo gem"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 960 - 190,
          top: 90,
          width: 380,
          height: 380,
          opacity: interpolate(
            frame,
            [END_CARD + 4, END_CARD + 10],
            [0, 1],
            clamp,
          ),
        }}
      >
        <Gem appearAt={END_CARD + 6} size={380} />
      </Interactive.Div>

      <Interactive.Div
        name="Name"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 0,
          top: 460,
          width: 1920,
          textAlign: "center",
          overflow: "hidden",
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 800,
          fontSize: 170,
          lineHeight: 1.1,
          letterSpacing: -5,
          color: "#F9FAFB",
        }}
      >
        <div
          style={{
            translate: interpolate(
              frame,
              [END_CARD + 10, END_CARD + 26],
              ["0px 200px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {fullName}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Subtitle"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 0,
          top: 668,
          width: 1920,
          textAlign: "center",
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 60,
          color: "#9CA3AF",
          opacity: interpolate(
            frame,
            [END_CARD + 20, END_CARD + 32],
            [0, 1],
            clamp,
          ),
          translate: interpolate(
            frame,
            [END_CARD + 20, END_CARD + 32],
            ["0px 30px", "0px 0px"],
            clamp,
          ),
        }}
      >
        {subtitle}
      </Interactive.Div>

      <Interactive.Div
        name="Website"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 960,
          top: 812,
          translate: "-50% -50%",
          padding: "20px 46px",
          borderRadius: 999,
          border: "3px solid #10B981",
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          fontFamily: "JetBrains Mono",
          fontWeight: 600,
          fontSize: 60,
          color: "#34D399",
          whiteSpace: "nowrap",
          scale: interpolate(frame, [END_CARD + 30, END_CARD + 44], [0, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 11 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {url}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const ctaSchema = {
  headline: {
    type: "text-content",
    default: "Custom websites",
    description: "Headline",
  },
  highlight: {
    type: "text-content",
    default: "that convert.",
    description: "Highlighted line",
  },
  button: {
    type: "text-content",
    default: "Start My Project",
    description: "Button label",
  },
  fullName: {
    type: "text-content",
    default: "Eljo Shurdhi",
    description: "Name",
  },
  subtitle: {
    type: "text-content",
    default: "Frontend Developer · Tirana, Albania",
    description: "Subtitle",
  },
  url: {
    type: "text-content",
    default: "eljoshurdhi.vercel.app",
    description: "Website",
  },
} as const satisfies InteractivitySchema;

export const CtaScene = Interactive.withSchema({
  Component: CtaSceneInner,
  componentName: "<CtaScene>",
  schema: ctaSchema,
  wrapInSequence: true,
});
