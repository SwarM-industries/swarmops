import sys, base64

body_path, logo_path, out_path, doc_kind, doc_date = sys.argv[1:6]
# Optional 7th arg: document language. Only lang/dir and the font stack differ — every
# directional rule below uses CSS logical properties, so RTL and LTR share one stylesheet.
lang = sys.argv[6] if len(sys.argv) > 6 else "he"
if lang not in ("he", "en"):
    sys.exit(f"unsupported lang {lang!r} (expected 'he' or 'en')")
direction = "rtl" if lang == "he" else "ltr"
font_family = "Heebo" if lang == "he" else "Inter"

with open(body_path, encoding="utf-8") as f:
    body = f.read()
with open(logo_path, "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("ascii")

# Pull the first h1 out of the marked body and turn it into a styled cover header.
import re
m = re.search(r"<h1>(.*?)</h1>", body, re.S)
title_html = m.group(1) if m else "SwarmOps"
body_rest = body[m.end():] if m else body

css = """
@page { size: A4; margin: 20mm 18mm 22mm 18mm; }
:root {
  --paper: #f4f2ee;
  --ink: #111110;
  --muted: #6d6c68;
  --hair: #cfccc5;
  --accent: #d9480f;
  --accent-soft: #fdece3;
}
* { box-sizing: border-box; }
html, body {
  background: var(--paper);
  color: var(--ink);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
body {
  direction: DIRECTION;
  font-family: 'FONTFAMILY', sans-serif;
  font-weight: 400;
  font-size: 10.6pt;
  line-height: 1.55;
  margin: 0;
}
.coverbar {
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 12px;
  margin-bottom: 4px;
}
.coverbar img { width: 46px; height: 46px; flex: none; }
.coverbar .titles { flex: 1; }
.coverbar .titles .doctitle {
  font-size: 20pt;
  font-weight: 900;
  letter-spacing: -0.01em;
}
.coverbar .meta {
  text-align: end;
  font-size: 8pt;
  color: var(--muted);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
h1 { display: none; }
h2 {
  font-size: 14pt;
  font-weight: 900;
  color: var(--accent);
  border-bottom: 1px solid var(--hair);
  padding-bottom: 4px;
  margin-top: 22px;
  margin-bottom: 10px;
  page-break-after: avoid;
}
h3 {
  font-size: 11.5pt;
  font-weight: 700;
  color: var(--ink);
  margin-top: 14px;
  margin-bottom: 6px;
  page-break-after: avoid;
}
p { margin: 0 0 8px 0; }
strong { font-weight: 700; }
hr { display: none; }
ul, ol { margin: 0 0 8px 0; padding-inline-start: 20px; }
li { margin-bottom: 3px; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0 14px 0;
  font-size: 8.7pt;
  page-break-inside: auto;
}
table, th, td {
  border: 1px solid var(--hair);
}
th {
  background: var(--accent-soft);
  color: var(--ink);
  font-weight: 700;
  padding: 5px 6px;
  text-align: start;
}
td {
  padding: 5px 6px;
  vertical-align: top;
  text-align: start;
}
tr { page-break-inside: avoid; }
blockquote {
  margin: 8px 0;
  padding: 8px 12px;
  border-inline-start: 3px solid var(--accent);
  background: var(--accent-soft);
  color: var(--muted);
  font-size: 9.3pt;
  page-break-inside: avoid;
}
.pagefooter {
  position: fixed;
  bottom: -14mm;
  left: 0;
  right: 0;
  font-size: 7.5pt;
  color: var(--muted);
  text-align: center;
}
"""

css = css.replace("DIRECTION", direction).replace("FONTFAMILY", font_family)

fonts = f"""<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family={font_family}:wght@300;400;500;700;900&display=swap" rel="stylesheet">"""

html = f"""<!doctype html>
<html lang="{lang}" dir="{direction}">
<head>
<meta charset="utf-8">
<title>{doc_kind}</title>
{fonts}
<style>{css}</style>
</head>
<body>
<div class="coverbar">
  <img src="data:image/png;base64,{logo_b64}" alt="SwarM Industries">
  <div class="titles"><div class="doctitle">{title_html}</div></div>
  <div class="meta">SwarM Industries<br>{doc_kind} &middot; {doc_date}</div>
</div>
{body_rest}
</body>
</html>"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)
print("wrote", out_path)
