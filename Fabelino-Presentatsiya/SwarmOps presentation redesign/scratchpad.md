# SwarmOps — Apple-keynote redesign

**Status: built and live.** 35 slides, deployed at <https://swarmops.tonyverin.dev>.

~15 min · 3 speakers: Guy (problem/idea/demo) → Tony (cloud + deployment) → Harel (monitoring,
security, close). Audience: industry + mixed + instructors. Real cluster numbers.

**Language:** slides are **English**, spoken script and `data-speaker-notes` are **Hebrew**.

> ⚠️ **Two things need a decision before rehearsing — see Open items.** Slides 16 and 17 are
> deliberate duplicates (pick one, delete the other), and `Speaker Script.dc.html` has not been
> renumbered for the three new slides yet.

## Files

| File | What it is |
|---|---|
| `SwarmOps Deck.dc.html` | The deck. 35 `<section>`s, the click-step engine, and the camera world. |
| `Speaker Script.dc.html` | Hebrew spoken script + timings. **Numbering is stale from slide 15 on.** |
| `deck-stage.js` | Fable's `<deck-stage>` web component (slide nav, 1920×1080 stage). Don't hand-edit. |
| `support.js` | Fable runtime shim. Don't hand-edit. |
| `assets/` | Images + video referenced by the deck (26 MB). |
| `uploads/` | Fable's raw upload dump. **Nothing references it** (37 MB dead weight). |
| `vercel.json` | Rewrites `/` → deck, `/script` → speaker script. |

## Running it

Local preview **needs an HTTP server** — `file://` breaks the module imports:

```
python3 -m http.server 8899      # then open http://localhost:8899/
```

Add `?v=2` (any query) when iterating — the browser caches the HTML aggressively and will
otherwise run the previous version of the camera code.

Deploy (linked to Vercel `swarmops-pitch`; `.vercel` is gitignored, so each person runs
`vercel link --project swarmops-pitch` once):

```
vercel --prod
```

## The camera world — slides 15–20

Slides 15–20 are not six separate diagrams. They are **six camera positions over one shared
architecture world**, so moving between them is a continuous flight rather than a cut.

- `_worldHTML(dense)` builds the world once per camera slide: account → region → VPC → two AZs →
  five nodes → pods, plus the managed-services column, the runtime-architecture graph, and the
  planning-service optimizer panel. World coordinate space is 5500×3800.
- The **runtime-architecture graph** (slide 19) is `architecture.drawio` diagram 2 rendered live:
  the same 10 nodes and 13 edges, including MongoDB annotated per service rather than as its own
  node. Boxes are absolutely placed inside the graph's own 3850×1000 space and the connector SVG
  is drawn in that same coordinate space, so a wire cannot drift away from its box. If you move a
  box, move its path — they are deliberately side by side in `_worldHTML` for that reason.
- `_setupCamera()` holds the `CAM` map — one entry per slide, naming a **target** (`data-w="vpc"`,
  `data-w="bus"`, …), a **depth**, and padding. Nothing is hardcoded in pixels: on first build the
  engine measures every `[data-w]` box and derives scale + translation to frame it. Move a box in
  the markup and the camera follows it.
- **Depth** is what makes the zoom mean something. Every `.lyr` carries `data-depth`; a slide shows
  layers at or below its own depth. Detail that does not exist at altitude — pod chips, queue
  names, optimizer stages — resolves in as you descend, with a blur-and-lift transition and a
  staggered delay so it arrives organically instead of popping.
- `dim: true` (Runtime Architecture, Optimizer) fades everything that is neither an ancestor nor a
  descendant of the target, so the focus reads immediately. Three CSS rules have to stay in this
  order to work: `.lyr.on` → `.world .dimmed` → `.world .lyr:not(.on)`. That is the precedence
  ladder *hidden beats dimmed beats revealed*; flip any two and either dimming silently stops
  working or unrevealed layers leak in at 30%.
- `oy` on a camera entry nudges the framing vertically — slide 19 uses it to sit the wide graph
  above the caption instead of behind it.
- Flight direction is automatic: entering a camera slide starts the world at the *previous* camera
  slide's transform, then transitions to its own. Backwards navigation flies back out.

