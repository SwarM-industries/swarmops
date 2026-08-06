# Pitch deck — remaining assets

`pitch.html` has 6 dashed placeholder slots left to fill, across 5 slides. Each
wants a different tool — don't reach for OBS for all of them.

| # | Slide | Wants | Tool | Notes |
|---|-------|-------|------|-------|
| 1a | 10 · הסימולטור (left box) | Video | **OBS** or `Win+G` | Drone's own camera feed (FPV) in the Unity simulator. 10–20s is enough. |
| 1b | 10 · הסימולטור (right box) | Video | **OBS** or `Win+G` | Third-person / external view of the same drone flying in Unity, ideally something reacting live (a re-route, an obstacle). |
| 2 | 11 · הנראות | Screenshot | `Win+Shift+S` | Live map from `swarmops-frontend`'s operational view. Still image, not video. |
| 3 | 12 · הענן | Diagram | **draw.io export** | `architecture.drawio`, page 13. Open in diagrams.net → that page → File → Export as → PNG/SVG. Don't screenshot the app window. |
| 4 | 15 · ניטור | Diagram | **draw.io export** | Same file, page 6. Same export method as above. |
| 5 | 19 · מאחורי הקלעים | Video | **OBS** or `Win+G` | Behind-the-scenes of building it — code, Grafana dashboards, an Argo CD rollout. Short clip. |

Slide 10 shows both simulator videos side by side (`.slots` — a 2-up dashed-box
row), so the two clips should be filmed as separate recordings, not one video
covering both angles.

## Once a file is ready

1. Drop it in `presentation-assets/` (same folder as the existing images).
2. Tell me the filename — I'll wire it into that slide's placeholder myself.

No need to touch `pitch.html` by hand for this.
