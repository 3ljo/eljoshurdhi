import { Trail } from "@remotion/motion-blur";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { DrawIcon, type IconName } from "../components/Icons";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Stations sit 1100px apart on a horizontal track. The camera arrives at each
// one on a beat (every 45 frames = 3 beats).
const SPACING = 1100;
const TRACK_Y = 410;
const ARRIVALS = [30, 75, 120, 165, 210];

type StationProps = {
  readonly index: number;
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
  readonly live?: boolean;
  readonly style?: React.CSSProperties;
};

// One step of the process. Its own frame 0 is 16 frames before the camera
// arrives, so it can fade in while the camera travels towards it.
const StationInner: React.FC<StationProps> = ({
  index,
  icon,
  title,
  description,
  live,
  style,
}) => {
  const frame = useCurrentFrame();
  const arrive = 16;
  const dim = live
    ? 1
    : interpolate(frame, [arrive + 34, arrive + 44], [1, 0.35], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: index * SPACING - 520,
        top: 0,
        width: 1040,
        height: 1080,
        opacity: interpolate(frame, [0, 10], [0, 1], clamp) * dim,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 520 - 70,
          top: TRACK_Y - 70,
          width: 140,
          height: 140,
          borderRadius: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "4px solid #10B981",
          backgroundColor: frame >= arrive ? "#10B981" : "#0A0A0A",
          boxShadow:
            frame >= arrive ? "0 0 60px rgba(16, 185, 129, 0.65)" : "none",
          scale: String(
            interpolate(frame, [arrive - 4, arrive + 8], [0.5, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 9 }),
            }),
          ),
        }}
      >
        <DrawIcon
          icon={icon}
          progress={interpolate(
            frame,
            [arrive - 2, arrive + 18],
            [0, 1],
            clamp,
          )}
          size={76}
          color={frame >= arrive ? "#0A0A0A" : "#34D399"}
          strokeWidth={2.2}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 520 - 60,
          top: TRACK_Y - 172,
          width: 120,
          textAlign: "center",
          fontFamily: "JetBrains Mono",
          fontWeight: 600,
          fontSize: 44,
          color: "#34D399",
          opacity: interpolate(frame, [arrive - 6, arrive + 4], [0, 1], clamp),
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: TRACK_Y + 112,
          width: 1040,
          textAlign: "center",
          overflow: "hidden",
          paddingBottom: 10,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 800,
          fontSize: 116,
          lineHeight: 1.05,
          letterSpacing: -3,
          color: "#F9FAFB",
        }}
      >
        <div
          style={{
            translate: `0px ${interpolate(
              frame,
              [arrive - 2, arrive + 14],
              [260, 0],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            )}px`,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          top: TRACK_Y + 372,
          width: 920,
          textAlign: "center",
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 52,
          color: "#9CA3AF",
          opacity: interpolate(frame, [arrive + 6, arrive + 18], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [arrive + 6, arrive + 18], [30, 0], clamp)}px`,
        }}
      >
        {description}
      </div>

      {live ? (
        <div
          style={{
            position: "absolute",
            left: 520 + 100,
            top: TRACK_Y - 44,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 26px",
            borderRadius: 999,
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "2px solid #10B981",
            fontFamily: "JetBrains Mono",
            fontWeight: 600,
            fontSize: 40,
            color: "#34D399",
            scale: String(
              interpolate(frame, [arrive + 8, arrive + 18], [0, 1], {
                ...clamp,
                easing: Easing.spring({ damping: 10 }),
              }),
            ),
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: "#34D399",
              opacity: 0.5 + 0.5 * Math.cos((frame / 8) * Math.PI),
            }}
          />
          LIVE
        </div>
      ) : null}

      {live
        ? new Array(28).fill(true).map((_, i) => {
            const angle = random(`c-a-${i}`) * Math.PI * 2;
            const dist = 160 + random(`c-d-${i}`) * 360;
            const p = interpolate(frame, [arrive + 6, arrive + 40], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 520 + Math.cos(angle) * dist * p,
                  top: TRACK_Y + Math.sin(angle) * dist * p + p * p * 120,
                  width: 14,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: ["#10B981", "#34D399", "#F9FAFB", "#6EE7B7"][
                    i % 4
                  ],
                  rotate: `${random(`c-r-${i}`) * 360 + frame * 12}deg`,
                  opacity: frame < arrive + 6 ? 0 : 1 - p,
                }}
              />
            );
          })
        : null}
    </div>
  );
};

const stationSchema = {
  title: { type: "text-content", default: "", description: "Title" },
  description: {
    type: "text-content",
    default: "",
    description: "Description",
  },
} as const satisfies InteractivitySchema;

const Station = Interactive.withSchema({
  Component: StationInner,
  componentName: "<Station>",
  schema: stationSchema,
  wrapInSequence: true,
});

const Comet: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(
    frame,
    [0, 30, 61, 75, 106, 120, 151, 165, 196, 210],
    [-900, 0, 0, 1100, 1100, 2200, 2200, 3300, 3300, 4400],
    { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x - 16,
        top: TRACK_Y - 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#ECFDF5",
        boxShadow: "0 0 30px 10px rgba(52, 211, 153, 0.9)",
      }}
    />
  );
};

type ProcessSceneProps = {
  readonly label: string;
  readonly style?: React.CSSProperties;
};

const ProcessSceneInner: React.FC<ProcessSceneProps> = ({ label, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const focus = interpolate(
    frame,
    [0, 30, 61, 75, 106, 120, 151, 165, 196, 210],
    [-900, 0, 0, 1100, 1100, 2200, 2200, 3300, 3300, 4400],
    { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
  );
  const reached = ARRIVALS.filter((a) => frame >= a).length;

  return (
    <AbsoluteFill style={{ ...style }}>
      <Backdrop seed="process" particles={24} />

      <AbsoluteFill style={{ translate: `${960 - focus}px 0px` }}>
        <svg
          width={7000}
          height={1080}
          style={{ position: "absolute", left: -1500, top: 0 }}
        >
          <line
            x1={0}
            x2={7000}
            y1={TRACK_Y}
            y2={TRACK_Y}
            stroke="#262626"
            strokeWidth={4}
            strokeDasharray="14 14"
          />
          <line
            x1={0}
            x2={1500 + focus}
            y1={TRACK_Y}
            y2={TRACK_Y}
            stroke="#10B981"
            strokeWidth={6}
            style={{ filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.9))" }}
          />
        </svg>

        <Trail layers={6} lagInFrames={0.6} trailOpacity={0.5}>
          <Comet />
        </Trail>

        <Station
          name="Step 1"
          from={ARRIVALS[0] - 16}
          premountFor={fps}
          index={0}
          icon="chat"
          title="Tell me what you need"
          description="A quick message is all it takes."
        />
        <Station
          name="Step 2"
          from={ARRIVALS[1] - 16}
          premountFor={fps}
          index={1}
          icon="document"
          title="We define the offer"
          description="Fixed price & scope, in writing."
        />
        <Station
          name="Step 3"
          from={ARRIVALS[2] - 16}
          premountFor={fps}
          index={2}
          icon="sparkles"
          title="I design the experience"
          description="Built to turn visitors into leads."
        />
        <Station
          name="Step 4"
          from={ARRIVALS[3] - 16}
          premountFor={fps}
          index={3}
          icon="bolt"
          title="I build it"
          description="Real progress you can watch."
        />
        <Station
          name="Step 5"
          from={ARRIVALS[4] - 16}
          premountFor={fps}
          index={4}
          icon="check"
          title="You launch"
          description="Live and tested on real devices."
          live
        />
      </AbsoluteFill>

      <Interactive.Div
        name="Section label"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 150,
          top: 110,
          fontFamily: "JetBrains Mono",
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 10,
          color: "#34D399",
          opacity: interpolate(frame, [8, 18], [0, 1], clamp),
        }}
      >
        {label}
      </Interactive.Div>

      <Interactive.Div
        name="Progress"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 1370,
          top: 124,
          display: "flex",
          gap: 12,
          opacity: interpolate(frame, [8, 18], [0, 1], clamp),
        }}
      >
        {ARRIVALS.map((a, i) => (
          <div
            key={a}
            style={{
              width: 72,
              height: 10,
              borderRadius: 5,
              backgroundColor: i < reached ? "#10B981" : "#262626",
              boxShadow:
                i < reached ? "0 0 14px rgba(16, 185, 129, 0.8)" : "none",
            }}
          />
        ))}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const processSchema = {
  label: {
    type: "text-content",
    default: "HOW IT WORKS",
    description: "Label",
  },
} as const satisfies InteractivitySchema;

export const ProcessScene = Interactive.withSchema({
  Component: ProcessSceneInner,
  componentName: "<ProcessScene>",
  schema: processSchema,
  wrapInSequence: true,
});
