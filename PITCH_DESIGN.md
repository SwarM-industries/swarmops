# pitch.html: design handoff

Non-technical Hebrew (RTL) pitch deck for SwarmOps, presenting the team, the
problem, the idea, and the reality of building it. Single self-contained
HTML file, no build step, no dependencies beyond a Google Fonts link. Open
`pitch.html` directly in a browser.

This doc exists so someone other than Guy can pick up work on it without
re-deriving the design decisions from scratch. Read it before editing the
file, especially the sections on the animation system and the inline
editor. Both were rebuilt after real bugs; the reasoning behind the current
design is easy to accidentally undo if you don't know what it's protecting
against.

Separate deck: `presentation.html` (English, technical, for a developer
audience) is a different file with its own "Swiss Signal" design language
that this deck's typography is loosely modeled on (see below). Don't
conflate the two.

Archived, superseded versions live in `presentation-assets/archive/`
(`pitch-he.html`, `pitch-he-swiss.html`), earlier design directions kept
for reference only. `pitch.html` is the one in active use.

---

## 1. What this is, structurally

One HTML file. Inline `<style>`, inline `<script>`, 21 `<section class="slide">`
elements. Scroll-snap does the paging (native, no library); a small JS
controller adds keyboard/touch nav, a progress bar, nav dots, and an inline
text editor.

Every `.slide` is locked to exactly one viewport (`100vh`/`100dvh`) with
`overflow:hidden`. **Nothing inside a slide may ever need to scroll.** If
content doesn't fit, it gets shorter, not scrollable. This is the single
most important constraint in the whole file; everything else (clamp()
everywhere, the responsive breakpoints, the terse copy) exists to serve it.

```
<section class="slide">
  <div class="main">   ← content, centered, fills available space
  <div class="head">   ← number + wordmark bar, fixed height, pinned to the foot
</section>
```

`.main` is `grid-row:1`, `.head` is `grid-row:2`, both assigned explicitly.
**Do not remove either `grid-row` declaration.** `.head` is authored first
in the markup (so a screen reader announces the slide's identity before its
content), but sits in the second grid row. Without explicit row assignment,
auto-placement would put the first DOM child back in the first row and the
bar would jump back to the top.

---

## 2. Design tokens

```css
--paper:  #f4f2ee   /* ground */
--ink:    #111110   /* type, borders */
--muted:  #6d6c68   /* secondary type */
--hair:   #cfccc5   /* dividers, dashed placeholder borders */
--accent: #ff3300   /* the one signal color: emphasis, risk, motion */
--ok:     #2f6b3f   /* ONLY used as a status marker on the security sheet */

--font: 'Heebo', sans-serif   /* weights 300/400/500/700/900 loaded */
```

One family, two extremes of weight (900 for display, 300 to 400 for body).
Same discipline as `presentation.html`'s Swiss system, with one deliberate
change: **Heebo, not Archivo Black.** Archivo Black (what `presentation.html`
uses) has no Hebrew glyphs. Hebrew text set in it silently falls back to a
system font and the whole typographic identity is lost. Heebo covers Hebrew
and Latin in one family, so Hebrew copy and English service names (`auth`,
`MongoDB`, `Argo`) sit together without a second typeface. If you ever add a
font, check its Hebrew coverage first, not just how it looks in the Google
Fonts preview, which defaults to Latin sample text.

`--accent` is spent carefully: emphasis in headings, the risk border on
`.card.risk`, the moving pulse on diagram wires, the `TBD` tag on the
security sheet. `--ok` (green) appears in exactly one place, the `OK` tags
on slide 18, and nowhere else. Don't start using it as a second accent.

---

## 3. Component reference

