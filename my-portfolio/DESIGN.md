---
name: Eljo Shurdhi — The Drawing Set
description: A freelance web studio site drawn as the construction set for the visitor's next website.
colors:
  safety-orange: "#f05a1a"
  safety-orange-deep: "#d94b0d"
  stamp-orange: "#c2410c"
  whiteprint-paper: "#f1f4f6"
  whiteprint-paper-shade: "#e6ebef"
  drafting-ink: "#0e1f2e"
  graphite: "#3e5468"
  diazo-blue: "#2457a5"
  rule: "rgb(14 31 46 / 0.16)"
  line-soft: "rgb(36 87 165 / 0.4)"
  field-border: "rgb(14 31 46 / 0.5)"
  danger: "#b42318"
  warm-white: "#fff6f0"
  blueprint-ground: "#0d2c4d"
  blueprint-ground-shade: "#0a2441"
  blueprint-ink: "#eaf2f9"
  blueprint-graphite: "#a9c1d9"
  blueprint-line: "#cfe0f0"
  blueprint-orange: "#ff6a2b"
  blueprint-danger: "#ffa094"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.1rem, 1.4rem + 5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.93
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 1.5rem + 3.4vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.55rem, 1.2rem + 1vw, 2.1rem)"
    fontWeight: 600
    lineHeight: 1.04
  price:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "lnum, tnum"
  stamp:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.08em"
  lead:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.05rem + 0.35vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.06em"
  annotation:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.08em"
rounded:
  sheet: "2px"
  stamp: "3px"
  bubble: "9999px"
spacing:
  gutter: "clamp(1.25rem, 5vw, 4.5rem)"
  section: "clamp(5rem, 4rem + 6vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.safety-orange}"
    textColor: "{colors.drafting-ink}"
    rounded: "{rounded.sheet}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.safety-orange-deep}"
  button-secondary:
    textColor: "{colors.drafting-ink}"
    rounded: "{rounded.sheet}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-secondary-hover:
    backgroundColor: "{colors.drafting-ink}"
    textColor: "{colors.whiteprint-paper}"
  button-inverse:
    backgroundColor: "{colors.drafting-ink}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.sheet}"
  field:
    backgroundColor: "{colors.whiteprint-paper}"
    textColor: "{colors.drafting-ink}"
    rounded: "{rounded.sheet}"
    padding: "0.85rem 1rem"
  chip-selected:
    backgroundColor: "{colors.diazo-blue}"
    textColor: "{colors.whiteprint-paper}"
    rounded: "{rounded.sheet}"
    height: "2.75rem"
  stamp:
    textColor: "{colors.stamp-orange}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
    padding: "0.3rem 0.6rem 0.25rem"
  callout-bubble:
    backgroundColor: "{colors.whiteprint-paper}"
    textColor: "{colors.diazo-blue}"
    rounded: "{rounded.bubble}"
    size: "2rem"
  view-number:
    backgroundColor: "{colors.diazo-blue}"
    textColor: "{colors.whiteprint-paper}"
    rounded: "{rounded.bubble}"
    size: "2rem"
---

# Design System: Eljo Shurdhi — The Drawing Set

## Overview

**Creative North Star: "The Drawing Set"**

The site is the construction drawing set for the visitor's next website: planned, priced in writing and approved before anything is built. Every page is a sheet with a number (A-001 Cover sheet, A-101 As-built drawings, A-201 Package schedule, A-301 The builder, A-401 Request for quote). The component language comes from the drawing set itself: title blocks, callout bubbles, view titles, revision clouds and deltas, schedules, general notes and rubber stamps. The hero is the proposed homepage drawn as linework that plots itself and then builds in.

There are two prints of one drawing. The whiteprint is cool drafting paper with ink and diazo-blue linework on a faint drafting grid. The blueprint is a Prussian-blue ground with white linework. Layout, type and content are identical in both; only the tokens swap. Safety orange is the one loud colour and it marks action. The density is that of a well-kept sheet: generous margins, hairline structure, and nothing floating.

The world refuses the freelancer default: a dark page, one neon accent, glow orbs and a grid of equal cards.

**Key Characteristics:**
- Two prints (whiteprint / blueprint) driven by one token set; the reader toggles them like prints of the same drawing.
- Safety orange reserved for action, stamps and revision marks.
- Condensed drafting lettering for display; mono only for annotation.
- Structure from hairline rules and 1.5px linework, 2px corners, no shadows on containers.
- One authored motion: plot, then build.

## Colors

A cool, low-chroma drafting palette (paper, ink, diazo blue) with one high-visibility safety orange.