Depth ladder: `0` frames · `1` nodes, subnets, stores · `2` pods, service graph, queues,
databases · `3` optimizer internals · `4` delivery pipeline (built, not yet used by any slide —
it's ready for a future "Commit to Cluster" camera slide).

Slides 19 and 20 carry a title-only caption on purpose: the graph and the numbered optimizer
stages *are* the content, and the clicks reveal those directly rather than a paragraph repeating
them.

## Slide order — as built

Speaker · slide · click-steps · script timing.

| # | Slide | Steps | Time |
|---|---|---|---|
| | **Guy — the mission (~6 min incl. demo)** | | |
| 01 | Title | — | 20s |
| 02 | The Team | — | 15s |
| 03 | § Guy (speaker card) | — | 10s |
| 04 | From the Field — *the one black slide, full-bleed photo* | — | 40s |
| 05 | The Problem | 3 | 30s |
| 06 | The Cost (+15% stat) | 5 | 25s |
| 07 | The Idea | — | 20s |
| 08 | Constraints (5 constraints → 1 plan) | 6 | 25s |
| 09 | Replanning | 3 | 25s |
| 10 | The Simulator (FPV + third-person video) | — | 20s |
| 11 | The Handoff (patrol video) | — | 20s |
| 12 | Live Demo (map) | — | 60–90s |
| | **Tony — the cloud (~5.5 min + ~60s of new material)** | | |
| 13 | § Tony | — | 10s |
| 14 | Six Services | 5 | 40s |
| 15 | Cloud Footprint 🎥 *camera: whole account* | — | 30s |
| 16 | Inside the Cluster 🎥 *camera: VPC, depth 1* | 3 | 30s |
| 17 | Inside the Cluster · Dense 🎥 **VARIANT — pick one of 16/17** | 3 | 30s |
| 18 | The Network 🎥 *camera: the edge* | 3 | 30s |
| 19 | Runtime Architecture 🎥 **new** *camera: service graph, depth 2* | 4 | ~30s |
| 20 | The Optimizer 🎥 **new** *camera: planning internals, depth 3* | 5 | ~35s |
| 21 | By the Numbers (stat wall) | 6 | 25s |
| 22 | Commit to Cluster (GitOps pipeline) | 6 | 30s |
| 23 | GitOps in Production (Argo CD shot) | 1 | 20s |
| 24 | Zero Downtime (blue-green pods) | 2 | 25s |
| 25 | Canary Rollouts (native ladder) | 5 | 30s |
| 26 | Rollout Timeline (two shots) | 2 | 15s |
| 27 | Cost Engineering ($250 → $140 → $43) | 4 | 35s |
| | **Harel — operations & security (~3.5 min)** | | |
| 28 | § Harel | — | 10s |
| 29 | Monitoring (Grafana) | 1 | 20s |
| 30 | What We Measure (3 Grafana crops) | 3 | 25s |
| 31 | Security | 5 | 35s |
| 32 | Request Path | 3 | 30s |
| 33 | Self-Healing | 3 | 30s |
| 34 | Recap wall | 7 | 30s |
| 35 | Thank You | — | 10s |

Slides 22–27 were deliberately **left as they were**: they carry real Argo CD / pod / canary
screenshots, and that evidence is stronger than another diagram. The delivery lane is already
modelled in the world at depth 4 if we later want slide 22 to fly up to it.

## Click-step system

Steps live in the `STEPS` map inside `_setupBuilds()`. Keys are `data-label`, values are arrays of
CSS selectors; each entry is one click, and `'.d6,.d7'` reveals two elements on one click. A step
can reveal caption text *and* a piece of the world at once — that's what `.s-bus-*` and `.s-opt-*`
do on slides 19 and 20.

Right-arrow / space / click reveals the next group; once a slide is fully built the next input
advances the slide. **88 click-steps total, matching the 88 ▸ cues in the speaker notes exactly on
every slide** — verified. If you add a `.dN` element, add it to `STEPS` too or it shows immediately.

Camera slides 16–18 keep caption-only steps on purpose: their world elements are already on screen
from the previous slide's flight, so hiding them would make them blink out and back.

## Design system — as built

- **White base.** `#f5f5f7` on the non-camera slides, `#eef0f3` behind the camera world.
  `From the Field` (04) is the only `#000` slide.
- Text `#1d1d1f` on light / `#f5f5f7` on dark; gray `#86868b`; accent `#ff5f3c`.
- Gradient headline words: `#ffb340 → #ff5f3c → #ff375f`.
- System SF stack. Kicker 26px caps accent · title 84px/700 (72px on camera slides) · lede 36px
  gray · stat 130px gradient · captions ≥24px.
- Camera slides put text in a frosted `.cap` panel bottom-left and an altitude `.crumb` top-right.
- Region colours are consistent and load-bearing: teal region, purple VPC, olive public subnet,
  teal private subnet, green MongoDB, orange RabbitMQ, accent-orange optimizer.
- Animations gated on `[data-deck-active]`; `prefers-reduced-motion` disables both the camera
  flight and the layer reveal; print forces everything visible.

## Open items

- **Pick slide 16 or 17 and delete the other.** 16 shows each node with a summary (`13 pods ·
  4 service · 4 platform · 5 system`); 17 renders all 62 containers by name on the node running
  them. Same script text either way, so this is purely a taste call.
- **`Speaker Script.dc.html` is not renumbered** for slides 17/19/20 — it still describes the
  32-slide deck, and the Hebrew text for The Data Plane and The Optimizer exists only in the
  deck's `data-speaker-notes`. Worth doing *after* the 16/17 decision, since that changes the
  numbering again.
- **Is the frontend polling or WebSocket?** `architecture.drawio` contradicts itself: diagram 2
  says *"alerts — polled (3s), no WebSocket"* and diagram 12 agrees, but diagram 3 says *"frontend
  WebSocket push"* — and `CLAUDE.md`'s system shape says `HTTPS / WebSocket`. Slide 19 currently
  says **polled every 3s** (the majority and the more specific claim). Confirm before presenting;
  it's the kind of detail an instructor asks about.
- **Timing.** The two new slides add roughly 60–65s to Tony's section. Something has to give
  against the 15-minute total — most likely trimming the Live Demo or Cost Engineering.
- **Guy's field story (slide 04) is still a draft** — deck note is flagged
  *"להתאים לסיפור האמיתי"*. Needs Guy's real version.
- `Speaker Script.dc.html` slide 04 is truncated mid-sentence on the word "היינו"; the deck note is
  ahead of it.
- **`uploads/` (37 MB) is unreferenced** and ships on every deploy. Safe to delete.
- Unused assets: `canary_steps.png`, `drone2/3/4.jpeg`, `logo.png`.
- Camera framing is tuned for the full 1920×1080 stage. Check it in presentation mode, not in the
  editor with the thumbnail rail open — the rail crops the stage and makes framing look off-centre.
