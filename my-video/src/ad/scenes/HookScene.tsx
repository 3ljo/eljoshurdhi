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
import { FONT, INK } from "../brand";
import { useSafeBox } from "../layout";
import { clamp, RedBar, shake } from "../parts";

// Hook (0-89): the website's cover, set on acid. Frame 0 is the thumbnail, so
// the audience call-out and "STOP LOSING" are already standing; the other four
// lines slam in on the beat (15, 30, 45, 60) and the stack re-centres as it
// grows, so no frame looks half-built. 60-89 hold the full headline on a push.

type HookSceneProps = {
  readonly kicker?: string;
  readonly line1?: string;
  readonly line2?: string;
  readonly line3?: string;
  readonly line4?: string;
  readonly line5?: string;
  readonly style?: React.CSSProperties;
};

// The cover is set as a street poster: every line is sized to run the full
// width of the stack, so the short words shout loudest. Anton is set 7%
// extended like the site's cover. Widths are Anton advance widths in em for
// the default copy; edited copy falls back to an estimate.
const EM: Record<string, number> = {
  "STOP LOSING": 4.604,
  CUSTOMERS: 4.387,
  "TO BUSINESSES": 5.462,
  "WITH BETTER": 4.637,
  "WEBSITES.": 3.787,
};
const EXTEND = 1.07;
const LEAD = 0.94;
// 880px wide, so the stack stays inside the 940px safe width at full push.
const STACK_W = 880;
const KICKER_H = 84;
const KICKER_GAP = 34;
const RULE_GAP = 30;
const RULE_W = 300;
const RULE_H = 26;
const PUSH_END = 1.05;
// Each line falls for 3 frames and hits on its beat.
const FALL = 3;

const sizeFor = (text: string) =>
  Math.min(
    240,
    STACK_W / ((EM[text.toUpperCase()] ?? text.length * 0.42) * EXTEND),
  );

const lineBase: React.CSSProperties = {
  position: "absolute",
  left: 0,
  fontFamily: FONT.display,
  lineHeight: LEAD,
  letterSpacing: "0.005em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  color: INK.ink,
  WebkitTextStroke: `0.012em ${INK.ink}`,
  transformOrigin: "0% 0%",
};

const extended: React.CSSProperties = {
  display: "inline-block",
  scale: `${EXTEND} 1`,
  transformOrigin: "0% 50%",
};