| Class | Slide(s) | What it is |
|---|---|---|
| `.lockup` | 01 | Logo mark stacked over wordmark, tight gap so it reads as one unit |
| `.people` | 02 | 3-up grayscale photo grid, name + role under each |
| `.strip` | 03 | 4-up square color photo grid (field equipment photos) |
| `.cards` / `.card` / `.card.risk` | 04, 17, 19 | Bordered boxes; `.risk` is a red border for failure/danger items |
| `.figure` | 05, 06, 07, 08, 09, 10, 15 | Animated SVG flow diagrams, see §4 |
| `ul.points` / `li.st` + `.tagpill` | 09, 18 | Bulleted list; `.st` variant adds an `OK`/`TBD` status pill |
| `.slot` | 11, 12, 13, 16, 20 | Dashed placeholder frame for unfinished assets (video/screenshot/diagram) |

`.cards` defaults to 3 columns; add `.two` for a 2-column layout (defined in
CSS, not currently used by any slide).

Photo treatment is a deliberate signal, not just a style choice: `.people`
(the team) is grayscale, `.strip` (field equipment/telemetry) is left in
color. If you add more photos, decide which category they represent before
picking a treatment. Don't grayscale everything by default.

---

## 4. The animated diagrams (`.figure`)

Each `.figure` is an inline `<svg>` with:
- `<rect class="box">` / `.box-fill` / `.box-hot` / `.box-line-hot`: the node shapes (outline, filled black, filled red, red outline)
- `<path class="wire">`: the connecting lines, **always drawn solid**
- `<g class="node n1">` through `.n7`: wraps each node for the one-time fade-up-on-reveal, staggered by the `n1` to `n7` class (see the `.node` transition-delay rules)

### How the motion works (and how it used to be broken)

An earlier version animated wires "drawing themselves in" using
`stroke-dasharray` with one hardcoded value (520) shared by every path in
the deck. Any path longer than 520 units got silently truncated. No error,
the line just stopped short. The loop-back arrow on slide 10 (תוכנית →
משהו משתנה → תכנון מחדש → back to תוכנית) is 617 units long, so its final
leg never rendered and the arrowhead floated in space, disconnected from
anything. This is exactly the kind of bug that only shows up when someone
actually looks at the rendered slide, not something a structural check
would ever catch.

**Current approach, which cannot break this way:** wires are always solid
and correct with zero JavaScript. Motion is a separate decorative layer
added on top at runtime by `flowPulses()` (near the bottom of the `<script>`
block):

1. For each `.wire`, clone it and measure its actual length with
   `wire.getTotalLength()`. No hardcoded numbers anywhere.
2. Give the clone a short dash (roughly 28% of its own length, clamped to
   18 to 52px) and animate `stroke-dashoffset` from the dash length down to
   `-len`, a short highlight travelling the wire's full length.
3. `iterations: Infinity` is what makes every diagram loop forever, per
   your explicit request. Speed is normalized (`900 + len * 3.2` ms), so a
   long path doesn't crawl while a short one races.
4. `prefers-reduced-motion: reduce` short-circuits `flowPulses()` entirely:
   solid wires, zero motion, honoring the OS setting.

**If you add a new `.figure`:** just draw solid `.wire` paths with normal
SVG geometry (`M`/`H`/`V`/`L`/`C`, whatever the shape needs). You never touch
the animation system. It introspects the DOM at runtime and animates
whatever `.wire` paths it finds. There is no per-diagram configuration to
keep in sync, which is the whole point of this design.

### RTL + SVG `text-anchor` gotcha

On the cost slide (14), bar labels are right-aligned to a shared edge using
`text-anchor="end"`. In an RTL document, `text-anchor` resolves against
text direction, not the visual side you'd expect. Without an explicit
override, `"end"` anchors the *left* edge in this document, throwing labels
off-canvas entirely. Every edge-anchored `<text>` in that diagram carries
`style="direction:ltr"` to force the anchor to resolve against the physical
edge instead. If you add a diagram with edge-anchored SVG text, you need
this too. It's not automatic, and the failure mode (a label vanishing off
one side) is easy to miss in a quick preview if you're not looking for it.

---

## 5. Inline editor

Click any headline/body text on the live page to rewrite it in place (hover
the top-left corner or press `E` to toggle). `Ctrl+S` exports a clean copy
of the file with your edits baked in; `Ctrl+Shift+Del` clears saved edits if
something looks wrong.

