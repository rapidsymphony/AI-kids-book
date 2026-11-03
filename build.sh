#!/usr/bin/env bash
# Build one chapter (1, 2 or 3) to .docx and render a PDF next to it.
# Usage: ./build.sh 1     |  ./build.sh 2b  (Chapter 2 "Sunny Lab" alternative design)
set -euo pipefail
cd "$(dirname "$0")"
case "${1:-}" in
  1) cd ch1 && cat components.js content.js > build.js && node build.js ;;
  3) cd ch3 && cat components.js content.js > build.js && node build.js ;;
  2) cd ch2 && cat components.js content.js > build.js && node build.js ;;
  2b) cd ch2 && node buildB_sunnylab.js ;;
  *) echo "usage: ./build.sh 1|2|2b|3"; exit 1 ;;
esac
for f in *.docx; do soffice --headless --convert-to pdf "$f" >/dev/null 2>&1 || true; done
ls -1 *.docx *.pdf
