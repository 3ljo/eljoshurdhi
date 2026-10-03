// The Meta ad speaks the website's language (my-portfolio, "Issue 01"):
// four inks, Anton for the shouting, Mulish for everything else, and
// black-and-white street photography with one print colour on top.

export const INK = {
  paper: "#fafafa",
  ink: "#0d0d0d",
  acid: "#f1fa18",
  red: "#f80808",
  redInk: "#c20000",
  grey: "#9a9a9a",
} as const;

export const FONT = {
  display: "Anton",
  body: "Mulish",
} as const;

// 30 fps against a 120 BPM bed: a beat is 15 frames, a bar is 60.
export const BEAT = 15;
export const BAR = 60;

// Where each scene sits on the ad's 20-second timeline. Cuts land on beats.
export const SCENES = {
  hook: { from: 0, durationInFrames: 90 },
  pain: { from: 90, durationInFrames: 135 },
  proof: { from: 225, durationInFrames: 165 },
  offer: { from: 390, durationInFrames: 105 },
  cta: { from: 495, durationInFrames: 105 },
} as const;

export const AD_DURATION = 600;

export const DOMAIN = "eljoshurdhi.com";
