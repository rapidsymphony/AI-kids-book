"""Two-pass placement of full-page pictures + contents page numbers (Chapter 1).

Pass per picture (in book order): build with that picture and all later ones left out (CAL=order),
find the page where its anchor block (the block it follows in content.js) ends, then move the
picture to just after the last block that still ends on that page, so the story page before it is
full. Writes ch1/placement.json. Finally builds everything, finds the page of every bookmark and
writes ch1/pages.json, then rebuilds so the contents page is right.

Usage: python3 tools/place_pictures.py [--pages-only]
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = os.path.join(ROOT, "ch1")
FIXED = {"cover", "image5.jpg", "image7.png", "facts", "parents"}  # placed by content order, not by scene
norm = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())


def build(cal=None):
    env = dict(os.environ)
    if cal is not None: env["CAL"] = str(cal)
    subprocess.run(["./build.sh", "1"], cwd=ROOT, env=env, check=True, stdout=subprocess.DEVNULL)
    pdf = os.path.join(CH, "Chapter1_Welcome_to_AI_World_v3.pdf")
    n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout).group(1))
    pages = [norm(subprocess.run(["pdftotext", "-raw", "-f", str(i), "-l", str(i), pdf, "-"], capture_output=True, text=True).stdout) for i in range(1, n + 1)]
    cal_data = json.load(open(os.path.join(CH, ".cal", "blocks.json")))
    return pages, cal_data


def locate(pages, blocks):
    """start/end page (1-based) of every block with enough text; searched in reading order."""
    pos = {}; pg = 0
    for b in blocks:
        t = norm(re.sub(r"\{#[^}]*\}", "", b["t"]))
        if len(t) < 6: continue
        head, tail = t[:24], t[-24:]
        s = next((i for i in range(pg, len(pages)) if head in pages[i]), None)
        if s is None: continue
        e = next((i for i in range(s, min(s + 3, len(pages))) if tail in pages[i]), s)
        pos[b["i"]] = (s + 1, e + 1); pg = s
    return pos


def main():
    place_path = os.path.join(CH, "placement.json")
    place = json.load(open(place_path)) if os.path.exists(place_path) else {}
    if "--pages-only" not in sys.argv:
        _, cal = build(cal=0)
        order = [p for p in cal["pics"] if p["id"] not in FIXED]
        for p in sorted(order, key=lambda x: x["order"]):
            place[p["id"]] = 0
            json.dump(place, open(place_path, "w"), indent=1)
            pages, cal = build(cal=p["order"])
            blocks = cal["blocks"]; pos = locate(pages, blocks)
            a = next(x for x in cal["pics"] if x["id"] == p["id"])["anchor"]
            anchor_end = pos[max(i for i in pos if i <= a)][1]
            k = a
            for b in blocks[a + 1:]:
                if b["sec"] != blocks[a]["sec"]: break
                if b["i"] in pos:
                    if pos[b["i"]][1] == anchor_end: k = b["i"]
                    else: break
            place[p["id"]] = k - a
            print(f"{p['id']}: anchor block {a} ends on page {anchor_end}; picture goes after block {k} (+{k - a})")
            json.dump(place, open(place_path, "w"), indent=1)
    # contents: page of every bookmark
    pages, cal = build()
    pos = locate(pages, cal["blocks"])
    bm = {}
    for b in cal["blocks"]:
        for m in re.findall(r"\{#([^}]*)\}", b["t"]):
            nxt = next(pos[j][0] for j in range(b["i"], len(cal["blocks"])) if j in pos)
            bm[m] = str(nxt)
    for p in cal["pics"]:  # bookmarks on picture pages: the page after the block the picture follows
        if p.get("bm"):
            prev = max(i for i in pos if i <= p["after"]); bm[p["bm"]] = str(pos[prev][1] + 1)
    # one more pass for pictures carrying bookmarks inside text (label run)
    for p in cal["pics"]:
        for m in re.findall(r"\{#([^}]*)\}", p.get("t", "")):
            prev = max(i for i in pos if i <= p["after"]); bm[m] = str(pos[prev][1] + 1)
    old = json.load(open(os.path.join(CH, "pages.json")))
    keys = list(old.keys())
    new = {k: bm.get(k, "?") for k in keys}
    json.dump(new, open(os.path.join(CH, "pages.json"), "w"))
    print("pages.json:", new)
    pages2, _ = build()
    print("final pages:", len(pages2))


if __name__ == "__main__":
    main()
