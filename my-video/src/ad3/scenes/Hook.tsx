import type React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EXPO_IN, EXPO_OUT, headGroup, type Layout, SANS, SNAP_SPRING, uiGroup } from "../theme";
import { display, LockGlyph, Mask, springAt, StatusGlyphs, TouchDot, ui } from "../kit";

// Scene 1 (frames 0-74): a customer taps "Book now" on a small business's
// site and nothing happens. The button drains, a spinner turns, a second tap
// does nothing, and the customer swipes the page away. Frame 0 is the
// thumbnail: complete, nothing animating in.

const PHONE = { x: 110, y: 724, w: 860, h: 1760 };
const SCREEN = { x: PHONE.x + 20, y: PHONE.y + 20, w: 820 };

// Frame-space (9:16) point -> screen-local point.
const sx = (x: number) => x - SCREEN.x;
const sy = (y: number) => y - SCREEN.y;

const Skeleton: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly frame: number }> = ({
  x,
  y,
  w,
  h,
  frame,
}) => {
  const sweep = ((frame % 30) / 30) * (w + 400) - 200;
  return (
    <div style={{ position: "absolute", left: sx(x), top: sy(y), width: w, height: h, borderRadius: h / 2, background: C.ashLine, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: sweep, width: 200, background: C.shimmer, transform: "skewX(-20deg)", opacity: 0.7 }} />
    </div>
  );
};

export const HookScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button: pressed on frame 0, drains to grey, shakes on the second tap.
  const btnPress = frame < 2 ? 0.95 : 0.95 + 0.05 * springAt(frame, 2, fps, SNAP_SPRING);
  const drain = interpolate(frame, [8, 18], [0, 1], clamp);
  const fill = interpolateColors(drain, [0, 1], [C.tangerine, C.deadGrey]);
  const label = interpolateColors(drain, [0, 1], [C.midnight, C.deadText]);
  const shakeX = interpolate(frame, [45, 47, 49, 51, 53, 54], [0, -14, 12, -8, 5, 0], clamp);
  const secondPress = frame >= 44 && frame < 50 ? interpolate(frame, [44, 46, 50], [1, 0.97, 1], clamp) : 1;

  // The page flicks away; the phone then sinks.
  const flick = interpolate(frame, [59, 71], [0, 1], { ...clamp, easing: EXPO_IN });
  const flickOpacity = interpolate(frame, [67, 71], [1, 0], clamp);
  const sink = interpolate(frame, [66, 82], [0, 1], { ...clamp, easing: EXPO_IN });
  const load = interpolate(frame, [0, 24], [18, 41], { ...clamp, easing: EXPO_OUT });

  const phoneGroup: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: 1080,
    height: 1920,
    transformOrigin: `540px ${PHONE.y}px`,
    scale: L.phone.scale,
    translate: `0px ${L.phone.top - PHONE.y}px`,
  };

  const headline = (
    <div style={headGroup(L)}>
      <div style={{ position: "absolute", left: 70, top: 300 }}>
        <Mask at={-20} exitAt={22}>
          <div style={display(168, C.bone)}>A customer</div>
        </Mask>
        <Mask at={-20} exitAt={24}>
          <div style={display(240, C.bone)}>tapped.</div>
        </Mask>
      </div>
      <div style={{ position: "absolute", left: 70, top: 300 }}>
        <Mask at={30} exitAt={69}>
          <div style={display(200, C.bone)}>Nothing</div>
        </Mask>
        <Mask at={33} exitAt={71}>
          <div style={display(176, C.mist)}>happened.</div>
        </Mask>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ scale: interpolate(frame, [0, 75], [1, 1.03], clamp) }}>
      {headline}
      <div style={phoneGroup}>
        <div style={{ position: "absolute", inset: 0, perspective: 2000 }}>
          <div
            style={{
              position: "absolute",
              left: PHONE.x,
              top: PHONE.y,
              width: PHONE.w,
              height: PHONE.h,
              transformOrigin: "50% 20%",
              rotate: `x ${5 + sink * 9}deg`,
              translate: `0px ${4 * Math.sin(frame / 50) + sink * 1100}px`,
              filter: `brightness(${1 - sink * 0.5})`,
            }}
          >
            <div style={{ width: "100%", height: "100%", rotate: `y ${-6 + 1.2 * Math.sin(frame / 40)}deg` }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 112,
                  padding: 4,
                  background: "linear-gradient(145deg, #5A5872, #1A1928 45%, #3B3A52 70%, #8C8AA6)",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 -20px 120px rgba(58,43,255,0.25)",
                }}
              >
                <div style={{ width: "100%", height: "100%", borderRadius: 108, background: C.bezel, padding: 16 }}>
                  <div style={{ position: "relative", width: SCREEN.w, height: PHONE.h - 40, borderRadius: 92, background: "#0E0D1C", overflow: "hidden" }}>
                    {/* Status bar */}
                    <div style={{ position: "absolute", left: sx(174), top: sy(756), ...ui(26, 600, "rgba(255,255,255,0.6)") }}>12:30</div>
                    <div style={{ position: "absolute", right: 46, top: sy(760) }}>
                      <StatusGlyphs color="rgba(255,255,255,0.6)" />
                    </div>
                    <div style={{ position: "absolute", left: SCREEN.w / 2 - 13, top: 22, width: 26, height: 26, borderRadius: 13, background: "#000" }} />

                    {/* The page */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: C.ash,
                        transformOrigin: "50% 30%",
                        translate: `0px ${-520 * flick}px`,
                        scale: 1 - 0.45 * flick,
                        rotate: `${-4 * flick}deg`,
                        borderRadius: 60 * flick,
                        opacity: flickOpacity,
                        top: sy(806),
                      }}
                    >
                      <div style={{ position: "absolute", left: 32, top: 10, width: 756, height: 76, borderRadius: 38, background: C.ashRaised, display: "flex", alignItems: "center", gap: 14, paddingLeft: 28 }}>
                        <LockGlyph size={24} color={C.mist} />
                        <div style={ui(30, 500, C.mist)}>yourbusiness.example</div>
                      </div>
                      <div style={{ position: "absolute", left: 32, top: 96, width: 756, height: 4, background: C.ashLine, borderRadius: 2 }}>
                        <div style={{ width: `${load}%`, height: "100%", background: C.deadText, borderRadius: 2 }} />
                      </div>
                      <Skeleton x={162} y={932 - 62} w={520} h={44} frame={frame} />
                      <Skeleton x={162} y={998 - 62} w={640} h={22} frame={frame} />
                      <Skeleton x={162} y={1036 - 62} w={560} h={22} frame={frame} />
                      <div
                        style={{
                          position: "absolute",
                          left: 70,
                          top: 336 - 62,
                          width: 680,
                          height: 150,
                          borderRadius: 75,
                          background: fill,
                          boxShadow: `0 20px 60px rgba(255,106,43,${0.45 * (1 - drain)})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          scale: btnPress * secondPress,
                          translate: `${shakeX}px 0px`,
                        }}
                      >
                        <Mask at={-20} style={{}} innerStyle={{ translate: `0% ${interpolate(frame, [12, 18], [0, 150], { ...clamp, easing: EXPO_IN })}%` }}>
                          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: "-0.03em", color: label, lineHeight: 1 }}>Book now</div>
                        </Mask>
                      </div>
                      <div style={{ position: "absolute", left: 32, top: 546 - 62, width: 756, height: 300, borderRadius: 28, background: "#1F1E35" }} />
                      <Skeleton x={162} y={744 + 870 - 62} w={600} h={22} frame={frame} />
                      <Skeleton x={162} y={744 + 910 - 62} w={480} h={22} frame={frame} />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 112,
                  background: "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0) 60%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The spinner outlives the page: it sits in its own layer from the first
// drain until the ripple swallows it, detaching from the button as the
// customer leaves and growing into the ghost spinner of the cost scene.
export const GhostSpinner: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  // Rotation: 18 deg/frame, slowing to 3 by frame 80, then to 1 by 150.
  let angle = 0;
  for (let f = 0; f < frame; f++) {
    const speed = f < 62 ? 18 : f < 80 ? interpolate(f, [62, 80], [18, 3]) : interpolate(f, [80, 150], [3, 1], clamp);
    angle += speed;
  }
  const appear = interpolate(frame, [14, 24], [0, 1], { ...clamp, easing: EXPO_OUT });
  const detach = interpolate(frame, [62, 80], [0, 1], { ...clamp, easing: EXPO_OUT });
  // Start: the button centre in the phone group; end: the UI centre.
  const startX = 540;
  const startY = L.phone.top + (1155 - 724) * L.phone.scale;
  const x = startX + (L.ui.x - startX) * detach;
  const y = startY + (L.ui.y - startY) * detach + (1 - appear) * 40;
  const size = interpolate(detach, [0, 1], [64 * L.phone.scale, 380 * L.uiScale]);
  const stroke = interpolate(detach, [0, 1], [8, 10]);
  const color = interpolateColors(detach, [0, 1], [C.deadText, C.ghost]);
  if (frame < 14) return null;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", left: x - size / 2, top: y - size / 2, opacity: appear, rotate: `${angle}deg` }}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * 0.75} ${c}`} />
    </svg>
  );
};

