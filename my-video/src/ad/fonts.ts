import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// The website's faces, bundled in public/fonts (both SIL OFL, licences next
// to the files) so renders never depend on the network.
const FILES = [
  ["Anton", "anton-latin-400-normal.woff2", "400"],
  ["Mulish", "mulish-latin-600-normal.woff2", "600"],
  ["Mulish", "mulish-latin-700-normal.woff2", "700"],
  ["Mulish", "mulish-latin-800-normal.woff2", "800"],
  ["Mulish", "mulish-latin-900-normal.woff2", "900"],
] as const;

for (const [family, file, weight] of FILES) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
}
