# Eljo Shurdhi — promo video

A 50-second motion-graphics promo for the portfolio in `../my-portfolio`,
built with [Remotion](https://www.remotion.dev) and the Remotion agent skills in
`.agents/skills`. Copy, colors (emerald on near-black) and fonts (Plus Jakarta
Sans, Inter) come from the portfolio.

## Commands

```console
npm i               # install dependencies
npm run dev         # open Remotion Studio (choose the "Promo" composition)
npx remotion render Promo out/promo.mp4
npm run lint        # eslint + tsc
```

## What's in the video

The music is 120 BPM, so every scene starts on a bar line (60 frames at 30 fps).

| Frames    | Scene          | What happens                                                          |
| --------- | -------------- | --------------------------------------------------------------------- |
| 0–180     | Intro          | Code is typed, then "compiles" into the name with a 3D emerald gem    |
| 180–300   | Location       | Dotted globe spins and zooms into Albania; pin drops on Tirana        |
| 300–540   | Problem        | Word-by-word captions over a glitching 2015-style site, then "Let's fix that." |
| 540–780   | How it works   | Camera travels a glowing track through the 5 process steps            |
| 780–1080  | Work           | 3D carousel of the six case studies with animated UI sketches         |
| 1080–1260 | Why me         | Beat-synced promises flashing between dark and emerald                |
| 1260–1500 | Call to action | Cursor clicks "Start My Project", end card with an audio spectrum     |

Each scene is also registered on its own under the **Scenes** folder in Studio
(a connected composition), so it can be previewed and edited on its own
timeline. Key text is exposed as editable props.

## Project layout

- `src/Promo.tsx`: the main timeline (`TransitionSeries` with wipe, iris, slide
  and push-cut transitions, light-leak overlays, music and the bass-reactive glow)
- `src/scenes/`: one file per scene
- `src/components/`: shared pieces (backdrop, 3D gem, icons, kinetic captions,
  project mockups, audio visualization, light leak)
- `src/SoundEffects.tsx`: every sound effect as its own `<Audio>` on the timeline
- `src/geo/`: baked map data (generated)
- `public/audio/`: music and sound effects (generated)
- `public/fonts/`: brand fonts and their SIL Open Font License files

## Regenerating assets

Everything is generated locally, so rendering needs no network access:

```console
node scripts/generate-audio.mjs   # synthesizes music.wav and the sound effects
node scripts/prep-geo.mjs         # bakes globe dots and Balkan outlines from world-atlas
```

## Notes

- Light leaks, the starburst background and the 3D gem use WebGL;
  `remotion.config.ts` sets the `angle` OpenGL renderer for Studio and renders.
- Remotion is free for individuals and companies of up to 3 people. Larger
  companies need a [company license](https://www.remotion.pro/license).