// The customer's touch, in frame space mapped through the phone group.
export const HookTouch: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const map = (x: number, y: number) => ({ x: 540 + (x - 540) * L.phone.scale, y: L.phone.top + (y - 724) * L.phone.scale });
  const p = (at: number, x: number, y: number, dur?: number) => ({ at, ...map(x, y), dur });
  return (
    <TouchDot
      pressedAt0
      points={[p(0, 700, 1150), p(38, 620, 1140, 6), p(52, 560, 980, 4), p(59, 580, 640, 12)]}
      presses={[44, 56]}
      chips={[
        { at: 0, text: "Customer", kind: "customer" },
        { at: 60, text: "Left", kind: "left" },
      ]}
      exit={{ at: 71, dx: 560, dur: 8 }}
      hideAt={79}
    />
  );
};

// Scene 2 (frames 75-149): the cost, in one still paragraph over the empty
// room while the ghost spinner keeps turning.
export const CostScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const vignette = interpolate(frame, [0, 75], [0, 0.25], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,${vignette}) 100%)` }} />
      <AbsoluteFill style={{ scale: interpolate(frame, [15, 75], [1, 1.05], { ...clamp, easing: (t) => t * t * (3 - 2 * t) }) }}>
        <div style={headGroup(L)}>
          <div style={{ position: "absolute", left: 70, top: 300, scale: interpolate(frame, [0, 10], [1.03, 1], { ...clamp, easing: EXPO_OUT }), transformOrigin: "0% 0%" }}>
            {[
              { t: "They left.", c: C.mist, at: 0 },
              { t: "Your website", c: C.bone, at: 9 },
              { t: "just cost you", c: C.bone, at: 12 },
              { t: "a customer.", c: C.tangerine, at: 15 },
            ].map((l) => (
              <Mask key={l.t} at={l.at}>
                <div style={{ ...display(130, l.c), lineHeight: 0.95 }}>{l.t}</div>
              </Mask>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <div style={uiGroup(L)}>
        <TouchDot points={[{ at: 0, x: 540, y: 1000 }]} presses={[75]} showAt={66} hideAt={76} chips={[{ at: 0, text: "You", kind: "you" }]} />
      </div>
    </AbsoluteFill>
  );
};

