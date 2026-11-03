# Hands-On AI for Kids — chapter production (handoff)

Handoff from a Claude chat session (Oct 31 – Nov 3, 2026). Read this first; it is the project memory.

## The book
- Children's AI-education book series, ages 8–13. Author: Lokesh (self-publishing in Australia via **KDP + IngramSpark**).
- Characters: **Newton** (10-year-old curious kid, colour blue `1F5FA9`), **Byte** (friendly AI robot, teal `0E7C86`), **SparX** (clumsy drone, orange `C25E0A`; always spelled "SparX"; obsessed with **cookies**, never "biscuits"), **i-Nova** (new in Ch1 — see below, violet `4338CA`), **Blip** (lost pixel, Ch3 only), **Beacon** (Ch3 voice).
- Trim **8" × 10"**, no bleed: everything sits inside 0.75" margins (activity pages run 0.25" into the margins — still within KDP/IngramSpark no-bleed limits).
- Fonts: **Baloo 2** (headings/labels), **Andika** (body), **Caveat** (handwriting/notebook), Courier New (scan screens). Embedded in PDFs.
- Palette: blue `1F5FA9`, teal `0E7C86`, orange `C25E0A`, green `2E7D4F`, purple `6A4C93`, gold `D9B24C`, navy `0E1B33`, ink `2B2D42`.

## Approved design: "Design A" (use for every chapter)
The author chose Design A after seeing an alternative ("Sunny Lab", kept in `ch2/buildB_sunnylab.js` for reference only).
Components (all in `components.js`, shared by ch1/ch3; ch2 has them inline in `build.js`):
- **Section opener**: solid colour block, gold "SECTION n" pill, progress dots, white Baloo title, optional Caveat subtitle. Section colours vary per section.
- **Dialogue**: round character face icon + tinted bubble with character-colour left stripe and the name in small caps (`say()` / `dialogue()`). Narration is regular Andika (not italic).
- **Picture This**: `figure()` — label row ("PICTURE THIS" + optional "SPARX CRASH COUNT · n") + rule + picture + caption, kept on one page.
- **Newton's Notebook** (white card, red margin line, Caveat), **Byte Says / SparX-ism** quote cards, **Challenge/Mission Meter** (navy console, stars), **scan panel** (navy, mono), **Big Idea** (gold box + lightbulb), summaries, glossary tables, back-matter banners.
- Ch3 also uses a gold "THE BIG IDEA" box for Byte's key line per section.

