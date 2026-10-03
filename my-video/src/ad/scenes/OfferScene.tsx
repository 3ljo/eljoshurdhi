import type React from "react";
import { AbsoluteFill, Interactive, type InteractivitySchema } from "remotion";
import { FONT, INK } from "../brand";

// Offer: the three promises and the starting price. PLACEHOLDER: replaced by the scene build.
type OfferSceneProps = {
  readonly style?: React.CSSProperties;
};

const OfferSceneInner: React.FC<OfferSceneProps> = ({ style }) => (
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
    OFFER
  </AbsoluteFill>
);

const offerSchema = {} as const satisfies InteractivitySchema;

export const OfferScene = Interactive.withSchema({
  Component: OfferSceneInner,
  componentName: "<OfferScene>",
  schema: offerSchema,
  wrapInSequence: true,
});
