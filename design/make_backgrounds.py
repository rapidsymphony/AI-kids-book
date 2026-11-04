"""Starry Circuits page backgrounds — the approved background style (Nov 2026).

Draws one full-bleed page background per colour at print resolution:
8.125 x 10.25 in @ 300 dpi (8" x 10" trim + 0.125" bleed on top, bottom and outside edge).
The reading area stays pale; circuit traces and stars live in a band near the edges
(DECO_BAND inches from each edge), which sits outside the 0.75" text margins.
The bottom-centre footer zone is kept clear so page numbers stay readable.

Usage:  python3 design/make_backgrounds.py art/backgrounds
Makes:  bg_blue.png, bg_green.png, bg_purple.png, bg_orange.png, bg_teal.png, bg_violet.png, bg_navy.png
"""
import math, os, random, sys
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else "art/backgrounds"
DPI = 300
TRIM_W, TRIM_H, BLEED = 8.0, 10.25 - 0.25, 0.125
W, H = int((TRIM_W + BLEED) * DPI), int((TRIM_H + 2 * BLEED) * DPI)
DECO_BAND = 0.62  # inches of decoration from each edge
M = int(DECO_BAND * DPI)

COLOURS = {  # book palette (Design A)
    "blue": (31, 95, 169), "green": (46, 125, 79), "purple": (106, 76, 147), "orange": (194, 94, 10),
    "teal": (14, 124, 134), "violet": (67, 56, 202), "navy": (14, 27, 51),
}
GOLD = (217, 178, 76); VIOLET = (67, 56, 202)


def mix(c, w, base=(255, 255, 255)):
    return tuple(int(c[i] * (1 - w) + base[i] * w) for i in range(3))


def in_band(x, y, pad=0):
    return x < M + pad or x > W - M - pad or y < M + pad or y > H - M - pad


def in_footer(x, y):
    return abs(x - W / 2) < 1.6 * DPI and y > H - 0.95 * DPI


def sparkle(d, cx, cy, r, fill):
    pts = []
    for k in range(8):
        a = math.radians(-90 + k * 45)
        rr = r if k % 2 == 0 else r * 0.28
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)


def circuits(col, name, seed=5):
    rnd = random.Random(seed)
    top, bot = (238, 244, 255), (231, 236, 252)
    im = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3)))
    for (cx, cy, r) in [(W * 0.9, H * 0.08, 700), (W * 0.08, H * 0.9, 760)]:   # soft section-colour glows
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix(col, 0.8, (236, 242, 255)))
    im = im.filter(ImageFilter.GaussianBlur(200))
    d = ImageDraw.Draw(im)
    trace, node = mix(col, 0.55), mix(col, 0.35)
    for _ in range(70):  # circuit traces growing in from every edge, staying in the band
        side = rnd.choice("LRTB")
        if side == "L": x, y, dx, dy = 0, rnd.uniform(0, H), 1, 0
        elif side == "R": x, y, dx, dy = W, rnd.uniform(0, H), -1, 0
        elif side == "T": x, y, dx, dy = rnd.uniform(0, W), 0, 0, 1
        else: x, y, dx, dy = rnd.uniform(0, W), H, 0, -1
        pts = [(x, y)]
        for _seg in range(rnd.randint(2, 4)):
            L = rnd.uniform(60, 220)
            nx, ny = x + dx * L, y + dy * L
            if not in_band(nx, ny, 40) or in_footer(nx, ny): break
            pts.append((nx, ny)); x, y = nx, ny
            if dx: dx, dy = 0, rnd.choice([-1, 1])
            else: dx, dy = rnd.choice([-1, 1]), 0
        if len(pts) > 1:
            d.line(pts, fill=trace, width=6)
            ex, ey = pts[-1]
            d.ellipse([ex - 15, ey - 15, ex + 15, ey + 15], outline=node, width=6)
    for _ in range(170):  # stars: bigger near the edges, tiny in the reading area
        x, y = rnd.uniform(0, W), rnd.uniform(0, H)
        if in_footer(x, y): continue
        r = rnd.uniform(5, 14) if in_band(x, y, 120) else rnd.uniform(3, 6)
        c = rnd.choice([mix(GOLD, 0.25), mix(VIOLET, 0.5), (255, 255, 255)])
        if rnd.random() < 0.25 and in_band(x, y, 80): sparkle(d, x, y, r * 3.2, c)
        else: d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    im.save(os.path.join(OUT, f"bg_{name}.png"), dpi=(DPI, DPI))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, col in COLOURS.items():
        circuits(col, name)
    print(f"wrote {len(COLOURS)} backgrounds to {OUT} at {W}x{H}px ({DPI} dpi)")