## Hard-won rules from the author's feedback
1. **Picture placement matters most**: put each story picture *right where its scene happens* in the story (never all pictures at the end of a section). "Do & Discover" activity pages stay after the story (they're exercises).
2. Pictures never split across pages; rebalance (move a picture a few lines, shrink to ~400–470 px wide) to avoid big white gaps.
3. Preserve the author's text exactly unless asked. When asked to change dialogue, change only lines with comments/highlights. Fix obvious spelling only and report it.
4. Pop-culture refs: author wants a *few* Harry Potter / Pokémon / Marvel references, only where a short dialogue line has room (keeps it on one line). Flag trademark risk once, briefly.
5. Keep the "main content" visible (summary boxes, Big Idea boxes) — the story shouldn't hide the lessons.
6. Every delivery: rebuild, re-check contents page numbers, word-diff against the input, validate, view rendered pages.

## Chapter status
- **Ch1 — Welcome to AI World** → `ch1/` (latest work, 35 pages, `outputs/Chapter1_Welcome_to_AI_World_v2.*`)
  - **AI Prism replaced by i-Nova** (author's image: `art/inova_src.jpg`). i-Nova = "The Ever-learning AI": hooded figure of blue light, white-and-gold cape, faceless hood, cyan chest gem, golden ring, floats cross-legged over a glowing platform holding a book of light. It **speaks**: calm, wise-sounding, confidently wrong ("I have read four million pages. I am never wrong." → calls SparX a BIRD / "probably a pigeon" / cookie spaceship "I am 99% sure"). No button — it rises on its own.
  - Author's red notes done: removed "How This Book Works" page; livelier S1 intro; new pictures for Byte's bird photos and the cookie spaceship; Section 3 activity enlarged; Your Turn summaries redesigned (`summary2`: colour header, "What it means", example cards, numbered key points); each crossword/back-matter page has its own banner colour. Yellow highlights = reworked (BB-8 → "a Pokédex that talks back", Mario → "even Harry needed Ron and Hermione", scan-scene lines). Green highlights = kept.
  - **5 picture placeholders** (`art/placeholder_1..5.png`, square, alt text "IMAGE n PLACEHOLDER"): 1 cover, 2 i-Nova scan (after "BIRD: SPARX" readout), 3 Byte's bird photos, 4 Learning by Trying (old one showed a prism + "TEACH the Prism"), 5 cookie spaceship. Prompts: `ch1/Chapter1_Image_Prompts.md`. **Next step: when the author sends the 5 images, put them in `ch1/media/`, swap `art:placeholder_n.png` → the new file in `ch1/content.js`, rebuild, rebalance pages, recalibrate contents.**
  - Contents page lists no "A Note for Grown-Ups"/"Your Mission Map" (they don't exist). Section 2 "Do & Discover" sheet kept (text-heavy; rebuild as editable layout if author wants it changed).
- **Ch2 — The Portal to AI Land** → `ch2/` (now `components.js` + `content.js` like Ch1; 27 pages, `ch2/Chapter2_The_Portal_to_AI_Land_v3.*`). Updated Nov 3 from the author's reviewed file (`inputs/ch2_reviewed.docx`, not committed): **Prism → i-Nova** everywhere (violet bubbles, i-Nova scan panels, a few new i-Nova lines); yellow = simplified, red = rewritten, red notes followed and removed; new per-section summaries in `summary2` design; wide activity pages; a different banner colour per back-matter page; crash counts dropped (Ch1 has none).
  - Section 3 now *earns* the last challenge step: i-Nova is tested on a brand-new night photo, guesses FIREFLY, the team adds night photos, it learns → portal opens (concept: **testing**, added to summary + glossary). Meter track is "i-NOVA TRAINING" throughout (was "Keys to free SparX").
  - Newton's family-tree line fixed: i-Nova reads/talks (word kind) and is learning the picture kind, so "sitting inside all four boxes" is now true.
  - **5 placeholders** (`ch2/media/placeholder_1..5.png`, regenerate with `python3 ch2/placeholders.py ch2/media`): 1 i-Nova "LARGE BEE", 2 i-Nova "SMALL DRONE 94%", 3 Try AI Safely sheet (Puzzle 4 fixed), 4 i-Nova opens the portal, 5 Explorer's Check sheet ("Test it on something new" replaces "My Portal Question"). Prompts: `ch2/Chapter2_Image_Prompts.md` (also lists 3 optional regenerations: nesting-box bubble, Level 1 "robot idea/prototype", Facts "moth in Section 2").
  - "i-Nova" uses Word's non-breaking hyphen in Ch2 (`r()` in `ch2/components.js`) so it never splits at line ends; Ch1 doesn't have this yet.
  - Ch3 recap still says "Newton touched a prism he was told not to touch" — no longer true after Ch1/Ch2; fix when Ch3 gets its i-Nova update.
- **Ch3 — The Superpowers of AI** → `ch3/` (Design A, 33 pages, pictures on each section opener). 4 added refs: Hermione (S1), Ash/Pokémon (S2), Hogwarts Great Hall (S3), Hulk (S5). Also mentions "prism" a few times (leave until asked).
- Author's content review of Ch2 (not yet applied, only if asked): Newton's "sitting inside all four boxes" is factually wrong (picture classifier isn't in the LLM box); Section 2 is dialogue-heavy (put the 4 safety rules in a box); Section 3 has no new AI concept; 41%/94% never explained; "Keys to free SparX" and crash-count threads don't connect.

## Build pipeline
```bash
./setup.sh            # once: installs fonts to ~/.fonts, docx (npm) if missing
./build.sh 1          # ch1 → ch1/*.docx + *.pdf   (also: 2, 2b, 3)
pdftoppm -r 40 -png ch1/*.pdf /tmp/pg   # look at pages
```
- docx-js (v9). Ch1/Ch2/Ch3: `components.js` + `content.js` are concatenated into `build.js` then run. Image refs: `"art:xxx.png"` → `art/`, otherwise chapter `media/`.
- **Contents page numbers are two-pass**: build → find each section's page with `pdftotext -f N -l N -layout` → write `pages.json` (keys = bookmark ids) → rebuild. Bookmarks + `InternalHyperlink` make contents clickable.
- Checks before delivering: `python <docx-skill>/scripts/office/validate.py file.docx`; `pdffonts file.pdf` (all embedded); word-level diff vs input with pandoc + difflib; render and look at every page; list first/last line per page to catch orphan pages (a trailing `gap()` before a page break can create a blank page — slice it off).
- Gotchas: LibreOffice needs exact line spacing for Baloo/Caveat display lines (`exact: true`) or lines overlap; use `TabStopType.RIGHT` tabs (positional tabs don't render); avoid ✓/✗ glyphs (font fallback) — use words; adjacent tables merge in LibreOffice (inner borders vanish).
- Images are ~1254 px (≈190 dpi at full width) — fine but below the 300 dpi print recommendation; new images should be ≥2048 px.

## Folder map
- `art/` shared avatars (`av_newton/byte/sparx/inova/beacon.png`), `bulb.png`, hero, i-Nova source/card, placeholders
- `fonts/` TTFs · `inputs/` and `outputs/` are empty in the zip to keep it small — put the author’s latest input .docx files (Ch1 has red comments/highlights) in `inputs/` if a word-diff is needed; outputs are rebuilt with `./build.sh`
- `ch1/placeholders.py` regenerates placeholder PNGs (`python3 ch1/placeholders.py art`)
