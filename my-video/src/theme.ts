// Brand tokens, matching the portfolio's Tailwind theme (src/index.css there).
// Editable top-level elements keep their colors inline so Studio can edit
// them; these constants are for generated, decorative layers.
export const COLORS = {
  bg: "#0A0A0A",
  card: "#141414",
  border: "#1F1F1F",
  emerald: "#10B981",
  emeraldLight: "#34D399",
  emeraldDark: "#059669",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  danger: "#F87171",
} as const;

export const FONTS = {
  heading: "Plus Jakarta Sans",
  body: "Inter",
  mono: "JetBrains Mono",
} as const;

// The music is 120 BPM: one beat is 15 frames at 30 fps, one bar is 60.
export const BEAT = 15;
export const BAR = 60;
