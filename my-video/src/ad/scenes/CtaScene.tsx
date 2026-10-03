import type React from "react";
import { AbsoluteFill, Interactive, type InteractivitySchema } from "remotion";
import { FONT, INK } from "../brand";

// Call to action: eljoshurdhi.com. PLACEHOLDER: replaced by the scene build.
type CtaSceneProps = {
  readonly style?: React.CSSProperties;
};

const CtaSceneInner: React.FC<CtaSceneProps> = ({ style }) => (
  <AbsoluteFill
    style={{
      backgroundColor: INK.ink,
      color: INK.acid,
      fontFamily: FONT.display,
      fontSize: 140,
      justifyContent: "center",
      alignItems: "center",
      ...style,
    }}
  >
    CTA
  </AbsoluteFill>
);

const ctaSchema = {} as const satisfies InteractivitySchema;

export const CtaScene = Interactive.withSchema({
  Component: CtaSceneInner,
  componentName: "<CtaScene>",
  schema: ctaSchema,
  wrapInSequence: true,
});