### The bug this replaced

The previous version keyed saved edits by a flat running index across the
whole document (`'key-0'`, `'key-1'`, ...). That's fine until the deck's
structure changes, which it does constantly during active editing. After
slides were added, removed, or reordered, index `N` no longer pointed at
the same element it used to.

This actually happened during this project: after the deck was expanded
from 9 to 20 slides and then reverted back to 9, the browser's
`localStorage` still held edits keyed against the 20-slide layout.
Reloading the 9-slide version sprayed that stale text into whatever
elements happened to occupy those positions now (a team member's name ended
up rendered as a slide's readout label). It's a `localStorage` issue, not
something that shows up in the file's own git history. The bug lives in
whatever browser state happens to be sitting on the machine that opens the
file, which is exactly why it was confusing to diagnose from the symptom
alone.

### Current design

```js
const STORE = 'swarmops-pitch-v1';
const EDITABLE = 'h1, h2, .kicker, .lede, .note, .byline, .wordmark, '
               + '.points li, .card .h, .card .d, .p-name, .p-role, '
               + '.s-label, .s-note, .num';
```

Two independent fixes, both required:

1. **Keys are scoped per-slide.** `"4.2"` means "3rd editable element on
   the 5th slide", an index within that slide's own editable elements, not
   the whole document. An edit can never leak onto a different slide even
   if element counts shift elsewhere in the deck.
2. **A structural fingerprint travels with the saved data**:
   `slideCount + ':' + perSlideEditableCounts.join(',')`. On load, if the
   current deck's fingerprint doesn't match the saved one, the entire
   payload is discarded (with a `console.warn`) rather than partially
   applied. A structural edit invalidates old saves cleanly instead of
   corrupting silently.

If you add, remove, or reorder editable elements, old saved edits for that
slide (or all slides, since the fingerprint covers the whole deck) will be
discarded automatically. This is intended, not a bug. There's no migration
path for saved edits across structural changes, and there shouldn't be one;
a fresh fingerprint mismatch is much safer than a partial match.

`EDITABLE` is a plain CSS selector list. Extend it if you add a new text
class that should be editable. SVG `<text>` inside `.figure` diagrams is
**not** in `EDITABLE` and not editable live (contenteditable on SVG text is
unreliable cross-browser). Edit diagram labels by editing the file
directly.

`export()` strips `[contenteditable]` attributes and the generated `.pulse`
animation clones before serializing `outerHTML`, so the exported file is
clean authored markup, not markup plus a render's worth of scratch DOM. It
then re-attaches both if you were still mid-edit.

---

## 6. Slide map (21 slides)

Numbering appears in two places per slide that must stay in sync: the
visible `<span class="num">NN</span>` badge and the `<!-- NN · ... -->`
HTML comment above the section. Renumbering a slide means editing both.

| # | Hebrew title | Real content? | Notes |
|---|---|---|---|
| 01 | פתיחה | ✅ | Title/lockup slide |
| 02 | הצוות | ✅ | 3 team photos, army roles (not project roles): טוני = צלף, גיא = חובש קרבי, חילוץ והצלה, והראל = מפעיל טנק |
| 03 | הרקע | ✅ | 4 field-equipment photos, hinges into the problem slide |
| 04 | הבעיה | ✅ | 3 risk cards (PRD §1.1) |
| 05 | המחיר | ✅ | Cost-chain diagram plus a real assumption (roughly 15% wasted flight time) in the note |
| 06 | הרעיון | ✅ | Fleet plus missions, decides, flight plan |
| 07 | המערכת | ✅ | Service tree (PRD §3.1), real service names |
| 08 | הנתונים | ✅ | MongoDB explained via a 3-services-3-stores diagram |
| 09 | האילוצים | ✅ | 4 constraints converging (PRD §4.1, §6) |
| 10 | בזמן אמת | ✅ | Re-planning loop (PRD §1.2), the loop-back arrow that used to be broken |
| 11 | הסימולטור | ⬜ slot | Needs: Unity drone-operation video |
| 12 | הנראות | ⬜ slot | Needs: live-map screenshot |
| 13 | הענן | ⬜ slot | Needs: `architecture.drawio` page 13 export |
| 14 | העלות | ✅ | Real figures from `swarmops-infrastructure/COST_NOTES.md`: $250 to $140 to $10 |
| 15 | הפריסה | ✅ | Argo deploy-flow diagram |
| 16 | ניטור | ⬜ slot | Needs: `architecture.drawio` page 6 export |
| 17 | האתגרים | ✅ | 3 real bugs/incidents, risk-carded |
| 18 | אבטחה | ✅ | 3 `OK` rows plus 1 deliberately unanswered `TBD` (military-use data/regulatory question; do not fill this in with invented claims) |
| 19 | מה למדנו | ✅ | 3 lesson cards |
| 20 | מאחורי הקלעים | ⬜ slot | Needs: behind-the-scenes video |
| 21 | סיום | ✅ | Closing/thank-you |

**5 open `.slot` placeholders** (11, 12, 13, 16, 20). Dashed borders,
visually distinct from every other border in the deck on purpose, so an
unfinished slide is obvious even skimming past quickly. Fill by replacing
the `.slot` div's contents with real media; keep the same aspect-ratio
container (`.slot` is `16/9`) or adjust deliberately.

**Slide 18's `TBD` row is intentional**, not an oversight. It flags a real
open question (military-use data location, plus which drones are
authorized) that nobody on the team has an actual answer to yet. Don't
paper over it with a plausible-sounding but unverified claim. Leave it
`TBD` until there's a real answer, or explicitly ask whoever owns that
decision.

---

## 7. Working in the file safely

- **Never remove `overflow:hidden` from `.slide`**, and never add anything
  that could make a slide's content scroll. If new content doesn't fit,
  either shorten it or drop to a smaller responsive tier (see the
  `@media (max-height: ...)` blocks near the bottom of the `<style>`
  block). Don't reach for `overflow:auto`.
- **Font sizes are all `clamp()`.** Don't hardcode a `px`/`rem` value for
  anything user-facing; it'll look right on your screen and break on a
  different aspect ratio or window size.
- **No em dashes, anywhere**, in Hebrew or English copy in this deck. This
  is a standing style rule for this project, not specific to this file.
- **When adding a slide**, copy the closest existing slide's structure
  wholesale (head/main/reveal classes) rather than building a section from
  raw CSS. The responsive breakpoints and reveal-animation timing assume
  the standard class names.
- **Verify before you call it done.** Section count, `<span class="num">`
  sequence, HTML comment numbers, and em-dash count are all one-line
  `grep`/`sed` checks; run them after any structural edit rather than
  eyeballing the diff.
- **Open it in an actual browser after editing.** Structural checks (tag
  balance, numbering, no em dashes) catch a lot, but they cannot catch a
  visual bug like the two described in §4 and §5. Both shipped past
  "looks fine in the code" and were only caught from a screenshot.

---

## 8. Asset inventory

```
presentation-assets/
├── logo-mark.png          the icon (used throughout: .head .mark, .lockup)
├── logo.png                full lockup w/ wordmark (not referenced by pitch.html)
├── guy2.jpg                 team photo, tall source, cropped via object-position
├── tony.jpg                 team photo, native 3:4
├── valfish.jpg               team photo, native 3:4
├── drones/
│   ├── drone1.jpeg          Mavic 3 on the ground
│   ├── drone2.jpeg          controller screen, thermal/night
│   ├── drone3.jpeg          controller screen, daylight
│   └── drone4.jpeg          drone in-hand, night road
└── archive/                 superseded deck versions, reference only
    ├── pitch-he.html
    └── pitch-he-swiss.html
```

None of these are wired to a build step. They're referenced by relative
`src` paths directly, so the file only works with this exact directory
layout alongside it. If you move `pitch.html`, move `presentation-assets/`
with it.
