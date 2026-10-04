import type React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BOUNCY,
  C,
  clamp,
  EXPO_IN,
  EXPO_OUT,
  MONO,
  RIPPLE,
  SANS,
  SNAP_SPRING,
  SWEEP,
  UI,
  UI_SPRING,
} from "./theme";

// The ad's motion toolkit. Every component reads the frame of the scene it
// sits in (scenes are Sequences), so `at` values are scene-relative.

export const springAt = (frame: number, at: number, fps: number, config = UI_SPRING) =>
  spring({ frame: frame - at, fps, config });

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

export const display = (size: number, color: string): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 0.92,
  letterSpacing: size >= 100 ? "-0.045em" : "-0.03em",
  color,
  whiteSpace: "nowrap",
});

export const mono = (size: number, color: string, tracking = 0.06): React.CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 600,
  fontSize: size,
  letterSpacing: `${tracking}em`,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});

export const ui = (size: number, weight: number, color: string): React.CSSProperties => ({
  fontFamily: UI,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.2,
  color,
  whiteSpace: "nowrap",
});

type MaskProps = {
  readonly at: number;
  readonly exitAt?: number;
  readonly style?: React.CSSProperties;
  readonly innerStyle?: React.CSSProperties;
  readonly from?: "below" | "left";
  readonly children: React.ReactNode;
};

