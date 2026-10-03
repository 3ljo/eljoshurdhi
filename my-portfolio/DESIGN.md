---
name: Eljo Shurdhi — Issue 01
description: A freelance web studio site set as an issue of a street-culture magazine whose cover star is the person who builds your website.
colors:
  acid: "#f1fa18"
  signal: "#f80808"
  signal-ink: "#c20000"
  ink: "#0d0d0d"
  ink-2: "#3d3d3b"
  paper: "#fafafa"
  paper-2: "#efeeec"
  bright-white: "#ffffff"
  on-ink: "#f7f7f5"
  on-ink-2: "#b9b8b4"
  rule: "rgb(13 13 13 / 0.14)"
  rule-strong: "rgb(13 13 13 / 0.85)"
  rule-on-ink: "rgb(255 255 255 / 0.2)"
  cover-scrim: "rgb(0 0 0 / 0.55)"
  card-stock: "#fffff4"
  frame-black: "#1a1a1a"
  ink-hover: "#2a2a2a"
  acid-hover: "#fbff5c"
typography:
  nameplate:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(5.5rem, 31vw, 12rem)"
    fontWeight: 400
    lineHeight: 0.8
  cover-title:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, calc((100vw - 2 * var(--gutter)) / 6.95), 5.25rem)"
    fontWeight: 400
    lineHeight: 0.923
    letterSpacing: "0.006em"
  page-title:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(3.5rem, 1.5rem + 8vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.005em"
  display-xl:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(3.25rem, 1.5rem + 6.2vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.005em"
  display-lg:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 4.6vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.005em"
  display-md:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2.25rem, 1.3rem + 3.2vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.005em"
  cover-line:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 1.2rem + 2.4vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.005em"
  title:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.1vw, 2.2rem)"
    fontWeight: 400
    lineHeight: 1
  numeral:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 2rem + 3vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 0.82
  price:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2.25rem, 1.8rem + 1.4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
  folio:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1
  deck:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.05rem + 0.6vw, 1.6rem)"
    fontWeight: 800
    lineHeight: 1.3
  lead:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1rem + 0.45vw, 1.4rem)"
    fontWeight: 600
    lineHeight: 1.45
  body-strong:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 800
    lineHeight: 1.3
  body:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: 1.55
  button:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1.1
  body-sm:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 800
  caption:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 800
  label:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    letterSpacing: "0.12em"
  label-sm:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    letterSpacing: "0.14em"
rounded:
  square: "0px"
  focus: "2px"
  field: "8px"
  browser: "12px"
  block: "14px"
  phone: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 0.5rem + 2.4vw, 2.5rem)"
  item: "1.5rem"
  block: "clamp(2.5rem, 5vw, 4rem)"
  department: "clamp(4.5rem, 3rem + 6vw, 9rem)"
  page-max: "1680px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.4rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-acid:
    backgroundColor: "{colors.acid}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.4rem"
    height: "3rem"
  button-acid-hover:
    backgroundColor: "{colors.acid-hover}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-paper-hover:
    backgroundColor: "{colors.acid}"
  button-large:
    padding: "0.9rem 1.8rem"
    height: "3.6rem"
  button-cover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.block}"
    padding: "0 1.75rem"
    height: "3.75rem"
  chip-choice:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 1rem"
    height: "2.75rem"
  chip-choice-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.acid}"
  tag:
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.7rem"
  price-tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.acid}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.6rem"
  input-field:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.7rem 0.9rem"
    height: "3.1rem"
  running-head:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "3.75rem"
  contents-page:
    backgroundColor: "{colors.acid}"
    textColor: "{colors.ink}"
  department-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  department-acid:
    backgroundColor: "{colors.acid}"
    textColor: "{colors.ink}"
  department-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  department-pulp:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
  story-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.square}"
  story-acid:
    backgroundColor: "{colors.acid}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  story-red:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  story-paper:
    backgroundColor: "{colors.bright-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  browser-frame:
    backgroundColor: "{colors.frame-black}"
    rounded: "{rounded.browser}"
  phone-frame:
    backgroundColor: "{colors.frame-black}"
    rounded: "{rounded.phone}"
---

