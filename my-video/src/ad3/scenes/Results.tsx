import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EXPO_IN, EXPO_OUT, FIELDS, headGroup, type Layout, MONO, UI_SPRING, uiGroup } from "../theme";
import {
  CARD_SHADOW,
  CheckGlyph,
  DemoChip,
  display,
  Field,
  Mask,
  MoonGlyph,
  PhoneGlyph,
  popScale,
  press,
  springAt,
  TouchDot,
  UICard,
  ui,
  WordRoll,
} from "../kit";

// Scenes 4-6: "More calls. More bookings. More sales." Each word lands on
// the beat and is proved by something the owner does in a UI card. "More"
// persists across the cuts and changes colour with each field.

type Word = { readonly text: string; readonly at: number };

const MoreHead: React.FC<{ readonly L: Layout; readonly color: string; readonly moreAt: number; readonly words: ReadonlyArray<Word>; readonly id: string }> = ({
  L,
  color,
  moreAt,
  words,
  id,
}) => {
  const frame = useCurrentFrame();
  const kick = moreAt > -10 ? interpolate(frame, [0, 10], [1.03, 1], { ...clamp, easing: EXPO_OUT }) : 1;
  return (
    <div style={headGroup(L)}>
      <div style={{ position: "absolute", left: 70, top: 300, scale: kick, transformOrigin: "0% 0%" }}>
        <Mask at={moreAt}>
          <div style={display(200, color)}>More</div>
        </Mask>
      </div>
      <WordRoll id={id} words={words} size={190} color={color} height={205} width={1000} style={{ position: "absolute", left: 70, top: 484 }} />
    </div>
  );
};

const Squircle: React.FC<{ readonly size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.25,
      background: C.midnight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
    }}
  >
    <MoonGlyph size={size * 0.55} color={C.tangerine} />
  </div>
);

