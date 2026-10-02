import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import balkansJson from "../geo/balkans.json";
import landDots from "../geo/land-dots.json";

type LocationSceneProps = {
  readonly city: string;
  readonly country: string;
  readonly style?: React.CSSProperties;
};

type Country = Feature<Geometry, { name: string }>;

const balkans = balkansJson as unknown as FeatureCollection<
  Geometry,
  { name: string }
>;
const albania = balkans.features.find(
  (f) => f.properties.name === "Albania",
) as Country;
const neighbours = balkans.features.filter(
  (f) => f.properties.name !== "Albania",
);
const dots = landDots as [number, number][];
const graticule = geoGraticule10();

const TIRANA: [number, number] = [19.8187, 41.3275];

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// A dotted globe spins from the Atlantic to the Balkans, then zooms in until
// Albania fills the right half of the frame and a pin drops on Tirana.
const GlobeMap: React.FC = () => {
  const frame = useCurrentFrame();

  const centerLon = interpolate(frame, [0, 52], [-35, TIRANA[0]], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const centerLat = interpolate(frame, [0, 52], [18, TIRANA[1]], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  // Zoom in log space so the push-in feels even rather than sudden.
  const radius = Math.exp(
    interpolate(
      frame,
      [0, 26, 74, 135],
      [Math.log(330), Math.log(400), Math.log(9800), Math.log(10600)],
      {
        ...clamp,
        easing: [
          Easing.bezier(0.16, 1, 0.3, 1),
          Easing.bezier(0.7, 0, 0.3, 1),
          Easing.linear,
        ],
      },
    ),
  );
  const cx = interpolate(frame, [36, 74], [960, 1250], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const cy = interpolate(frame, [36, 74], [540, 560], clamp);

  const projection = geoOrthographic()
    .scale(radius)
    .translate([cx, cy])
    .rotate([-centerLon, -centerLat])
    .clipAngle(90)
    .clipExtent([
      [-100, -100],
      [2020, 1180],
    ])
    .precision(0.4);
  const path = geoPath(projection);

  const globeOpacity = interpolate(radius, [1300, 2600], [1, 0], clamp);
  const detailOpacity = interpolate(radius, [1500, 3200], [0, 1], clamp);
  const dotRadius = Math.min(9, 2.3 * (radius / 400));
  const draw = interpolate(frame, [56, 86], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const albaniaPath = path(albania) ?? "";
  const pin = projection(TIRANA) ?? [cx, cy];

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="globe-fill" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#10261d" />
          <stop offset="100%" stopColor="#060807" />
        </radialGradient>
        <radialGradient
          id="atmosphere"
          gradientUnits="userSpaceOnUse"
          cx={cx}
          cy={cy}
          r={radius * 1.18}
        >
          <stop offset="0.8" stopColor="rgba(16,185,129,0)" />
          <stop offset="0.85" stopColor="rgba(16,185,129,0.28)" />
          <stop offset="1" stopColor="rgba(16,185,129,0)" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <g opacity={globeOpacity}>
        <circle cx={cx} cy={cy} r={radius * 1.18} fill="url(#atmosphere)" />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="url(#globe-fill)"
          stroke="rgba(52, 211, 153, 0.45)"
          strokeWidth={2}
        />
        <path
          d={path(graticule) ?? ""}
          fill="none"
          stroke="rgba(52, 211, 153, 0.12)"
          strokeWidth={1}
        />
        {dots.map((p, i) => {
          if (geoDistance(p, [centerLon, centerLat]) > Math.PI / 2 - 0.02) {
            return null;
          }
          const xy = projection(p);
          if (
            !xy ||
            xy[0] < -20 ||
            xy[0] > 1940 ||
            xy[1] < -20 ||
            xy[1] > 1100
          ) {
            return null;
          }
          return (
            <circle
              key={i}
              cx={xy[0]}
              cy={xy[1]}
              r={dotRadius}
              fill="#34D399"
              opacity={0.75}
            />
          );
        })}
      </g>

      <g opacity={detailOpacity}>
        {neighbours.map((f) => (
          <path
            key={f.properties.name}
            d={path(f) ?? ""}
            fill="rgba(16, 185, 129, 0.05)"
            stroke="rgba(52, 211, 153, 0.35)"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        ))}
        <path
          d={albaniaPath}
          fill={`rgba(16, 185, 129, ${interpolate(frame, [82, 100], [0, 0.32], clamp)})`}
          stroke="none"
        />
        <path
          d={albaniaPath}
          pathLength={1}
          fill="none"
          stroke="#34D399"
          strokeWidth={14}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
          opacity={0.55}
          filter="url(#glow)"
        />
        <path
          d={albaniaPath}
          pathLength={1}
          fill="none"
          stroke="#6EE7B7"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
      </g>

      {[0, 1, 2].map((k) => {
        const start = 90 + k * 14;
        const t = interpolate(frame, [start, start + 28], [0, 1], clamp);
        return (
          <circle
            key={k}
            cx={pin[0]}
            cy={pin[1]}
            r={10 + t * 90}
            fill="none"
            stroke="#34D399"
            strokeWidth={3}
            opacity={frame < start ? 0 : (1 - t) * 0.9}
          />
        );
      })}
      <g
        transform={`translate(${pin[0]} ${
          pin[1] +
          interpolate(frame, [84, 96], [-160, 0], {
            ...clamp,
            easing: Easing.bounce,
          })
        }) scale(1.45)`}
        opacity={interpolate(frame, [84, 87], [0, 1], clamp)}
      >
        <path
          d="M0 0 C -6 -18 -30 -34 -30 -58 A 30 30 0 1 1 30 -58 C 30 -34 6 -18 0 0 Z"
          fill="#10B981"
          stroke="#0A0A0A"
          strokeWidth={3}
        />
        <circle cx={0} cy={-58} r={11} fill="#0A0A0A" />
      </g>
    </svg>
  );
};

const LocationSceneInner: React.FC<LocationSceneProps> = ({
  city,
  country,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ ...style }}>
      <Backdrop seed="location" particles={20} />
      <GlobeMap />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 38%, rgba(10,10,10,0) 58%)",
          opacity: interpolate(frame, [70, 90], [0, 1], clamp),
        }}
      />

      <Interactive.Div
        name="Based in"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 150,
          top: 330,
          fontFamily: "JetBrains Mono",
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 10,
          color: "#34D399",
          opacity: interpolate(frame, [78, 88], [0, 1], clamp),
          translate: interpolate(frame, [78, 92], ["-40px 0px", "0px 0px"], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        BASED IN
      </Interactive.Div>

      <Interactive.Div
        name="City"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 140,
          top: 385,
          overflow: "hidden",
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 800,
          fontSize: 170,
          lineHeight: 1.1,
          letterSpacing: -4,
          color: "#F9FAFB",
        }}
      >
        <div
          style={{
            translate: interpolate(frame, [82, 100], ["0px 200px", "0px 0px"], {
              ...clamp,
              easing: Easing.spring({ damping: 14 }),
            }),
          }}
        >
          {city}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Country"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 140,
          top: 572,
          overflow: "hidden",
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 800,
          fontSize: 170,
          lineHeight: 1.1,
          letterSpacing: -4,
          color: "#34D399",
        }}
      >
        <div
          style={{
            translate: interpolate(frame, [88, 106], ["0px 200px", "0px 0px"], {
              ...clamp,
              easing: Easing.spring({ damping: 14 }),
            }),
          }}
        >
          {country}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Coordinates"
        premountFor={fps}
        style={{
          position: "absolute",
          left: 150,
          top: 790,
          fontFamily: "JetBrains Mono",
          fontSize: 40,
          color: "#9CA3AF",
          whiteSpace: "pre",
          opacity: interpolate(frame, [96, 100], [0, 1], clamp),
        }}
      >
        {"41.33° N  ·  19.82° E".slice(
          0,
          Math.floor(interpolate(frame, [96, 118], [0, 21], clamp)),
        )}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const locationSchema = {
  city: { type: "text-content", default: "Tirana,", description: "City" },
  country: { type: "text-content", default: "Albania", description: "Country" },
} as const satisfies InteractivitySchema;

export const LocationScene = Interactive.withSchema({
  Component: LocationSceneInner,
  componentName: "<LocationScene>",
  schema: locationSchema,
  wrapInSequence: true,
});
