import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import type React from "react";
import { useMemo } from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";

type KineticCaptionsProps = {
  readonly captions: Caption[];
  readonly activeColor: string;
  readonly style?: React.CSSProperties;
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Word-by-word captions: each sentence is a page (pages break on pauses),
// words pop in on their timestamp and the spoken word is highlighted.
const KineticCaptionsInner: React.FC<KineticCaptionsProps> = ({
  captions,
  activeColor,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: 4000,
        breakOnSilenceAfterMilliseconds: 350,
      }),
    [captions],
  );

  return (
    <div style={{ position: "absolute", ...style }}>
      {pages.map((page) => {
        const start = (page.startMs / 1000) * fps;
        const end = Number.isFinite(page.durationMs)
          ? ((page.startMs + page.durationMs) / 1000) * fps
          : Infinity;
        if (frame < start - 1 || frame > end + 12) {
          return null;
        }
        const exit = interpolate(frame, [end - 4, end + 8], [0, 1], {
          ...clamp,
          easing: Easing.in(Easing.cubic),
        });
        return (
          <div
            key={page.startMs}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              opacity: 1 - exit,
              translate: `0px ${-exit * 90}px`,
              filter: `blur(${exit * 10}px)`,
            }}
          >
            {page.tokens.map((token) => {
              const from = (token.fromMs / 1000) * fps;
              const to = (token.toMs / 1000) * fps;
              const pop = interpolate(frame, [from, from + 9], [0, 1], {
                ...clamp,
                easing: Easing.spring({ damping: 11 }),
              });
              const active = frame >= from && frame < to;
              // Keep the leading space outside the animated word, so lines
              // wrap at the space instead of starting with an indent.
              const word = token.text.trimStart();
              return (
                <span key={token.fromMs}>
                  {word.length < token.text.length ? " " : null}
                  <span
                    style={{
                      display: "inline-block",
                      opacity: frame >= from ? 1 : 0,
                      translate: `0px ${(1 - pop) * 70}px`,
                      scale: String(0.6 + 0.4 * pop),
                      color: active ? activeColor : "#F9FAFB",
                    }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const kineticCaptionsSchema = {
  ...Interactive.captionsSchema,
  activeColor: {
    type: "color",
    default: "#F87171",
    description: "Active word color",
  },
} as const satisfies InteractivitySchema;

export const KineticCaptions = Interactive.withSchema({
  Component: KineticCaptionsInner,
  componentName: "<KineticCaptions>",
  schema: kineticCaptionsSchema,
  wrapInSequence: true,
});