# Design System: Eljo Shurdhi — Issue 01

## Overview

**Creative North Star: "The Street Issue"**

The site is one issue of a street-culture magazine, and the person who builds your website is its cover star. Every client project is a cover story; every section is a department of the issue with its own full-bleed print field and a folio in its foot. The visitor opens the issue on an open spread: a living black-and-white portrait of Eljo on the left page, an acid-yellow offer page on the right, a red ELJO nameplate running down the photo's edge. From there the issue reads in order: cover stories, reader letters, the feature on how it works, the price list, what you can hold me to, the interview, and the back cover's call.

The material is flat print. Four inks (acid yellow, signal red, white newsprint, black ink) are laid down as solid fields, never as tints or glows, and colour comes from the field a thing is printed on rather than from decoration on top of it. Headlines are an ultra-heavy condensed grotesque in capitals, set tight and big; everything you read is a friendly, heavy-weighted sans. Photography is grainy, high-contrast street and editorial work: the people and the department plates are black-and-white, and a story plate may keep one natural colour. Density is magazine density: big type, long scrolls of full-bleed fields, hairline and heavy rules instead of boxes.

The thesis refuses two defaults by name: the dark-page, neon, glow-orb, equal-cards freelancer site, and the quiet white minimal portfolio. Black is one of the four inks and owns whole departments, but it is never the ground every section sits on, and no two cover stories share a colour.

**Key Characteristics:**
- Flat full-bleed print fields from four inks; one ink per cover story.
- Anton capitals for everything seen from across the room, Mulish 500–900 for everything read.
- Open two-page spreads on a single centre gutter from 1024px up; stacked pages below.
- Magazine apparatus as navigation and rhythm: running head, folios, numbered points, Q. and A., a contents page, a colophon.
- Square pages and plates; pills for actions and choices; rounded corners only on depicted devices and form controls.
- One authored motion: pages turn in from the spine; cover photos breathe as silent loops.

## Colors

Four printing inks, laid flat, with greys existing only as tints of the black ink for reading text, rules and the pulp page.

