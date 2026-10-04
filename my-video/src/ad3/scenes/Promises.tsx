import type React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EXPO_IN, EXPO_OUT, FIELDS, headGroup, type Layout, SNAP_SPRING, UI_SPRING, uiGroup } from "../theme";
import { bouncy, CheckGlyph, display, Field, Mask, mono, popScale, springAt, TouchDot, UICard, ui, WordRoll } from "../kit";

// Scenes 7-9 answer the objections with true facts only: a fixed price in
// writing, a direct line to the person building it, live in weeks.

// Scene 7 (315-359): "Fixed price. In writing." and a quote being signed.
export const PriceScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, 4, fps, UI_SPRING);
  const out = interpolate(frame, [39, 45], [0, 1], { ...clamp, easing: EXPO_IN });
  const sign = interpolate(frame, [16, 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const agreed = frame >= 33 ? 0.5 + 0.5 * bouncy(frame, 33, fps) : 0;
  const bars = [0, 1, 2].map((i) => interpolate(frame, [10 + i * 2, 18 + i * 2], [0, 1], { ...clamp, easing: EXPO_OUT }));
  // A cursive signature (drawn, not a font).
  const SIG = "M10 62c18-40 34-52 40-38 5 12-14 40-6 42 9 2 22-40 34-40 9 0-6 34 3 34 10 0 18-24 28-24 8 0 2 20 10 20s16-18 24-18 4 16 12 16 20-26 30-26c8 0-2 22 6 22s26-16 40-18c10-2 14 6 26 4 18-3 40-14 62-16";
  return (
    <AbsoluteFill>
      <Field background={FIELDS.bone} orb={C.lilac} seed={7} />
      <div style={headGroup(L)}>
        <div style={{ position: "absolute", left: 70, top: 300 }}>
          <div style={{ display: "flex" }}>
            <Mask at={0} exitAt={39}>
              <div style={display(160, C.midnight)}>Fixed&nbsp;</div>
            </Mask>
            <Mask at={3} exitAt={39}>
              <div style={display(160, C.midnight)}>price.</div>
            </Mask>
          </div>
          <Mask at={8} exitAt={40}>
            <div style={display(160, C.ultra)}>In writing.</div>
          </Mask>
        </div>
      </div>
      <div style={uiGroup(L)}>
        {frame >= 4 ? (
          <div style={{ position: "absolute", left: 540 - 380, top: 1010 - 240, width: 760, height: 480, perspective: 1800 }}>
            <div
              style={{
                width: 760,
                height: 480,
                borderRadius: 36,
                background: C.white,
                boxShadow: "0 50px 100px rgba(12,11,29,0.18)",
                padding: 48,
                boxSizing: "border-box",
                transformOrigin: "50% 100%",
                rotate: `x ${24 + (6 - 24) * s}deg`,
                translate: `0px ${(1 - s) * 180 - out * 60}px`,
                scale: 1 - out * 0.06,
                opacity: Math.min(1, s * 2.5) * (1 - out),
              }}
            >
              <div style={{ width: "100%", height: "100%", rotate: `y ${interpolate(frame, [4, 45], [-8, -4], clamp)}deg` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={mono(24, C.slate)}>Quote</div>
                  <div style={{ ...mono(22, C.bone), background: C.ultra, borderRadius: 10, padding: "6px 12px" }}>Fixed price</div>
                </div>
                <div style={{ marginTop: 34, display: "grid", gap: 26 }}>
                  {bars.map((b, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ width: 360 * b, height: 20, borderRadius: 10, background: C.sand }} />
                      <div style={{ width: 110 * b, height: 20, borderRadius: 10, background: C.sand }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 30, height: 2, background: C.sand }} />
                <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={ui(34, 600, C.midnight)}>Total</div>
                  <div style={{ ...ui(26, 600, C.bone), background: C.midnight, borderRadius: 10, padding: "6px 14px" }}>Fixed</div>
                </div>
                <div style={{ position: "relative", marginTop: 18, height: 96 }}>
                  <svg width={420} height={90} viewBox="0 0 420 90" style={{ position: "absolute", left: 0, top: -6 }}>
                    <path d={SIG} fill="none" stroke={C.midnight} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
                  </svg>
                  <div style={{ position: "absolute", left: 0, top: 70, width: 420, height: 2, background: C.sandDeep }} />
                  <div style={{ position: "absolute", left: 0, top: 80, ...mono(20, C.slate) }}>Agreed before work starts</div>
                  {agreed > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 4,
                        height: 60,
                        padding: "0 22px 0 14px",
                        borderRadius: 30,
                        background: C.ultra,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        scale: agreed,
                        ...ui(28, 600, C.bone),
                      }}
                    >
                      <CheckGlyph size={36} color={C.bone} stroke={12} />
                      Agreed
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Scene 8 (360-404): a direct line, a message from Eljo himself.
export const DirectScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const row = interpolate(frame, [4, 14], [0, 1], { ...clamp, easing: EXPO_OUT });
  const bubble = popScale(frame, 6, fps, 0.6);
  const grow = springAt(frame, 14, fps, SNAP_SPRING);
  const out = interpolate(frame, [39, 45], [0, 1], { ...clamp, easing: EXPO_IN });
  const w = 140 + (672 - 140) * grow;
  const h = 80 + (110 - 80) * grow;
  return (
    <AbsoluteFill>
      <Field background={FIELDS.night} orb={C.ultra} seed={8} />
      <div style={headGroup(L)}>
        <div style={{ position: "absolute", left: 70, top: 300 }}>
          <Mask at={0} exitAt={39}>
            <div style={display(160, C.bone)}>Direct line</div>
          </Mask>
          <Mask at={5} exitAt={40} style={{ marginTop: 26 }}>
            <div style={ui(44, 600, C.lilac)}>to the person building it.</div>
          </Mask>
        </div>
      </div>
      <div style={{ ...uiGroup(L), translate: `${L.ui.x - 540}px ${L.ui.y - 1000 - (L.format === "reels" ? 0 : 80)}px` }}>
        <div style={{ position: "absolute", left: 110, top: 800, opacity: row * (1 - out), translate: `${(1 - row) * -40}px ${-out * 60}px`, display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: C.ultra, display: "flex", alignItems: "center", justifyContent: "center", ...display(38, C.bone) }}>ES</div>
          <div>
            <div style={ui(36, 600, C.bone)}>Eljo Shurdhi</div>
            <div style={{ ...mono(22, C.mist), marginTop: 6 }}>Builds your site</div>
          </div>
        </div>
        {frame >= 6 ? (
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 930,
              width: w,
              height: h,
              borderRadius: "40px 40px 40px 12px",
              background: interpolateColors(grow, [0, 1], [C.ashRaised, C.bone]),
              transformOrigin: "0% 100%",
              scale: bubble * (1 - out * 0.06),
              opacity: 1 - out,
              translate: `0px ${-out * 60}px`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 32, top: 33, display: "flex", gap: 12, opacity: interpolate(frame, [14, 17], [1, 0], clamp) }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.mist, translate: `0px ${-8 * Math.max(0, Math.sin(((frame - i * 4) / 12) * Math.PI * 2))}px` }} />
              ))}
            </div>
            <div style={{ position: "absolute", left: 36, top: 26 }}>
              <Mask at={16}>
                <div style={ui(44, 500, C.midnight)}>I’ll be building your site.</div>
              </Mask>
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Scene 9 (405-449): "Live in weeks. Not months." A toggle flips the site live.
export const LiveScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = springAt(frame, 18, fps, SNAP_SPRING);
  const squash = frame >= 18 && frame < 26 ? 1 + 0.15 * Math.sin(((frame - 18) / 8) * Math.PI) : 1;
  const track = interpolateColors(interpolate(frame, [18, 24], [0, 1], clamp), [0, 1], [C.sandDeep, C.tangerine]);
  const live = frame >= 20;
  const pulse = live ? ((frame - 20) % 20) / 20 : 0;
  const weeks = frame >= 3 ? 1 + 0.06 * (1 - springAt(frame, 3, fps, SNAP_SPRING)) : 1;
  return (
    <AbsoluteFill>
      <Field background={FIELDS.ultra} orb={C.tangerine} seed={9} />
      <div style={headGroup(L)}>
        <div style={{ position: "absolute", left: 70, top: 300 }}>
          <Mask at={0} exitAt={39}>
            <div style={display(180, C.bone)}>Live in</div>
          </Mask>
          <Mask at={3} exitAt={40}>
            <div style={{ ...display(230, C.bone), scale: weeks, transformOrigin: "0% 80%" }}>weeks.</div>
          </Mask>
          <Mask at={9} exitAt={41} style={{ marginTop: 8 }}>
            <div style={display(80, C.lilac)}>Not months.</div>
          </Mask>
        </div>
      </div>
      <div style={uiGroup(L)}>
        <UICard at={4} exitAt={39} x={540} y={920} width={860} height={240}>
          <div style={{ position: "relative", width: 860, height: 240, borderRadius: 52, background: C.bone, boxShadow: "0 2px 6px rgba(12,11,29,0.12), 0 40px 90px rgba(12,11,29,0.35)" }}>
            <div style={{ position: "absolute", left: 48, top: 50, ...mono(22, C.slate) }}>Site status</div>
            <div style={{ position: "absolute", left: 48, top: 92, display: "flex", alignItems: "center", gap: 18 }}>
              <WordRoll
                id="roll9"
                words={[
                  { text: "Draft", at: -20 },
                  { text: "Live", at: 20 },
                ]}
                size={64}
                color={live ? C.midnight : C.deadText}
                height={84}
                width={180}
                textStyle={{ letterSpacing: "-0.03em" }}
              />
              {live ? (
                <div style={{ position: "relative", width: 18, height: 18 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 9, background: C.tangerine, scale: 1 + pulse * 1.4, opacity: 0.8 * (1 - pulse) }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: 9, background: C.tangerine }} />
                </div>
              ) : null}
            </div>
            <div style={{ position: "absolute", left: 830 - 110 - 100, top: 120 - 56, width: 200, height: 112, borderRadius: 56, background: track }}>
              <div
                style={{
                  position: "absolute",
                  left: 10 + 88 * on,
                  top: 10,
                  width: 92,
                  height: 92,
                  borderRadius: 46,
                  background: C.white,
                  boxShadow: "0 4px 12px rgba(12,11,29,0.25)",
                  scale: `${squash} 1`,
                }}
              />
            </div>
          </div>
        </UICard>
        {[
          { t: "One-page site", v: "5 days", at: 24, y: 1100 },
          { t: "Full site", v: "2–3 weeks", at: 28, y: 1160 },
        ].map((r) => (
          <div key={r.t} style={{ position: "absolute", left: 110, top: r.y, width: 860 }}>
            <Mask at={r.at} exitAt={39} from="left">
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, ...mono(30, C.bone, 0.04) }}>
                <span>{r.t}</span>
                <span style={{ flex: 1, borderBottom: "4px dotted rgba(200,184,255,0.6)", transform: "translateY(-8px)" }} />
                <span>{r.v}</span>
              </div>
            </Mask>
          </div>
        ))}
        <TouchDot
          points={[
            { at: 0, x: 960, y: 1240 },
            { at: 10, x: 830, y: 920, dur: 6 },
          ]}
          presses={[18]}
          showAt={8}
          hideAt={28}
          chips={[{ at: 0, text: "You", kind: "you" }]}
        />
      </div>
    </AbsoluteFill>
  );
};

