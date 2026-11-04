"""Replace soft masks (SMask, PDF 1.4 transparency) on images with 1-bit explicit masks (/Mask, PDF 1.3).
PDF/X-1a forbids transparency; with soft masks Ghostscript would flatten whole pages to pixels. The only
soft masks in the book are the round character faces and the bulb, whose edges become hard (at 300 dpi
this is not visible at their printed size). Also removes link annotations (the clickable contents page),
which PDF/X does not allow inside the bleed box. Usage: python3 tools/pdf_hardmask.py in.pdf out.pdf
"""
import sys, zlib
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject, BooleanObject, StreamObject, ArrayObject

reader = PdfReader(sys.argv[1]); writer = PdfWriter(clone_from=reader)
done = {}
def fix(xobjs):
    for name in list(xobjs.keys()):
        img = xobjs[name].get_object()
        if img.get("/Subtype") == "/Form" and "/Resources" in img and "/XObject" in img["/Resources"]:
            fix(img["/Resources"]["/XObject"]); continue
        if img.get("/Subtype") != "/Image" or "/SMask" not in img: continue
        sm_ref = img["/SMask"]; sm = sm_ref.get_object()
        key = id(sm)
        if key not in done:
            w, h = int(sm["/Width"]), int(sm["/Height"]); data = sm.get_data()
            assert int(sm.get("/BitsPerComponent", 8)) == 8 and len(data) >= w * h
            rows = bytearray()
            for y in range(h):
                bits = 0; n = 0; row = bytearray()
                for x in range(w):
                    bits = (bits << 1) | (1 if data[y * w + x] >= 128 else 0); n += 1
                    if n == 8: row.append(bits); bits = 0; n = 0
                if n: row.append(bits << (8 - n))
                rows += row
            m = StreamObject()
            m.set_data(zlib.compress(bytes(rows)))
            m.update({NameObject("/Type"): NameObject("/XObject"), NameObject("/Subtype"): NameObject("/Image"),
                      NameObject("/Width"): NumberObject(w), NameObject("/Height"): NumberObject(h),
                      NameObject("/ImageMask"): BooleanObject(True), NameObject("/BitsPerComponent"): NumberObject(1),
                      NameObject("/Filter"): NameObject("/FlateDecode")})
            done[key] = writer._add_object(m)
        del img["/SMask"]; img[NameObject("/Mask")] = done[key]
for page in writer.pages:
    if "/Annots" in page: del page["/Annots"]
    res = page.get("/Resources")
    if res and "/XObject" in res: fix(res["/XObject"])
writer.write(sys.argv[2]); print(f"{len(done)} soft masks -> 1-bit masks")
