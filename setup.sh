#!/usr/bin/env bash
# One-time setup: fonts for accurate rendering + the docx library.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p ~/.fonts && cp fonts/*.ttf ~/.fonts/ && fc-cache -f >/dev/null
npm ls docx >/dev/null 2>&1 || npm install docx@9
command -v soffice >/dev/null || echo "Install LibreOffice to render PDFs (soffice)."
command -v pdftoppm >/dev/null || echo "Install poppler-utils for page previews (pdftoppm)."
