import type React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { C, clamp, EXPO_IN, EXPO_OUT, FIELDS, headGroup, type Layout, uiGroup } from "../theme";
import { CheckGlyph, display, Field, Mask } from "../kit";

// Scene 3 (frames 150-179): the turn. The ripple floods ultramarine, "Let's
// fix that." rises with a tangerine highlight behind "fix", and the loading
// ring finally closes into a check.
export const TurnScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const arc = interpolate(frame, [6, 16], [0.75, 1], { ...clamp, easing: EXPO_OUT });
  const check = interpolate(frame, [16, 24], [0, 1], { ...clamp, easing: EXPO_OUT });
  const pulse = frame >= 18 ? 1 + 0.06 * Math.sin(Math.min(1, (frame - 18) / 8) * Math.PI) : 1;
  const out = interpolate(frame, [22, 30], [0, 1], { ...clamp, easing: EXPO_IN });
  const wipe = interpolate(frame, [12, 20], [0, 100], { ...clamp, easing: EXPO_OUT });
  const fixColor = interpolateColors(wipe, [0, 60, 100], [C.bone, C.bone, C.midnight]);
  const r = 104;
  const circ = 2 * Math.PI * r;

  return (
    <AbsoluteFill>
      <Field background={FIELDS.ultra} orb={C.lilac} seed={3} />
      <div style={headGroup(L)}>
        <div style={{ position: "absolute", left: 70, top: 300 }}>
          <Mask at={4} exitAt={24}>
            <div style={{ ...display(210, C.bone), display: "flex", alignItems: "baseline" }}>
              <span>Let’s&nbsp;</span>
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -18,
                    right: -18,
                    top: "0.1em",
                    height: "0.86em",
                    borderRadius: 24,
                    background: C.tangerine,
                    clipPath: `inset(0px ${100 - wipe}% 0px 0px)`,
                  }}
                />
                <span style={{ position: "relative", color: fixColor }}>fix</span>
              </span>
            </div>
          </Mask>
          <Mask at={7} exitAt={26}>
            <div style={display(210, C.bone)}>that.</div>
          </Mask>
        </div>
      </div>
      <div style={uiGroup(L)}>
        <div
          style={{
            position: "absolute",
            left: 540 - 110,
            top: 1000 - 110,
            width: 220,
            height: 220,
            scale: pulse * (1 - out * 0.2),
            opacity: 1 - out,
          }}
        >
          <svg width={220} height={220} viewBox="0 0 220 220" style={{ position: "absolute", rotate: `${-90 + (1 - arc) * 120}deg` }}>
            <circle cx={110} cy={110} r={r} fill="none" stroke={C.bone} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${circ * arc} ${circ}`} />
          </svg>
          <div style={{ position: "absolute", left: 40, top: 40 }}>
            <CheckGlyph size={140} color={C.bone} stroke={14} progress={check} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
