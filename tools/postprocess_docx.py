"""Post-process a docx-js build for print (bleed layout).
1. Turn on mirror margins (w:mirrorMargins) so the inside/outside margins alternate on left/right pages
   (docx-js has no option for it). LibreOffice maps it to a "mirrored" page layout.
2. Shrink the empty paragraph that docx-js adds to carry a section break after a table, so it can
   never spill onto a page of its own (a blank page before a full-page picture).
Usage: python3 tools/postprocess_docx.py file.docx
"""
import re, shutil, sys, zipfile, os

path = sys.argv[1]
tmp = path + ".tmp"
with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/settings.xml":
            s = data.decode("utf8")
            if "<w:mirrorMargins" not in s:
                # schema order: mirrorMargins comes after displayBackgroundShape and before defaultTabStop
                if "<w:displayBackgroundShape/>" in s: s = s.replace("<w:displayBackgroundShape/>", "<w:displayBackgroundShape/><w:mirrorMargins/>", 1)
                else: s = re.sub(r"(<w:settings[^>]*>)", r"\1<w:mirrorMargins/>", s, count=1)
            data = s.encode("utf8")
        elif item.filename == "word/document.xml":
            s = data.decode("utf8")
            s, n = re.subn(r"<w:p><w:pPr><w:sectPr",
                           '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/>'
                           '<w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr><w:sectPr', s)
            data = s.encode("utf8")
            print(f"postprocess: mirror margins on, {n} section-break paragraphs shrunk")
        zout.writestr(item, data)
shutil.move(tmp, path)
