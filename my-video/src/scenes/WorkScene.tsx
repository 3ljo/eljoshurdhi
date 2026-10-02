import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import {
  AgencyMock,
  BoardMock,
  BrowserFrame,
  CvMock,
  FinanceMock,
  StoreMock,
  VoiceMock,
} from "../components/ProjectMockups";

// Case studies from the portfolio's siteConfig.js.
const PROJECTS = [
  {
    title: "Sage Commerce",
    niche: "E-commerce",
    tags: ["Next.js", "Stripe", "Tailwind"],
    accent: "#14B8A6",
    Mock: StoreMock,
  },
  {
    title: "CV Climber",
    niche: "Career SaaS",
    tags: ["Next.js", "AI", "Stripe"],
    accent: "#10B981",
    Mock: CvMock,
  },
  {
    title: "AI Receptionist",
    niche: "AI Automation",
    tags: ["OpenAI", "Twilio", "Supabase"],
    accent: "#8B5CF6",
    Mock: VoiceMock,
  },
  {
    title: "Nderto",
    niche: "Construction SaaS",
    tags: ["Next.js", "Postgres", "Auth"],
    accent: "#F59E0B",
    Mock: BoardMock,
  },
  {
    title: "ESHB",
    niche: "Brand & Agency",
    tags: ["React", "Framer Motion"],
    accent: "#F43F5E",
    Mock: AgencyMock,
  },
  {
    title: "Denaro",
    niche: "Fintech",
    tags: ["Next.js", "Charts", "Auth"],
    accent: "#84CC16",
    Mock: FinanceMock,
  },
];

// The carousel turns one card every 45 frames (3 beats).
const ARRIVALS = [30, 75, 120, 165, 210, 255];
const RADIUS = 900;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const ringAngle = (frame: number) =>
  interpolate(
    frame,
    [0, 30, 61, 75, 106, 120, 151, 165, 196, 210, 241, 255],
    [100, 0, 0, -60, -60, -120, -120, -180, -180, -240, -240, -300],
    { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
  );

type WorkSceneProps = {
  readonly label: string;
  readonly style?: React.CSSProperties;
};

const WorkSceneInner: React.FC<WorkSceneProps> = ({ label, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = ringAngle(frame) + Math.sin(frame / 40) * 1.5;
  const focused = Math.max(
    0,
    ARRIVALS.filter((a) => frame >= a - 7).length - 1,
  );
  const accent = interpolateColors(
    frame,
    ARRIVALS.map((a) => a - 7),
    PROJECTS.map((p) => `${p.accent}40`),
  );

  return (
    <AbsoluteFill style={{ ...style }}>
      <Backdrop seed="work" particles={18} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 900px 520px at 50% 42%, ${accent}, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 410,
          top: 742,
          width: 1100,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.75), transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 440,
          width: 0,
          height: 0,
          perspective: 2600,
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${-RADIUS}px) rotateY(${ring}deg)`,
          }}
        >
          {PROJECTS.map((p, i) => {
            const raw = i * 60 + ring;
            const angle = ((((raw + 180) % 360) + 360) % 360) - 180;
            const away = Math.abs(angle);
            return (
              <div
                key={p.title}
                style={{
                  position: "absolute",
                  left: -480,
                  top: -300,
                  width: 960,
                  height: 600,
                  transform: `rotateY(${i * 60}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                  opacity: interpolate(away, [0, 60, 105], [1, 0.55, 0], clamp),
                  filter: `brightness(${interpolate(away, [0, 60], [1, 0.55], clamp)}) blur(${interpolate(away, [10, 60], [0, 2.5], clamp)}px)`,
                }}
              >
                <BrowserFrame title={p.title} accent={p.accent}>
                  <p.Mock t={frame - (ARRIVALS[i] - 14)} />
                </BrowserFrame>
              </div>
            );
          })}
        </div>
      </div>

      {PROJECTS.map((p, i) => {
        const inAt = ARRIVALS[i] - 8;
        const outAt = i < PROJECTS.length - 1 ? ARRIVALS[i + 1] - 14 : Infinity;
        if (frame < inAt - 1 || frame > outAt + 10) {
          return null;
        }
        const enter = interpolate(frame, [inAt, inAt + 14], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const leave = Number.isFinite(outAt)
          ? interpolate(frame, [outAt, outAt + 8], [0, 1], {
              ...clamp,
              easing: Easing.in(Easing.cubic),
            })
          : 0;
        return (
          <div
            key={p.title}
            style={{
              position: "absolute",
              left: 0,
              top: 780,
              width: 1920,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: enter * (1 - leave),
              translate: `0px ${(1 - enter) * 60 - leave * 40}px`,
            }}
          >
            <div
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 800,
                fontSize: 96,
                lineHeight: 1,
                letterSpacing: -3,
                color: "#F9FAFB",
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 26,
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono",
                  fontWeight: 600,
                  fontSize: 36,
                  letterSpacing: 2,
                  color: p.accent,
                  marginRight: 10,
                }}
              >
                {p.niche.toUpperCase()}
              </div>
              {p.tags.map((tag, ti) => (
                <div
                  key={tag}
                  style={{
                    padding: "8px 22px",
                    borderRadius: 999,
                    border: "2px solid #2A2A2A",
                    backgroundColor: "#141414",
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: 30,
                    color: "#D1D5DB",
                    scale: String(
                      interpolate(
                        frame,
                        [inAt + 4 + ti * 3, inAt + 14 + ti * 3],
                        [0.6, 1],
                        {
                          ...clamp,
                          easing: Easing.spring({ damping: 12 }),
                        },
                      ),
                    ),
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <Interactive.Div
        name="Section label"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 150,
          top: 96,
          fontFamily: "JetBrains Mono",
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 10,
          color: "#34D399",
          opacity: interpolate(frame, [10, 20], [0, 1], clamp),
        }}
      >
        {label}
      </Interactive.Div>

      <Interactive.Div
        name="Counter"
        premountFor={fps}
        style={{
          position: "absolute",
          right: 150,
          top: 96,
          fontFamily: "JetBrains Mono",
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 4,
          color: "#9CA3AF",
          opacity: interpolate(frame, [10, 20], [0, 1], clamp),
        }}
      >
        <span style={{ color: "#F9FAFB" }}>
          {String(focused + 1).padStart(2, "0")}
        </span>
        {" / 06"}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const workSchema = {
  label: {
    type: "text-content",
    default: "SELECTED WORK",
    description: "Label",
  },
} as const satisfies InteractivitySchema;

export const WorkScene = Interactive.withSchema({
  Component: WorkSceneInner,
  componentName: "<WorkScene>",
  schema: workSchema,
  wrapInSequence: true,
});
