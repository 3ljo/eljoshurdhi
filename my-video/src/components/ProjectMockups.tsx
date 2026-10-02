import type React from "react";
import { Easing, interpolate } from "remotion";
import { DrawIcon } from "./Icons";

// Stylized, animated UI sketches of the portfolio's case studies. They are
// illustrations of each product type, not screenshots. `t` is the number of
// frames since the card started rotating into focus.

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const Bar: React.FC<{
  readonly w: number | string;
  readonly h?: number;
  readonly c?: string;
  readonly style?: React.CSSProperties;
}> = ({ w, h = 14, c = "#E5E7EB", style }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: h / 2,
      backgroundColor: c,
      ...style,
    }}
  />
);

export const BrowserFrame: React.FC<{
  readonly title: string;
  readonly accent: string;
  readonly children: React.ReactNode;
}> = ({ title, accent, children }) => (
  <div
    style={{
      width: 960,
      height: 600,
      borderRadius: 26,
      overflow: "hidden",
      backgroundColor: "#0F0F0F",
      border: "2px solid #262626",
      boxShadow: `0 40px 120px rgba(0, 0, 0, 0.65), 0 0 80px ${accent}22`,
    }}
  >
    <div
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 22px",
        backgroundColor: "#161616",
        borderBottom: "2px solid #222222",
      }}
    >
      {["#F87171", "#FBBF24", "#34D399"].map((c) => (
        <div
          key={c}
          style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c }}
        />
      ))}
      <div
        style={{
          marginLeft: 18,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 18px",
          borderRadius: 10,
          backgroundColor: "#0F0F0F",
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 22,
          color: "#D1D5DB",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: accent,
          }}
        />
        {title}
      </div>
      <div
        style={{
          flex: 1,
          height: 30,
          marginLeft: 16,
          borderRadius: 15,
          backgroundColor: "#0F0F0F",
        }}
      />
    </div>
    <div style={{ position: "relative", height: 540, overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

export const StoreMock: React.FC<{ readonly t: number }> = ({ t }) => {
  const count = t >= 30 ? 2 : t >= 20 ? 1 : 0;
  const press = (at: number) =>
    interpolate(t, [at - 3, at, at + 5], [1, 0.86, 1], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#F6FAF9" }}>
      <div
        style={{
          height: 74,
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "0 34px",
          borderBottom: "2px solid #E5EEEB",
        }}
      >
        <div
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 34,
            color: "#0F766E",
          }}
        >
          sage.
        </div>
        <Bar w={70} c="#CBD5D1" />
        <Bar w={90} c="#CBD5D1" />
        <Bar w={60} c="#CBD5D1" />
        <div style={{ flex: 1 }} />
        <div
          style={{
            position: "relative",
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: "#0F766E",
            scale: String(
              interpolate(t, [20, 24, 30, 34], [1, 1.25, 1, 1.25], clamp),
            ),
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -8,
              top: -8,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#F97316",
              color: "#FFFFFF",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: count > 0 ? 1 : 0,
            }}
          >
            {count}
          </div>
        </div>
      </div>
      <div
        style={{
          margin: "22px 34px",
          height: 120,
          borderRadius: 20,
          padding: "26px 30px",
          background: "linear-gradient(110deg, #0F766E, #14B8A6 60%, #5EEAD4)",
        }}
      >
        <Bar w={340} h={22} c="rgba(255,255,255,0.95)" />
        <Bar
          w={220}
          h={14}
          c="rgba(255,255,255,0.7)"
          style={{ marginTop: 14 }}
        />
      </div>
      <div style={{ display: "flex", gap: 20, padding: "0 34px" }}>
        {["#99F6E4", "#FDE68A", "#FBCFE8", "#BFDBFE"].map((c, i) => (
          <div
            key={c}
            style={{
              flex: 1,
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              border: "2px solid #E5EEEB",
              padding: 12,
              translate: `0px ${interpolate(
                t,
                [2 + i * 3, 14 + i * 3],
                [40, 0],
                {
                  ...clamp,
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              )}px`,
            }}
          >
            <div
              style={{
                height: 130,
                borderRadius: 12,
                background: `linear-gradient(160deg, ${c}, #FFFFFF)`,
              }}
            />
            <Bar w="80%" c="#D1DBD8" style={{ marginTop: 12 }} />
            <Bar w="45%" c="#0F766E" style={{ marginTop: 10 }} />
            <div
              style={{
                marginTop: 12,
                height: 34,
                borderRadius: 10,
                backgroundColor: "#0F766E",
                scale: String(i === 1 ? press(20) * press(30) : 1),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CvMock: React.FC<{ readonly t: number }> = ({ t }) => {
  const ring = interpolate(t, [6, 40], [0.15, 0.92], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        gap: 30,
        padding: 34,
        backgroundColor: "#0B1512",
      }}
    >
      <div
        style={{
          width: 400,
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          padding: 30,
        }}
      >
        <Bar w={200} h={26} c="#111827" />
        <Bar w={140} h={14} c="#10B981" style={{ marginTop: 12 }} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{ position: "relative", marginTop: i === 0 ? 34 : 18 }}
          >
            <Bar w={[300, 260, 320, 240, 290, 200][i]} c="#E5E7EB" />
            {i === 2 ? (
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  top: -8,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.35)",
                  width: interpolate(t, [10, 26], [0, 336], clamp),
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <DrawIcon
            icon="sparkles"
            progress={interpolate(t, [6, 22], [0, 1], clamp)}
            size={56}
            color="#34D399"
          />
          <Bar w={220} h={20} c="#E5E7EB" />
        </div>
        <svg
          width={220}
          height={220}
          viewBox="0 0 220 220"
          style={{ alignSelf: "center" }}
        >
          <circle
            cx={110}
            cy={110}
            r={88}
            fill="none"
            stroke="#1F2F29"
            strokeWidth={20}
          />
          <circle
            cx={110}
            cy={110}
            r={88}
            fill="none"
            stroke="#10B981"
            strokeWidth={20}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - ring}
            transform="rotate(-90 110 110)"
          />
        </svg>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <DrawIcon
              icon="check"
              progress={interpolate(t, [18 + i * 6, 30 + i * 6], [0, 1], clamp)}
              size={40}
              color="#34D399"
            />
            <Bar w={[260, 210, 240][i]} c="#2F4A40" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const VoiceMock: React.FC<{ readonly t: number }> = ({ t }) => {
  const bubble = (at: number): React.CSSProperties => ({
    opacity: interpolate(t, [at, at + 6], [0, 1], clamp),
    translate: `0px ${interpolate(t, [at, at + 10], [24, 0], {
      ...clamp,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    })}px`,
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        gap: 28,
        padding: 34,
        backgroundColor: "#100C1A",
      }}
    >
      <div
        style={{
          width: 330,
          borderRadius: 22,
          backgroundColor: "#1B1530",
          border: "2px solid #2E2450",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 44,
        }}
      >
        <div style={{ position: "relative", width: 130, height: 130 }}>
          {[0, 1].map((k) => {
            const p = ((t + k * 15) % 30) / 30;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 65,
                  border: "4px solid #8B5CF6",
                  scale: String(1 + p * 0.6),
                  opacity: 1 - p,
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 65,
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
            }}
          />
        </div>
        <Bar w={170} h={18} c="#E9E3FF" style={{ marginTop: 30 }} />
        <Bar w={110} h={12} c="#6D5BA8" style={{ marginTop: 12 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 90,
            marginTop: 30,
          }}
        >
          {new Array(18).fill(true).map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                borderRadius: 4,
                backgroundColor: "#A78BFA",
                height:
                  12 +
                  Math.abs(
                    Math.sin(t * 0.45 + i * 0.9) * Math.cos(t * 0.21 + i * 0.4),
                  ) *
                    70,
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          paddingTop: 10,
          fontFamily: "Inter",
          fontSize: 26,
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: 420,
            padding: "16px 22px",
            borderRadius: "22px 22px 22px 6px",
            backgroundColor: "#262033",
            color: "#E5E7EB",
            ...bubble(6),
          }}
        >
          Hi! Can I book a cleaning?
        </div>
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: 420,
            padding: "16px 22px",
            borderRadius: "22px 22px 6px 22px",
            backgroundColor: "#7C3AED",
            color: "#FFFFFF",
            ...bubble(16),
          }}
        >
          Sure, is Tuesday at 10:00 good?
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: 420,
            padding: "16px 22px",
            borderRadius: "22px 22px 22px 6px",
            backgroundColor: "#262033",
            color: "#E5E7EB",
            ...bubble(26),
          }}
        >
          Perfect, thanks!
        </div>
        <div
          style={{
            alignSelf: "center",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
            padding: "12px 24px",
            borderRadius: 999,
            backgroundColor: "rgba(52, 211, 153, 0.15)",
            border: "2px solid #34D399",
            color: "#34D399",
            fontWeight: 600,
            ...bubble(36),
          }}
        >
          <DrawIcon
            icon="check"
            progress={interpolate(t, [36, 48], [0, 1], clamp)}
            size={32}
            color="#34D399"
          />
          Appointment booked
        </div>
      </div>
    </div>
  );
};

export const BoardMock: React.FC<{ readonly t: number }> = ({ t }) => {
  const move = interpolate(t, [14, 30], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const card = (c: string): React.CSSProperties => ({
    height: 96,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    border: "2px solid #EFE7DA",
    borderLeft: `8px solid ${c}`,
    padding: "16px 18px",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FBF7F0",
        padding: "26px 30px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 30,
            color: "#92400E",
          }}
        >
          nderto
        </div>
        <div
          style={{
            flex: 1,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#F1E6D3",
          }}
        >
          <div
            style={{
              height: 14,
              borderRadius: 7,
              backgroundColor: "#F59E0B",
              width: `${45 + move * 20}%`,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          gap: 22,
          marginTop: 26,
        }}
      >
        {[0, 1, 2].map((col) => (
          <div
            key={col}
            style={{
              flex: 1,
              borderRadius: 18,
              backgroundColor: "#F4ECDF",
              padding: 16,
              height: 400,
            }}
          >
            <Bar w={110} h={16} c="#B45309" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: 18,
              }}
            >
              {[0, 1].map((r) => (
                <div
                  key={r}
                  style={card(["#F59E0B", "#FB923C", "#22C55E"][col])}
                >
                  <Bar w="85%" c="#E7DCCB" />
                  <Bar w="50%" c="#E7DCCB" style={{ marginTop: 12 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div
          style={{
            ...card(move > 0.5 ? "#22C55E" : "#FB923C"),
            position: "absolute",
            width: 236,
            left: 16 + 278 + move * 278,
            top: 290 - move * 0,
            boxShadow: `0 ${10 + 20 * Math.sin(move * Math.PI)}px 40px rgba(146, 64, 14, ${0.15 + 0.2 * Math.sin(move * Math.PI)})`,
            rotate: `${Math.sin(move * Math.PI) * 4}deg`,
          }}
        >
          <Bar w="85%" c="#E7DCCB" />
          <Bar w="50%" c="#E7DCCB" style={{ marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
};

export const AgencyMock: React.FC<{ readonly t: number }> = ({ t }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "#0A0A0A",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: 620,
        height: 620,
        borderRadius: "50%",
        left: 420 + Math.sin(t / 12) * 40,
        top: -120 + Math.cos(t / 15) * 30,
        background:
          "radial-gradient(circle, rgba(244,63,94,0.85), rgba(249,115,22,0.35) 45%, transparent 70%)",
        filter: "blur(10px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 30,
        display: "flex",
        gap: 26,
        alignItems: "center",
      }}
    >
      <Bar w={90} h={16} c="#F9FAFB" />
      <Bar w={60} c="#4B5563" />
      <Bar w={60} c="#4B5563" />
    </div>
    <div
      style={{
        position: "absolute",
        left: 34,
        top: 140,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {"ESHB".split("").map((ch, i) => (
        <div
          key={ch}
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 240,
            lineHeight: 1,
            letterSpacing: -10,
            color: "#F9FAFB",
            translate: `0px ${interpolate(
              t,
              [4 + i * 3, 18 + i * 3],
              [260, 0],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            )}px`,
          }}
        >
          {ch}
        </div>
      ))}
    </div>
    <Bar
      w={420}
      h={18}
      c="#9CA3AF"
      style={{ position: "absolute", left: 44, top: 410 }}
    />
    <div
      style={{
        position: "absolute",
        left: 44,
        top: 450,
        padding: "14px 30px",
        borderRadius: 999,
        backgroundColor: "#F43F5E",
        fontFamily: "Inter",
        fontWeight: 600,
        fontSize: 24,
        color: "#FFFFFF",
        opacity: interpolate(t, [20, 28], [0, 1], clamp),
      }}
    >
      Let&apos;s talk
    </div>
  </div>
);

export const FinanceMock: React.FC<{ readonly t: number }> = ({ t }) => {
  const grow = interpolate(t, [6, 32], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const segments = [
    { c: "#84CC16", v: 0.42 },
    { c: "#22C55E", v: 0.26 },
    { c: "#0EA5E9", v: 0.18 },
    { c: "#F59E0B", v: 0.14 },
  ];
  let acc = 0;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        backgroundColor: "#F7FAF3",
      }}
    >
      <div
        style={{
          width: 150,
          backgroundColor: "#1A2E05",
          padding: "30px 26px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: 26,
            color: "#D9F99D",
          }}
        >
          denaro
        </div>
        {[0, 1, 2, 3].map((i) => (
          <Bar
            key={i}
            w={i === 0 ? 96 : 80}
            c={i === 0 ? "#84CC16" : "#3F6212"}
          />
        ))}
      </div>
      <div style={{ flex: 1, padding: 30 }}>
        <div style={{ display: "flex", gap: 18 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 96,
                borderRadius: 16,
                backgroundColor: "#FFFFFF",
                border: "2px solid #E3EBD8",
                padding: 18,
              }}
            >
              <Bar w={90} c="#D4DEC6" />
              <Bar
                w={140}
                h={22}
                c={i === 0 ? "#3F6212" : "#1F2937"}
                style={{ marginTop: 14 }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 26, marginTop: 24 }}>
          <svg width={250} height={250} viewBox="0 0 250 250">
            {segments.map((s) => {
              const start = acc;
              acc += s.v;
              return (
                <circle
                  key={s.c}
                  cx={125}
                  cy={125}
                  r={90}
                  fill="none"
                  stroke={s.c}
                  strokeWidth={34}
                  pathLength={1}
                  strokeDasharray={`${Math.max(0, s.v * grow - 0.01)} 1`}
                  strokeDashoffset={-start * grow}
                  transform="rotate(-90 125 125)"
                />
              );
            })}
          </svg>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              height: 250,
            }}
          >
            {[0.45, 0.7, 0.55, 0.9, 0.62, 0.8, 0.5].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: i === 3 ? "#65A30D" : "#BEF264",
                  height: `${
                    h *
                    100 *
                    interpolate(t, [4 + i * 2, 24 + i * 2], [0, 1], {
                      ...clamp,
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    })
                  }%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
