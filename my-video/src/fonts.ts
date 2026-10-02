import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// The portfolio's brand fonts (Plus Jakarta Sans for headings, Inter for body
// copy) plus a mono for code. They are bundled in public/fonts instead of
// loaded from Google Fonts, so previews and renders also work offline.
// loadFont() blocks rendering until each file is ready.
const FONTS = [
  ["Plus Jakarta Sans", "plus-jakarta-sans-latin-600-normal.woff2", "600"],
  ["Plus Jakarta Sans", "plus-jakarta-sans-latin-700-normal.woff2", "700"],
  ["Plus Jakarta Sans", "plus-jakarta-sans-latin-800-normal.woff2", "800"],
  ["Inter", "inter-latin-400-normal.woff2", "400"],
  ["Inter", "inter-latin-500-normal.woff2", "500"],
  ["Inter", "inter-latin-600-normal.woff2", "600"],
  ["JetBrains Mono", "jetbrains-mono-latin-400-normal.woff2", "400"],
  ["JetBrains Mono", "jetbrains-mono-latin-600-normal.woff2", "600"],
] as const;

for (const [family, file, weight] of FONTS) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
}