// Scene 4 (180-224): a call comes in and connects.
export const CallsScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const buzz = (frame >= 6 && frame < 14) || (frame >= 18 && frame < 26) ? (Math.floor(frame / 2) % 2 === 0 ? 3 : -3) : 0;
  const connected = frame >= 26;
  const morph = interpolate(frame, [26, 34], [0, 1], { ...clamp, easing: EXPO_OUT });
  const accept = press(frame, 24, fps, 0.86);
  const rollLine = (a: string, b: string, style: React.CSSProperties, h: number, styleB: React.CSSProperties = {}) => (
    <div style={{ position: "relative", height: h, width: 520, overflow: "hidden" }}>
      {[a, b].map((t, i) => {
        const p = interpolate(frame, [26, 35], [0, 1], { ...clamp, easing: EXPO_OUT });
        const y = i === 0 ? -p * 100 : (1 - p) * 100;
        return (
          <div key={t} style={{ position: "absolute", left: 0, top: 0, ...style, ...(i === 1 ? styleB : {}), translate: `0% ${y}%` }}>
            {t}
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill>
      <Field background={FIELDS.ultra} orb={C.tangerine} seed={4} />
      <MoreHead L={L} color={C.bone} moreAt={0} words={[{ text: "calls.", at: 3 }]} id="roll4" />
      <div style={uiGroup(L)}>
        <UICard at={2} exitAt={39} x={540} y={1000} width={860} height={300}>
          <div
            style={{
              position: "relative",
              width: 860,
              height: 300,
              borderRadius: 52,
              background: C.bone,
              boxShadow: CARD_SHADOW,
              translate: `${buzz}px 0px`,
            }}
          >
            <div style={{ position: "absolute", left: 40, top: 90, width: 120, height: 120 }}>
              {!connected
                ? [0, 7].map((off) => {
                    const t = ((frame + 15 - off) % 15) / 15;
                    return (
                      <div
                        key={off}
                        style={{
                          position: "absolute",
                          left: 60 - (60 + t * 50),
                          top: 60 - (60 + t * 50),
                          width: (60 + t * 50) * 2,
                          height: (60 + t * 50) * 2,
                          borderRadius: "50%",
                          border: `4px solid ${C.lilac}`,
                          opacity: 1 - t,
                          boxSizing: "border-box",
                        }}
                      />
                    );
                  })
                : null}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.lilac, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PhoneGlyph size={56} color={C.midnight} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 190, top: 88 }}>
              {rollLine("Incoming call", "Connected", ui(46, 600, C.midnight), 58)}
              <div style={{ marginTop: 6 }}>
                {rollLine("via your website", "00:01", ui(30, 400, C.slate), 40, { fontFamily: MONO, fontWeight: 600 })}
              </div>
            </div>
            <div style={{ position: "absolute", left: 764 - 56, top: 150 - 56, width: 112, height: 112 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: C.tangerine,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: accept * (1 - morph),
                  opacity: 1 - morph,
                }}
              >
                <PhoneGlyph size={52} color={C.midnight} />
              </div>
              {morph > 0 ? (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: morph }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 20 + 40 * (0.5 + 0.5 * Math.sin(frame / 3 + i * 1.3)),
                        borderRadius: 5,
                        background: C.tangerine,
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </UICard>
        <TouchDot
          points={[
            { at: 0, x: 940, y: 1240 },
            { at: 14, x: 874, y: 1000 },
          ]}
          presses={[24]}
          showAt={12}
          hideAt={32}
          chips={[{ at: 0, text: "You", kind: "you" }]}
        />
      </div>
    </AbsoluteFill>
  );
};

// Scene 5 (225-269): a booking request comes in and is confirmed.
export const BookingsScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = press(frame, 22, fps, 0.95);
  const morph = interpolate(frame, [25, 33], [0, 1], { ...clamp, easing: EXPO_OUT });
  const check = interpolate(frame, [33, 41], [0, 1], { ...clamp, easing: EXPO_OUT });
  const bump = frame >= 36 ? 1 + 0.025 * Math.sin(Math.min(1, (frame - 36) / 6) * Math.PI) : 1;
  const btnW = 780 + (120 - 780) * morph;
  // Card-local centres: the full button sits on x430; the circle on x320.
  const btnCx = 320 + (430 - 320) * (1 - morph);
  return (
    <AbsoluteFill>
      <Field background={FIELDS.tangerine} orb={C.lilac} seed={5} />
      <MoreHead
        L={L}
        color={C.midnight}
        moreAt={-20}
        words={[
          { text: "calls.", at: -20 },
          { text: "bookings.", at: 0 },
        ]}
        id="roll5"
      />
      <div style={uiGroup(L)}>
        <UICard at={3} exitAt={39} x={540} y={1000} width={860} height={470}>
          <div style={{ position: "relative", width: 860, height: 470, borderRadius: 52, background: C.bone, boxShadow: CARD_SHADOW, scale: bump }}>
            <div style={{ position: "absolute", left: 40, top: 40, right: 40, display: "flex", alignItems: "center", gap: 20 }}>
              <Squircle size={72} />
              <div style={ui(34, 600, C.midnight)}>Luna Café</div>
              <div style={{ flex: 1 }} />
              <DemoChip />
            </div>
            <div style={{ position: "absolute", left: 40, top: 134, ...display(52, C.midnight) }}>New booking request</div>
            <div style={{ position: "absolute", left: 40, top: 220, display: "flex", gap: 12 }}>
              {["Sat", "7:30 PM", "Table for 2"].map((t, i) => (
                <div
                  key={t}
                  style={{
                    height: 56,
                    padding: "0 24px",
                    borderRadius: 28,
                    background: C.sand,
                    display: "flex",
                    alignItems: "center",
                    ...ui(30, 600, C.midnight),
                    scale: popScale(frame, 8 + i * 2, fps),
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                left: btnCx - btnW / 2,
                top: 135 + 235 - 60 + 0,
                width: btnW,
                height: 120,
                borderRadius: 60,
                background: C.ultra,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scale: btn,
              }}
            >
              <div style={{ ...ui(40, 600, C.bone), opacity: interpolate(frame, [25, 28], [1, 0], clamp) }}>Confirm booking</div>
              {morph > 0.6 ? (
                <div style={{ position: "absolute", left: 10, top: 10 }}>
                  <CheckGlyph size={100} color={C.bone} stroke={10} progress={check} />
                </div>
              ) : null}
            </div>
            <div style={{ position: "absolute", left: 404, top: 316 }}>
              <Mask at={31}>
                <div style={display(56, C.midnight)}>Booked</div>
              </Mask>
            </div>
          </div>
        </UICard>
        <TouchDot
          points={[
            { at: 0, x: 960, y: 1240 },
            { at: 14, x: 640, y: 1135 },
          ]}
          presses={[22]}
          showAt={12}
          hideAt={27}
          chips={[{ at: 0, text: "You", kind: "you" }]}
        />
      </div>
    </AbsoluteFill>
  );
};

// Scene 6 (270-314): orders stack up. Clearly a demo, no counts.
const ORDERS = [
  { at: 5, sub: "Luna Café · Pastry box" },
  { at: 13, sub: "Luna Café · Gift card" },
  { at: 21, sub: "Luna Café · 2× Flat white" },
];
const SLOTS = [
  { y: 860, s: 1, o: 1 },
  { y: 1030, s: 0.96, o: 0.92 },
  { y: 1190, s: 0.92, o: 0.8 },
];

export const SalesScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bump = frame >= 26 ? 1 + 0.02 * Math.sin(Math.min(1, (frame - 26) / 6) * Math.PI) : 1;
  return (
    <AbsoluteFill>
      <Field background={FIELDS.lilac} orb={C.bone} seed={6} />
      <MoreHead
        L={L}
        color={C.midnight}
        moreAt={-20}
        words={[
          { text: "bookings.", at: -20 },
          { text: "sales.", at: 0 },
        ]}
        id="roll6"
      />
      <div style={uiGroup(L)}>
        <div style={{ position: "absolute", right: 70, top: 728, opacity: interpolate(frame, [6, 12], [0, 1], clamp) }}>
          <DemoChip color="rgba(12,11,29,0.6)" />
        </div>
        {ORDERS.map((o, i) => {
          if (frame < o.at) return null;
          // Position: how many newer toasts have arrived since this one.
          const newer = ORDERS.slice(i + 1).map((n) => springAt(frame, n.at, fps, UI_SPRING));
          const depth = newer.reduce((a, b) => a + b, 0);
          const lo = Math.min(2, Math.floor(depth));
          const hi = Math.min(2, lo + 1);
          const f = depth - lo;
          const slot = {
            y: SLOTS[lo].y + (SLOTS[hi].y - SLOTS[lo].y) * f,
            s: SLOTS[lo].s + (SLOTS[hi].s - SLOTS[lo].s) * f,
            o: SLOTS[lo].o + (SLOTS[hi].o - SLOTS[lo].o) * f,
          };
          const enter = springAt(frame, o.at, fps, UI_SPRING);
          const exit = interpolate(frame, [39 + (2 - i), 45 + (2 - i)], [0, 1], { ...clamp, easing: EXPO_IN });
          return (
            <div
              key={o.sub}
              style={{
                position: "absolute",
                left: 540 - 440,
                top: slot.y - 75 + (1 - enter) * -80 - exit * 120,
                width: 880,
                height: 150,
                borderRadius: 44,
                background: C.white,
                boxShadow: "0 24px 60px rgba(12,11,29,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "0 32px",
                boxSizing: "border-box",
                scale: slot.s * bump,
                opacity: Math.min(1, enter * 1.5) * slot.o * (1 - exit),
                zIndex: 10 + i,
              }}
            >
              <Squircle size={84} />
              <div style={{ flex: 1 }}>
                <div style={ui(40, 600, C.midnight)}>New order</div>
                <div style={{ ...ui(28, 400, C.slate), marginTop: 4 }}>{o.sub}</div>
              </div>
              <div style={{ ...ui(24, 500, C.slate), alignSelf: "flex-start", marginTop: 30 }}>now</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

