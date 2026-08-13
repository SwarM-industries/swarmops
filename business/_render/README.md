# Business documents — how to edit and render them

Everything in `business/` is an external-facing document: investors, incubators, college
leadership. This file is the whole process — what to edit, how to turn it into a PDF, and how to
check you didn't break it.

**Never edit a PDF.** Every `.pdf` in `business/` is generated output. Edit the source, re-render,
commit both. A PDF edited directly will be silently overwritten by the next render.

## What is where

| Source (edit this) | Output | Kind |
|---|---|---|
| `_render/onepager_he.html` | `../SwarmOps_OnePager_HE.pdf` | Hand-authored HTML, 1 page, RTL |
| `_render/onepager_en.html` | `../SwarmOps_OnePager_EN.pdf` | Hand-authored HTML, 1 page, LTR |
| `_render/onepager_he_v2.html` | `../SwarmOps_OnePager_HE_V2.pdf` | Hand-authored HTML, 1 page, RTL |
| `../SwarmOps_Business_Overview_HE.md` | `../SwarmOps_Business_Overview_HE.pdf` | Markdown → `wrap_overview.py` |
| `../SwarmOps_Business_Overview_EN.md` | `../SwarmOps_Business_Overview_EN.pdf` | Markdown → `wrap_overview.py` |
| `../SwarmOps_UseCases.md` | *(none — markdown only)* | Companion doc, no PDF |

`overview_he.html` / `overview_en.html` in this directory are **generated intermediates**. Do not
edit them; they are overwritten on every render. Only the `.md` is the source.

### Three one-pagers, not one

- **V1** (`onepager_he.html` + `onepager_en.html`) — the stats-row layout. HE and EN are a pair.
- **V2** (`onepager_he_v2.html`) — a different content variant with numbered sections and an
  exec-summary lede. Hebrew only. Not a replacement for V1; both are live, pick per audience.

**All three are independent files.** There is no shared template and no generation step between
them. A copy change means editing every file it applies to, by hand, and re-rendering each. They
*will* drift if you forget.

The EN one-pager mirrors HE with `dir="ltr"`, Inter instead of Heebo, and slightly smaller type
(English runs longer than Hebrew at the same point size). The roadmap block sits in the left
column in EN and the right column in HE — deliberate, it's what balances the columns in each
language, not drift.

## Prerequisites

- **Chrome** at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` — it is the PDF
  engine, not just a viewer.
- **`npx`** (Node) for `marked`, the markdown→HTML step. The `-y` flag avoids the install prompt.
- **poppler** — `pdftotext` and `pdftoppm`, both installed on Tony's machine via Homebrew. Needed
  for verification. Do not fall back to `sips` for checking multi-page PDFs: it only ever converts
  page 1, so it silently tells you nothing about pages 2+.

## Rendering

### One-pagers (HTML → PDF, one step)

```bash
cd business/_render
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf=../SwarmOps_OnePager_HE.pdf \
  --no-pdf-header-footer --virtual-time-budget=8000 \
  "file://$(pwd)/onepager_he.html"
```

Swap `onepager_he.html` / `SwarmOps_OnePager_HE.pdf` for the EN or V2 pair.

`--virtual-time-budget=8000` gives the Google Fonts request time to land. Drop it and the PDF
renders in a fallback font — it will look subtly wrong rather than obviously broken, which is
worse. **The render needs network access** for that font fetch.

### Business overviews (Markdown → HTML → PDF, two steps)

`wrap_overview.py` wraps a `marked` HTML body in the styled cover + section layout. The optional
7th argument is the language (`he` default, or `en`) — it sets `lang`/`dir` and the font stack.
Everything directional in the stylesheet uses CSS logical properties (`border-inline-start`,
`text-align: start`), so both languages share one stylesheet rather than forking it.

```bash
cd business/_render

# Hebrew
npx -y marked ../SwarmOps_Business_Overview_HE.md > /tmp/overview_he_body.html
python3 wrap_overview.py /tmp/overview_he_body.html \
  ../../presentation-assets/logo-mark.png \
  overview_he.html "מסמך עסקי" "אוגוסט 2026" he
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf=../SwarmOps_Business_Overview_HE.pdf \
  --no-pdf-header-footer --virtual-time-budget=10000 \
  "file://$(pwd)/overview_he.html"

# English
npx -y marked ../SwarmOps_Business_Overview_EN.md > /tmp/overview_en_body.html
python3 wrap_overview.py /tmp/overview_en_body.html \
  ../../presentation-assets/logo-mark.png \
  overview_en.html "Business Document" "August 2026" en
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf=../SwarmOps_Business_Overview_EN.pdf \
  --no-pdf-header-footer --virtual-time-budget=10000 \
  "file://$(pwd)/overview_en.html"
