import { Trail } from "@remotion/motion-blur";
import { Underline } from "@remotion/rough-notation";
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
import { CursorArrow, DrawIcon } from "../components/Icons";
import { KineticCaptions } from "../components/KineticCaptions";

type ProblemSceneProps = {
  readonly fix: string;
  readonly style?: React.CSSProperties;
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Frame 180 lands on the impact hit in the music.
const FIX = 180;
const GLITCH_HITS = [12, 42, 72, 102, 132, 154, FIX - 4];

const glitchAmount = (frame: number) =>
  Math.max(
    0,
    ...GLITCH_HITS.map((h) =>
      frame >= h ? Math.max(0, 1 - (frame - h) / 7) : 0,
    ),
  );

// An intentionally dated "2015" website.
const RetroSite: React.FC = () => (
  <div
    style={{
      width: 660,
      height: 500,
      backgroundColor: "#C0C0C0",
      border: "4px outset #E5E5E5",
      fontFamily: "'Times New Roman', Times, serif",
      color: "#000000",
    }}
  >
    <div
      style={{
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px 0 12px",
        background: "linear-gradient(90deg, #000080, #1084D0)",
        color: "#FFFFFF",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontWeight: 700,
        fontSize: 20,
      }}
    >
      <span>My Business - Home Page</span>
      <span
        style={{
          width: 30,
          height: 26,
          lineHeight: "22px",
          textAlign: "center",
          backgroundColor: "#C0C0C0",
          color: "#000000",
          border: "2px outset #FFFFFF",
        }}
      >
        x
      </span>
    </div>
    <div
      style={{
        margin: 10,
        height: 428,
        padding: "14px 18px",
        backgroundColor: "#FFFFFF",
        border: "2px inset #808080",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          fontStyle: "italic",
          color: "#800080",
        }}
      >
        Welcome to our Website!!!
      </div>
      <div
        style={{
          margin: "8px 0 14px",
          fontSize: 24,
          color: "#0000EE",
          textDecoration: "underline",
        }}
      >
        Home | About Us | Services | Contact
      </div>
      <div
        style={{
          height: 30,
          background:
            "repeating-linear-gradient(45deg, #FFD700 0 18px, #111111 18px 36px)",
        }}
      />
      <div
        style={{
          margin: "10px 0",
          fontSize: 32,
          fontWeight: 700,
          color: "#FF0000",
        }}
      >
        UNDER CONSTRUCTION
      </div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 170,
              height: 110,
              border: "2px inset #808080",
              backgroundColor: "#E0E0E0",
              backgroundImage:
                "linear-gradient(45deg, transparent 48%, #999 48%, #999 52%, transparent 52%), linear-gradient(-45deg, transparent 48%, #999 48%, #999 52%, transparent 52%)",
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 22 }}>
        You are visitor #{" "}
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            backgroundColor: "#000000",
            color: "#00FF00",
            padding: "0 6px",
          }}
        >
          000137
        </span>
      </div>
      <div style={{ marginTop: 6, fontSize: 16, color: "#555555" }}>
        Best viewed in Internet Explorer 6 at 800x600
      </div>
    </div>
  </div>
);

// A visitor's cursor flies in, touches the site, and immediately leaves.
const BouncingCursor: React.FC<{
  readonly from: readonly [number, number];
  readonly to: readonly [number, number];
  readonly arrive: number;
}> = ({ from, to, arrive }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [arrive - 12, arrive], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const outP = interpolate(frame, [arrive + 3, arrive + 15], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const x = from[0] + (to[0] - from[0]) * inP + (from[0] - to[0]) * outP * 1.15;
  const y = from[1] + (to[1] - from[1]) * inP + (from[1] - to[1]) * outP * 1.15;
  if (frame < arrive - 12 || frame > arrive + 16) {
    return null;
  }
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <CursorArrow size={72} />
    </div>
  );
};

