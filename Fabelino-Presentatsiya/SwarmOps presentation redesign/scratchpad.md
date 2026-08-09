# SwarmOps — Apple-keynote redesign

**Status: built and live.** 32 slides, full spoken script written, deployed at
<https://swarmops.tonyverin.dev>.

~15 min · 3 speakers: Guy (problem/idea/demo) → Tony (cloud + deployment) → Harel (monitoring,
security, close). Audience: industry + mixed + instructors. Real cluster numbers. Apple-style
recap wall before Thank You.

**Language:** slides are **English**, spoken script and `data-speaker-notes` are **Hebrew**.
(Earlier drafts of this file said "All English" — that only ever applied to the slides.)

## Files

| File | What it is |
|---|---|
| `SwarmOps Deck.dc.html` | The deck. 32 `<section>`s + inline `_setupBuilds()` click-step engine. |
| `Speaker Script.dc.html` | Full Hebrew spoken script, per-slide timings, ▸ click cues. |
| `deck-stage.js` | Fable's `<deck-stage>` web component (slide nav, 1920×1080 stage). Don't hand-edit. |
| `support.js` | Fable runtime shim. Don't hand-edit. |
| `assets/` | Images + video actually referenced by the deck (26 MB). |
| `uploads/` | Fable's raw upload dump. **Nothing references it** (37 MB dead weight). |
| `vercel.json` | Rewrites `/` → deck, `/script` → speaker script. |

## Running it

Local preview **needs an HTTP server** — `file://` breaks the module imports:

```
python3 -m http.server 8899      # then open http://localhost:8899/
```

Deploy (project already linked to Vercel `swarmops-pitch`, `.vercel` is gitignored so each
person runs `vercel link --project swarmops-pitch` once):

```
vercel --prod
```

## Slide order — as built

Speaker · slide · click-steps · script timing. **Steps** = how many click-reveals that slide has;
`—` means the slide lands whole.

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
| | **Tony — the cloud (~5.5 min)** | | |
| 13 | § Tony | — | 10s |
| 14 | Six Services | 5 | 40s |
| 15 | Cloud Footprint (account → region → VPC → 2 AZ) | — | 30s — *self-builds on timers, no clicks* |
| 16 | Inside the Cluster (EKS, 62 containers, 5 spot nodes) | 3 | 30s |
| 17 | The Network (one door in, one out, NAT ×1) | 3 | 30s |
| 18 | By the Numbers (stat wall) | 6 | 25s |
| 19 | Commit to Cluster (GitOps pipeline) | 6 | 30s |
| 20 | GitOps in Production (Argo CD shot) | 1 | 20s |
| 21 | Zero Downtime (blue-green pods) | 2 | 25s |
| 22 | Canary Rollouts (native ladder) | 5 | 30s |
| 23 | Rollout Timeline (two shots) | 2 | 15s |
| 24 | Cost Engineering ($250 → $140 → $43) | 4 | 35s |
| | **Harel — operations & security (~3.5 min)** | | |
| 25 | § Harel | — | 10s |
| 26 | Monitoring (Grafana) | 1 | 20s |
| 27 | What We Measure (3 Grafana crops) | 3 | 25s |
| 28 | Security | 5 | 35s |
| 29 | Request Path | 3 | 30s |
| 30 | Self-Healing | 3 | 30s |
| 31 | Recap wall | 7 | 30s |
| 32 | Thank You | — | 10s |

**Order note:** Cloud Footprint → Inside the Cluster → The Network. Inside the Cluster gets a
`dDeepZoom` entrance so it reads as zooming *into* the footprint from the slide before — moving
The Network back ahead of it would break that gag.

Five slides exist that the original 27-slide plan didn't have: `§ Guy`, `The Simulator`,
`The Handoff`, `Request Path`, `Self-Healing`.

## Click-step system

Steps are declared in one place — the `STEPS` map inside `_setupBuilds()` near the bottom of
`SwarmOps Deck.dc.html`. Keys are `data-label`, values are arrays of CSS selectors; each entry is
one click. `'.d6,.d7'` reveals two elements on a single click.

```js
'The Cost': ['.d2', '.d3', '.d4', '.d5', '.d6,.d7'],
```

Right-arrow / space / click reveals the next group; once a slide is fully built the next input
advances the slide. Going *backwards* lands on a fully-built slide. **76 click-steps total, and
they match the script's 76 ▸ cues exactly on every slide** — verified. If you add a `.dN` element
to a slide, add it to `STEPS` too or it will show up immediately instead of on cue.

## Design system — as built

- **White base.** `#f5f5f7` on 31 of 32 slides. `From the Field` (04) is the only `#000` slide.
  *(This is inverted from the original plan, which was black-base with white data slides.)*
- Text `#1d1d1f` on light / `#f5f5f7` on dark; gray `#86868b`; accent `#ff5f3c`.
- Gradient headline words: `#ffb340 → #ff5f3c → #ff375f`.
- System SF stack. Kicker 26px caps accent · title 84px/700 · lede 36px gray · stat 130px
  gradient · captions ≥24px.
- Animations gated on `[data-deck-active]` (`dIn`/`dZoom`/`dPop`/`dBar`/`dDeepZoom`) with `.d1`–`.d8`
  stagger; `prefers-reduced-motion` safe; print-safe (`@media print` forces everything visible).
- Diagrams are pure HTML chips/bars, no SVG, so they stay directly editable.

## Open items

- **Guy's field story (slide 04) is still a draft.** The deck's speaker note has full prose
  (night search, thermal drone, battery dies, "one operator, one drone") flagged
  *"להתאים לסיפור האמיתי"* — adapt to what actually happened. Needs Guy's real version.
- **`Speaker Script.dc.html` slide 04 is truncated** — it's still the bracketed placeholder and
  cuts off mid-sentence on the word "היינו". The deck note is ahead of it. The script file's own
  header promises both copies are identical, so this one needs syncing.
- Minor script↔note drift on slides 12, 24, 32 (stage directions present in one copy only).
  Harmless, but worth a pass if the script gets printed for rehearsal.
- **`uploads/` (37 MB) is unreferenced** and ships on every deploy. Safe to delete.
- Unused assets: `canary_steps.png` (Canary Rollouts went native-ladder-only), `drone2/3/4.jpeg`,
  `logo.png`.
- Videos dominate weight: `third-person.mp4` 12 MB, `fpv-feed.mp4` 8.4 MB, `patrol-demo.mp4` 2.8 MB.