const HookSceneInner: React.FC<HookSceneProps> = ({
  kicker = "SMALL BUSINESS OWNERS:",
  line1 = "STOP LOSING",
  line2 = "CUSTOMERS",
  line3 = "TO BUSINESSES",
  line4 = "WITH BETTER",
  line5 = "WEBSITES.",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = useSafeBox();

  const sizes = [line1, line2, line3, line4, line5].map(sizeFor);
  const tops = sizes.reduce<number[]>(
    (acc, size) => [...acc, acc[acc.length - 1] + size * LEAD],
    [KICKER_H + KICKER_GAP],
  );
  const ruleTop = tops[5] + RULE_GAP;

  // How much of the stack is standing: one line at frame 0, all five plus
  // the rule from frame 60. The stack stays centred in the safe box as it
  // grows, so every in-between frame is balanced.
  const arrived = [15, 30, 45, 60].map((at) =>
    interpolate(frame, [at - FALL, at], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const height =
    tops[1] +
    arrived.reduce((sum, a, i) => sum + a * sizes[i + 1] * LEAD, 0) +
    arrived[3] * (RULE_GAP + RULE_H);
  // The stack runs at full width while it fits; once it outgrows a short box
  // (the square, and the reels box for the last line) it pulls back to fit,
  // on the beat, as each line lands.
  const fit = Math.min(1, box.height / (height * PUSH_END));

  return (
    <AbsoluteFill style={{ backgroundColor: INK.acid, ...style }}>
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          transformOrigin: "50% 50%",
          scale:
            fit *
            interpolate(frame, [0, 60, 89], [1, 1.012, PUSH_END], clamp),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: (box.width - STACK_W) / 2,
            top: (box.height - height) / 2,
            width: STACK_W,
            height,
            translate: shake(frame, 15, 7, "hook-stack"),
          }}
        >
          <Interactive.Div
            name="Kicker"
            premountFor={fps}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: KICKER_H,
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              backgroundColor: INK.ink,
              color: INK.acid,
              fontFamily: FONT.body,
              fontWeight: 900,
              fontSize: 50,
              lineHeight: 1,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {kicker}
          </Interactive.Div>

          <Interactive.Div
            name="Line 1"
            premountFor={fps}
            style={{ ...lineBase, top: tops[0], fontSize: sizes[0] }}
          >
            <span style={extended}>{line1}</span>
          </Interactive.Div>

          <Interactive.Div
            name="Line 2 (red)"
            premountFor={fps}
            style={{
              ...lineBase,
              top: tops[1],
              fontSize: sizes[1],
              color: INK.red,
              WebkitTextStroke: `0.012em ${INK.red}`,
              opacity: interpolate(frame, [12, 13], [0, 1], clamp),
              scale: interpolate(frame, [13, 15, 16, 19], [1.4, 1, 0.985, 1], {
                ...clamp,
                easing: [Easing.in(Easing.quad), Easing.linear, Easing.out(Easing.quad)],
              }),
              translate: shake(frame, 15, 18, "hook-customers"),
            }}
          >
            <span style={extended}>{line2}</span>
          </Interactive.Div>

          <Interactive.Div
            name="Line 3"
            premountFor={fps}
            style={{
              ...lineBase,
              top: tops[2],
              fontSize: sizes[2],
              opacity: interpolate(frame, [27, 28], [0, 1], clamp),
              scale: interpolate(frame, [28, 30, 31, 34], [1.4, 1, 0.985, 1], {
                ...clamp,
                easing: [Easing.in(Easing.quad), Easing.linear, Easing.out(Easing.quad)],
              }),
            }}
          >
            <span style={extended}>{line3}</span>
          </Interactive.Div>

          <Interactive.Div
            name="Line 4"
            premountFor={fps}
            style={{
              ...lineBase,
              top: tops[3],
              fontSize: sizes[3],
              opacity: interpolate(frame, [42, 43], [0, 1], clamp),
              scale: interpolate(frame, [43, 45, 46, 49], [1.4, 1, 0.985, 1], {
                ...clamp,
                easing: [Easing.in(Easing.quad), Easing.linear, Easing.out(Easing.quad)],
              }),
            }}
          >
            <span style={extended}>{line4}</span>
          </Interactive.Div>

          <Interactive.Div
            name="Line 5"
            premountFor={fps}
            style={{
              ...lineBase,
              top: tops[4],
              fontSize: sizes[4],
              opacity: interpolate(frame, [57, 58], [0, 1], clamp),
              scale: interpolate(frame, [58, 60, 61, 64], [1.4, 1, 0.985, 1], {
                ...clamp,
                easing: [Easing.in(Easing.quad), Easing.linear, Easing.out(Easing.quad)],
              }),
            }}
          >
            <span style={extended}>{line5}</span>
          </Interactive.Div>

          <Interactive.Div
            name="Red rule"
            premountFor={fps}
            style={{ position: "absolute", left: 0, top: ruleTop }}
          >
            <RedBar at={59} width={RULE_W} height={RULE_H} />
          </Interactive.Div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const hookSchema = {
  kicker: {
    type: "text-content",
    default: "SMALL BUSINESS OWNERS:",
    description: "Kicker",
  },
  line1: { type: "text-content", default: "STOP LOSING", description: "Line 1" },
  line2: { type: "text-content", default: "CUSTOMERS", description: "Line 2 (red)" },
  line3: { type: "text-content", default: "TO BUSINESSES", description: "Line 3" },
  line4: { type: "text-content", default: "WITH BETTER", description: "Line 4" },
  line5: { type: "text-content", default: "WEBSITES.", description: "Line 5" },
} as const satisfies InteractivitySchema;

export const HookScene = Interactive.withSchema({
  Component: HookSceneInner,
  componentName: "<HookScene>",
  schema: hookSchema,
  wrapInSequence: true,
});
