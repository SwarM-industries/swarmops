# research-deck

Internal slide deck presenting the market, fleet and competitive research to the team.
**Not the investor deck** — that is `Fabelino-Presentatsiya/`, and not the business documents —
those are `business/`.

Open `index.html` directly in a browser. One self-contained file: no build step, no dependencies,
no network. It works offline, which is deliberate — the same constraint the product has to meet
(`onprem_deployment.md`).

## Presenting it

| Key | Does |
|---|---|
| `→` `↓` `space` `PgDn` | next slide |
| `←` `↑` `PgUp` | previous |
| `Home` / `End` | first / last |
| `d` | toggle dark mode — use it in a dark room, the palette is validated for both |
| **Tables** button | opens every chart's underlying numbers as plain tables, in a new tab |

18 slides, ~17 minutes at a normal pace.

## Where the numbers come from

Every figure traces to the research documents. Change a number **there first**, then here.

| Slide | Source document |
|---|---|
| 3, 4 — fleet composition, vendor share | `business/SwarmOps_Israel_Drone_Landscape.md` §1.1, §4 |
| 5 — agency spend | same, §1.1 |
| 6 — defense procurement | `business/SwarmOps_Drone_Fact_Pack.md` §1.2 |
| 7 — observed growth | derived from slides 5 and 6 plus `SwarmOps_Competitive_Battlecard.md` §1 |
| 8 — growth gaps | `business/SwarmOps_Market_Sizing.md` §2.1, §2.3, §9 |
| 9 — fleet size bands | `business/SwarmOps_Drone_Fact_Pack.md` §1.3 |
| 10, 11, 15 — competitors | `business/SwarmOps_Competitive_Battlecard.md` §1, `SwarmOps_Competitor_eyesAtop.md` |
| 12 — TAM | `business/SwarmOps_Market_Sizing.md` §2.1, §9.1 |
| 13, 14 — layers, fleet shapes | `business/SwarmOps_Positioning_and_Pitch.md` §3, `Battlecard` §3.6 |
| 16 — the four observers | `business/SwarmOps_Competitor_eyesAtop.md` §5 |
| 17, 18 — insights and next steps | `business/SwarmOps_Positioning_and_Pitch.md` §9 |

**All chart data lives in one `DATA` object** at the top of the `<script>` block. Edit there and
every chart follows — do not hand-edit numbers into the SVG code.

## Rules the deck follows — do not break them when editing

These come from `business/_render/README.md` and the source discipline in the research documents.

1. **Models are not airframes.** Every model count says "models" on the slide. The donut on slide 4
   is a share of *models*, not of aircraft or of market — it is labelled that way and must stay so.
2. **Modelled numbers are drawn as bands, never bars.** Slide 9 uses range marks with end-caps for
   exactly this reason: a bar turns an estimate into a measurement.
3. **The 100,000-drone figure is a stated ambition**, drawn dashed and labelled as such — in both
   slide 6 and the growth chart. It is not an inventory, and no IDF airframe count is public.
4. **Slide 7 compares different quantities.** Spend, revenue, agency count and airframes share one
   axis only because a *growth multiple* is the one unit they all have. Every row states what it
   measures and over what period, and the note says to read the labels rather than the lengths
   against each other. **Do not add a row without that label**, and do not re-title the axis as
   anything other than a multiple.
5. **The four-observer finding stays bounded.** Four people, one force, dates and roles stated.
   Never "the IDF has no coordination system."
6. **Nothing classified.** If it is not in an open source it does not go in this deck.
7. **The fleet is simulated** wherever our own capability is shown.

## Design

Inherits the Swiss Signal tokens from `PITCH_DESIGN.md` — `--paper`, `--ink`, `--muted`, `--hair`,
`--accent` — so this deck and the pitch deck read as the same company. Type is a system Helvetica
stack rather than a webfont, so nothing silently falls back when offline.

Chart colours are the validated categorical palette from the `dataviz` skill, not chosen by eye.
Both modes pass every gate — lightness band, chroma floor, colour-blind separation, normal-vision
separation — on the paper surface (`#f4f2ee`) and the dark surface (`#1a1a19`). Light mode carries
a contrast warning on three of the hues, which is why **every mark on every chart is directly
labelled**; that is the required relief, not a stylistic choice. If you add a series, re-run:

```
node scripts/validate_palette.js "<hex,hex,…>" --mode light --surface "#f4f2ee"
```
