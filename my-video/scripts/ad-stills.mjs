// Renders review stills of an ad composition in every Meta format and lays
// them out on one contact sheet (rows = formats, columns = frames).
//
//   node scripts/ad-stills.mjs <compositionId> <frame,frame,...> <outDir>
//
// e.g. node scripts/ad-stills.mjs AdHook 0,8,20,45,80 /tmp/hook
// The scene compositions are 1080x1920; the 4:5 and 1:1 rows override the
// height, which is exactly how the full ad lays the scene out in that format.
// Set REMOTION_BROWSER to a Chrome headless shell if the default download is
// blocked (in the cloud container it is
// /opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell).

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [id, framesArg, outDir] = process.argv.slice(2);
if (!id || !framesArg || !outDir) {
  console.error("usage: node scripts/ad-stills.mjs <compositionId> <frames> <outDir>");
  process.exit(1);
}
const frames = framesArg.split(",").map(Number);
const heights = (process.env.HEIGHTS ?? "1920,1350,1080").split(",").map(Number);
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const files = [];
for (const height of heights) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  composition.height = height;
  for (const frame of frames) {
    const output = join(outDir, `${id}-${height}-f${frame}.png`);
    await renderStill({
      serveUrl,
      composition,
      frame,
      output,
      scale: 0.5,
      browserExecutable,
      chromiumOptions: { gl: "angle" },
      overwrite: true,
    });
    files.push({ height, frame, output });
  }
}

const sheet = join(outDir, `${id}-sheet.jpg`);
execFileSync("python3", [
  "-c",
  `
import json, sys
from PIL import Image, ImageDraw
files = json.loads(sys.argv[1]); heights = json.loads(sys.argv[2]); frames = json.loads(sys.argv[3])
W = 540; gap = 16
rowh = [int(h / 2) for h in heights]
sheet = Image.new("RGB", (len(frames) * (W + gap) + gap, sum(rowh) + gap * (len(heights) + 1) + 30), "#777")
d = ImageDraw.Draw(sheet)
y = gap + 30
for fi, f in enumerate(frames):
    d.text((gap + fi * (W + gap), 8), f"frame {f}", fill="white")
for hi, h in enumerate(heights):
    for fi, f in enumerate(frames):
        p = [x for x in files if x["height"] == h and x["frame"] == f][0]["output"]
        sheet.paste(Image.open(p).convert("RGB"), (gap + fi * (W + gap), y))
    y += rowh[hi] + gap
sheet.save(sys.argv[4], quality=82)
`,
  JSON.stringify(files),
  JSON.stringify(heights),
  JSON.stringify(frames),
  sheet,
]);
console.log(sheet);
