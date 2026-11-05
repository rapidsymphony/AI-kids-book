# Design update: Starry Circuits + full-page pictures + print-ready Chapter 1

Approved by the author on 4 Nov 2026 after reviewing `design/reference_mockup.pdf`
(the "STARRY CIRCUITS" story page and the full-page activity page — pages 3–4).
Everything else in Design A stays the same (section openers, dialogue bubbles,
notebook, meters, scan panels, Big Idea, summaries, banners).

## 1. Page size: switch to a bleed layout
- Trim stays **8" × 10"**. Add **0.125" bleed** on the top, bottom and outside edge
  → PDF page size **8.125" × 10.25"** (11700 × 14760 DXA). This is KDP's bleed size for 8×10.
- **Before building, check the current KDP and IngramSpark interior bleed specs online**
  (KDP "paper and bleed settings", IngramSpark "File Creation Guide"). If IngramSpark needs a
  different page size (for example bleed on all four sides), build a second PDF for it from the
  same source — don't compromise the KDP file.
- Margins measured from the **trim** stay as they are (0.75"), so in the PDF the outside margin is
  0.75 + 0.125 and top/bottom are 0.75 + 0.125. Use **mirror margins** (inside/outside) so the
  bleed edge alternates on left and right pages, if docx-js / LibreOffice supports it; if not,
  document the limitation and use the larger margin on both sides.
- Keep **all text and important artwork at least 0.375" inside the trim** (safe zone).

## 2. Backgrounds: Starry Circuits on every text page
- Generate with `python3 design/make_backgrounds.py art/backgrounds` (needs Pillow).
  It writes `bg_<colour>.png` at 2437 × 3075 px, 300 dpi: blue, green, purple, orange, teal, violet, navy.
- Colour per part of the book (the section's Design A colour):
  front matter + back matter = **teal**, Section 1 = **blue**, Section 2 = **green**,
  Section 3 = **purple**, Section 4 = **orange**.
- How: put the background as a **floating image behind text, anchored to the page at (0,0)**,
  sized 8.125" × 10.25", inside the section **header** (see `design/reference_mockup_code.js` →
  `bgHeader()`/`pageImg()`). That means each colour block becomes its own docx section;
  keep page numbering continuous across sections.
- The reading area of the background is pale on purpose; don't make it darker. The footer
  zone (bottom centre) is kept clear by the script so page numbers stay readable.

## 3. Pictures become full pages
Applies to: every **story picture** ("Picture This" / placeholders 1–5), every **Do & Discover**
activity sheet, and the **True Stories** and **Parents' Corner** illustrations. Not to small art
(face icons, i-Nova card, bulb) and not to the Meet the Team page (it shares the page with the
i-Nova card).
- Each one gets its **own page**, running **edge to edge across the full bleed width (8.125")**,
  as a floating image anchored to the page (see `pageImg()` in the reference code).
- Square images (all current art) can't fill a 4:5 page without cropping, so: image full width,
  positioned so the strip that's left (top or bottom) holds the small label ("PICTURE THIS · SPARX
  CRASH COUNT · n" or "SECTION n · DO & DISCOVER · YOUR TURN n") and, if there is one, the caption —
  on the Starry Circuits background. **Never crop activity sheets** (they contain text).
- **Placement still follows the scene.** A full-page picture must come right after the page on
  which its scene happens. Do it in two passes: build, find the page that holds the anchor
  sentence (the sentence the picture currently follows), and move the picture page to just after
  the last paragraph that fits on that page, so the story page before it is full — no half-empty
  pages before a picture.
- **New pictures should be portrait.** Update the 5 placeholders (`ch1/placeholders.py`) and
  `ch1/Chapter1_Image_Prompts.md` so the new i-Nova images are generated at **4:5 portrait,
  at least 2438 × 3075 px** (full bleed at 300 dpi), with the important content kept away from
  the edges (0.5" safe margin). A portrait image fills the whole page with no strip — then put
  the label as a small pill over the top-left corner, inside the safe zone.

## 4. Publisher-ready checks (Chapter 1)
- Rebuild Chapter 1 and **recalibrate the contents page numbers** (two-pass, `pages.json`).
- **Fonts:** every font embedded (`pdffonts`). Replace Courier New on the scan screens with a free
  monospaced font you bundle in `fonts/` (for example Courier Prime or Space Mono) so the PDF
  matches on every machine. Track down the characters currently falling back to Inter or an emoji
  font (★ ☆ ● ○ ⚡ → and similar) and either switch them to a bundled font that has the glyph or
  replace them with small drawn images.
- **Images:** list every image's effective resolution at its printed size. Anything under 300 dpi
  gets flagged in the report (the current art is ~190 dpi full width — expected; the author is
  generating new high-res art). Don't upscale silently.
- **Safe zone:** check no text sits within 0.375" of the trim on any page.
- **PDF:** standard PDF with embedded fonts for KDP. IngramSpark prefers PDF/X-1a — if you can
  produce it reliably (for example with Ghostscript), add it; otherwise say so in the report.
- Render **every page** and look at it. No blank pages, no split pictures, no half-empty pages
  before a picture, contents numbers correct.

## 5. Deliverables
- Commit the updated build code, `design/`, the generated backgrounds, the updated placeholders
  and prompt sheet, and the built `.docx` + print `.pdf` (override `.gitignore` for the built files).
- Attach the `.docx` and `.pdf` in the chat as well.
- A short report: what changed, page count, contents check, font check, image-resolution table,
  anything that still blocks print (for example the 5 placeholders and the low-res art).
- Then add a line to `CLAUDE.md` that Starry Circuits + full-page pictures + bleed is now the
  approved design for every chapter (2–6 will be converted into it later).