```

### The logo

Embedded in every one-pager as a base64 `<img src="data:image/png;base64,...">`, so the HTML is
self-contained. Re-embed from source:

```bash
base64 -i ../../presentation-assets/logo-mark.png
```

Or lift the existing data URI from a file that already has it — easier when creating a new
one-pager variant:

```python
import re
he = open('onepager_he.html', encoding='utf-8').read()
uri = re.search(r'src="(data:image/png;base64,[^"]+)"', he).group(1)
p = 'onepager_new.html'
s = open(p, encoding='utf-8').read().replace('__LOGO_DATA_URI__', uri)
open(p, 'w', encoding='utf-8').write(s)
```

## Verifying a render

Page count is the first check and never the only one.

```bash
python3 -c "import re; print(len(re.findall(rb'/Type\s*/Page[^s]', open('FILE.pdf','rb').read())))"
```

Expected: **one-pagers 1 page each**; overviews vary with content — check against the last
committed count and make sure any change is one you intended.

Then actually look at it. RTL punctuation, a table header orphaned at a page break, and a
missing font all pass a page-count check:

```bash
# whole document, or a page range
pdftoppm -png -r 80 FILE.pdf out            # → out-1.png, out-2.png, ...
pdftoppm -f 2 -l 3 -png -r 80 FILE.pdf out  # just pages 2–3
```

To confirm nothing was dropped when a template changes, compare the text, not the picture:

```bash
pdftotext FILE.pdf - | grep -n "^[0-9]\+\. "   # section headings
pdftotext -f 2 -l 2 FILE.pdf -                 # one page's text
```

### Fast iteration loop

Rendering a PDF for every tweak is slow. While editing a one-pager:

```bash
open -a "Google Chrome" business/_render/onepager_he.html
```

Edit, save, Cmd+R. **But** a normal Chrome window renders at screen width, where the `@page A4`
rules don't fully apply — a one-pager that looks fine in the tab can still spill to two pages.
Use Cmd+P (print preview) for true pagination, and render the real PDF before committing.

To preview PDFs inside VSCode, install the `tomoki1207.pdf` extension. It auto-refreshes when the
file changes on disk. Preview only — it cannot edit.

## Editing rules

These exist because they've each been broken at least once.

### Audience: the one-pagers are not for engineers

They go to investors, incubators and college leadership. Keep implementation detail out — no
Terraform, Argo CD, EKS, GitOps, Kubernetes, OR-Tools, Hungarian algorithm, microservice counts.
Say "secure, distributed and scalable cloud infrastructure" instead.

Terms that **do** stay, in English rather than transliterated into Hebrew, because they read as
domain fluency to this audience: `AWS`, `MAVLink`, `VRPTW`, `PoC`, `Pre-Seed`, `Seed`,
`Multi-Tenant`, `BVLOS`, `Accelerator`, `Enterprise`.

The business overviews *may* carry architecture detail. That split is intentional — don't
harmonize it.

### Claims must match built reality

`SwarmOps_UseCases.md` has a status legend — **Built / Phase 1–3 / Future** — and the overviews'
use-case tables use the Hebrew equivalents (**קיים / שלב N / עתידי**). Every capability statement
carries one. This tagging is the documents' entire credibility model; a reader who catches one
overstatement discounts everything else.

- No **Future** item may be written in the present tense.
- Video feed, GNSS-denied onboard autonomy, ML, and UTM are all **Future**, and the video feed
  row says out loud that no camera or streaming exists in the system today. Don't soften that.
- Anything cross-unit / multi-org is **Phase 3**. A unified live map for a *single* fleet is
  Built.

### The 7 October account — origin, not proof

The account in the one-pagers (`.origin` block) and both overviews' §2 ends on **intent**:
`זו הבעיה ש-SwarmOps נבנתה כדי לפתור` / "that is the problem SwarmOps was built to solve".

That ending is load-bearing. The failure it describes — two teams, no shared picture — is the
cross-unit operational picture, which is **Phase 3, not built**. Rewriting it as "SwarmOps
prevents this" puts an unsupportable claim in the paragraph a reader is most invested in, which
is exactly where a credibility failure costs most.

Attribution is deliberately unattributed first person plural: `שני צוותים מאותה פלוגה`, not
`הפלוגה שלנו` — the text never asserts all three founders served together. No unit, no kibbutz,
no individuals, no emoji.

### Still-open placeholders

Both languages, all documents: surnames, team bios, the pre-seed amount, email and phone are
`[...]` placeholders. Fill them before anything goes out. The one-pagers also name the third
founder as Harel/הראל while `CLAUDE.md` says Valfish — unresolved, check before sending.

## Design tokens

`--paper / --ink / --muted / --hair / --accent` are lifted from `PITCH_DESIGN.md` (the pitch
deck's system), with `--accent` swapped from deck-red to a business-appropriate orange, since
these are external documents for college leadership rather than the deck. Keep new blocks on
those variables instead of hardcoding hex values.
