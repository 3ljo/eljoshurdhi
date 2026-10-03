import type React from "react";
import { AbsoluteFill, Interactive, type InteractivitySchema } from "remotion";
import { FONT, INK } from "../brand";

// Proof: real projects, live. PLACEHOLDER: replaced by the scene build.
type ProofSceneProps = {
  readonly style?: React.CSSProperties;
};

const ProofSceneInner: React.FC<ProofSceneProps> = ({ style }) => (
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
    PROOF
  </AbsoluteFill>
);

const proofSchema = {} as const satisfies InteractivitySchema;

export const ProofScene = Interactive.withSchema({
  Component: ProofSceneInner,
  componentName: "<ProofScene>",
  schema: proofSchema,
  wrapInSequence: true,
});
