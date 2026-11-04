"""Render every page of a PDF and tile them into numbered contact sheets: contact_sheet.py file.pdf outdir [dpi] [cols]"""
import glob, os, subprocess, sys
from PIL import Image, ImageDraw
pdf, out = sys.argv[1], sys.argv[2]; dpi = sys.argv[3] if len(sys.argv) > 3 else "30"; cols = int(sys.argv[4]) if len(sys.argv) > 4 else 8
os.makedirs(out, exist_ok=True)
for f in glob.glob(f"{out}/pg-*.png"): os.remove(f)
subprocess.run(["pdftoppm", "-r", dpi, "-png", pdf, f"{out}/pg"], check=True)
fs = sorted(glob.glob(f"{out}/pg-*.png")); ims = [Image.open(f) for f in fs]; w, h = ims[0].size
per = cols * 3
for s in range(0, len(ims), per):
    chunk = ims[s:s + per]; rows = (len(chunk) + cols - 1) // cols
    W = Image.new("RGB", (cols * (w + 6), rows * (h + 16)), "gray"); d = ImageDraw.Draw(W)
    for i, im in enumerate(chunk):
        x, y = (i % cols) * (w + 6), (i // cols) * (h + 16); W.paste(im, (x, y + 14)); d.text((x + 2, y), str(s + i + 1), fill="white")
    W.save(f"{out}/sheet_{s // per + 1}.png")
print(len(ims), "pages")
