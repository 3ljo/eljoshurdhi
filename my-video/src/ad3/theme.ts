import type React from "react";
import { Easing, useVideoConfig } from "remotion";

// "Nothing Happened." — the second Meta ad. Its own world, nothing borrowed
// from the website: midnight, bone, ultramarine, tangerine and lilac fields,
// Plus Jakarta Sans 800 in sentence case, Inter for UI, JetBrains Mono for
// small labels.

export const C = {
  midnight: "#0C0B1D",
  bone: "#F4F1EA",
  ultra: "#3A2BFF",
  ultraLight: "#6A5CFF",
  ultraDeep: "#2419D6",
  tangerine: "#FF6A2B",
  tangerineLight: "#FF8A55",
  tangerineDeep: "#F2551A",
  lilac: "#C8B8FF",
  ash: "#141327",
  ashRaised: "#23223A",
  ashLine: "#2A2940",
  shimmer: "#3A3955",
  ghost: "#34334E",
  deadGrey: "#4A4960",
  deadText: "#8A88A3",
  mist: "#9D9BB5",
  slate: "#6B6980",
  white: "#FFFFFF",
  sand: "#E9E4D8",
  sandDeep: "#D9D4C8",
  bezel: "#05050C",
} as const;

export const FIELDS = {
  midnight: `radial-gradient(circle at 50% 85%, rgba(58,43,255,0.22) 0%, rgba(58,43,255,0) 60%), ${C.midnight}`,
  ultra: "radial-gradient(circle at 30% 20%, #6A5CFF 0%, #3A2BFF 45%, #2419D6 100%)",
  tangerine: "radial-gradient(circle at 70% 20%, #FF8A55 0%, #FF6A2B 55%, #F2551A 100%)",
  lilac: "radial-gradient(circle at 70% 20%, #DCD0FF 0%, #C8B8FF 50%, #B3A0FF 100%)",
  bone: "radial-gradient(circle at 50% 0%, #FFFFFF 0%, #F4F1EA 55%, #E9E4D8 100%)",
  night: `radial-gradient(circle at 50% 95%, rgba(58,43,255,0.45) 0%, rgba(58,43,255,0) 60%), ${C.midnight}`,
} as const;

export const SANS = "Plus Jakarta Sans";
export const UI = "Inter";
export const MONO = "JetBrains Mono";

export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const SWEEP = Easing.bezier(0.76, 0, 0.24, 1);
export const RIPPLE = Easing.bezier(0.65, 0, 0.35, 1);
export const ODO = Easing.bezier(0.2, 0.8, 0.2, 1);

export const UI_SPRING = { damping: 14, stiffness: 170, mass: 0.9 };
export const SNAP_SPRING = { damping: 18, stiffness: 260, mass: 1 };
export const BOUNCY = { damping: 12, stiffness: 160, mass: 1 };

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export type Format = "reels" | "feed" | "square";

// One layout table drives all three formats. Everything in the scenes is
// authored in 9:16 frame space (1080x1920); `head` and `ui` map those
// coordinates into the current format.
export type Layout = {
  readonly format: Format;
  readonly height: number;
  readonly headTop: number;
  readonly ui: { readonly x: number; readonly y: number };
  readonly contentY: number;
  readonly type: number;
  readonly uiScale: number;
  readonly rippleMax: number;
  readonly phone: { readonly top: number; readonly scale: number };
  readonly end: number;
};

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  const r = height / width;
  if (r > 1.6) {
    return {
      format: "reels",
      height,
      headTop: 300,
      ui: { x: 540, y: 1000 },
      contentY: 765,
      type: 1,
      uiScale: 1,
      rippleMax: 2300,
      phone: { top: 724, scale: 1 },
      end: 1,
    };
  }
  if (r > 1.1) {
    return {
      format: "feed",
      height,
      headTop: 110,
      ui: { x: 540, y: 940 },
      contentY: 675,
      type: 0.92,
      uiScale: 0.9,
      rippleMax: 1800,
      phone: { top: 500, scale: 0.9 },
      end: 0.95,
    };
  }
  return {
    format: "square",
    height,
    headTop: 70,
    ui: { x: 540, y: 770 },
    contentY: 540,
    type: 0.78,
    uiScale: 0.7,
    rippleMax: 1600,
    phone: { top: 400, scale: 0.7 },
    end: 0.86,
  };
};

// Map 9:16 UI coordinates (authored around (540,1000)) into this format.
export const uiGroup = (L: Layout): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: 1080,
  height: 1920,
  transformOrigin: "540px 1000px",
  scale: L.uiScale,
  translate: `${L.ui.x - 540}px ${L.ui.y - 1000}px`,
});

// Map 9:16 headline coordinates (top-left at x70, y300) into this format.
export const headGroup = (L: Layout): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: 1080,
  height: 1920,
  transformOrigin: "70px 300px",
  scale: L.type,
  translate: `0px ${L.headTop - 300}px`,
});

// The scene starts on the timeline (absolute frames).
export const AT = {
  hook: 0,
  cost: 75,
  turn: 150,
  calls: 180,
  bookings: 225,
  sales: 270,
  price: 315,
  direct: 360,
  live: 405,
  from: 450,
  end: 495,
} as const;

export const DOMAIN = "eljoshurdhi.com";
