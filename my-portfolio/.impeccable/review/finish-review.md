# Finish review: drawing-set redesign (all routes)

Run inline (no subagent capability in this harness), per `reference/degraded/finish-reviewer.md`.
Evidence: `desktop.png`, `mobile.png` (+ `-dark` variants) of `/`, full page, reduced motion so drawings show finished; route captures for `/work`, `/pricing`, `/about`, `/contact` and 404 from the build's second inspection round. Code-led build: no approved comp, no QUALITY BAR card (concept roll ran degraded), detector clean (one advisory waived in place: the drafting grid is the world's ground).

## Review round

disposition: fix

### persistence
pass. PRODUCT.md present; surface brief carries the direction contract; code-led, so no comp round or build state applies; DESIGN.md is written after this review (new world).

### fidelity
- TYPE: match. Self-hosted Barlow Condensed lettering, Barlow text.
- MATERIAL: match. Crisp vector linework is the world's own medium; the builder figure is a real photo with a derived alpha matte; no faked physicality.
- GROUND: match. Whiteprint paper #f1f4f6 reads cool; blueprint #0d2c4d reads Prussian blue, not blue-black slate.
- Hero plan with four keynotes, dimension lines, view title: match.
- Plot, then build: match in code (captures are reduced motion by design).
- Sheet numbers, title blocks, callout bubbles, revision cloud, schedule, general notes: match.
- Navigation as the sheet index: contradicted on desktop. The links carry no sheet numbers and read as an ordinary nav; only the phone menu is a sheet index.
- Title block at the bottom right of the first viewport: adaptation. The user's full lead copy and the 6rem headline fill a 900px viewport (PRODUCT.md: siteConfig is the source of truth), so a strip title block sits at the fold, and the footer's title block puts the sheet number bottom right on every sheet.
- Projects as as-built drawings: adaptation. The surface brief records real screenshots as unresolved; the drawings are labelled as drawings.
- Template tiles: adaptation. They use live screenshots from a third-party service this sandbox cannot reach; the hatched fallback is what a failed load looks like.

### ceiling
No card was supplied. Native devices left unused: a sheet border with zone coordinates, a graphic scale bar or north arrow on the hero view, cross-sheet detail references between views, and a revision block in the title block.

### material_fixes
1. Floor, eyebrow ban: the package mark (P1–P4) sits above the package name on the /pricing sheets and the phone schedule. Set the mark on the name's line.
2. Verify, contrast: orange stamp lettering ("Recommended", "Fixed price · in writing") is about 3.1:1 on whiteprint paper. Give text-bearing marks a darker orange that reaches at least 4.5:1.
3. Verify, contrast: form-field and choice-chip borders are about 1.4:1 against the paper. Raise them to at least 3:1, derived from the ink.
4. OWN-WORLD, mono as costume: the stamps and the template fallback label are set in Overpass Mono. Letter the stamps in Barlow Condensed and the fallback in Barlow. Keep mono for annotation only (dimensions, figures, sheet numbers, field labels) and record that scope in DESIGN.md.
5. FIRST VIEWPORT: give each desktop nav link its sheet number where the width allows, so the navigation reads as the sheet index.

### keep
The self-plotting hero plan with its four keynotes, and the whiteprint/blueprint pair with safety orange kept for action.

## Verdict pass

Recaptured over the same `desktop.png` / `mobile.png` (+ `-dark`), plus `/pricing` and `/contact`.

### verdict
1. Package mark above the name: resolved. P1–P4 now sit on the name's line, on the /pricing sheets and in the phone schedule.
2. Orange stamp lettering contrast: resolved. Marks use `--action-text` (#c2410c, 4.7:1 on whiteprint; the blueprint keeps #ff6a2b at 4.9:1).
3. Field and chip borders: resolved. `--field-border` is 50% ink, about 3.2:1 on whiteprint and 4.2:1 on blueprint; hover darkens to ink-2.
4. Mono as costume: resolved in the build. Stamps are lettered in Barlow Condensed and the fallback label is in Barlow. The annotation-only scope for mono is recorded in DESIGN.md.
5. Sheet-index navigation: resolved. Desktop links carry their sheet numbers from 1280px up; the header holds one row from 1024 to 1920px.

No regressions: the header stays one row at every measured width, nothing scrolls horizontally at 390px, and the interaction checks pass 20/20.

### remaining
clear

disposition: ship (this covers the five scored fixes)
