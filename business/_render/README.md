# Rendering the business PDFs

Unlike the first pass (see `milestones.md`, 2026-08-12 note), these HTML templates
*are* committed — regenerating a PDF after editing the source `.md` doesn't require
rebuilding the template from scratch.

## Business Overview (multi-page, generated from markdown)

`wrap_overview.py` converts a marked-down overview body (via `npx marked`) into the
styled cover + section layout. It renders **both languages** — the optional 7th
argument is the language (`he`, the default, or `en`). Only `lang`/`dir` and the font
stack differ between them; every directional rule in the stylesheet uses CSS logical
properties (`border-inline-start`, `text-align: start`), so there is one stylesheet,
not two.

```bash
# Hebrew
npx -y marked ../SwarmOps_Business_Overview_HE.md > /tmp/overview_he_body.html
python3 wrap_overview.py /tmp/overview_he_body.html \
  ../../presentation-assets/logo-mark.png \
  overview_he.html "מסמך עסקי" "אוגוסט 2026" he

# English
npx -y marked ../SwarmOps_Business_Overview_EN.md > /tmp/overview_en_body.html
python3 wrap_overview.py /tmp/overview_en_body.html \
  ../../presentation-assets/logo-mark.png \
  overview_en.html "Business Document" "August 2026" en
```

The EN overview previously had no committed source at all — its PDF came from a
template that was never checked in. Rendering it through this path restyled it and it
came out 6 pages where the old one was 7; that is tighter styling, not lost content
(all nine sections verified present).

## One-Pagers (single page, hand-authored HTML — no markdown source)

`onepager_he.html` and `onepager_en.html` are authored directly (a one-pager's layout
doesn't map cleanly from flowing markdown). Edit them in place. **They are separate
sources, not a template + translation** — keep them in sync manually when content
changes, and re-render both.

The EN version is a mirror of the HE one with `dir="ltr"`, Inter instead of Heebo, and
slightly smaller type (English runs longer than Hebrew at the same point size). The
roadmap block sits in the left column in EN and the right column in HE — that's
deliberate, it's what keeps the two columns balanced in each language, not a drift.

The logo is embedded in both as a base64 `<img src="data:image/png;base64,...">` —
re-embed with:

```bash
base64 -i ../../presentation-assets/logo-mark.png
```

or copy the existing data URI across files:

```bash
python3 -c "import re; he=open('onepager_he.html').read(); print(re.search(r'src=\"(data:image/png;base64,[^\"]+)\"', he).group(1)[:60])"
```

## Rendering either HTML file to PDF

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf=../SwarmOps_Business_Overview_HE.pdf \
  --no-pdf-header-footer --virtual-time-budget=8000 \
  "file://$(pwd)/overview_he.html"
```

Swap the input/output filenames for the one-pager. Verify page count with:

```bash
python3 -c "import re; print(len(re.findall(rb'/Type\s*/Page[^s]', open('FILE.pdf','rb').read())))"
```

Both one-pagers must stay at 1 page — if content overflows, tighten the HTML (font
sizes, list items) rather than letting Chrome spill to a second page.

## Audience rule for the one-pagers

The one-pagers go to investors, incubators and college leadership — **not** to engineers.
Keep implementation detail out: no Terraform, Argo CD, EKS, GitOps, Kubernetes, OR-Tools,
Hungarian algorithm, microservice counts. Say "secure, distributed and scalable cloud
infrastructure" instead. Terms that *do* stay, in English rather than transliterated into
Hebrew, because they read as domain fluency to this audience: `AWS`, `MAVLink`, `VRPTW`,
`PoC`, `Pre-Seed`, `Seed`, `Multi-Tenant`, `BVLOS`, `Accelerator`, `Enterprise`.

The fuller business overview (`SwarmOps_Business_Overview_*.md`) is the document that may
carry architecture detail — that split is intentional.

## The 7 October account — do not reword into a capability claim

The origin story in the one-pagers (`.origin` block) and in both overviews' §2 ends on
**intent**: `זו הבעיה ש-SwarmOps נבנתה כדי לפתור` / "that is the problem SwarmOps was built
to solve". That ending is deliberate and load-bearing.

The failure it describes — two teams, no shared picture — is the *cross-unit* operational
picture, which `SwarmOps_UseCases.md` row 2.2 correctly tags **Phase 3, not built**. What
exists today is a unified live map for a single fleet. So any edit that turns this into
"SwarmOps prevents this" or "SwarmOps would have prevented this" makes a claim the product
cannot currently support, in the one place a reader is most emotionally invested — which is
exactly where a credibility failure costs the most.

Keep it as origin, not proof. Same rule for the status tags in `SwarmOps_UseCases.md`: no
**Future** item may be written in the present tense.

Design tokens (paper/ink/muted/hair/accent) are lifted from `PITCH_DESIGN.md` (the
pitch-deck's system) with `--accent` swapped from deck-red to a business-appropriate
orange, since these are external documents for college leadership, not the deck.
