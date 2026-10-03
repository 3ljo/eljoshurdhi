import { useVideoConfig } from "remotion";

export type Format = "reels" | "feed" | "square";

export type SafeBox = {
  readonly format: Format;
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
};

// Every format is 1080 wide; only the height changes. Backgrounds always
// bleed to the edges, but anything the viewer must read goes inside the safe
// box:
// - reels (1080x1920, Reels and Stories): Meta's own UI covers the top bar
//   and the bottom third (caption, profile, the ad's button), so text stays
//   between y=250 and y=1280.
// - feed (1080x1350, 4:5) and square (1080x1080): a plain margin.
export const useSafeBox = (): SafeBox => {
  const { width, height } = useVideoConfig();
  const side = 70;
  if (height / width > 1.6) {
    return { format: "reels", top: 250, left: side, width: width - side * 2, height: height - 250 - 640 };
  }
  if (height / width > 1.1) {
    return { format: "feed", top: 90, left: side, width: width - side * 2, height: height - 180 };
  }
  return { format: "square", top: 70, left: side, width: width - side * 2, height: height - 140 };
};
