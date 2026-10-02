import { evolvePath, getSubpaths } from "@remotion/paths";
import type React from "react";

// Same hand-drawn 24x24 stroke icons as the portfolio's ProofStrip.
export const ICON_PATHS = {
  sparkles:
    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  document:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  chat: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
} as const;

export type IconName = keyof typeof ICON_PATHS;

// Draws an icon stroke by stroke, driven by `progress` (0 to 1).
export const DrawIcon: React.FC<{
  readonly icon: IconName;
  readonly progress: number;
  readonly size: number;
  readonly color: string;
  readonly strokeWidth?: number;
}> = ({ icon, progress, size, color, strokeWidth = 1.8 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {getSubpaths(ICON_PATHS[icon]).map((d, i) => {
        const { strokeDasharray, strokeDashoffset } = evolvePath(
          Math.max(0, Math.min(1, progress)),
          d,
        );
        return (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        );
      })}
    </svg>
  );
};

export const CursorArrow: React.FC<{ readonly size?: number }> = ({
  size = 64,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M4 2.5 L4 19.5 L8.6 15.2 L11.6 21.8 L14.4 20.6 L11.4 14.1 L17.6 14.1 Z"
      fill="#F9FAFB"
      stroke="#0A0A0A"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
  </svg>
);
