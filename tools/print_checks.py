"""Print checks for a bleed build (8" x 10" trim, 0.125" bleed on top, bottom and outside edge).
  python3 tools/print_checks.py ch1/Chapter1_Welcome_to_AI_World_v3.docx ch1/Chapter1_Welcome_to_AI_World_v3.pdf
1. Effective resolution of every placed image (pixels / printed inches), flags anything under 300 dpi.
2. Safe zone: no live text closer than 0.375" to the trim on any page (odd pages: bleed on the right;
   even pages: bleed on the left).
3. Page size, blank pages, first/last line of every page.
"""
import io, re, subprocess, sys, zipfile
from collections import OrderedDict
from PIL import Image

docx, pdf = sys.argv[1], sys.argv[2]
EMU = 914400
z = zipfile.ZipFile(docx)

# ---- 1. images
rows = OrderedDict()
for part in [n for n in z.namelist() if re.match(r"word/(document|header\d+|footer\d+)\.xml$", n)]:
    xml = z.read(part).decode("utf8")
    rel_name = part.replace("word/", "word/_rels/") + ".rels"
    rels = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"', z.read(rel_name).decode("utf8"))) if rel_name in z.namelist() else {}
    for m in re.finditer(r"<w:drawing>(.*?)</w:drawing>", xml, re.S):
        d = m.group(1)
        cx = int(re.search(r'<wp:extent cx="(\d+)"', d).group(1))
        rid = re.search(r'r:embed="([^"]+)"', d).group(1)
        name = re.search(r'<wp:docPr [^>]*name="([^"]*)"', d)
        target = "word/" + rels[rid].lstrip("/").replace("word/", "")
        im = Image.open(io.BytesIO(z.read(target)))
        key = (target, round(cx / EMU, 2))
        r = rows.setdefault(key, {"px": im.size, "w_in": cx / EMU, "count": 0, "name": name.group(1) if name else ""})
        r["count"] += 1

# map media files back to source names by content
import hashlib, glob, os
src = {}
for f in glob.glob("art/**/*.*", recursive=True) + glob.glob("ch1/media/*"):
    try: src[hashlib.md5(open(f, "rb").read()).hexdigest()] = f
    except IsADirectoryError: pass
print("IMAGE RESOLUTION AT PRINTED SIZE")
print(f"{'source file':34} {'pixels':>11} {'printed width':>14} {'eff. dpi':>9} {'uses':>5}  status")
low = 0
for (target, _), r in sorted(rows.items(), key=lambda kv: kv[1]["px"][0] / kv[1]["w_in"]):
    s = src.get(hashlib.md5(z.read(target)).hexdigest(), target)
    dpi = r["px"][0] / r["w_in"]
    flag = "OK" if dpi >= 299 else "LOW (<300 dpi)"
    low += dpi < 299
    print(f"{s:34} {r['px'][0]:>5}x{r['px'][1]:<5} {r['w_in']:>12.2f}\" {dpi:>9.0f} {r['count']:>5}  {flag}")
print(f"-> {low} placed image(s) under 300 dpi\n")

# ---- 2/3. pages
info = subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout
n = int(re.search(r"Pages:\s+(\d+)", info).group(1))
size = re.search(r"Page size:\s+([\d.]+) x ([\d.]+)", info)
W, H = float(size.group(1)), float(size.group(2))
print(f"PAGE SIZE {W / 72:.3f}\" x {H / 72:.3f}\"  ({n} pages)")
SAFE = 0.375 * 72; B = 9.0
bbox = subprocess.run(["pdftotext", "-bbox", pdf, "-"], capture_output=True, text=True).stdout
pages = bbox.split("<page ")[1:]
viol = 0
print("SAFE ZONE (live text >= 0.375\" inside the trim)")
for i, pg in enumerate(pages, 1):
    tx0, tx1 = (0, W - B) if i % 2 else (B, W)          # trim box x range
    ty0, ty1 = B, H - B
    worst = None
    for m in re.finditer(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<', pg):
        x0, y0, x1, y1 = map(float, m.groups()[:4])
        dist = min(x0 - tx0, tx1 - x1, y0 - ty0, ty1 - y1)
        if worst is None or dist < worst[0]: worst = (dist, m.group(5))
    if worst and worst[0] < SAFE:
        viol += 1; print(f"  page {i}: '{worst[1]}' is {worst[0] / 72:.3f}\" from the trim")
print(f"  closest text per page is fine on {n - viol} of {n} pages\n")

print("FIRST / LAST LINE OF EVERY PAGE")
for i in range(1, n + 1):
    t = [l.strip() for l in subprocess.run(["pdftotext", "-layout", "-f", str(i), "-l", str(i), pdf, "-"], capture_output=True, text=True).stdout.splitlines() if l.strip()]
    t = [l for l in t if not re.match(r"Hands-On AI for Kids · Chapter 1 · \d+$", l)]
    if not t: print(f"  {i:>2}: [no live text — full-page picture]"); continue
    print(f"  {i:>2}: {t[0][:60]!r:64} … {t[-1][:50]!r}")
