import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { INK } from "../brand";
import { useSafeBox } from "../layout";
import {
  clamp,
  EXTEND,
  Extended,
  fitSize,
  LEAD,
  Photo,
  posterLine,
  shake,
  snap,
  useFontsReady,
} from "../parts";

// Offer (scene frames 0-104): the website's three numbered promises land one
// per beat, then a red price stamp slams over them.

type OfferSceneProps = {
  readonly promise1?: string;
  readonly promise2?: string;
  readonly promise3?: string;
  readonly stampTop?: string;
  readonly stampBottom?: string;
  readonly style?: React.CSSProperties;
};

// Scene-local frames the soundtrack hits on.
const LANDS = [0, 15, 30];
const STAMP = 60;

const split = (text: string) =>
  text
    .split("/")
    .map((l) => l.trim())
    .filter(Boolean);

const OfferSceneInner: React.FC<OfferSceneProps> = ({
  promise1 = "FIXED PRICE, / IN WRITING, / BEFORE WE START",
  promise2 = "A DIRECT LINE / TO THE PERSON / BUILDING IT",
  promise3 = "LIVE IN WEEKS, / NOT MONTHS",
  stampTop = "WEBSITES",
  stampBottom = "FROM $649",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = useSafeBox();
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ backgroundColor: INK.ink, ...style }} />;

  const promises = [promise1, promise2, promise3].map(split);
  const numW = 150;
  const gap = 34;
  const textW = box.width - numW - gap;
  // One size for every promise line, so the list reads as one block.
  const size = Math.min(118, ...promises.flat().map((l) => fitSize(l, textW / EXTEND, 118)));
  const rows = promises.map((lines) => Math.max(lines.length * size * LEAD, 210 * LEAD));
  const rowGap = 40;
  const listH = rows.reduce((a, h) => a + h, 0) + rowGap * 2;
  const fit = Math.min(1, (box.height * 0.94) / listH);
  const dim = interpolate(frame, [STAMP, STAMP + 5], [1, 0.32], clamp);

  const p = snap(frame, STAMP, fps);
  const stampW = Math.min(box.width * 0.92, 860);
  const bottomSize = fitSize(stampBottom, (stampW - 110) / EXTEND, 230);
  const topSize = Math.min(86, fitSize(stampTop, (stampW - 110) / EXTEND, 86));

  return (
    <AbsoluteFill style={{ backgroundColor: INK.ink, overflow: "hidden", ...style }}>
      <Photo
        src="ad/img/laptop-1792.webp"
        duration={105}
        zoom={[1.15, 1.05]}
        position="50% 30%"
        style={{ opacity: 0.22 }}
      />
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top + (box.height - listH * fit) / 2,
          width: box.width,
          transformOrigin: "0% 0%",
          scale: fit,
          opacity: dim,
          translate: shake(frame, STAMP, 12, "offer-list"),
        }}
      >
        {promises.map((lines, i) => {
          const at = LANDS[i];
          const t = interpolate(frame, [at - 3, at + 3], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const visible = i === 0 || frame >= at - 3;
          return (
            <div
              key={lines.join(" ")}
              style={{
                display: "flex",
                alignItems: "center",
                gap,
                height: rows[i],
                marginTop: i ? rowGap : 0,
                opacity: visible ? (i === 0 ? 1 : t) : 0,
                translate: i === 0 ? "0px 0px" : `${(1 - t) * -120}px 0px`,
              }}
            >
              <div
                style={{
                  ...posterLine(210, INK.acid),
                  width: numW,
                  textAlign: "center",
                  scale: i === 0 ? 1 : interpolate(t, [0, 1], [1.5, 1]),
                }}
              >
                {i + 1}
              </div>
              <div>
                {lines.map((line) => (
                  <div key={line} style={{ ...posterLine(size, INK.paper), transformOrigin: "0% 50%" }}>
                    <Extended>{line}</Extended>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {frame >= STAMP ? (
        <div
          style={{
            position: "absolute",
            left: box.left + (box.width - stampW) / 2,
            top: box.top + box.height * 0.5 - (topSize + bottomSize) * LEAD * 0.5 - 50,
            width: stampW,
            padding: "36px 55px 40px",
            backgroundColor: INK.red,
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
            rotate: `${interpolate(p, [0, 1], [-14, -6])}deg`,
            scale: interpolate(p, [0, 1], [2.1, 1]),
            opacity: Math.min(1, p * 3),
            translate: shake(frame, STAMP, 14, "offer-stamp"),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 14,
              border: `4px solid ${INK.paper}`,
            }}
          />
          <div style={{ ...posterLine(topSize, INK.paper), transformOrigin: "0% 50%" }}>
            <Extended>{stampTop}</Extended>
          </div>
          <div style={{ ...posterLine(bottomSize, INK.paper), transformOrigin: "0% 50%", marginTop: 6 }}>
            <Extended>{stampBottom}</Extended>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const offerSchema = {
  promise1: { type: "text-content", default: "FIXED PRICE, / IN WRITING, / BEFORE WE START", description: "Promise 1 (/ = break)" },
  promise2: { type: "text-content", default: "A DIRECT LINE / TO THE PERSON / BUILDING IT", description: "Promise 2" },
  promise3: { type: "text-content", default: "LIVE IN WEEKS, / NOT MONTHS", description: "Promise 3" },
  stampTop: { type: "text-content", default: "WEBSITES", description: "Stamp, small line" },
  stampBottom: { type: "text-content", default: "FROM $649", description: "Stamp, big line" },
} as const satisfies InteractivitySchema;

export const OfferScene = Interactive.withSchema({
  Component: OfferSceneInner,
  componentName: "<OfferScene>",
  schema: offerSchema,
  wrapInSequence: true,
});
