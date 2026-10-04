import type React from "react";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, INK } from "./brand";

// Shared building blocks for the ad's scenes. Every motion is driven by the
// frame, so renders are deterministic.

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Text is sized to fill the safe box, which needs the real fonts measured.
// Holds the frame until Anton and Mulish have loaded, then re-renders.
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading the ad's fonts"));
  useEffect(() => {
    let cancelled = false;
    // loadFont() registers each face asynchronously, and document.fonts.load()
    // resolves at once for a face that is not registered yet, so poll until
    // the faces themselves report "loaded".
    const loaded = (family: string, weight: string) =>
      [...document.fonts].some(
        (f) => f.family.replace(/["']/g, "") === family && f.weight === weight && f.status === "loaded",
      );
    const check = () => {
      if (cancelled) return;
      if (loaded(FONT.display, "400") && loaded(FONT.body, "900") && loaded(FONT.body, "800")) {
        setReady(true);
        continueRender(handle);
      } else {
        setTimeout(check, 30);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [handle]);
  return ready;
};

const widths = new Map<string, number>();
const measure = (text: string, family: string, weight: number) => {
  const key = `${family}|${weight}|${text}`;
  const known = widths.get(key);
  if (known !== undefined) return known;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * 50;
  ctx.font = `${weight} 100px "${family}"`;
  const w = ctx.measureText(text).width;
  widths.set(key, w);
  return w;
};

// The font size at which `text` is exactly `maxWidth` wide (capped at
// `maxSize`). Anton lines are measured in capitals, as they are shown.
export const fitSize = (
  text: string,
  maxWidth: number,
  maxSize: number,
  family: string = FONT.display,
  weight = 400,
) => {
  const shown = family === FONT.display ? text.toUpperCase() : text;
  return Math.min(maxSize, (maxWidth / measure(shown, family, weight)) * 100 * 0.985);
};

// Poster lines: Anton capitals set 7% extended with a hair of stroke, like
// the website's cover. Fit them with fitSize(text, width / EXTEND, max).
export const EXTEND = 1.07;
export const LEAD = 0.92;

export const posterLine = (size: number, color: string): React.CSSProperties => ({
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

export const Extended: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", scale: `${EXTEND} 1`, transformOrigin: "0% 50%" }}>{children}</span>
);

// Drop-in for a line landing on frame `at`: from 1.4x to rest with a tiny
// settle, visible from two frames before the hit.
export const land = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at - 3, at - 2], [0, 1], clamp),
  scale: interpolate(frame, [at - 2, at, at + 1, at + 4], [1.4, 1, 0.985, 1], {
    ...clamp,
    easing: [Easing.in(Easing.quad), Easing.linear, Easing.out(Easing.quad)],
  }),
});

// The ad's snap: fast in, a hair of overshoot, settled within ~8 frames.
export const snap = (frame: number, at: number, fps: number) =>
  spring({
    frame: frame - at,
    fps,
    config: { damping: 15, stiffness: 260, mass: 0.55 },
  });

// A decaying shake that starts on `at`: returns a CSS translate value.
export const shake = (frame: number, at: number, strength = 14, seed = "s") => {
  const f = frame - at;
  if (f < 0 || f > 10) return "0px 0px";
  const k = strength * (1 - f / 10);
  return `${(random(`${seed}x${f}`) - 0.5) * 2 * k}px ${(random(`${seed}y${f}`) - 0.5) * 2 * k}px`;
};

type SlamProps = {
  readonly at: number;
  readonly size: number;
  readonly color?: string;
  readonly enter?: "scale" | "up" | "left" | "right";
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
};

// A display line that slams in on frame `at`: Anton capitals, tight leading.
export const Slam: React.FC<SlamProps> = ({
  at,
  size,
  color = INK.ink,
  enter = "scale",
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = snap(frame, at, fps);
  const visible = frame >= at;
  const offset = (1 - p) * 140;
  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 0.9,
        textTransform: "uppercase",
        letterSpacing: "-0.005em",
        color,
        whiteSpace: "nowrap",
        opacity: visible ? Math.min(1, p * 1.6) : 0,
        scale: enter === "scale" ? interpolate(p, [0, 1], [1.55, 1]) : 1,
        translate:
          enter === "up"
            ? `0px ${offset}px`
            : enter === "left"
              ? `${-offset * 3}px 0px`
              : enter === "right"
                ? `${offset * 3}px 0px`
                : "0px 0px",
        transformOrigin: "50% 60%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

type KickerProps = {
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
};

// Small label capitals in Mulish 900, like the site's labels.
export const Kicker: React.FC<KickerProps> = ({
  children,
  color = INK.ink,
  size = 34,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT.body,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

type RedBarProps = {
  readonly at: number;
  readonly width?: number;
  readonly height?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

// The short red rule under every cover line on the site, drawn left to right.
export const RedBar: React.FC<RedBarProps> = ({
  at,
  width = 140,
  height = 16,
  color = INK.red,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: color,
        scale: `${interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })} 1`,
        transformOrigin: "0% 50%",
        ...style,
      }}
    />
  );
};

type PhotoProps = {
  readonly src: string;
  readonly duration: number;
  readonly zoom?: readonly [number, number];
  readonly drift?: readonly [string, string];
  readonly position?: string;
  readonly style?: React.CSSProperties;
};

// A full-bleed photo (path under public/) with a slow push across `duration`.
export const Photo: React.FC<PhotoProps> = ({
  src,
  duration,
  zoom = [1.12, 1],
  drift = ["0px 0px", "0px 0px"],
  position = "50% 50%",
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          scale: interpolate(frame, [0, duration], [zoom[0], zoom[1]], clamp),
          translate: interpolate(frame, [0, duration], [drift[0], drift[1]], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

// Film grain over the whole frame, re-seeded every other frame.
export const Grain: React.FC<{ readonly opacity?: number }> = ({
  opacity = 0.09,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

type BrowserProps = {
  readonly shot: string;
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly scroll?: readonly [number, number, number, number];
  readonly style?: React.CSSProperties;
};

// A browser window showing a real, long screenshot (960 wide) of a live
// project; `scroll` = [fromFrame, toFrame, fromPx, toPx] scrolls the page.
export const Browser: React.FC<BrowserProps> = ({
  shot,
  url,
  width,
  height,
  scroll = [0, 1, 0, 0],
  style,
}) => {
  const frame = useCurrentFrame();
  const bar = 54;
  const imgW = width;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: INK.ink,
        border: `4px solid ${INK.ink}`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      <div
        style={{
          height: bar,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
          backgroundColor: "#1b1b1b",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#4a4a4a" }} />
        ))}
        <div
          style={{
            marginLeft: 14,
            flex: 1,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#2a2a2a",
            color: "#d6d6d6",
            fontFamily: FONT.body,
            fontWeight: 700,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ height: height - bar, overflow: "hidden", position: "relative" }}>
        <Img
          src={staticFile(shot)}
          style={{
            width: imgW,
            display: "block",
            translate: `0px ${-interpolate(frame, [scroll[0], scroll[1]], [scroll[2], scroll[3]], {
              ...clamp,
              easing: Easing.inOut(Easing.cubic),
            })}px`,
          }}
        />
      </div>
    </div>
  );
};

type PhoneProps = {
  readonly shot: string;
  readonly width: number;
  readonly style?: React.CSSProperties;
};

// A phone showing a real mobile screenshot (390x844).
export const Phone: React.FC<PhoneProps> = ({ shot, width, style }) => {
  const height = Math.round(width * (844 / 390));
  const bezel = Math.round(width * 0.035);
  return (
    <div
      style={{
        width: width + bezel * 2,
        height: height + bezel * 2,
        padding: bezel,
        borderRadius: width * 0.14,
        backgroundColor: INK.ink,
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      <Img
        src={staticFile(shot)}
        style={{ width, height, display: "block", borderRadius: width * 0.11, objectFit: "cover" }}
      />
    </div>
  );
};

// The arrow cursor used for the click on the call to action.
export const Cursor: React.FC<{ readonly size?: number; readonly style?: React.CSSProperties }> = ({
  size = 90,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M4 2.5l15.5 9.2-6.9 1.6 3.9 7.1-3.1 1.6-3.8-7.1-5.1 4.6z"
      fill={INK.paper}
      stroke={INK.ink}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);
