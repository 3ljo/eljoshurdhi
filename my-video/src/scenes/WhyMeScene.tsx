import { Trail } from "@remotion/motion-blur";
import { StrikeThrough, Underline } from "@remotion/rough-notation";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  random,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { DrawIcon } from "../components/Icons";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const HEADLINE: React.CSSProperties = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 800,
  letterSpacing: -5,
  lineHeight: 1.04,
  textAlign: "center",
};

// Words rise from behind a mask, one after another.
const RisingWords: React.FC<{
  readonly text: string;
  readonly delay?: number;
}> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "0.24em",
      }}
    >
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            paddingBottom: "0.08em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              translate: `0px ${interpolate(
                frame,
                [delay + i * 2, delay + i * 2 + 9],
                [110, 0],
                {
                  ...clamp,
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              )}%`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

const SpeedLines: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(16).fill(true).map((_, i) => {
        const y = random(`sl-y-${i}`) * 1080;
        const len = 200 + random(`sl-l-${i}`) * 500;
        const speed = 90 + random(`sl-s-${i}`) * 80;
        const x =
          1920 + 200 - ((frame * speed + random(`sl-x-${i}`) * 2400) % 2800);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: len,
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(10, 10, 10, 0.18)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

type WhyMeSceneProps = {
  readonly style?: React.CSSProperties;
};

// Five promises from the portfolio, one every two beats, flashing between
// dark and emerald. The last one zooms through the camera into the outro.
const WhyMeSceneInner: React.FC<WhyMeSceneProps> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A", ...style }}>
      <Sequence name="No agency layers" durationInFrames={30} premountFor={fps}>
        <AbsoluteFill
          style={{
            backgroundColor: "#0A0A0A",
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
          }}
        >
          <DrawIcon
            icon="shield"
            progress={interpolate(frame, [0, 16], [0, 1], clamp)}
            size={150}
            color="#34D399"
            strokeWidth={1.6}
          />
          <div style={{ ...HEADLINE, fontSize: 160, color: "#F9FAFB" }}>
            <RisingWords text="No agency layers." delay={2} />
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence
        name="Fixed price"
        from={30}
        durationInFrames={30}
        premountFor={fps}
      >
        <AbsoluteFill
          style={{
            backgroundColor: "#10B981",
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 28px)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Interactive.Div
            name="Fixed price text"
            premountFor={fps}
            style={{
              ...HEADLINE,
              fontSize: 180,
              color: "#0A0A0A",
              scale: interpolate(frame, [30, 40], [1.35, 1], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                output: "perceptual-scale",
              }),
              rotate: interpolate(frame, [30, 40], ["-4deg", "0deg"], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            <div>Fixed price,</div>
            <Underline
              color="#0A0A0A"
              strokeWidth={10}
              progress={interpolate(frame, [38, 52], [0, 1], clamp)}
            >
              in writing.
            </Underline>
          </Interactive.Div>
        </AbsoluteFill>
      </Sequence>

      <Sequence
        name="Custom-built"
        from={60}
        durationInFrames={30}
        premountFor={fps}
      >
        <AbsoluteFill
          style={{
            backgroundColor: "#0A0A0A",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ ...HEADLINE, fontSize: 180, color: "#F9FAFB" }}>
            <div>
              <RisingWords text="Custom-built," />
            </div>
            <div style={{ color: "#9CA3AF" }}>
              not{" "}
              <StrikeThrough
                color="#F87171"
                strokeWidth={12}
                progress={interpolate(frame, [70, 80], [0, 1], clamp)}
              >
                templated.
              </StrikeThrough>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence name="Fast" from={90} durationInFrames={30} premountFor={fps}>
        <AbsoluteFill
          style={{
            backgroundColor: "#10B981",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SpeedLines />
          <Trail layers={5} lagInFrames={0.7} trailOpacity={0.4}>
            <AbsoluteFill
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <FastWord />
            </AbsoluteFill>
          </Trail>
          <div
            style={{
              position: "absolute",
              top: 690,
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              fontSize: 80,
              color: "#0A0A0A",
              opacity: interpolate(frame, [98, 104], [0, 1], clamp),
            }}
          >
            Because slow costs you customers.
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence
        name="Direct line"
        from={120}
        durationInFrames={60}
        premountFor={fps}
      >
        <AbsoluteFill
          style={{
            backgroundColor: "#0A0A0A",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
            scale: interpolate(frame, [150, 180], [1, 1.6], {
              ...clamp,
              easing: Easing.in(Easing.cubic),
              output: "perceptual-scale",
            }),
            filter: `blur(${interpolate(frame, [162, 180], [0, 10], clamp)}px)`,
            opacity: interpolate(frame, [166, 180], [1, 0.4], clamp),
          }}
        >
          <DrawIcon
            icon="chat"
            progress={interpolate(frame, [120, 138], [0, 1], clamp)}
            size={140}
            color="#34D399"
            strokeWidth={1.6}
          />
          <div style={{ ...HEADLINE, fontSize: 230, color: "#F9FAFB" }}>
            <RisingWords text="Direct line" delay={2} />
          </div>
          <div
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              fontSize: 80,
              color: "#34D399",
              opacity: interpolate(frame, [130, 138], [0, 1], clamp),
            }}
          >
            to the person building it.
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// Inside a <Trail>, so it reads the (lagged) frame itself. Its frame 0 is
// the start of the "Fast" sequence.
const FastWord: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...HEADLINE,
        fontSize: 340,
        letterSpacing: -12,
        color: "#0A0A0A",
        translate: `${interpolate(frame, [0, 9], [1500, 0], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}px -60px`,
        transform: `skewX(${interpolate(frame, [0, 9], [-20, 0], clamp)}deg)`,
      }}
    >
      Fast.
    </div>
  );
};

const whyMeSchema = {} as const satisfies InteractivitySchema;

export const WhyMeScene = Interactive.withSchema({
  Component: WhyMeSceneInner,
  componentName: "<WhyMeScene>",
  schema: whyMeSchema,
  wrapInSequence: true,
});
