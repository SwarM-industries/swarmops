#!/usr/bin/env bash
# Render business-doc sources to PDF and check the page count.
#
#   ./render.sh                  # everything
#   ./render.sh he_v2            # one document
#   ./render.sh he_v2 en_v2      # several
#
# Run it from business/_render/. See README.md for the process and the editing rules.
set -euo pipefail
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LOGO="../../presentation-assets/logo-mark.png"
[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME"; exit 1; }

# doc key -> source html | output pdf | expected pages (0 = don't care)
onepagers="he en he_v2 he_v3 en_v3"
overviews="overview_he overview_en"

pagecount() {
  python3 -c "import re,sys;print(len(re.findall(rb'/Type\s*/Page[^s]',open(sys.argv[1],'rb').read())))" "$1"
}

topdf() { # src.html  out.pdf  expected_pages
  "$CHROME" --headless --disable-gpu --no-sandbox \
    --print-to-pdf="$2" --no-pdf-header-footer --virtual-time-budget=10000 \
    "file://$(pwd)/$1" >/dev/null 2>&1
  local n; n=$(pagecount "$2")
  if [ "$3" != 0 ] && [ "$n" != "$3" ]; then
    echo "  ✗ $(basename "$2") — $n pages, expected $3"
    FAILED=1
  else
    echo "  ✓ $(basename "$2") — $n page(s)"
  fi
}

render_onepager() { # key
  local k=$1
  # en_v3 is deliberately 3 pages: page 1 is the one-pager, pages 2-3 are the market annex
  # (2 = the numbers, 3 = the plan). Everything else is a true single page.
  local want=1; case "$k" in en_v3|he_v3) want=3;; esac
  echo "one-pager: $k"
  topdf "onepager_$k.html" "../SwarmOps_OnePager_$(echo "$k" | tr '[:lower:]' '[:upper:]').pdf" "$want"
}

render_overview() { # overview_he | overview_en
  local lang=${1#overview_}
  local up; up=$(echo "$lang" | tr '[:lower:]' '[:upper:]')
  local kind date
  if [ "$lang" = he ]; then kind="מסמך עסקי"; date="אוגוסט 2026"; else kind="Business Document"; date="August 2026"; fi
  echo "overview: $lang"
  npx -y marked "../SwarmOps_Business_Overview_$up.md" > "/tmp/overview_${lang}_body.html"
  python3 wrap_overview.py "/tmp/overview_${lang}_body.html" "$LOGO" "overview_$lang.html" "$kind" "$date" "$lang"
  topdf "overview_$lang.html" "../SwarmOps_Business_Overview_$up.pdf" 0
}

FAILED=0
targets=("$@")
[ ${#targets[@]} -eq 0 ] && targets=($onepagers $overviews)

for t in "${targets[@]}"; do
  case " $onepagers " in *" $t "*) render_onepager "$t"; continue;; esac
  case " $overviews " in *" $t "*) render_overview "$t"; continue;; esac
  echo "unknown target: $t (expected: $onepagers $overviews)"; FAILED=1
done

if [ "$FAILED" = 1 ]; then
  echo
  echo "A one-pager over 1 page must be tightened (font sizes, spacing), not left to spill."
  echo "Look at the result before committing:  pdftoppm -png -r 110 FILE.pdf out"
  exit 1
fi
