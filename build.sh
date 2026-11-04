#!/usr/bin/env bash
# Build one chapter (1, 2 or 3) to .docx and render a PDF next to it.
# Usage: ./build.sh 1     |  ./build.sh 2b  (Chapter 2 "Sunny Lab" alternative design)
set -euo pipefail
cd "$(dirname "$0")"
case "${1:-}" in
  1) [ -f art/backgrounds/bg_teal.png ] || python3 design/make_backgrounds.py art/backgrounds
     cd ch1 && cat components.js content.js > build.js && node build.js
     for f in *.docx; do python3 ../tools/postprocess_docx.py "$f"; python3 ../tools/make_print_pdf.py "$f"; done
     ls -1 *.docx *.pdf; exit 0 ;;
  3) cd ch3 && cat components.js content.js > build.js && node build.js ;;
  2) cd ch2 && node build.js ;;
  2b) cd ch2 && node buildB_sunnylab.js ;;
  *) echo "usage: ./build.sh 1|2|2b|3"; exit 1 ;;
esac
for f in *.docx; do soffice --headless --convert-to pdf "$f" >/dev/null 2>&1 || true; done
ls -1 *.docx *.pdf
