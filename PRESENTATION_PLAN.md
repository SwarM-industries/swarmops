# SwarmOps capstone-defense deck (frontend-slides)

## Context

Capstone hits M10 (demo prep). Need a defense deck. `site/` is a scrolling pitch page for
non-technical stakeholders — wrong format and wrong audience for examiners. This produces a
separate, self-contained HTML slide deck via the `frontend-slides` skill.

**Skill access note:** `frontend-slides@frontend-slides` is `false` in `~/.claude/settings.json`,
so the Skill tool cannot invoke it. Following `SKILL.md` directly from
`~/.claude/plugins/marketplaces/frontend-slides/`. Enabling the plugin would also work.

## Decisions locked

| | |
|---|---|
| Purpose | Capstone defense |
| Length | Medium, ~16 slides |
| Emphasis | **Platform/DevOps-heavy**, with a real optimizer section (not one token slide) |
| Vibe | Impressed/Confident + Inspired/Moved |
| Inline editing | Yes — press `E`, click text, localStorage autosave, export |
| Style | **LOCKED — `style-g.html` r5, "Stealth Dossier"** (see below) |

## Style previews (round 2, awaiting pick)

Round 1 (Bold Signal / Electric Studio / Dark Botanical, straight from the skill's preset list)
was rejected — not technical enough, wanted **defense-tech**. Deleted. Round 2 is custom, not
preset-derived, all three opened in browser from `.claude-design/slide-previews/`:

- **style-d.html — Tactical HUD.** Chakra Petch + Share Tech Mono on `#04070a`. Phosphor green
  `#00ff9c` with amber caution, rotating radar sweep, crosshair grid, scanline overlay, corner
  brackets, blinking link-status rail, `clip-path` cut-in text. Most overtly targeting-overlay.
- **style-e.html — Mission Control.** Oxanium + JetBrains Mono on `#0a0e14`. Framed console
  modules with corner ticks, amber `#ff9e00` + ice-blue `#59c2ff`, status-LED header, animated
  gauge fills, scrolling telemetry ticker. Most information-dense — closest to a real flight-ops
  console, and the format that best carries dense architecture/pipeline slides.
- **style-f.html — Recon Dossier.** Big Shoulders Display + Space Mono on olive-slate `#0c0f0d`.
  Classification banners top and bottom, stencil outline title, signal-red `#e0453a` stamp,
  CSS topo-contour backdrop, bordered dossier field boxes. Most briefing-document.

Round 2 verdict: **D and F both liked, E out.** Merged into `style-g.html`, then revised twice on
feedback — no red, lean dossier, then **stealth, kill the phosphor green**. Current r3:

- **style-g.html — Stealth Dossier.** Monochrome cold, nothing saturates and nothing glows.
  Big Shoulders Display (stencil condensed) + Share Tech Mono. Palette: matte `#08090b` field
  with two very low-alpha ice washes so the black is non-uniform, bone `#d6d8da` titles/numerals,
  gunmetal `#8c959e` accents, `#545c65` hairline rules, ice `#9db3c2` only at ≤4.5% alpha.
  The radar circle is **gone** — replaced by a faceted stealth-airframe wireframe (three
  `clip-path` polygons, hairline edges, ~40s near-static drift): angular, not radiant.
  Classification banners are hairline rules rather than filled bars. Surviving HUD signatures:
  corner brackets, a faint instrument grid, and a slow-breathing steel status dot.
  Dossier structure (file row, stencil title, field boxes, hairline `FIELD-TESTED` stamp) carries
  the identity.

r4 (current) added, on feedback that r3 read empty and plain:

- **Ice-blue signal reintroduced, rationed.** `--ice: #6fb0d8` appears only on live data — status
  dot, drone marks, active flight track, low-battery bar, title stroke, field-box left rules.
  Everything structural stays gunmetal. Nothing else saturates.
- **Two-column body.** Left is the dossier text. Right is an **instrument panel**: a hairline SVG
  sector plot (grid, dashed no-fly polygon, charging base, two crawling flight tracks with
  diamond waypoints and triangular drone marks) over a 5-row fleet readout with ID / status /
  battery bar.
- **Center density:** a tick-marked measure rule under the title, and the bottom banner became a
  two-part strip carrying the solver credit.
- Facets moved low-left so they never compete with the panel.

**Note:** this exceeds the skill's title-slide density limit (1 heading + 1 subtitle + tagline).
Deliberate, at explicit request. Viewport fitting still holds — panel hides below 860px wide, plot
hides below 600px tall, everything stays in `clamp()`.

r5 (current) filled the top and bottom edges, replacing the two thin classification lines:

- **Top:** a three-part unit rail — `SwarmOps · SwarM-Industries` / classification / live status
  chips (`● Link 200`, `Fleet 05/05`, `T+ 00:14:22`) — over a **section breadcrumb nav** with
  numbered sections and an active state, which will track position through the 16 slides.
- **Bottom:** a **16-tick sheet progress bar** (ice = current, gunmetal = seen) over a three-part
  footer rail — section subtitle / stack chips (`Solver Hungarian + OR-Tools`, `Bus RabbitMQ
  fanout`, `Tick 2s`) / `Sheet 01/16`.
- Both rails degrade by dropping chips in a fixed order (`nth-child` rules at 1000px wide,
  860px wide, 700px and 600px tall) rather than wrapping into extra rows — protects the
  100vh guarantee.

**r5 is locked.** The rails, breadcrumbs and tick bar become persistent chrome across all 16
sheets; the panel / sector-plot / readout-row components get reused on the architecture, pipeline
and metrics sheets.

## Slide outline (16)

Content comes from `SwarmOps_PRD.md`, `milestones.md`, `SERVICES.md`, `TALK_TRACK_GUY.md`,
`plan.md` — all real, nothing invented.

1. **Title** — SwarmOps, one-line what-it-is, capstone defense 2026.
2. **Problem** — PRD §1.1. A dispatcher past a handful of drones cannot hold battery + priority +
   payload + deadline simultaneously. Manual assignment strands drones.
3. **What it does** — auto-assign, battery-feasible routing, re-plan on events, live map.
4. **System shape** — CSS/SVG diagram of the 9 services + gateway + RabbitMQ + Mongo, from
   CLAUDE.md's ASCII architecture. Callout: gateway is the only exposed port.
5. **The core problem is VRPTW** — but capacity is battery, which depends on distance flown and
   payload weight, not a fixed number (PRD §4.1).
6. **Solver ladder** — greedy → Hungarian (`scipy.linear_sum_assignment`) → OR-Tools per-drone
   routing → battery feasibility w/ charging-stop insertion + no-fly-zone rejection → event-driven
   re-solve. Why Python here and nowhere else.
7. **Proof, not vibes** — the 3 real metrics from `src/routes/planning.py`:
   `planning_solve_duration_seconds`, `planning_conflict_rate`,
   `planning_assignment_quality_vs_greedy` (real matcher vs a real M1 greedy run, same input).
8. **Polyrepo, 13 repos** — why, plus `swarmops-contracts` as the anti-drift mechanism.
9. **Helm** — one parent chart, `range` + `_helpers.tpl` generating near-identical services,
   Bitnami Mongo + RabbitMQ as dependencies. `services:` list→map conversion and why (Helm
   replaces lists wholesale, deep-merges maps).
10. **Terraform / EKS** — TFC VCS-driven runs, remote state + locking. `infra/persistent`
    (ECR + OIDC role, `prevent_destroy`) vs `infra/cluster` (destroy between sessions). Driven by
    a real cost incident where a teardown took ECR with it — and the guard has since blocked a
    real destroy attempt.
11. **CI** — GitHub Actions per repo. PRs never touch the cluster. Pushes to `main`: version,
    OIDC to AWS (zero static keys), build, push to ECR, tag `<semver>-<7-char-hash>`, never
    `latest`.
12. **CD is a git commit** — `yq`-bump exactly one service's own image file in
    `swarmops-deployments`, Argo CD auto-sync + self-heal + prune. Nobody runs `helm upgrade`.
13. **Canary on the optimizer** — Argo Rollouts on `planning-service` only, 20%→analysis→50%→
    analysis→100%, `AnalysisTemplate` on error rate / p95 / p99 scoped to canary pods by
    pod-template-hash, auto-rollback. State the limitation out loud: no `trafficRouting` plugin,
    so it is a replica-split approximation, not weighted traffic.
14. **Observability** — `/metrics` on all 7 app services, `ServiceMonitor` per service,
    kube-prometheus-stack + Loki/Alloy as their own Argo CD Applications, SwarmOps Overview
    dashboard carrying the 3 algorithm metrics.
15. **Four bugs worth the slide** — (a) `telemetry_events` single shared queue would have
    round-robin-split messages across consumers instead of fanning out; (b) GitHub Free org plan
    cannot pass org-level Actions secrets to *private* repos — proved with an A/B public/private
    flip; (c) `raw.githubusercontent.com` 404 body is *valid YAML*, parsed to
    `{"404":"Not Found"}` and handed to `kubectl_manifest` as a manifest; (d) AWS LB controller's
    mutating webhook rejected Argo CD's Services before its own pod served.
16. **Honest gaps + what's next** — plaintext shared secrets in `values.yaml`; `GET /` 504s at
    the ALB (frontend ClusterIP datapath, pod healthy, zero non-probe requests in 40 min);
    gateway/frontend `/metrics` scrapes returning 499 continuously; `kubectl get applications -n
    argocd` still unconfirmed (Tony's access entry is View, CRDs not covered); Unity Stage 4
    two-machine setup not started.

**Assumption flagged:** slide 16 was not explicitly requested. `TALK_TRACK_GUY.md` argues these
are gaps to own rather than hide, and examiners will find the 504 the moment the URL is opened.
Say the word and it comes out.

## Density guardrails (skill hard rules)

- Every `.slide`: `height: 100vh; height: 100dvh; overflow: hidden`.
- All type/space in `clamp()`. Height breakpoints at 700/600/500px. `prefers-reduced-motion`.
- Never `-clamp()` — use `calc(-1 * clamp(...))`.
- Max 4–6 bullets or 6 grid cards per slide. Over budget → split, never scroll.
- Full `viewport-base.css` (153 lines) inlined verbatim.
- Fonts from Google/Fontshare. Inter is banned by the skill — the `site/` deck uses it, so the
  palette can be borrowed but the font cannot.

## Build steps (after style pick)

1. Read `html-template.md` + `animation-patterns.md`.
2. Write `presentation.html` — single file, inline CSS/JS, `viewport-base.css` in full,
   `/* === SECTION === */` comments, inline-edit mode included.
3. Slides 4 and 6 get CSS/SVG diagrams — no screenshots, no external images.
4. Delete `.claude-design/slide-previews/`.
5. `open presentation.html`, verify at 1280×720: no slide scrolls, no clipped text.
6. Offer Vercel deploy / PDF export (skill Phase 6). Not doing either unasked.

## Verification

- Every slide at 1280×720 and 1440×900: no internal scrollbar, nothing clipped.
- Arrow keys / space / scroll / nav dots all move one slide.
- `E` toggles edit mode, edit persists across reload, export writes a file.
- Cross-check every number on slides 7/10/13/16 against `milestones.md` and
  `TALK_TRACK_GUY.md` — no rounded-up or invented figures.