### Primary
- **Safety Orange** (#f05a1a; blueprint #ff6a2b): primary buttons, the solid final call-to-action field, the active-link underline, focus rings, text selection, the caret, tick marks and revision-cloud linework. Its hover is **Safety Orange Deep** (#d94b0d; blueprint #ff8450).
- **Stamp Orange** (#c2410c; blueprint uses #ff6a2b): the same orange, deepened for lettering on paper (stamps and delta numbers). It reaches 4.7:1 on whiteprint, where safety orange as text reaches only 3.1:1.

### Secondary
- **Diazo Blue** (#2457a5; blueprint line #cfe0f0): all linework (drawings, title-block frames, view-title rules, callout bubbles), the selected choice chip, and the drafting grid at very low alpha (5.5% minor, 11% major).

### Neutral
- **Whiteprint Paper** (#f1f4f6) with **Paper Shade** (#e6ebef): the page ground and recessed frames. Blueprint: **Blueprint Ground** (#0d2c4d) and **Ground Shade** (#0a2441).
- **Drafting Ink** (#0e1f2e; blueprint #eaf2f9): headings, body text, the secondary-button outline, and the text on orange.
- **Graphite** (#3e5468; blueprint #a9c1d9): secondary text, leads, annotation labels and placeholders (7.1:1 on whiteprint, 7.6:1 on blueprint).
- **Rule** (ink at 16%): section and row dividers. **Line Soft** (diazo at 40%): inner title-block dividers and link underlines. **Field Border** (ink at 50%): input and chip boundaries, which hold at least 3:1.
- **Danger** (#b42318; blueprint #ffa094): field errors only.
- **Warm White** (#fff6f0): lettering on the inverse button, which sits on the orange field.

### Named Rules
**The Safety Orange Rule.** Orange means "act here" or "this was marked". It is never a background tint, a divider or decoration. The only orange field on a page is the final call to action.

**The Two Prints Rule.** Every surface ships in both prints from the same markup. A colour is chosen by token (`--paper`, `--ink`, `--line`, `--action`), never hard-coded per theme.

## Typography

**Display Font:** Barlow Condensed (fallback Arial Narrow), self-hosted
**Body Font:** Barlow (fallback system sans), self-hosted
**Label/Mono Font:** Overpass Mono (fallback ui-monospace), self-hosted

**Character:** Barlow Condensed is the drafting hand: tall, compressed and engineered, like the lettering on a title block. Barlow is its readable sibling for running text. Overpass Mono is the annotation pen.

### Hierarchy
- **Display** (700, clamp(3.1rem → 6rem), 0.93): the page's one headline (h1). It never exceeds 6rem.
- **Headline** (700, clamp(2.5rem → 4.4rem), 0.96): section headings (h2), balanced, usually capped at 16–18ch.
- **Title** (600, clamp(1.55rem → 2.1rem), 1.04): sub-sections such as methodology levels and package names.
- **Price** (700 condensed, lining tabular figures): prices read as the key dimension on a sheet, from 1.9rem in the schedule to 3.25rem on the package sheets.
- **Lead** (400, clamp(1.15rem → 1.3rem), 1.55, graphite, max 36em): the paragraph under a headline.
- **Body** (400, 1.0625rem, 1.6): running text, with a measure of 65ch where it runs long.
- **Label** (mono 400, 0.75rem, 0.06em, uppercase): sheet numbers in the header, package marks, case-study tag lines.
- **Annotation** (mono 400, 0.6875rem, 0.08em, uppercase): title-block field labels, schedule headers, view-title notes and nav sheet numbers.

### Named Rules
**The Annotation Rule.** Overpass Mono is reserved for annotation: dimensions, figures, sheet numbers, title-block field labels, schedule headers, scale notes and package marks. Headings, body, buttons and stamps never use mono.

**The Lettering Rule.** Anything lettered for display (headings, view titles, stamps, prices) is set in Barlow Condensed. Tracking never goes tighter than -0.012em on display sizes.

## Layout

- **Container:** one centred column, `min(100% − 2 × gutter, 1320px)`.
- **Gutter:** clamp(1.25rem, 5vw, 4.5rem).
- **Sections:** vertical padding of clamp(5rem, 4rem + 6vw, 9rem), separated by a full-width 1px rule.
- **Grid:** desktop compositions sit on a 12-column grid. Typical splits are a 5/7 hero (text left, drawing right), a 6 + 5 heading/lead pair offset to columns 8–12, and a 7/5 drawing-plus-text case study whose drawing is sticky on large screens. Case studies alternate sides.
- **Breakpoints:** Tailwind's sm 640, md 768, lg 1024 and xl 1280. The schedule becomes a table at md, the nav goes horizontal at lg, and the nav shows sheet numbers at xl.
- **Phones:** everything stacks in reading order, hero buttons go full width, the schedule becomes a ruled list, and the menu becomes a full-screen sheet index.
- **Safe areas:** the header and the sheet index pad with `env(safe-area-inset-*)`, and full-height surfaces use svh.
- **Ground:** the body carries the drafting grid (24px minor, 120px major). The footer's title block sits on plain paper.

## Elevation & Depth

The system is flat. Depth comes from linework weight (1px rule, 1.5px frame, 2px emphasis) and from the two paper tones, never from shadows on containers. The single shadow belongs to the photographic cut-out of the builder, which stands on a drawn ground line.

### Shadow Vocabulary
- **Figure shadow** (`filter: drop-shadow(0 18px 24px var(--figure-shadow))`; ink at 18%, or black at 35% on blueprint): only under the alpha-matted portrait.

### Named Rules
**The Hairline Rule.** Containers are defined by rules and linework, never by a shadow and never by a border-plus-shadow. A frame is a 1.5px diazo line; a divider is a 1px rule.

## Shapes

- Corners are 2px everywhere: buttons, fields, chips, frames.
- Stamps are 3px and rotated −3°.
- Callout bubbles and view numbers are full circles.
- The revision cloud is a measured scalloped path (14px arcs).
- Hatching marks sections: dots for below grade, cross-hatch, diagonal and vertical for the levels above.
- Illustrations are geometric linework (wireframes, dimension lines, building sections) drawn with `pathLength=1` so they can plot. They are never sketch-style scenes.

## Components

### Buttons
Engineered and immediate.
- **Shape:** squared, 2px corners; 3.25rem tall, or 3.75rem for large (`btn-lg`).
- **Primary:** safety orange with ink lettering in Barlow 600. On hover (fine pointers only) it deepens to safety orange deep.
- **Secondary:** a 1.5px ink outline on paper. On hover it fills with ink and the lettering turns to paper.
- **Inverse:** ink with warm-white lettering, used on the orange field.
- **Press:** scale(0.97) over 160ms ease-out. The trailing arrow nudges 3px on hover. External links add an up-right arrow and open in a new tab.

### Text links
Ink, weight 600, underlined in line-soft at a 0.22em offset. On hover the underline turns orange.

### Chips (choice)
- **Style:** radio inputs drawn as 2.75rem chips with a 1.5px field-border on paper.
- **State:** selected chips fill with diazo blue and paper lettering. Hover darkens the border to graphite, and invalid groups take the danger border.

### Inputs / Fields
- **Style:** a 1.5px field-border (at least 3:1), paper ground, 2px corners and 16px text so phones never zoom.
- **Focus:** the border shifts to diazo blue and the global 2px orange focus ring sits 3px out.
- **Error:** a danger border with an error message linked through `aria-describedby`. On submit, the first invalid field takes focus.

### Navigation
- **Desktop (lg+):** the sheet index across the top. Links are Barlow 500 in graphite and turn ink on hover. The current page gets a 2px orange underline. From xl each link carries its sheet number in mono.
- **Toggle and CTA:** the print toggle ("Blue print" / "White print" with a swatch) and the orange primary CTA sit at the right.
- **On scroll:** the header hides when scrolling down and returns when scrolling up.
- **Phone:** a "Menu" button opens a full-screen sheet index that drops in on the drawer curve (380ms) or fades with reduced motion. It holds sheet numbers with display-size links and a full-width CTA. Focus is trapped, Escape closes it, and focus returns to the opener.

### Title block (signature)
- **Structure:** a 1.5px diazo frame on paper with cells divided by line-soft rules. Each cell has a mono uppercase field label over a 600-weight value.
- **Where it appears:** under the hero (with the circular seal portrait), in page headers, on the contact aside, and as the footer of every sheet. The footer's last cell shows the current sheet number in display lettering.

### Callouts and view titles (signature)
- **Keynotes:** outlined circles in diazo blue.
- **View numbers:** solid diazo discs, so they never read as keynotes.
- **View title:** an uppercase condensed title on a 2px rule, with a mono scale or reference note below.

### Stamps
Condensed bold uppercase in stamp orange inside a 2px frame, rotated −3°. On the orange field they are inked in action ink. Stamps mark a state: Recommended, Fixed price · in writing, Ready to build.

### Schedule
The package schedule is a table with a 2px ink top rule, mono column headers, ruled rows, right-aligned condensed prices and no-wrap action links. On phones it becomes a ruled list with the mark on the name's line.

### Plot, then build (signature motion)
Linework strokes draw themselves (1100ms, ease-in-out, staggered by `--d`), then fills wipe in with clip-path (700ms, ease-out, default delay 900ms), then labels appear (500ms). It starts when the drawing scrolls into view. Content never waits on it, and with reduced motion every drawing is simply finished.

## Do's and Don'ts

### Do:
- **Do** take every colour from the token pair so both prints stay correct (`--paper`, `--ink`, `--ink-2`, `--line`, `--action`, `--action-text`).
- **Do** letter display text, stamps and prices in Barlow Condensed, and keep Overpass Mono for annotation (dimensions, figures, sheet numbers, field labels).
- **Do** frame grouped facts as a title block, list sequences as numbered callouts, and present comparisons as a schedule.
- **Do** keep UI motion under 300ms on ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`), animate only transform, opacity and clip-path, and gate hover effects behind `(hover: hover) and (pointer: fine)`.
- **Do** use stamp orange (#c2410c) for any orange lettering smaller than 24px on whiteprint.

### Don't:
- **Don't** use a dark page with one neon accent, glow orbs, or a grid of equal floating cards.
- **Don't** put a kicker or eyebrow label above a heading; marks and numbers sit on the heading's line or in their own column.
- **Don't** add shadows to containers, or pair a border with a shadow; the portrait cut-out is the only shadow.
- **Don't** use orange as decoration, as a tint, or for body text.
- **Don't** draw sketch-style illustrations; drawings are crisp geometric linework.
- **Don't** set headings, buttons or stamps in mono.
