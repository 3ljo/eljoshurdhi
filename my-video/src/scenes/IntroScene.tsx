import { Highlight } from "@remotion/rough-notation";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Gem } from "../components/Gem";

type IntroSceneProps = {
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly style?: React.CSSProperties;
};

const KEYWORD = "#34D399";
const IDENT = "#F9FAFB";
const KEY = "#9CA3AF";
const STRING = "#6EE7B7";
const PUNCT = "#6B7280";

type Token = readonly [text: string, color: string, isName?: boolean];

// Frame 60 is the beat drop in the music: the code "compiles" into the title.
const DROP = 60;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const CodeEditor: React.FC<{
  readonly lines: readonly (readonly Token[])[];
}> = ({ lines }) => {
  const frame = useCurrentFrame();
  const total = lines.reduce(
    (sum, line) => sum + line.reduce((s, [text]) => s + text.length, 0),
    0,
  );
  const typed = Math.floor(interpolate(frame, [3, 50], [0, total], clamp));
  const selection = interpolate(frame, [50, 56], [0, 0.42], clamp);

  let budget = typed;
  let cursorPlaced = false;

  return (
    <div
      style={{
        fontFamily: "JetBrains Mono",
        fontSize: 46,
        lineHeight: 1.62,
        padding: "34px 52px 44px",
        whiteSpace: "pre",
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", height: 75 }}>
          {line.map(([text, color, isName], ti) => {
            const visible = text.slice(0, Math.max(0, budget));
            budget -= text.length;
            const showCursor = !cursorPlaced && budget < 0;
            if (showCursor) cursorPlaced = true;
            return (
              <span key={ti} style={{ position: "relative", color }}>
                <span
                  style={{
                    backgroundColor: isName
                      ? `rgba(16, 185, 129, ${selection})`
                      : undefined,
                    borderRadius: 6,
                  }}
                >
                  {visible}
                </span>
                {showCursor ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 24,
                      height: 52,
                      marginLeft: 2,
                      translate: "0px 10px",
                      backgroundColor: "#10B981",
                    }}
                  />
                ) : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const NameLine: React.FC<{
  readonly word: string;
  readonly delay: number;
}> = ({ word, delay }) => {
  const frame = useCurrentFrame();
  const style: React.CSSProperties = {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 800,
    fontSize: 230,
    lineHeight: 1.04,
    letterSpacing: -6,
    fontKerning: "none",
    whiteSpace: "pre",
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", paddingTop: 10 }}>
      <div style={{ ...style, display: "flex", color: "#F9FAFB" }}>
        {word.split("").map((ch, j) => {
          const start = delay + j * 2;
          return (
            <span
              key={j}
              style={{
                display: "inline-block",
                translate: interpolate(
                  frame,
                  [start, start + 20],
                  ["0px 270px", "0px 0px"],
                  { ...clamp, easing: Easing.spring({ damping: 13 }) },
                ),
                rotate:
                  interpolate(frame, [start, start + 20], [14, 0], {
                    ...clamp,
                    easing: Easing.spring({ damping: 13 }),
                  }) + "deg",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      {/* A shine band sweeps across the settled letters. */}
      <div
        style={{
          ...style,
          position: "absolute",
          inset: 0,
          paddingTop: 10,
          color: "transparent",
          backgroundImage:
            "linear-gradient(105deg, transparent 0%, transparent 42%, rgba(110, 231, 183, 0.95) 50%, transparent 58%, transparent 100%)",
          backgroundSize: "260% 100%",
          backgroundPosition: `${interpolate(frame, [delay + 36, delay + 70], [100, 0], clamp)}% 0%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {word}
      </div>
    </div>
  );
};

const IntroSceneInner: React.FC<IntroSceneProps> = ({
  firstName,
  lastName,
  role,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines: Token[][] = [
    [
      ["const ", KEYWORD],
      ["developer", IDENT],
      [" = {", PUNCT],
    ],
    [
      ["  name", KEY],
      [": ", PUNCT],
      [`"${firstName} ${lastName}"`, STRING, true],
      [",", PUNCT],
    ],
    [
      ["  role", KEY],
      [": ", PUNCT],
      [`"${role}"`, STRING],
      [",", PUNCT],
    ],
    [
      ["  stack", KEY],
      [": [", PUNCT],
      ['"React"', STRING],
      [", ", PUNCT],
      ['"Next.js"', STRING],
      ["],", PUNCT],
    ],
    [["};", PUNCT]],
  ];

  return (
    <AbsoluteFill style={{ ...style }}>
      <Backdrop seed="intro" />
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, 6 * fps], [1, 1.05], clamp),
        }}
      >
        <Interactive.Div
          name="Code editor"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 360,
            top: 255,
            width: 1200,
            borderRadius: 28,
            backgroundColor: "#141414",
            border: "2px solid #1F1F1F",
            boxShadow: "0 40px 120px rgba(0, 0, 0, 0.6)",
            overflow: "hidden",
            opacity: interpolate(
              frame,
              [0, 8, DROP, DROP + 14],
              [0, 1, 1, 0],
              clamp,
            ),
            scale: interpolate(
              frame,
              [0, 10, DROP, DROP + 16],
              [0.92, 1, 1, 2.6],
              {
                ...clamp,
                easing: [
                  Easing.bezier(0.16, 1, 0.3, 1),
                  Easing.linear,
                  Easing.in(Easing.cubic),
                ],
                output: "perceptual-scale",
              },
            ),
            filter: `blur(${interpolate(frame, [DROP, DROP + 14], [0, 14], clamp)}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              height: 72,
              padding: "0 28px",
              borderBottom: "2px solid #1F1F1F",
            }}
          >
            {["#F87171", "#FBBF24", "#34D399"].map((c) => (
              <div
                key={c}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: c,
                }}
              />
            ))}
            <div
              style={{
                marginLeft: 20,
                fontFamily: "JetBrains Mono",
                fontSize: 28,
                color: "#9CA3AF",
              }}
            >
              developer.ts
            </div>
          </div>
          <CodeEditor lines={lines} />
        </Interactive.Div>

        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {[0, 7].map((offset) => (
            <circle
              key={offset}
              cx={1490}
              cy={540}
              r={interpolate(
                frame,
                [DROP + offset, DROP + offset + 30],
                [60, 900],
                {
                  ...clamp,
                  easing: Easing.out(Easing.cubic),
                },
              )}
              fill="none"
              stroke="#34D399"
              strokeWidth={interpolate(
                frame,
                [DROP + offset, DROP + offset + 30],
                [6, 0.5],
                clamp,
              )}
              opacity={interpolate(
                frame,
                [DROP + offset - 1, DROP + offset, DROP + offset + 30],
                [0, 0.8, 0],
                clamp,
              )}
            />
          ))}
        </svg>

        <Interactive.Div
          name="3D gem"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 1080,
            top: 130,
            width: 820,
            height: 820,
          }}
        >
          <Gem appearAt={DROP} size={820} />
        </Interactive.Div>

        <Interactive.Div
          name="Greeting"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 150,
            top: 236,
            fontFamily: "JetBrains Mono",
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 10,
            color: "#34D399",
            opacity: interpolate(frame, [DROP, DROP + 10], [0, 1], clamp),
            translate: interpolate(
              frame,
              [DROP, DROP + 14],
              ["-40px 0px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          HELLO, I&apos;M
        </Interactive.Div>

        <Interactive.Div
          name="Name"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 140,
            top: 290,
          }}
        >
          <NameLine word={firstName} delay={DROP + 1} />
          <NameLine word={lastName} delay={DROP + 7} />
        </Interactive.Div>

        <Interactive.Div
          name="Role"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 150,
            top: 812,
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            fontSize: 84,
            color: "#E5E7EB",
            opacity: interpolate(frame, [86, 98], [0, 1], clamp),
            translate: interpolate(frame, [86, 104], ["0px 50px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <Highlight
            color="rgba(16, 185, 129, 0.45)"
            progress={interpolate(frame, [98, 122], [0, 1], clamp)}
          >
            {role}
          </Highlight>
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const introSchema = {
  firstName: {
    type: "text-content",
    default: "Eljo",
    description: "First name",
  },
  lastName: {
    type: "text-content",
    default: "Shurdhi",
    description: "Last name",
  },
  role: {
    type: "text-content",
    default: "Frontend Developer",
    description: "Role",
  },
} as const satisfies InteractivitySchema;

export const IntroScene = Interactive.withSchema({
  Component: IntroSceneInner,
  componentName: "<IntroScene>",
  schema: introSchema,
  wrapInSequence: true,
});
