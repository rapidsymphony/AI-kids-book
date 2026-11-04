"""Placeholder images at the exact shape of each final picture: 4:5 portrait, full bleed.
2438 x 3075 px = 8.125" x 10.25" at 300 dpi (8" x 10" trim + 0.125" bleed on top, bottom and outside edge).
The dashed frame is the safe zone (0.5" inside the trim on every side, measured as if the bleed could be on
either side): keep faces, hands and anything important inside it. The shaded corner (top left) is where the
page label pill sits; the cover's shaded band (bottom) is where the title band sits.
In Word: right-click the placeholder -> Change Picture -> From a File keeps size and position.
Usage: python3 ch1/placeholders.py art
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
F = os.path.expanduser("~/.fonts/")
def font(name, size): return ImageFont.truetype(F + name, size)

DPI = 300
W, H = 2438, 3075
BLEED = int(0.125 * DPI)
SAFE = BLEED + int(0.5 * DPI) + BLEED   # bleed + 0.5" safe margin (+ the other side's bleed, so it works on left and right pages)
VIOLET, GREY, INK = (67, 56, 202), (92, 96, 112), (43, 45, 66)

ITEMS = [
    (1, "Chapter cover", "i-Nova floating above the science fair, with Newton, Byte and SparX looking up in awe"),
    (2, "Section 1 · The i-Nova reveal", "i-Nova rises from its platform and sweeps the crew with blue scanning light"),
    (3, "Section 2 · Byte’s bird photos", "Byte projects a robin, a sparrow, a kingfisher — and one photo hidden behind a question mark"),
    (4, "Section 2 · Learning by trying", "Newton writes “TEACH” in his notebook while a tiny i-Nova hologram watches and SparX crashes"),
    (5, "Section 4 · The cookie spaceship", "i-Nova proudly presents a giant chocolate-chip cookie with wings. SparX is in love"),
]


def dashed_rect(d, x0, y0, x1, y1, fill, w=6, dash=36, on=20):
    for x in range(x0, x1, dash):
        d.line([(x, y0), (min(x + on, x1), y0)], fill=fill, width=w); d.line([(x, y1), (min(x + on, x1), y1)], fill=fill, width=w)
    for y in range(y0, y1, dash):
        d.line([(x0, y), (x0, min(y + on, y1))], fill=fill, width=w); d.line([(x1, y), (x1, min(y + on, y1))], fill=fill, width=w)


for n, title, desc in ITEMS:
    im = Image.new("RGB", (W, H), (240, 238, 252))
    d = ImageDraw.Draw(im)
    cx = W // 2

    def ctext(y, t, f, fill):
        w = d.textlength(t, font=f); d.text((cx - w / 2, y), t, font=f, fill=fill)

    # reserved zones: label pill (top-left) on story pages, title band (bottom) on the cover
    if n == 1:
        d.rectangle([0, int(7.5 * DPI), W, int(9.75 * DPI)], fill=(226, 223, 246))
        ctext(int(8.35 * DPI), "Title band sits here — keep this area calm (sky, floor, soft background)", font("andika-700.ttf", 44), GREY)
    else:
        d.rectangle([0, 0, int(4.6 * DPI), int(1.25 * DPI)], fill=(226, 223, 246))
        d.text((SAFE, int(0.62 * DPI)), "Label pill sits here", font=font("andika-700.ttf", 40), fill=GREY)
    dashed_rect(d, SAFE, SAFE, W - SAFE, H - SAFE, VIOLET)
    d.text((SAFE + 24, H - SAFE - 64), "safe zone: keep faces and key details inside this line", font=font("andika-400.ttf", 36), fill=VIOLET)

    # picture glyph
    top = int(2.6 * DPI)
    d.rounded_rectangle([cx - 200, top, cx + 200, top + 290], 30, outline=(150, 140, 230), width=12)
    d.polygon([(cx - 160, top + 250), (cx - 40, top + 120), (cx + 40, top + 200), (cx + 95, top + 145), (cx + 160, top + 250)], fill=(150, 140, 230))
    d.ellipse([cx + 65, top + 40, cx + 135, top + 110], fill=(217, 178, 76))
    y = top + 400
    ctext(y, f"IMAGE {n} OF 5", font("baloo-2-800.ttf", 96), VIOLET); y += 140
    ctext(y, title, font("baloo-2-700.ttf", 104), INK); y += 190
    f = font("andika-400.ttf", 64); words = desc.split(); lines = []; cur = ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if d.textlength(t, font=f) > W - 2 * SAFE - 160: lines.append(cur); cur = w_
        else: cur = t
    lines.append(cur)
    for l in lines: ctext(y, l, f, GREY); y += 90
    y += 110
    for t in ["Final picture: 4:5 portrait, 2438 × 3075 px or larger", f"Prompt: “Chapter 1 Image Prompts”, Image {n}", "To replace in Word: right-click › Change Picture › From a File"]:
        ctext(y, t, font("andika-700.ttf", 54), VIOLET); y += 96
    im.save(f"{OUT}/placeholder_{n}.png", dpi=(DPI, DPI), optimize=True)
print("ok")