const ProblemSceneInner: React.FC<ProblemSceneProps> = ({ fix, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = glitchAmount(frame);
  const sliceTop = Math.floor(random(`slice-${Math.floor(frame / 2)}`) * 80);

  return (
    <AbsoluteFill style={{ ...style }}>
      <Backdrop
        seed="problem"
        glow="rgba(248, 113, 113, 0.13)"
        particles={14}
      />

      <AbsoluteFill
        style={{
          scale: interpolate(frame, [FIX, 240], [1, 1.07], clamp),
        }}
      >
        <Interactive.Div
          name="Sound familiar"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 150,
            top: 290,
            fontFamily: "JetBrains Mono",
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 10,
            color: "#F87171",
            opacity: interpolate(
              frame,
              [0, 10, FIX - 6, FIX],
              [0, 1, 1, 0],
              clamp,
            ),
          }}
        >
          SOUND FAMILIAR?
        </Interactive.Div>

        <KineticCaptions
          name="Pain points"
          premountFor={fps}
          activeColor="#F87171"
          style={{
            left: 150,
            top: 370,
            width: 960,
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 132,
            lineHeight: 1.08,
            letterSpacing: -3,
            opacity: interpolate(frame, [FIX - 6, FIX + 2], [1, 0], clamp),
            filter: `blur(${interpolate(frame, [FIX - 6, FIX + 2], [0, 12], clamp)}px)`,
          }}
          captions={[
            {
              text: "Your",
              startMs: 400,
              endMs: 600,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " site",
              startMs: 600,
              endMs: 800,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " looks",
              startMs: 800,
              endMs: 1000,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " stuck",
              startMs: 1000,
              endMs: 1233,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " in",
              startMs: 1233,
              endMs: 1400,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " 2015.",
              startMs: 1400,
              endMs: 1933,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " Visitors",
              startMs: 2400,
              endMs: 2667,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " land…",
              startMs: 2667,
              endMs: 3200,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " and",
              startMs: 3200,
              endMs: 3400,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " leave.",
              startMs: 3400,
              endMs: 3933,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " The",
              startMs: 4400,
              endMs: 4600,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " phone",
              startMs: 4600,
              endMs: 4867,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " never",
              startMs: 4867,
              endMs: 5133,
              timestampMs: null,
              confidence: null,
            },
            {
              text: " rings.",
              startMs: 5133,
              endMs: 5667,
              timestampMs: null,
              confidence: null,
            },
          ]}
        />

        <Interactive.Div
          name="Old website"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 1150,
            top: 290,
            width: 660,
            height: 500,
            opacity: interpolate(frame, [4, 14], [0, 1], clamp),
            translate: interpolate(frame, [4, 22], ["120px 0px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div
            style={{
              transform:
                "perspective(1800px) rotateY(-16deg) rotateX(4deg) rotateZ(1.5deg)",
              boxShadow: "0 40px 120px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Old CRT switching off when the solution arrives. */}
            <div
              style={{
                position: "relative",
                scale: `${interpolate(frame, [FIX - 2, FIX + 6, FIX + 10], [1, 1, 0], clamp)} ${interpolate(frame, [FIX - 2, FIX + 4], [1, 0.012], clamp)}`,
                translate: `${(random(`gx-${frame}`) - 0.5) * 46 * g}px ${(random(`gy-${frame}`) - 0.5) * 16 * g}px`,
                filter:
                  g > 0
                    ? `drop-shadow(${9 * g}px 0 0 rgba(255, 0, 80, 0.85)) drop-shadow(${-9 * g}px 0 0 rgba(0, 255, 255, 0.85))`
                    : "none",
              }}
            >
              <RetroSite />
              {g > 0.15 ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    translate: `${(random(`gs-${frame}`) - 0.5) * 110 * g}px 0px`,
                    clipPath: `inset(${sliceTop}% 0 ${Math.max(0, 88 - sliceTop)}% 0)`,
                  }}
                >
                  <RetroSite />
                </div>
              ) : null}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#FFFFFF",
                  opacity: interpolate(
                    frame,
                    [FIX - 2, FIX + 2, FIX + 10],
                    [0, 1, 0.9],
                    clamp,
                  ),
                }}
              />
            </div>
          </div>
        </Interactive.Div>

        {[
          { from: [-120, 980], to: [1260, 560], arrive: 84 },
          { from: [2020, 1160], to: [1600, 720], arrive: 90 },
          { from: [1420, -140], to: [1430, 400], arrive: 97 },
          { from: [2060, 260], to: [1700, 520], arrive: 105 },
        ].map((c) => (
          <AbsoluteFill key={c.arrive}>
            <Trail layers={5} lagInFrames={0.5} trailOpacity={0.45}>
              <BouncingCursor
                from={c.from as [number, number]}
                to={c.to as [number, number]}
                arrive={c.arrive}
              />
            </Trail>
          </AbsoluteFill>
        ))}

        <Interactive.Div
          name="Empty inbox"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 1310,
            top: 730,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "22px 30px",
            borderRadius: 24,
            backgroundColor: "#141414",
            border: "2px solid #2A2A2A",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6)",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 40,
            color: "#F9FAFB",
            opacity: interpolate(
              frame,
              [134, 142, FIX - 4, FIX],
              [0, 1, 1, 0],
              clamp,
            ),
            scale: interpolate(frame, [134, 146], [0.6, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 12 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <DrawIcon
            icon="chat"
            progress={interpolate(frame, [136, 156], [0, 1], clamp)}
            size={64}
            color="#F87171"
            strokeWidth={2}
          />
          <div>
            0 new inquiries
            <div style={{ fontSize: 28, fontWeight: 500, color: "#9CA3AF" }}>
              Inbox · this week
            </div>
          </div>
        </Interactive.Div>

        <Interactive.Div
          name="Let's fix that"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 0,
            top: 380,
            width: 1920,
            textAlign: "center",
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 210,
            letterSpacing: -6,
            color: "#F9FAFB",
            textShadow: "0 0 60px rgba(16, 185, 129, 0.55)",
            opacity: interpolate(frame, [FIX, FIX + 3], [0, 1], clamp),
            scale: interpolate(frame, [FIX, FIX + 10], [1.9, 1], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          <Underline
            color="#10B981"
            strokeWidth={10}
            progress={interpolate(frame, [FIX + 10, FIX + 26], [0, 1], clamp)}
          >
            {fix}
          </Underline>
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const problemSchema = {
  fix: {
    type: "text-content",
    default: "Let's fix that.",
    description: "Turning point",
  },
} as const satisfies InteractivitySchema;

export const ProblemScene = Interactive.withSchema({
  Component: ProblemSceneInner,
  componentName: "<ProblemScene>",
  schema: problemSchema,
  wrapInSequence: true,
});
