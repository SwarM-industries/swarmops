# SwarmOps — Pitch Site

A single-page pitch/presentation site for **SwarmOps** (drone fleet mission planning & route
optimization). This is the pitch deck, not the actual application — content is sourced from
`../SwarmOps_PRD.md`.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/ — deployable to Vercel/Netlify/GitHub Pages as-is
```

No backend, no env vars — it's a static React/Vite bundle.

## Stack

React + Vite + Tailwind CSS v4 (via `@tailwindcss/vite`, zero-config). Plain CSS custom
properties for the color system, no component library, no animation library — all scroll
reveals and marker motion are hand-rolled (`IntersectionObserver` + a small `requestAnimationFrame`-adjacent
interval hook), so there's nothing to configure to make it feel alive.

## Design decisions worth knowing about

- **Dark-only, not dark-mode-toggle.** The product story (fleet ops, telemetry, canary deploys)
  reads as an ops tool — permanent dark theme fits that and avoids designing two palettes.
- **Palette kept to 3 accents on a near-black base:** cyan (primary / "flying" / live-data),
  violet (secondary / gateway / brand), amber (attention / low-battery / canary extension) — plus
  a muted slate for "idle" and a green reserved only for "complete"/success states. Everything
  else is grayscale.
- **Fonts:** Inter for text, JetBrains Mono for anything that reads as an identifier, path, or
  status value (service names, API routes, field types) — a cheap but effective way to make the
  technical content visually distinct from prose without extra components.
- **Live fleet map is simulated, not Leaflet.** The PRD's own open question (§10) flags this
  trade-off; I built an abstract SVG grid rather than a real-world map, since the pitch needs a
  fleet map that *feels alive* (animated markers, routes, no-fly zones), not real geodata. All
  positions/routes are fake, deterministic, and loop forever via `pointOnLoop()`
  (`src/lib/geometry.js`) — no timers to break, no backend to run.
- **Architecture diagram connectors are computed, not hand-placed.** `useConnectors`
  (`src/hooks/useConnectors.js`) measures actual DOM box positions and draws SVG arrows between
  them, recomputing on resize. Service order in the diagram (`src/components/Architecture.jsx`)
  is deliberately telemetry → planning → notification left-to-right so the message-bus arrows
  read as a straight chain instead of crossing over other service boxes.
- **Algorithm section shows all 5 PRD phases**, not the 4-stage gloss in the build brief — the
  PRD (§4.2) is the source of truth and battery-aware feasibility is its own distinct phase
  worth a beat on its own.
- **Scroll reveals are deliberately restrained:** one fade+rise pattern (`.reveal` in
  `index.css`), staggered by a small per-item delay — no per-section novelty animations, so nothing
  competes with the content during a live pitch.

## Structure

```
src/
  components/     one file per section (Hero, Architecture, Algorithm, LiveMap, ...)
  hooks/          useReveal (scroll-in), useConnectors (diagram arrows), useNow (map clock)
  lib/            mapData.js (fake fleet/mission data), geometry.js (route interpolation)
```
