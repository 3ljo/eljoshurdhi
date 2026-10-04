import type React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { DOMAIN } from "../ad/brand";
import { useAdFonts } from "./fonts";
import { Field, Grain, Shutter, TapRipple } from "./kit";
import { EndScene, FromScene } from "./scenes/Close";
import { CostScene, GhostSpinner, HookScene, HookTouch } from "./scenes/Hook";
import { DirectScene, LiveScene, PriceScene } from "./scenes/Promises";
import { BookingsScene, CallsScene, SalesScene } from "./scenes/Results";
import { TurnScene } from "./scenes/Turn";
import { C, clamp, FIELDS, useLayout } from "./theme";

// "Nothing Happened." — a 20-second Meta ad in three formats (9:16, 4:5,
// 1:1) from one component. A customer taps "Book now" on a dead small
// business site and nothing happens; one tap floods the screen ultramarine
// and the ad shows what a working site brings in, answers the objections
// with true facts and ends on eljoshurdhi.com.
//
// Scenes change on the beat (120 BPM: 15 frames). Each scene stays mounted
// 12 frames past its cut so the outgoing layer sits under the incoming
// shutter; newer scenes stack on top.
export const NothingHappened: React.FC<{ readonly sound?: React.ReactNode }> = ({ sound }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const ready = useAdFonts();
  if (!ready) return <AbsoluteFill style={{ background: FIELDS.midnight }} />;
  // A constant breath on the stage, settling to still for the end card.
  const drift = 4 * Math.sin(frame / 40) * interpolate(frame, [495, 515], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: C.midnight, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `0px ${drift}px` }}>
        <Field background={FIELDS.midnight} orb={C.ultra} seed={1} />
        <Sequence name="1 · Hook"  durationInFrames={87} premountFor={fps}>
          <HookScene L={L} />
        </Sequence>
        <Sequence name="2 · The cost" from={75} durationInFrames={87} premountFor={fps}>
          <CostScene L={L} />
        </Sequence>
        <Sequence name="Ghost spinner"  durationInFrames={166} premountFor={fps}>
          <GhostSpinner L={L} />
        </Sequence>
        <Sequence name="Customer touch"  durationInFrames={87} premountFor={fps}>
          <HookTouch L={L} />
        </Sequence>
        <Sequence name="3 · Let's fix that" from={150} durationInFrames={42} premountFor={fps}>
          <TapRipple x={L.ui.x} y={L.ui.y} max={L.rippleMax}>
            <TurnScene L={L} />
          </TapRipple>
        </Sequence>
        <Sequence name="4 · More calls" from={180} durationInFrames={57} premountFor={fps}>
          <CallsScene L={L} />
        </Sequence>
        <Sequence name="5 · More bookings" from={225} durationInFrames={57} premountFor={fps}>
          <Shutter edge={C.tangerineLight}>
            <BookingsScene L={L} />
          </Shutter>
        </Sequence>
        <Sequence name="6 · More sales" from={270} durationInFrames={57} premountFor={fps}>
          <Shutter edge="#DCD0FF">
            <SalesScene L={L} />
          </Shutter>
        </Sequence>
        <Sequence name="7 · Fixed price" from={315} durationInFrames={57} premountFor={fps}>
          <Shutter edge={C.white}>
            <PriceScene L={L} />
          </Shutter>
        </Sequence>
        <Sequence name="8 · Direct line" from={360} durationInFrames={57} premountFor={fps}>
          <Shutter edge={C.ultra}>
            <DirectScene L={L} />
          </Shutter>
        </Sequence>
        <Sequence name="9 · Live in weeks" from={405} durationInFrames={57} premountFor={fps}>
          <Shutter edge={C.ultraLight}>
            <LiveScene L={L} />
          </Shutter>
        </Sequence>
        <Sequence name="10 · From $649" from={450} durationInFrames={57} premountFor={fps}>
          <Shutter edge={C.tangerineLight}>
            <FromScene L={L} />
          </Shutter>
        </Sequence>
        <Sequence name="11 · End card" from={495} durationInFrames={105} premountFor={fps}>
          <Shutter edge={C.ultraLight}>
            <EndScene L={L} domain={DOMAIN} />
          </Shutter>
        </Sequence>
      </AbsoluteFill>
      <Grain />
      {sound}
    </AbsoluteFill>
  );
};
