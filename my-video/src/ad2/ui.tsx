import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Drawn UI for the ad: a phone, notification toasts, a browser window, a
// cursor and a button. Everything is vector/CSS, so it stays crisp at any
// format, and every motion is driven by the frame.

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const SANS = "Plus Jakarta Sans";
export const BODY = "Inter";
export const MONO = "JetBrains Mono";

// A soft, quick settle used for UI pieces popping in.
export const pop = (frame: number, at: number, fps: number, damping = 14) =>
  spring({ frame: frame - at, fps, config: { damping, stiffness: 220, mass: 0.6 } });

type PhoneProps = {
  readonly width: number;
  readonly children?: React.ReactNode;
  readonly screen?: string;
  readonly frameColor?: string;
  readonly style?: React.CSSProperties;
};

// A modern phone: thin bezel, rounded corners, dynamic-island notch. The
// screen is 9:19.5; children are laid out inside it (position: relative).
export const Phone: React.FC<PhoneProps> = ({
  width,
  children,
  screen = "#0b0b10",
  frameColor = "#1a1a22",
  style,
}) => {
  const bezel = Math.round(width * 0.035);
  const sw = width - bezel * 2;
  const sh = Math.round(sw * (19.5 / 9));
  const r = width * 0.15;
  return (
    <div
      style={{
        width,
        height: sh + bezel * 2,
        borderRadius: r,
        padding: bezel,
        background: `linear-gradient(145deg, ${frameColor}, #050507)`,
        boxShadow:
          "0 0 0 2px rgba(255,255,255,0.08) inset, 0 50px 120px rgba(0,0,0,0.55), 0 20px 40px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: sw,
          height: sh,
          borderRadius: r - bezel,
          overflow: "hidden",
          background: screen,
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            top: sw * 0.03,
            left: "50%",
            width: sw * 0.3,
            height: sw * 0.085,
            marginLeft: -sw * 0.15,
            borderRadius: sw,
            background: "#000",
          }}
        />
      </div>
    </div>
  );
};

type ToastProps = {
  readonly icon: React.ReactNode;
  readonly app: string;
  readonly title: string;
  readonly body?: string;
  readonly time?: string;
  readonly width: number;
  readonly scale?: number;
  readonly dark?: boolean;
  readonly style?: React.CSSProperties;
};

// An iOS-style notification card.
export const Toast: React.FC<ToastProps> = ({
  icon,
  app,
  title,
  body,
  time = "now",
  width,
  scale = 1,
  dark = false,
  style,
}) => {
  const k = scale;
  return (
    <div
      style={{
        width,
        display: "flex",
        gap: 18 * k,
        alignItems: "flex-start",
        padding: `${20 * k}px ${22 * k}px`,
        borderRadius: 30 * k,
        background: dark ? "rgba(40,40,52,0.82)" : "rgba(255,255,255,0.86)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
        color: dark ? "#f4f4f7" : "#101018",
        fontFamily: BODY,
        ...style,
      }}
    >
      <div style={{ flex: "none", width: 64 * k, height: 64 * k, borderRadius: 16 * k, overflow: "hidden" }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 * k, fontWeight: 600, opacity: 0.6 }}>
          <span style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>{app}</span>
          <span>{time}</span>
        </div>
        <div style={{ marginTop: 4 * k, fontSize: 30 * k, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
        {body ? (
          <div style={{ marginTop: 2 * k, fontSize: 26 * k, fontWeight: 400, lineHeight: 1.3, opacity: 0.75 }}>{body}</div>
        ) : null}
      </div>
    </div>
  );
};

// A flat app icon: rounded square in a colour with a simple glyph.
export const AppIcon: React.FC<{ readonly color: string; readonly glyph: "calendar" | "chat" | "bag" | "phone" | "mail" }> = ({
  color,
  glyph,
}) => {
  const paths: Record<string, React.ReactNode> = {
    calendar: (
      <>
        <rect x="14" y="18" width="36" height="32" rx="6" fill="none" stroke="#fff" strokeWidth="4" />
        <path d="M14 28h36M24 13v9M40 13v9" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="39" r="4" fill="#fff" />
      </>
    ),
    chat: (
      <path
        d="M14 20a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H28l-9 8v-8h1a6 6 0 0 1-6-6z"
        fill="#fff"
      />
    ),
    bag: (
      <>
        <path d="M17 24h30l-3 26H20z" fill="#fff" />
        <path d="M25 26v-6a7 7 0 0 1 14 0v6" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    phone: (
      <path
        d="M22 14l8 2 2 9-5 4a24 24 0 0 0 10 10l4-5 9 2 2 8c-1 3-4 5-7 5-17-1-30-14-31-31 0-3 2-6 5-7z"
        fill="#fff"
      />
    ),
    mail: (
      <>
        <rect x="13" y="18" width="38" height="28" rx="5" fill="#fff" />
        <path d="M15 21l17 13 17-13" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill={color} />
      {paths[glyph]}
    </svg>
  );
};

type BrowserProps = {
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly children?: React.ReactNode;
  readonly dark?: boolean;
  readonly style?: React.CSSProperties;
};

// A browser window with a drawn page inside (children, position: relative).
export const BrowserWindow: React.FC<BrowserProps> = ({ width, height, url, children, dark = false, style }) => {
  const bar = Math.round(width * 0.075);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.03,
        overflow: "hidden",
        background: dark ? "#16161d" : "#ffffff",
        boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      <div
        style={{
          height: bar,
          display: "flex",
          alignItems: "center",
          gap: bar * 0.18,
          padding: `0 ${bar * 0.35}px`,
          background: dark ? "#22222c" : "#ececf1",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: bar * 0.24, height: bar * 0.24, borderRadius: bar, background: c }} />
        ))}
        <div
          style={{
            marginLeft: bar * 0.3,
            flex: 1,
            height: bar * 0.56,
            borderRadius: bar,
            background: dark ? "#2e2e3a" : "#ffffff",
            color: dark ? "#c9c9d6" : "#55556a",
            fontFamily: BODY,
            fontWeight: 500,
            fontSize: bar * 0.3,
            display: "flex",
            alignItems: "center",
            paddingLeft: bar * 0.35,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: "relative", width, height: height - bar, overflow: "hidden" }}>{children}</div>
    </div>
  );
};

// A pointer cursor that presses (scales down) between `pressAt` and +6.
export const Pointer: React.FC<{ readonly size?: number; readonly pressAt?: number; readonly style?: React.CSSProperties }> = ({
  size = 80,
  pressAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const s = pressAt === undefined ? 1 : interpolate(frame, [pressAt, pressAt + 2, pressAt + 6], [1, 0.82, 1], clamp);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ scale: s, transformOrigin: "20% 10%", ...style }}>
      <path
        d="M4 2.5l15.5 9.2-6.9 1.6 3.9 7.1-3.1 1.6-3.8-7.1-5.1 4.6z"
        fill="#ffffff"
        stroke="#0b0b10"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </svg>
  );
};

// A tap ripple that expands from the press point.
export const Ripple: React.FC<{ readonly at: number; readonly size?: number; readonly color?: string }> = ({
  at,
  size = 160,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [at, at + Math.round(fps * 0.5)], [0, 1], clamp);
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: -size / 2,
        top: -size / 2,
        width: size,
        height: size,
        borderRadius: size,
        border: `4px solid ${color}`,
        opacity: 1 - t,
        scale: 0.2 + t,
      }}
    />
  );
};
