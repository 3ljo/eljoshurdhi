import { Video } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { DOMAIN, FONT, INK } from "../brand";
import { useSafeBox } from "../layout";
import {
  clamp,
  Cursor,
  EXTEND,
  Extended,
  fitSize,
  Kicker,
  land,
  LEAD,
  posterLine,
  shake,
  snap,
  useFontsReady,
} from "../parts";

// Call to action (scene frames 0-104), the end card: Eljo's living portrait,
// the back cover's headline, the address burned in on an acid band, and the
// site's button clicked once. From frame 60 it holds as a still end card.

type CtaSceneProps = {
  readonly headline?: string;
  readonly domain?: string;
  readonly button?: string;
  readonly signoff?: string;
  readonly style?: React.CSSProperties;
};

// Scene-local frames the soundtrack hits on.
const DOMAIN_AT = 15;
const BUTTON_AT = 30;
const CLICK = 45;

const split = (text: string) =>
  text
    .split("/")
    .map((l) => l.trim())
    .filter(Boolean);

const CtaSceneInner: React.FC<CtaSceneProps> = ({
  headline = "LET'S GET YOU / MORE CUSTOMERS.",
  domain = DOMAIN,
  button = "START MY PROJECT",
  signoff = "Eljo Shurdhi",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const box = useSafeBox();
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ backgroundColor: INK.ink, ...style }} />;

  const lines = split(headline);
  const hSize = Math.min(150, ...lines.map((l) => fitSize(l, box.width / EXTEND, 150)));
  const hH = lines.length * hSize * LEAD;
  const dSize = fitSize(domain, box.width - 20, 128, FONT.body, 900);
  const bandH = Math.round(dSize * 1.5);
  const btnH = 128;
  const gapA = 34;
  const gapB = 40;
  const stackH = hH + gapA + bandH + gapB + btnH;
  // The stack sits on the bottom of the safe box; the portrait fills above.
  const fit = Math.min(1, (box.height * 0.66) / stackH);
  const stackTop = box.top + box.height - stackH * fit;
  const videoBottom = stackTop + hSize * LEAD * 0.55 * fit;

  const bandIn = interpolate(frame, [DOMAIN_AT - 3, DOMAIN_AT + 1], [0, 100], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const btn = snap(frame, BUTTON_AT, fps);
  const press = interpolate(frame, [CLICK, CLICK + 2, CLICK + 7], [1, 0.92, 1], clamp);
  const ring = interpolate(frame, [CLICK, CLICK + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cursorT = interpolate(frame, [BUTTON_AT + 2, CLICK], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: INK.ink, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width, height: videoBottom, overflow: "hidden" }}>
        <Video
          src={staticFile("ad/video/portrait.mp4")}
          muted
          volume={0}
          objectFit="cover"
          premountFor={fps}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectPosition: "50% 22%",
            scale: interpolate(frame, [0, 104], [1.08, 1], clamp),
          }}
        />
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(13,13,13,0) 55%, rgba(13,13,13,0.85) 92%, #0d0d0d 100%)",
          }}
        />
      </div>

      <Kicker
        size={34}
        color={INK.ink}
        style={{
          position: "absolute",
          left: box.left,
          top: box.top,
          backgroundColor: INK.acid,
          padding: "12px 20px 10px",
        }}
      >
        {signoff}
      </Kicker>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: stackTop,
          width,
          transformOrigin: "50% 0%",
          scale: fit,
        }}
      >
        <div style={{ marginLeft: box.left, translate: shake(frame, DOMAIN_AT, 6, "cta") }}>
          {lines.map((line) => (
            <div
              key={line}
              style={{
                ...posterLine(hSize, INK.acid),
                transformOrigin: "0% 50%",
                filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.6))",
              }}
            >
              <Extended>{line}</Extended>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: gapA,
            height: bandH,
            backgroundColor: INK.acid,
            clipPath: `inset(0px ${100 - bandIn}% 0px 0px)`,
            display: "flex",
            alignItems: "center",
            paddingLeft: box.left,
          }}
        >
          <div
            style={{
              fontFamily: FONT.body,
              fontWeight: 900,
              fontSize: dSize,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: INK.ink,
              whiteSpace: "nowrap",
              transformOrigin: "0% 50%",
              ...land(frame, DOMAIN_AT),
            }}
          >
            {domain}
          </div>
        </div>

        <div style={{ marginTop: gapB, marginLeft: box.left, height: btnH, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: btnH,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 48px",
              borderRadius: btnH / 2,
              backgroundColor: INK.red,
              color: INK.paper,
              fontFamily: FONT.body,
              fontWeight: 900,
              fontSize: 54,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              opacity: frame >= BUTTON_AT ? Math.min(1, btn * 2) : 0,
              scale: interpolate(btn, [0, 1], [0.6, 1]) * press,
              transformOrigin: "30% 50%",
            }}
          >
            {button}
            <svg width={54} height={30} viewBox="0 0 54 30">
              <path d="M2 15h44M33 3l13 12-13 12" stroke={INK.paper} strokeWidth={6} fill="none" strokeLinecap="square" />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: btnH,
                border: `6px solid ${INK.acid}`,
                opacity: frame >= CLICK ? 1 - ring : 0,
                scale: 1 + ring * 0.25,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: interpolate(cursorT, [0, 1], [box.width * 0.95, 500]),
              top: interpolate(cursorT, [0, 1], [btnH * 2.2, btnH * 0.45]),
              opacity: interpolate(frame, [BUTTON_AT + 2, BUTTON_AT + 5, 58, 64], [0, 1, 1, 0], clamp),
              scale: interpolate(frame, [CLICK, CLICK + 2, CLICK + 6], [1, 0.85, 1], clamp),
            }}
          >
            <Cursor size={96} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ctaSchema = {
  headline: { type: "text-content", default: "LET'S GET YOU / MORE CUSTOMERS.", description: "Headline (/ = break)" },
  domain: { type: "text-content", default: DOMAIN, description: "Website" },
  button: { type: "text-content", default: "START MY PROJECT", description: "Button label" },
  signoff: { type: "text-content", default: "Eljo Shurdhi", description: "Sign-off" },
} as const satisfies InteractivitySchema;

export const CtaScene = Interactive.withSchema({
  Component: CtaSceneInner,
  componentName: "<CtaScene>",
  schema: ctaSchema,
  wrapInSequence: true,
});