### Primary
- **Acid Yellow** (#f1fa18): the issue's signature field. The cover's offer page, the contents page, How it works, the page heads of inner pages, the reply card, the recommended package row, text selection, and every headline set on a black field. Black ink on it reads at 17:1.

### Secondary
- **Signal Red** (#f80808): the nameplate (ELJO on the cover and in the colophon), the short rule under every cover line, the nav underline, the focus ring on light grounds, and the red cover-story field (black ink on it, 4.65:1). A display and graphic ink: on newsprint it reaches only 4.0:1.
- **Proof Red** (#c20000): Signal Red's text cut, for red that must be read at reading size on light grounds: the Q. in the interview, the include ticks on the price list, the current page in the contents page, invalid field borders. 6.1:1 on newsprint, 5.6:1 on acid.

### Neutral
- **Press Black** (#0d0d0d): all reading text on light fields, every primary pill button, the black departments (Sound familiar, What you can hold me to), the colophon, the reply page's side, heavy rules (2–3px) between list items and stories.
- **Ink Wash** (#3d3d3b): secondary reading text on light fields (problems under package names, answers in the interview, muted notes). 9.5:1 on acid, 10.4:1 on newsprint.
- **White Newsprint** (#fafafa): the page ground: running head, cover stories, the price list, the plain departments, the browser's theme colour.
- **Pulp Grey** (#efeeec): the one off-white department (the interview) and the scrollbar track; a second paper stock, not a surface tint.
- **Bright White** (#ffffff): type laid over photographs (cover lines, back cover, 404) and the white-paper cover story, whiter than newsprint so the story reads as its own sheet.
- **Newsprint on Ink** (#f7f7f5) and **Grey on Ink** (#b9b8b4): reading text and secondary text on black fields (9.8:1 for the grey).
- **Rules** (`rule` 14% ink, `rule-strong` 85% ink, `rule-on-ink` 20% white): hairlines on light fields, the strong hairline under price rows and interview items, and hairlines on black fields.
- **Cover Scrim** (55% black): the start of the 160° scrim that sits in the top-left of every cover photo so a white cover line stays legible.
- **Card Stock** (#fffff4): the fill of form fields and choice chips on the yellow reply card, a warm white that reads as printed card, not as a UI input.
- **Frame Black** (#1a1a1a): the chrome of the browser and phone frames that hold real screenshots; lifted off Press Black so a frame never merges with a black page.
- **Button lifts** (`ink-hover` #2a2a2a, `acid-hover` #fbff5c): hover fills for the black and acid pills; the paper pill lifts to Acid Yellow.

### Named Rules
**The Four Inks Rule.** Every field is acid, signal red, newsprint or press black. Greys exist only as tints of the black ink for text and rules, plus one pulp stock. No fifth hue, no gradient fills, no tinted glass.

**The One Ink Per Story Rule.** Each cover story is printed on exactly one ink (`ink`, `acid`, `red` or `paper`, set by `tone` in the media map), and that ink carries from its card on the cover through its case spread on /work. Neighbouring stories never share an ink.

**The Two Reds Rule.** Signal Red is for fields, the nameplate, rules and focus; red text at reading size on a light ground is Proof Red.

## Typography

**Display Font:** Anton (with Arial Narrow, sans-serif), self-hosted, weight 400 only
**Body Font:** Mulish (with ui-sans-serif, system-ui, sans-serif), self-hosted at 500, 600, 700, 800 and 900

**Character:** A poster-weight condensed grotesque shouting in capitals, against a round, open sans that stays heavy (body at 500, emphasis at 800) so it holds its own on saturated fields. The pair reads as a street magazine: loud cover, plain-spoken copy.

### Hierarchy
- **Nameplate** (Anton 400, clamp(5.5rem, 31vw, 12rem), 0.8): ELJO, signal red, rotated up the left edge of the cover photo and stretched along its line; on the open spread it is measured in comp units (311u). The colophon repeats it as the footer mark.
- **Cover title** (Anton 400, fitted so "better websites." always fits its page, up to 5.25rem; 143u on the open spread; 0.923): the cover's one headline, four lines that rise into place.
- **Page title** (Anton 400, clamp(3.5rem, 1.5rem + 8vw, 8.5rem), 0.92): the h1 of each inner page (Real work. All live., Pricing).
- **Display XL / LG / MD** (Anton 400; clamp(3.25rem → 6rem), clamp(2.75rem → 5.25rem), clamp(2.25rem → 3.75rem); 0.92): department headlines, case-study names, and the reply card's title.
- **Cover line** (Anton 400, clamp(1.9rem, 1.2rem + 2.4vw, 3.25rem), 1.02): white capitals over a cover photo, two short lines and a red rule under them.
- **Title** (Anton 400, clamp(1.6rem, 1.2rem + 1.1vw, 2.2rem), 1): names of steps, promises you can hold me to, interview questions, template names.
- **Numeral** (Anton 400, clamp(3rem, 2rem + 3vw, 4.75rem), 0.82): the big numbers beside steps and the cover's three promises.
- **Price** (Anton 400, clamp(2.25rem, 1.8rem + 1.4vw, 3rem), 1, tabular): package prices.
- **Folio** (Anton 400, 1.1rem, 1): page numbers in the corners of the cover and every department.
- **Deck** (Mulish 800, clamp(1.25rem, 1.05rem + 0.6vw, 1.6rem), 1.3): the one-sentence outcome under a case study's name; max 34ch.
- **Lead** (Mulish 600, clamp(1.15rem, 1rem + 0.45vw, 1.4rem), 1.45): the paragraph beside a department headline; max 38ch.
- **Body strong** (Mulish 800, 1.1rem, 1.3): bold reading lines: who a package is for, the direct lines on the contact page, the cover's secondary link.
- **Body** (Mulish 500, 1.0625rem, 1.55): running text; 44–66ch.
- **Button** (Mulish 800, 1rem, 1.1): pill labels; 1.125rem on large pills.
- **Body small** (Mulish 800, 0.95rem) and **Caption** (Mulish 800, 0.85rem): "Before & after", choice chips, timeframes; tags, price notes, screenshot captions.
- **Label** (Mulish 800, 0.8125rem, 0.12em, uppercase): the running head title, field labels, case-study column heads, a story's project · niche line.
- **Label small** (Mulish 800, 0.75rem, 0.14em, uppercase): running folios, colophon headings, the Recommended tag.

### Named Rules
**The Two Faces Rule.** Anton for anything seen from across the room (headlines, cover lines, numerals, prices, folios), always in capitals at weight 400; Mulish for anything read. Anton never drops below folio size (1.1rem) and never sets a sentence of reading text.

**The Tight Stack Rule.** Display lines sit at 0.92 line-height or tighter and balance their wrap; the headline is a block of ink, not a paragraph.

## Layout

The issue is built from full-bleed horizontal fields, each a department with its own ink, stacked down the page and alternating so no two neighbours share a field (newsprint, black, acid, newsprint, black, pulp, then the photographic back cover). Inside a field, content sits in a wrap of at most 1680px with a fluid side gutter (clamp(1rem, 0.5rem + 2.4vw, 2.5rem)). Departments breathe at clamp(4.5rem, 3rem + 6vw, 9rem) top and bottom, blocks inside them step by clamp(2.5rem, 5vw, 4rem), and list items (letters, steps, promises, interview answers) are separated by rules with 1.5rem of padding rather than boxed.

From 1024px the issue opens into spreads: two pages on one centre gutter. The cover spread, the case studies on /work (photo page and story page, alternating sides), the inner page heads (text page and photo page), the reply page (black side page and yellow reply card), the feature spread in How it works, and every department head (headline left, lead right). Below 1024px (900–960px for the department heads and the feature) the pages stack, photo page first.

The cover spread and the cover-stories block are measured in comp units (`--u` = 1/2688 of the site's inline size, from a container query on the site wrapper), so from 1024px up the spread scales as one printed object, with page edges, a fold and its proportions intact. The spread takes a min-height, never a fixed height, so text the reader enlarges grows the page. On /work the photo page is sticky under the running head and one viewport tall, so the plate stays in view while its story is read.

The running head is sticky, hides as you scroll down past 420px, returns on scroll up or on focus, and gains a hairline once the page has scrolled. On phones it keeps Start My Project and gives way on the title and the menu label instead; the sections open as a full-screen acid contents page. The site ships one light scheme.

**Breakpoints:** below 600px (phone), 600–1023px (tablet, stacked cover held within the first screen), 1024px (the open spread, desktop nav, comp units, sticky plates), 1280px (cover stories four across).

### Named Rules
**The Centre Gutter Rule.** At 1024px and up, a section that pairs a picture with words is a two-page spread on one centre gutter; it never becomes a card grid with an image card and a text card.

**The Comp Unit Rule.** The cover spread is drawn in comp units and scales as one object; nothing inside it is sized in viewport units or fixed pixels of its own.

## Elevation & Depth

The issue is flat print. Fields, cards, stories, price rows and buttons carry no shadow; separation comes from a change of ink and from rules (hairline, 2px, 3px). Depth appears only where a physical object is depicted. The open spread has page edges stacked under it, the photo page darkens into the spine, the yellow page shades off the fold, and the right page lifts off the table with a soft shadow under its outer edge; stacked on phones, the photo page casts a short inset shadow onto the yellow page. Real screenshots sit in browser and phone frames with one soft drop shadow, because they depict devices. White cover lines carry a soft dark text shadow over the photo for legibility, never a glow.

### Shadow Vocabulary
- **Page lift** (`box-shadow: calc(var(--u) * 6) calc(var(--u) * 10) calc(var(--u) * 28) calc(var(--u) * -10) rgb(0 0 0 / 0.28)`): the cover's right page on the open spread only.
- **Device frame** (`box-shadow: 0 18px 40px -18px rgb(13 13 13 / 0.45)`; the phone at 0.5): browser and phone frames holding real screenshots.
- **Cover-line legibility** (`text-shadow: 0 2px 18px rgb(0 0 0 / 0.35)`): white Anton over photographs.
- **Running-head hairline** (`box-shadow: 0 1px 0 var(--rule)`): the sticky head once the page has scrolled.

### Named Rules
**The Printed Object Rule.** A shadow means a physical object: a page of the spread or a device holding a screenshot. Cards, buttons, sections and stories are printed flat and never lift.

## Shapes

Pages are square. Fields, photo plates, cover-story cards, case spreads, price rows and the contents page have hard 0px corners and full-bleed edges; the spread's form is a rectangle with a fold. Round forms are reserved for things a hand touches: every action and choice is a full pill (999px): buttons, choice chips, tags, the Recommended tag, the menu button, the video pause control. Form fields take gently rounded 8px corners, the reply card a softly cornered dashed outline, and the cover's own call to action is a rounded block (14px; 16u on the open spread) as printed on the approved cover. Device frames take the corners of the devices they depict: a 12px browser window, a 20px phone with a 14px screen. Small dots (the running head's separators, the browser's traffic lights) are circles. Focus rings take a 2px corner.

### Named Rules
**The Square Page Rule.** Anything that is a page, a plate or a story is square-cornered; rounding belongs only to pills, form controls and depicted devices.

## Components

### Buttons
Heavy, black, pill-shaped: a printed sticker you press.
- **Shape:** full pill (999px); minimum 3rem tall, 3.6rem for large.
- **Primary:** Press Black with newsprint lettering, Mulish 800 at 1rem, padding 0.7rem 1.4rem, an arrow after the label that nudges 3px right on hover.
- **Acid:** Acid Yellow with black lettering, for black fields and the back cover (and for non-recommended packages on the price list, where the recommended row is itself acid).
- **Paper:** newsprint with black lettering, used as jump links on an acid page head; lifts to acid on hover.
- **Cover block:** the cover's own Start My Project is a rounded block (14px), not a pill, 3.75rem tall, as printed.
- **Hover / Focus / Press:** hover only on fine pointers: black lifts to #2a2a2a, acid to #fbff5c, 200ms. Press scales to 0.97 in 160ms. Focus is a 3px Signal Red outline at 3px offset (Acid Yellow on black fields).
- **Text link:** Mulish 800, underlined at 0.12em with 0.28em offset; the underline turns Signal Red on hover and the trailing arrow moves up-right 2px.

### Chips and Tags
- **Choice chips** (the reply card's project type and budget): Card Stock pill, 2px black border, Mulish 800 at 0.95rem, 2.75rem tall. Selected is black with acid lettering; hover whitens the unselected chip; press scales to 0.97; an invalid group turns its borders Proof Red.
- **Tags** (what a case study was built with): outline pills in the current ink, 1.5px border, Mulish 800 at 0.85rem.
- **Recommended tag:** black pill, acid lettering, label small in capitals.

### Cover Stories
The issue's proof, one card per project.
- **Corner Style:** square.
- **Background:** the story's one ink (`ink` default, `acid`, `red`, or Bright White for `paper`, which adds a 2px black inset keyline to its meta strip).
- **Plate:** the cover photo full-bleed (16:10; the two lead stories 3.41:1 on the open spread), with an optional silent loop over it, a 160° scrim from the top-left, and the cover line in white Anton with a short Signal Red rule under it.
- **Meta strip:** project · niche in label capitals, "Before & after" with an arrow, and the outcome in body text at max 60ch.
- **Behaviour:** the card's one link is stretched over the whole card, and focus outlines the whole card (3px Signal Red, 4px offset). On hover the plate scales to 1.035, the red rule stretches to 1.8×, the arrow nudges. Cards turn in like pages as they reach the reader, 90ms apart.
- **Layout:** two lead stories side by side, then four more (two across from 700px, four across from 1280px).

### Inputs / Fields
- **Style:** Card Stock fill, 2px black border, 8px corners, 3.1rem tall, Mulish 600 at 1.0625rem; textareas at least 9.5rem and resizable. Labels sit above in label capitals.
- **Focus:** a 3px black outline at 2px offset, drawn separately from the invalid state so both can show at once.
- **Error:** Proof Red border with a 1px Proof Red ring, and a bold error line under the field; focus moves to the first invalid field.
- **The reply card:** the form sits on the acid page inside a dashed outline (2px, 55% ink) with a faint white wash, like a tear-off reply card.

### Navigation
- **Running head:** newsprint strip, 3.75rem tall (scaled to the comp's thin strip on the open spread). Left: ELJO · ISSUE 01 · TIRANA in label capitals with round dot separators. Right: section links in Mulish 700, the current or hovered one underlined by a 2px Signal Red rule that draws in from the left (240ms), then the black Start My Project pill.
- **Menu page (phones and tablets):** a full-screen acid page that wipes down from the top (420ms, drawer easing; a plain fade under reduced motion). Sections are listed in Anton capitals with two-digit folio numbers, separated by rules, the current page in Proof Red, and a full-width black pill at the foot. Focus is trapped inside and returns to the button on close.
- **Colophon:** a black footer with the ELJO nameplate in Signal Red, the direct line, links elsewhere and the issue's contents in newsprint, hovering to acid.

### The Open Spread (signature)
The cover. Left page: the full-bleed black-and-white portrait with a silent loop over it, the Signal Red ELJO nameplate rotated up its left edge. Right page: the acid offer page with the cover title, three numbered promises (Anton numerals beside Mulish 900 lines), the cover block button and a "See the work" text link, and folio 02 in the corner. On load, the photo page turns in from the spine, the portrait settles from 1.07 scale, the yellow page turns in after it, and the headline's four lines rise one after another 60ms apart.

### The Price List (signature)
A ruled schedule, not a card grid: a 3px black rule on top, each package a row (name and tag; who it is for and the problem; note, price and timeframe; the call) separated by strong hairlines, four columns from 1100px. The recommended package's row is printed acid, bleeding past the column to the gutter.

### Browser and Phone Frames (signature)
Real screenshots of live sites, never mockups. A Frame Black browser window (12px corners) with three grey dots and the site's host in its bar, the capture beneath, and a caption saying what it shows (the live site; the live app's login screen when the product sits behind sign-in). Long captures scroll inside the frame and are keyboard focusable. On wider screens a phone frame with the mobile capture overlaps the browser's lower right corner, and the caption keeps clear of it.

### Running Folios
Every department ends with "Eljo · Issue 01" in label-small capitals at its lower left and its page number in Anton at its lower right, at 70% of the field's ink: the issue's page furniture.

## Do's and Don'ts

### Do:
- **Do** print each department on one full-bleed field from the four inks and alternate fields down the page.
- **Do** give every cover story exactly one ink from the media map's `tone`, and carry it from the card to the case spread.
- **Do** set headlines, cover lines, numerals, prices and folios in Anton capitals at weight 400, line-height 0.92 or tighter, and everything read in Mulish at 500 or heavier.
- **Do** make Start My Project a black pill on light fields and an acid pill on black fields, with the arrow after the label.
- **Do** set red text at reading size in Proof Red (#c20000); keep Signal Red (#f80808) for fields, the nameplate, the rule under cover lines, nav underlines and focus.
- **Do** put white cover lines on photographs over the 160° scrim, with the short Signal Red rule beneath.
- **Do** separate items with rules (hairline, 2px or 3px) and padding instead of boxes.
- **Do** show real screenshots in the browser and phone frames and say in the caption exactly what the capture is.
- **Do** number things the way a magazine does: Anton numerals for steps and promises, two-digit folios, Q. and A. in the interview.
- **Do** keep motion to page turns, rising headlines and silent photo loops; under reduced motion, fade in 300ms and never load the loops.

### Don't:
- **Don't** make black the ground every section sits on, and don't build neon, glow orbs or a grid of equal cards: the thesis refuses the dark-page freelancer default by name.
- **Don't** fall back to a quiet white minimal portfolio either; newsprint is one field among four, not the whole site.
- **Don't** round cards, plates, pages, stories or price rows; rounding belongs to pills, form controls and depicted devices.
- **Don't** put a shadow on a card, button, section or story; shadows exist only on the spread's pages and the device frames.
- **Don't** use gradients as decoration; the only gradients are light on a physical page (the fold, page edges) and the scrim under cover lines.
- **Don't** set small red text in Signal Red on newsprint or acid (4.0:1 and 3.7:1).
- **Don't** stretch type horizontally anywhere but the nameplate and the cover title, where the stretch reproduces the printed cover.
- **Don't** set a small uppercase label above a headline as an eyebrow; a label names a field, a column or a story's niche, beside or below its subject.