// A line that rises into its mask (EXPO_OUT, 10 frames) and leaves upwards
// (EXPO_IN, 6 frames). Text never simply fades. The mask is padded so
// descenders are never clipped.
export const Mask: React.FC<MaskProps> = ({ at, exitAt, style, innerStyle, from = "below", children }) => {
  const frame = useCurrentFrame();
  // 150% clears the padded mask completely (the padding keeps descenders
  // and accents visible at rest).
  const enter = interpolate(frame, [at, at + 10], [150, 0], { ...clamp, easing: EXPO_OUT });
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 6], [0, -150], { ...clamp, easing: EXPO_IN });
  const offset = enter + exit;
  return (
    <div style={{ overflow: "hidden", paddingTop: "0.12em", marginTop: "-0.12em", paddingBottom: "0.24em", marginBottom: "-0.24em", ...style }}>
      <div
        style={{
          translate: from === "left" ? `${-enter}% ${exit}%` : `0% ${offset}%`,
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Directional (vertical) motion blur for fast-moving type, as an SVG filter.
export const VBlur: React.FC<{ readonly id: string; readonly amount: number }> = ({ id, amount }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-10%" y="-50%" width="120%" height="200%">
      <feGaussianBlur stdDeviation={`0 ${Math.min(6, Math.max(0, amount))}`} />
    </filter>
  </svg>
);

type RollProps = {
  readonly id: string;
  readonly words: ReadonlyArray<{ readonly text: string; readonly at: number }>;
  readonly size: number;
  readonly color: string;
  readonly height: number;
  readonly width?: number;
  readonly duration?: number;
  readonly style?: React.CSSProperties;
  readonly textStyle?: React.CSSProperties;
};

// A slot-machine word swap in a fixed mask: the old word goes up and out
// while the next comes up from below (SWEEP), blurred only while moving.
export const WordRoll: React.FC<RollProps> = ({ id, words, size, color, height, width, duration = 9, style, textStyle }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", overflow: "hidden", height: height + size * 0.24, marginBottom: -size * 0.24, width, ...style }}>
      {words.map((w, i) => {
        const next = words[i + 1];
        const inT = i === 0 && w.at <= 0 ? 1 : interpolate(frame, [w.at, w.at + duration], [0, 1], { ...clamp, easing: SWEEP });
        const outT = next ? interpolate(frame, [next.at, next.at + duration], [0, 1], { ...clamp, easing: SWEEP }) : 0;
        if (inT <= 0 || outT >= 1) return null;
        const y = (1 - inT) * 100 - outT * 100;
        const moving = (inT > 0 && inT < 1) || (outT > 0 && outT < 1);
        const speed = moving ? 6 : 0;
        const fid = `${id}-${i}`;
        return (
          <div key={w.text + i} style={{ position: "absolute", left: 0, top: 0, height: height + size * 0.24, paddingBottom: size * 0.24, boxSizing: "border-box", display: "flex", alignItems: "flex-end" }}>
            <VBlur id={fid} amount={speed} />
            <div
              style={{
                ...display(size, color),
                translate: `0% ${y}%`,
                filter: moving ? `url(#${fid})` : undefined,
                ...textStyle,
              }}
            >
              {w.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Fields and transitions
// ---------------------------------------------------------------------------

type FieldProps = {
  readonly background: string;
  readonly orb?: string;
  readonly seed?: number;
};

// A full-bleed gradient field with two slow orbs in the next scene's colour.
export const Field: React.FC<FieldProps> = ({ background, orb = C.lilac, seed = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            left: (i === 0 ? -250 : 480) + (frame + seed * 37) * 0.4 * (i === 0 ? 1 : -1),
            top: (i === 0 ? 200 : 1100) + (frame + seed * 19) * 0.4 * (i === 0 ? 0.6 : -0.5),
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb} 0%, rgba(0,0,0,0) 70%)`,
            opacity: 0.25,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Film grain over everything, re-seeded every other frame.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 60;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.05, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g3-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g3-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

type ShutterProps = {
  readonly edge: string;
  readonly duration?: number;
  readonly children: React.ReactNode;
};

// The next scene arrives as a whole layer revealed from the bottom up, with
// a thin line in the incoming field's light tone riding the edge.
export const Shutter: React.FC<ShutterProps> = ({ edge, duration = 10, children }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const p = interpolate(frame, [0, duration], [100, 0], { ...clamp, easing: SWEEP });
  const kick = interpolate(frame, [0, 10], [1.03, 1], { ...clamp, easing: EXPO_OUT });
  return (
    <AbsoluteFill style={{ clipPath: `inset(${p}% 0px 0px 0px)` }}>
      <AbsoluteFill style={{ scale: kick }}>{children}</AbsoluteFill>
      {p > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: (p / 100) * height, height: 3, background: edge, opacity: 0.8 }} />
      ) : null}
    </AbsoluteFill>
  );
};

type RippleProps = {
  readonly x: number;
  readonly y: number;
  readonly max: number;
  readonly duration?: number;
  readonly children: React.ReactNode;
};

// The one flood: a circle grows from the tap point, led by a lilac ring.
export const TapRipple: React.FC<RippleProps> = ({ x, y, max, duration = 14, children }) => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [0, duration], [0, max], { ...clamp, easing: RIPPLE });
  const ring = interpolate(frame, [duration - 4, duration], [1, 0], clamp);
  const scale = interpolate(frame, [0, duration], [1.04, 1], { ...clamp, easing: RIPPLE });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>
        <AbsoluteFill style={{ scale, transformOrigin: `${x}px ${y}px` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {ring > 0 ? (
        <div
          style={{
            position: "absolute",
            left: x - r,
            top: y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: `8px solid ${C.lilac}`,
            opacity: ring,
            boxSizing: "border-box",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Touch
// ---------------------------------------------------------------------------

type Chip = { readonly at: number; readonly text: string; readonly kind: "customer" | "left" | "you" };
type Point = { readonly at: number; readonly x: number; readonly y: number; readonly dur?: number };

type TouchProps = {
  readonly points: ReadonlyArray<Point>;
  readonly presses?: ReadonlyArray<number>;
  readonly chips: ReadonlyArray<Chip>;
  readonly showAt?: number;
  readonly hideAt?: number;
  readonly pressedAt0?: boolean;
  readonly exit?: { readonly at: number; readonly dx: number; readonly dur: number };
};

const CHIP_STYLE: Record<Chip["kind"], React.CSSProperties> = {
  customer: { background: C.bone, color: C.midnight },
  left: { background: C.deadGrey, color: C.bone },
  you: { background: C.midnight, color: C.bone, border: "2px solid rgba(244,241,234,0.4)" },
};

// A touch point that glides, presses and carries a label chip, so the story
// reads with the sound off ("Customer", "Left", "You").
export const TouchDot: React.FC<TouchProps> = ({ points, presses = [], chips, showAt = -100, hideAt, pressedAt0 = false, exit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let x = points[0].x;
  let y = points[0].y;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const t = interpolate(frame, [p.at, p.at + (p.dur ?? 8)], [0, 1], { ...clamp, easing: EXPO_OUT });
    x += (p.x - x) * t;
    y += (p.y - y) * t;
  }
  if (exit) {
    x += interpolate(frame, [exit.at, exit.at + exit.dur], [0, exit.dx], { ...clamp, easing: EXPO_IN });
  }
  let scale = 1;
  for (const at of presses) {
    if (frame >= at && frame < at + 3) scale = Math.min(scale, interpolate(frame, [at, at + 3], [1, 0.8], clamp));
    else if (frame >= at + 3 && frame < at + 20) scale = Math.min(scale, 0.8 + 0.2 * springAt(frame, at + 3, fps, SNAP_SPRING));
  }
  if (pressedAt0 && frame < 7) scale = interpolate(frame, [0, 3, 7], [0.85, 0.85, 1], clamp);
  const appear = showAt <= -10 ? 1 : springAt(frame, showAt, fps, SNAP_SPRING);
  const hide = hideAt === undefined ? 1 : interpolate(frame, [hideAt, hideAt + 4], [1, 0], { ...clamp, easing: EXPO_IN });
  if (frame < showAt || hide <= 0) return null;

  // Chip: crossfade between labels.
  const current = [...chips].reverse().find((c) => frame >= c.at) ?? chips[0];
  const idx = chips.indexOf(current);
  const prev = idx > 0 ? chips[idx - 1] : null;
  const mix = prev ? interpolate(frame, [current.at, current.at + 6], [0, 1], clamp) : 1;

  const rings = [...presses, ...(pressedAt0 ? [-1] : [])].map((at) => {
    const start = at < 0 ? 0 : at;
    const t = interpolate(frame, [start, start + 14], [at < 0 ? 0.0 : 0, 1], { ...clamp, easing: EXPO_OUT });
    const visible = frame >= start && frame <= start + 14;
    return visible ? (
      <div
        key={at}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 0,
          height: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -(42 + t * 108),
            top: -(42 + t * 108),
            width: (42 + t * 108) * 2,
            height: (42 + t * 108) * 2,
            borderRadius: "50%",
            border: `4px solid ${C.bone}`,
            opacity: 0.9 * (1 - t),
            boxSizing: "border-box",
          }}
        />
      </div>
    ) : null;
  });

  return (
    <>
      {rings}
      <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity: hide, scale: appear * (0.6 + 0.4 * hide) }}>
        <div
          style={{
            position: "absolute",
            left: -42,
            top: -42,
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "rgba(244,241,234,0.35)",
            border: "4px solid rgba(244,241,234,0.9)",
            boxShadow: "0 0 0 1.5px rgba(12,11,29,0.35), 0 8px 24px rgba(0,0,0,0.3)",
            boxSizing: "border-box",
            scale,
          }}
        />
        <div style={{ position: "absolute", left: 34, top: 34 }}>
          {[prev, current].map((c, i) =>
            c ? (
              <div
                key={c.text + i}
                style={{
                  position: i === 0 ? "absolute" : "relative",
                  left: 0,
                  top: 0,
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  ...ui(24, 600, C.bone),
                  ...CHIP_STYLE[c.kind],
                  boxSizing: "border-box",
                  opacity: i === 0 ? 1 - mix : mix,
                }}
              >
                {c.text}
              </div>
            ) : null,
          )}
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

type CardProps = {
  readonly at: number;
  readonly exitAt?: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
};

export const CARD_SHADOW = "0 2px 6px rgba(12,11,29,0.12), 0 40px 90px rgba(12,11,29,0.35)";

// A UI card centred on (x, y) that springs in tilted back and leaves up.
export const UICard: React.FC<CardProps> = ({ at, exitAt, x, y, width, height, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, at, fps, UI_SPRING);
  const out = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 6], [0, 1], { ...clamp, easing: EXPO_IN });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x - width / 2, top: y - (height ?? 0) / 2, width, perspective: 1600 }}>
      <div
        style={{
          width,
          height,
          transformOrigin: "50% 100%",
          translate: `0px ${(1 - s) * 160 - out * 60}px`,
          scale: (0.88 + 0.12 * s) * (1 - out * 0.06),
          rotate: `x ${(1 - s) * 20}deg`,
          opacity: Math.min(1, s * 2.5) * (1 - out),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Pop scale for chips and small pieces.
export const popScale = (frame: number, at: number, fps: number, from = 0.6, config = SNAP_SPRING) =>
  frame < at ? 0 : from + (1 - from) * springAt(frame, at, fps, config);

export const bouncy = (frame: number, at: number, fps: number) => springAt(frame, at, fps, BOUNCY);

// A press: scale to `depth` over 2 frames, then spring back.
export const press = (frame: number, at: number, fps: number, depth = 0.95) => {
  if (frame < at) return 1;
  if (frame < at + 2) return interpolate(frame, [at, at + 2], [1, depth], clamp);
  return depth + (1 - depth) * springAt(frame, at + 2, fps, SNAP_SPRING);
};

// ---------------------------------------------------------------------------
// Glyphs (the local fonts are Latin subsets: every icon is SVG)
// ---------------------------------------------------------------------------

type GlyphProps = { readonly size: number; readonly color: string; readonly stroke?: number };

export const PhoneGlyph: React.FC<GlyphProps> = ({ size, color, stroke = 5 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <path
      d="M17 9l7 1.5 2.5 9-4.5 3.5a23 23 0 0 0 11 11l3.5-4.5 9 2.5L47 39c-.5 4-4 7-8 7C24 45 11 32 10 17c0-4 3-7.5 7-8z"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </svg>
);

export const LockGlyph: React.FC<GlyphProps> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill={color} />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke={color} strokeWidth={2.4} />
  </svg>
);

export const MoonGlyph: React.FC<GlyphProps> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M15.5 3.5a8.5 8.5 0 1 0 5 15 7 7 0 0 1-5-15z" fill={color} />
  </svg>
);

export const CheckGlyph: React.FC<GlyphProps & { readonly progress?: number }> = ({ size, color, stroke = 10, progress = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M24 52l17 17 36-38"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);

export const ArrowGlyph: React.FC<GlyphProps> = ({ size, color, stroke = 7 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52">
    <path d="M6 26h38M30 12l14 14-14 14" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StatusGlyphs: React.FC<{ readonly color: string }> = ({ color }) => (
  <svg width={110} height={26} viewBox="0 0 110 26">
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 8} y={18 - i * 5} width={5} height={6 + i * 5} rx={1.5} fill={color} />
    ))}
    <path d="M44 10a14 14 0 0 1 20 0M48 14a8 8 0 0 1 12 0" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
    <circle cx={54} cy={19} r={2.6} fill={color} />
    <rect x={72} y={5} width={32} height={16} rx={4} fill="none" stroke={color} strokeWidth={2.2} />
    <rect x={75} y={8} width={20} height={10} rx={2} fill={color} />
    <rect x={105.5} y={10} width={2.5} height={6} rx={1} fill={color} />
  </svg>
);

// A loading spinner: a 270-degree arc with round caps.
export const Spinner: React.FC<{ readonly size: number; readonly stroke: number; readonly color: string; readonly rotation: number }> = ({
  size,
  stroke,
  color,
  rotation,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ rotate: `${rotation}deg` }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c * 0.75} ${c}`}
      />
    </svg>
  );
};

export const DemoChip: React.FC<{ readonly color?: string; readonly style?: React.CSSProperties }> = ({ color = C.midnight, style }) => (
  <div
    style={{
      ...mono(22, color),
      padding: "4px 10px",
      borderRadius: 10,
      border: "2px solid rgba(12,11,29,0.3)",
      lineHeight: 1.1,
      ...style,
    }}
  >
    Demo
  </div>
);
