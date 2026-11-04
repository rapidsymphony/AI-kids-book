#!/usr/bin/env bash
# PDF/X-1a:2001 (CMYK, PDF 1.3, fonts embedded, output intent) from the print PDF, for IngramSpark.
# Usage: tools/make_pdfx.sh ch1/Chapter1_Welcome_to_AI_World_v3.pdf  -> ..._PDFX1a.pdf
set -euo pipefail
in="$1"; out="${in%.pdf}_PDFX1a.pdf"; tmp="$(mktemp --suffix=.pdf)"
python3 "$(dirname "$0")/pdf_hardmask.py" "$in" "$tmp"   # PDF/X-1a: no soft-mask transparency
gs -q -dPDFX -dBATCH -dNOPAUSE -dNOSAFER -dNOOUTERSAVE -sDEVICE=pdfwrite -dCompatibilityLevel=1.3 \
   -sColorConversionStrategy=CMYK -sProcessColorModel=DeviceCMYK -dOverrideICC \
   -dEmbedAllFonts=true -dSubsetFonts=true -dAutoRotatePages=/None \
   -dDownsampleColorImages=false -dDownsampleGrayImages=false -dAutoFilterColorImages=false -dColorImageFilter=/DCTEncode -dJPEGQ=95 \
   -sOutputFile="$out" "$(dirname "$0")/PDFX1a_def.ps" "$tmp"
rm -f "$tmp"
echo "wrote $out"
