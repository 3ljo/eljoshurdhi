import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";

// The ad's faces (Plus Jakarta Sans, Inter, JetBrains Mono) are registered
// in src/fonts.ts. Text that is measured or fitted waits until the faces
// themselves report "loaded" (document.fonts.load() resolves early for a
// face that has not been registered yet).
const NEEDED: ReadonlyArray<readonly [string, string]> = [
  ["Plus Jakarta Sans", "800"],
  ["Plus Jakarta Sans", "700"],
  ["Inter", "600"],
  ["Inter", "500"],
];

export const useAdFonts = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading the ad fonts"));
  useEffect(() => {
    let cancelled = false;
    const loaded = (family: string, weight: string) =>
      [...document.fonts].some(
        (f) => f.family.replace(/["']/g, "") === family && f.weight === weight && f.status === "loaded",
      );
    const check = () => {
      if (cancelled) return;
      if (NEEDED.every(([f, w]) => loaded(f, w))) {
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

// Width of `text` at 100px in the given face (fonts must be loaded).
export const measure = (text: string, family: string, weight: number) => {
  const key = `${family}|${weight}|${text}`;
  const known = widths.get(key);
  if (known !== undefined) return known;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * 55;
  ctx.font = `${weight} 100px "${family}"`;
  const w = ctx.measureText(text).width;
  widths.set(key, w);
  return w;
};

// Font size at which `text` fills `maxWidth`, capped at `maxSize`.
export const fit = (text: string, maxWidth: number, maxSize: number, family = "Plus Jakarta Sans", weight = 800, tracking = 0) =>
  Math.min(maxSize, (maxWidth / (measure(text, family, weight) * (1 + tracking))) * 100 * 0.98);
