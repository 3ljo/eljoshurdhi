import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { measure } from "../fonts";
import {
  ArrowGlyph,
  display,
  Field,
  LockGlyph,
  Mask,
  mono,
  popScale,
  springAt,
  TouchDot,
  ui,
  VBlur,
} from "../kit";
import {
  BOUNCY,
  C,
  clamp,
  EXPO_IN,
  EXPO_OUT,
  FIELDS,
  type Layout,
  ODO,
  SANS,
  UI_SPRING,
} from "../theme";

// Scene 10 (450-494): the price as a pure type beat on tangerine.
const DIGITS = ["6", "4", "9"];
const LANDS = [8, 12, 16];

const Odometer: React.FC<{
  readonly size: number;
  readonly exitAt: number;
}> = ({ size, exitAt }) => {
  const frame = useCurrentFrame();
  const colW = measure("0", SANS, 800) * (size / 100) * 0.94;
  const h = size * 1.0;
  const exit = interpolate(frame, [exitAt, exitAt + 6], [0, -110], {
    ...clamp,
    easing: EXPO_IN,
  });
  return (
    <div style={{ overflow: "hidden", paddingBottom: h * 0.06 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          translate: `0% ${exit * 1.3}%`,
        }}
      >
        <div style={{ overflow: "hidden", height: h * 1.02 }}>
          <div
            style={{
              ...display(size, C.midnight),
              lineHeight: 1,
              translate: `0% ${interpolate(frame, [2, 12], [105, 0], { ...clamp, easing: EXPO_OUT })}%`,
            }}
          >
            $
          </div>
        </div>
        {DIGITS.map((d, i) => {
          const target = 10 + Number(d);
          const land = LANDS[i];
          const p = interpolate(frame, [2, land], [0, 1], {
            ...clamp,
            easing: ODO,
          });
          const over =
            frame > land
              ? 0.06 *
                Math.max(0, 1 - (frame - land) / 5) *
                Math.sin(((frame - land) / 5) * Math.PI)
              : 0;
          const idx = p * target + over;
          const moving = frame >= 2 && frame < land;
          const id = `odo-${i}`;
          return (
            <div
              key={i}
              style={{
                width: colW,
                height: h * 1.02,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <VBlur id={id} amount={moving ? 5 : 0} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  translate: `0px ${-idx * h}px`,
                  filter: moving ? `url(#${id})` : undefined,
                }}
              >
                {Array.from({ length: 20 }, (_, n) => (
                  <div
                    key={n}
                    style={{
                      ...display(size, C.midnight),
                      lineHeight: 1,
                      height: h,
                      width: colW,
                      textAlign: "center",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: 0,
                    }}
                  >
                    {n % 10}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FromScene: React.FC<{ readonly L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [16, 24], [1.04, 1], {
    ...clamp,
    easing: EXPO_OUT,
  });
  return (
    <AbsoluteFill>
      <Field background={FIELDS.tangerine} orb="#FFC3A0" seed={10} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "70px 739px",
          scale: L.type,
          translate: `0px ${L.contentY - 765}px`,
        }}
      >
        <div style={{ position: "absolute", left: 70, top: 500 }}>
          <Mask at={0} exitAt={39}>
            <div style={display(96, C.midnight)}>Websites from</div>
          </Mask>
          <div
            style={{
              marginTop: 6,
              scale: frame >= 16 ? punch : 1,
              transformOrigin: "0% 50%",
            }}
          >
            <Odometer size={330} exitAt={39} />
          </div>
          <Mask at={20} exitAt={40} style={{ marginTop: 30 }}>
            <div style={{ ...mono(28, "rgba(12,11,29,0.75)", 0.04) }}>
              Fixed price · in writing
            </div>
          </Mask>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 11 (495-599): the end card. The address types into the same pill
// shape as the dead site's address bar; "You" taps Start My Project; then it
// holds, still, for ~2.8 s.
export const EndScene: React.FC<{
  readonly L: Layout;
  readonly domain: string;
}> = ({ L, domain }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const name = domain.replace(/\.com$/, "");
  const tld = domain.slice(name.length);
  const typed = Math.max(
    0,
    Math.min(domain.length, Math.floor((frame - 5) * 2)),
  );
  const textW = 820 - 40 - 20;
  const dSize = Math.min(
    110,
    (textW / measure(domain, SANS, 800)) * 100 * 0.97,
  );
  const pill = springAt(frame, 2, fps, UI_SPRING);
  const btnIn = springAt(frame, 4, fps, BOUNCY);
  const pressS =
    frame < 18
      ? 1
      : frame < 20
        ? interpolate(frame, [18, 20], [1, 0.94], clamp)
        : 0.94 + 0.06 * springAt(frame, 20, fps);
  const arrow = interpolate(frame, [18, 22, 30], [0, 16, 0], {
    ...clamp,
    easing: EXPO_OUT,
  });
  const sheen = interpolate(frame, [20, 34], [-200, 1000], clamp);
  const glow = 60 + 30 * (0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 2));
  const caretOn = frame < 13 || Math.floor((frame - 13) / 15) % 2 === 0;
  const ring = interpolate(frame, [18, 32], [0, 1], {
    ...clamp,
    easing: EXPO_OUT,
  });

  return (
    <AbsoluteFill>
      <Field background={FIELDS.ultra} orb={C.lilac} seed={11} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "540px 765px",
          scale: L.end,
          translate: `0px ${L.contentY - 765}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 640,
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.lilac} 0%, rgba(0,0,0,0) 70%)`,
            opacity: 0.3,
            translate: `${Math.sin(frame / 50) * 30}px ${Math.cos(frame / 60) * 20}px`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1080,
            top: 412,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Mask at={0}>
            <div style={display(64, C.bone)}>Eljo Shurdhi</div>
          </Mask>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1080,
            top: 500,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Mask at={2}>
            <div style={ui(38, 600, C.lilac)}>
              Websites built to bring you customers.
            </div>
          </Mask>
        </div>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 606,
            width: 940,
            height: 180,
            borderRadius: 90,
            background: C.bone,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: Math.min(1, pill * 2),
            scale: 0.92 + 0.08 * pill,
            translate: `0px ${(1 - pill) * 40}px`,
          }}
        >
          <div style={{ opacity: 0.6, display: "flex" }}>
            <LockGlyph size={40} color={C.midnight} />
          </div>
          <div
            style={{
              position: "relative",
              ...display(dSize, C.midnight),
              letterSpacing: "-0.02em",
              width: textW,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>{name.slice(0, typed)}</span>
            <span style={{ color: C.ultra }}>
              {tld.slice(0, Math.max(0, typed - name.length))}
            </span>
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: dSize * 0.85,
                marginLeft: 6,
                background: C.ultra,
                opacity: caretOn ? 1 : 0,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 846,
            width: 820,
            height: 150,
            borderRadius: 75,
            background: C.tangerine,
            boxShadow: `0 24px ${glow}px rgba(255,106,43,0.45), inset 0 2px 0 rgba(255,255,255,0.35)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            overflow: "hidden",
            opacity: frame >= 4 ? Math.min(1, btnIn * 2) : 0,
            translate: `0px ${(1 - btnIn) * 200}px`,
            scale: (0.8 + 0.2 * btnIn) * pressS,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: sheen,
              width: 120,
              background: "rgba(255,255,255,0.3)",
              transform: "skewX(-20deg)",
            }}
          />
          <div style={display(60, C.midnight)}>Start My Project</div>
          <div style={{ translate: `${arrow}px 0px`, display: "flex" }}>
            <ArrowGlyph size={52} color={C.midnight} />
          </div>
        </div>
        {frame >= 18 && ring < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 760 - (40 + ring * 160),
              top: 921 - (40 + ring * 160),
              width: (40 + ring * 160) * 2,
              height: (40 + ring * 160) * 2,
              borderRadius: "50%",
              border: `4px solid ${C.bone}`,
              opacity: 1 - ring,
              boxSizing: "border-box",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1080,
            top: 1056,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {["Fixed price", "Live in weeks", "From $649"].map((t, i) => (
            <div
              key={t}
              style={{
                height: 60,
                padding: "0 24px",
                borderRadius: 30,
                border: "2px solid rgba(244,241,234,0.4)",
                display: "flex",
                alignItems: "center",
                ...ui(30, 600, C.bone),
                scale: popScale(frame, 8 + i * 2, fps, 0.7),
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <TouchDot
          points={[
            { at: 0, x: 930, y: 1240 },
            { at: 8, x: 760, y: 921 },
          ]}
          presses={[18]}
          showAt={6}
          hideAt={33}
          chips={[{ at: 0, text: "You", kind: "you" }]}
        />
      </div>
    </AbsoluteFill>
  );
};
