# Pitch deck — remaining assets

**The live deck is now `pitch_v2.html`.** `pitch.html` is frozen at the pre-screenshot version
(21 sheets) as a backup — don't edit it, and don't present from it.

`pitch_v2.html` has **no dashed placeholder slots left**. Everything the deck asks for has landed.
What follows is the record of what went where, plus the one optional item still open.

## Still open (optional)

| # | Slide | Wants | Tool | Notes |
|---|-------|-------|------|-------|
| 1 | 19 · מאחורי הקלעים | Video | **OBS** or `Win+G` | Behind-the-scenes of building it — code, a Grafana dashboard, an Argo CD rollout. Short clip. There is no slide for this yet; it would need one adding. Sheets 17–22 now cover the Argo CD and Grafana ground on their own, so this is a nice-to-have, not a gap. |

## Landed

| Slide | Asset |
|-------|-------|
| 10 · בפעולה | `videos/mission-demo.mp4` |
| 11 · בפעולה | `videos/patrol-demo.mp4` |
| 12 · הסימולטור | `videos/fpv-feed.mp4` + `videos/third-person.mp4` |
| 13 · הנראות | `screenshot/map_screenshot.png` |
| 17 · הפריסה | `screenshot/base_argo.png` — twice: the sync header cropped and legible, the full tree below it as texture |
| 18 · הפריסה | `screenshot/forntend_argo_blue-green.png` + `screenshot/frontend_argo_green.png` |
| 19 · הפריסה | `screenshot/canary_in_progress3.png`, cropped to the step ladder + summary |
| 20 · הפריסה | `screenshot/canary in progress2.png` + `screenshot/canary_final.png` |
| 21 · ניטור | `screenshot/grafana_dashboard.png`, whole |
| 22 · ניטור | `screenshot/grafana_dashboard.png` again, cropped to three panels |

The `architecture.drawio` page-6 export that slide 17 originally reserved a slot for was
**retired** — the real Grafana dashboard says the same thing and is evidence rather than
illustration. The AWS diagram (page 13) was never a screenshot; it is hand-drawn SVG on sheet 14.

## Once a file is ready

1. Drop it in `presentation-assets/` (same folder as the existing images).
2. Tell me the filename — I'll wire it into the deck myself.

No need to touch `pitch_v2.html` by hand for this. Worth knowing if you do: a screenshot of a
dashboard is never readable at the size a sheet can give it, so these get cropped in CSS rather
than shown whole — see the `SCREENSHOT CROPS` block in `pitch_v2.html` and the 2026-08-07 note in
`milestones.md`.
