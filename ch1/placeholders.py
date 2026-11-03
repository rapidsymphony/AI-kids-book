"""Placeholder images at the exact aspect ratio of each final picture.
In Word: right-click the placeholder -> Change Picture -> From a File keeps size and position."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
F = os.path.expanduser("~/.fonts/")
def font(name, size): return ImageFont.truetype(F + name, size)

ITEMS = [
    (1, "Chapter cover", "i-Nova floating above the science fair, with Newton, Byte and SparX looking up in awe"),
    (2, "Section 1 · The i-Nova reveal", "i-Nova rises from its platform and sweeps the crew with blue scanning light"),
    (3, "Section 2 · Byte’s bird photos", "Byte projects a robin, a sparrow, a kingfisher — and one photo hidden behind a question mark"),
    (4, "Section 2 · Learning by trying", "Newton writes “TEACH” in his notebook while a tiny i-Nova hologram watches and SparX crashes"),
    (5, "Section 4 · The cookie spaceship", "i-Nova proudly presents a giant chocolate-chip cookie with wings. SparX is in love"),
]
W = H = 1500
for n, title, desc in ITEMS:
    im = Image.new("RGB", (W, H), (240, 238, 252))
    d = ImageDraw.Draw(im)
    # dashed frame
    for x in range(40, W - 40, 36):
        d.line([(x, 40), (x + 20, 40)], fill=(67, 56, 202), width=6); d.line([(x, H - 40), (x + 20, H - 40)], fill=(67, 56, 202), width=6)
    for y in range(40, H - 40, 36):
        d.line([(40, y), (40, y + 20)], fill=(67, 56, 202), width=6); d.line([(W - 40, y), (W - 40, y + 20)], fill=(67, 56, 202), width=6)
    # picture glyph
    cx = W // 2
    d.rounded_rectangle([cx - 150, 300, cx + 150, 520], 24, outline=(150, 140, 230), width=10)
    d.polygon([(cx - 120, 490), (cx - 30, 390), (cx + 30, 450), (cx + 70, 410), (cx + 120, 490)], fill=(150, 140, 230))
    d.ellipse([cx + 50, 330, cx + 100, 380], fill=(217, 178, 76))
    def ctext(y, t, f, fill):
        w = d.textlength(t, font=f); d.text((cx - w / 2, y), t, font=f, fill=fill)
    ctext(590, f"IMAGE {n} OF 5", font("baloo-2-800.ttf", 64), (67, 56, 202))
    ctext(690, title, font("baloo-2-700.ttf", 76), (43, 45, 66))
    # wrap description
    f = font("andika-400.ttf", 46); words = desc.split(); lines = []; cur = ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if d.textlength(t, font=f) > W - 300: lines.append(cur); cur = w_
        else: cur = t
    lines.append(cur)
    for i, l in enumerate(lines): ctext(820 + i * 64, l, f, (92, 96, 112))
    y = 1060
    for t in ["Final picture: square, 2048 × 2048 px or larger", f"Prompt: “Chapter 1 Image Prompts”, Image {n}", "To replace in Word: right-click › Change Picture › From a File"]:
        ctext(y, t, font("andika-700.ttf", 40), (67, 56, 202)); y += 70
    im.save(f"{OUT}/placeholder_{n}.png")
print("ok")
