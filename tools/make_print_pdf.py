"""Render a bleed-layout .docx to an exact-size print PDF.

LibreOffice "sloppy-fits" a 10.25" page height (14760 twips) to 260 mm (10.236"), which KDP would reject.
So the PDF is rendered from a temporary copy whose page height is 5 twips taller (14765 -> 738.26 pt), then
every page box is set to exactly 8.125" x 10.25" (585 x 738 pt; the extra 0.26 pt comes off the top bleed),
and TrimBox/BleedBox are written per page: bleed on the outside edge (right on odd pages, left on even).
Usage: python3 tools/make_print_pdf.py file.docx   -> file.pdf next to it
"""
import os, re, shutil, subprocess, sys, tempfile, zipfile
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject, NameObject

src = os.path.abspath(sys.argv[1])
out_pdf = os.path.splitext(src)[0] + ".pdf"
W, H, B = 585.0, 738.0, 9.0   # 8.125" x 10.25", 0.125" bleed
tmp = tempfile.mkdtemp()
tmp_docx = os.path.join(tmp, os.path.basename(src))
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp_docx, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/document.xml":
            data = data.replace(b'w:h="14760"', b'w:h="14765"')
        zout.writestr(item, data)
subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", tmp, tmp_docx], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
reader = PdfReader(os.path.join(tmp, os.path.splitext(os.path.basename(src))[0] + ".pdf"))
writer = PdfWriter(clone_from=reader)
for i, page in enumerate(writer.pages, 1):
    full = RectangleObject([0, 0, W, H])
    page.mediabox = full; page.cropbox = full; page.bleedbox = full
    page.trimbox = RectangleObject([0, B, W - B, H - B] if i % 2 else [B, B, W, H - B])
writer.write(out_pdf)
shutil.rmtree(tmp)
print(f"wrote {out_pdf}: {len(writer.pages)} pages at 8.125 x 10.25 in, TrimBox/BleedBox set")
