// Hands-On AI for Kids — Chapter 2 — simplified "Science Fair" design system
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Footer,
  AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign, PageNumber, HeadingLevel,
  TableLayoutType, TabStopType, Bookmark, InternalHyperlink,
} = require("docx");

const MEDIA = __dirname + "/media/";
const ART = __dirname + "/../art/";
const PAGES = JSON.parse(fs.readFileSync(__dirname + "/pages.json", "utf8")); // contents page numbers (two-pass)

// ---------------- tokens ----------------
const C = {
  blue: "1F5FA9", teal: "0E7C86", orange: "C25E0A", green: "2E7D4F", purple: "6A4C93", gold: "D9B24C",
  ink: "2B2D42", soft: "5C6070", navy: "0E1B33", white: "FFFFFF", line: "D9DCE3",
  tintBlue: "E8F0FA", tintTeal: "E2F3F4", tintOrange: "FDEFE2", tintGold: "FFF3D1", tintGreen: "E6F2EA", tintPurple: "EFEAF6",
};
const F = { head: "Baloo 2", body: "Andika", hand: "Caveat", mono: "Courier New" };
const TW = 9360; // 6.5in text width
const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NB = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const box = (color, size = 12, style = BorderStyle.SINGLE) => { const b = { style, size, color }; return { top: b, bottom: b, left: b, right: b, insideHorizontal: NONE, insideVertical: NONE }; };
const shade = (fill) => ({ type: ShadingType.CLEAR, fill, color: "auto" });

// ---------------- primitives ----------------
const r = (text, o = {}) => new TextRun({ text, font: o.font || F.body, size: o.size || 24, color: o.color || C.ink, bold: o.bold, italics: o.italics, characterSpacing: o.sp, shading: o.shading, break: o.br });
function p(runs, o = {}) {
  return new Paragraph({
    children: Array.isArray(runs) ? runs : [runs], style: o.style, heading: o.heading, alignment: o.align,
    spacing: { before: o.before || 0, after: o.after ?? 120, line: o.line || 300, lineRule: o.exact ? "exact" : undefined },
    indent: o.indent, keepNext: o.keepNext, keepLines: o.keepLines, pageBreakBefore: o.pageBreak, tabStops: o.tabs,
  });
}
const gap = (pt = 8) => new Paragraph({ children: [], spacing: { before: 0, after: 0, line: pt * 20, lineRule: "exact" } });
const image = (file, w, type) => {
  const isArt = file.startsWith("art:");
  const data = fs.readFileSync(isArt ? ART + file.slice(4) : MEDIA + file);
  const t = type || (file.endsWith(".jpg") ? "jpg" : "png");
  // read dimensions
  const { w: iw, h: ih } = dims(data, t);
  return new ImageRun({ type: t, data, transformation: { width: w, height: Math.round(w * ih / iw) } });
};
function dims(buf, t) {
  if (t === "png") return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  let i = 2; while (i < buf.length) { const m = buf[i + 1]; const len = buf.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }; i += 2 + len; }
}
const cell = (children, o = {}) => new TableCell({ children, width: { size: o.w, type: WidthType.DXA }, shading: o.fill ? shade(o.fill) : undefined, borders: o.borders || NB, margins: o.m || { top: 0, bottom: 0, left: 0, right: 0 }, verticalAlign: o.va || VerticalAlign.CENTER });
const table = (cols, rows, o = {}) => new Table({ width: { size: cols.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: cols, layout: TableLayoutType.FIXED, borders: o.borders || NB, rows: rows.map((cells) => new TableRow({ children: cells, cantSplit: o.cantSplit !== false })) });

// story text — a run list mini-markup: *bold*, _italic_
function md(text, base = {}) {
  const out = []; const re = /(\*[^*]+\*|_[^_]+_)/g; let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(r(text.slice(last, m.index), base));
    const t = m[0];
    out.push(t[0] === "*" ? r(t.slice(1, -1), { ...base, bold: true, color: base.accent || C.blue }) : r(t.slice(1, -1), { ...base, italics: true }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(r(text.slice(last), base));
  return out;
}
const story = (text, o = {}) => p(md(text), { after: 140, line: 300, ...o });
const kicker = (left, o = {}) => p([
  r(left, { font: F.head, size: 18, bold: true, color: o.color || C.blue, sp: 40 }),
  ...(o.right ? [r("\t"), r(o.right, { font: F.head, size: 18, bold: true, color: C.orange, sp: 40 })] : []),
], { after: 60, line: 280, exact: true, pageBreak: o.pageBreak !== false, tabs: [{ type: TabStopType.RIGHT, position: TW }] });
const pageTitle = (t, color = C.ink) => p(r(t, { font: F.head, size: 40, bold: true, color }), { after: 160, line: 560, exact: true });
const caption = (t) => p(r(t, { size: 18, italics: true, color: C.soft }), { align: AlignmentType.CENTER, before: 60, after: 180, line: 260 });
const centerImg = (file, w) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [image(file, w)] });

// ---------------- components ----------------
const AV = { Newton: ["art:av_newton.png", C.blue, C.tintBlue], Byte: ["art:av_byte.png", C.teal, C.tintTeal], SparX: ["art:av_sparx.png", C.orange, C.tintOrange] };

// dialogue bubble: avatar + tinted bubble with character stripe
function say(who, text) {
  const [file, col, tint] = AV[who];
  const aw = 820;
  return [table([aw, TW - aw], [[
    cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [image(file, 44)] })], { w: aw, m: { top: 0, bottom: 0, left: 0, right: 100 } }),
    cell([
      p(r(who.toUpperCase(), { font: F.head, size: 17, bold: true, color: col, sp: 30 }), { after: 0, line: 260, exact: true }),
      p(md(text, { size: 23, accent: col }), { after: 0, line: 280 }),
    ], { w: TW - aw, fill: tint, borders: { left: { style: BorderStyle.SINGLE, size: 30, color: col }, top: NONE, bottom: NONE, right: NONE }, m: { top: 70, bottom: 80, left: 180, right: 180 } }),
  ]]), gap(5)];
}
const dialogue = (lines) => lines.flatMap(([w, t]) => say(w, t));

// opener band — solid colour block inside the margins
function opener({ label, title, color, dots, bookmark, sub }) {
  const dotRuns = dots === undefined ? [] : [r("\t"), ...[0, 1, 2].map((i) => r(i < dots ? "●  " : "○  ", { font: F.head, size: 22, color: i < dots ? C.gold : "FFFFFF" }))];
  const titlePara = new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 60, after: sub ? 40 : 0, line: 720, lineRule: "exact" },
    children: bookmark ? [new Bookmark({ id: bookmark, children: [r(title, { font: F.head, size: 56, bold: true, color: C.white })] })] : [r(title, { font: F.head, size: 56, bold: true, color: C.white })],
  });
  return [table([TW], [[cell([
    p([r(` ${label} `, { font: F.head, size: 19, bold: true, color: C.navy, sp: 30, shading: shade(C.gold) }), ...dotRuns], { after: 0, line: 340, exact: true, tabs: [{ type: TabStopType.RIGHT, position: TW - 760 }] }),
    titlePara,
    ...(sub ? [p(r(sub, { font: F.hand, size: 32, color: "FFE7A3" }), { after: 0, line: 420, exact: true })] : []),
  ], { w: TW, fill: color, m: { top: 260, bottom: 260, left: 380, right: 380 } })]]), gap(14)];
}

// labelled card (Newton's notebook)
function notebook(text) {
  return [table([TW], [[cell([
    p(r("NEWTON’S NOTEBOOK", { font: F.head, size: 18, bold: true, color: C.blue, sp: 40 }), { after: 20, line: 280, exact: true }),
    p(r(text, { font: F.hand, size: 30, color: C.blue }), { after: 0, line: 340 }),
  ], { w: TW, fill: "FFFFFF", borders: { left: { style: BorderStyle.SINGLE, size: 24, color: "E57373" }, top: { style: BorderStyle.SINGLE, size: 4, color: C.line }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.line }, right: { style: BorderStyle.SINGLE, size: 4, color: C.line } }, m: { top: 120, bottom: 140, left: 280, right: 240 } })]]), gap(12)];
}

// quote card (Byte Says / SparX-ism)
function quote(label, who, text, attribution) {
  const [file, col, tint] = AV[who];
  const aw = 1300;
  return [table([aw, TW - aw], [[
    cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [image(file, 64)] })], { w: aw, fill: tint, m: { top: 140, bottom: 140, left: 160, right: 0 } }),
    cell([
      p(r(label, { font: F.head, size: 19, bold: true, color: col, sp: 40 }), { after: 20, line: 280, exact: true }),
      p(r(`“${text}”`, { size: 26, bold: true, italics: true, color: C.ink }), { after: attribution ? 40 : 0, line: 312 }),
      ...(attribution ? [p(r(`— ${attribution}`, { font: F.head, size: 20, bold: true, color: col }), { after: 0, line: 280, exact: true })] : []),
    ], { w: TW - aw, fill: tint, m: { top: 140, bottom: 140, left: 200, right: 280 } }),
  ]], { borders: box(col, 12) }), gap(12)];
}

// navy console panel: mission meter / prism scan
function panel(children) {
  return [table([TW], [[cell(children, { w: TW, fill: C.navy, m: { top: 140, bottom: 160, left: 400, right: 400 } })]], { borders: box("38C6D4", 18) }), gap(12)];
}
function missionMeter(head, track, stars, text, status) {
  return panel([
    p(r(head, { font: F.head, size: 19, bold: true, color: "38C6D4", sp: 40 }), { after: 40, line: 280, exact: true }),
    p([r(track + "   ", { font: F.head, size: 22, bold: true, color: C.white, sp: 20 }), r("★ ".repeat(stars).trim(), { size: 26, color: "FFD86B" }), r(stars < 6 ? "  " + "☆ ".repeat(6 - stars).trim() : "", { size: 26, color: "6B7FA3" }), ...(status ? [r("   " + status, { font: F.head, size: 20, bold: true, color: "6EE7A8", sp: 20 })] : [])], { after: 60, line: 340, exact: true }),
    p(r(text, { size: 22, color: "E6ECF5" }), { after: 0, line: 290 }),
  ]).slice(0, 1);
}
function scan(text, ok) {
  return panel([
    p(r("◆ AI PRISM  ·  SCAN RESULT", { font: F.head, size: 18, bold: true, color: "38C6D4", sp: 40 }), { align: AlignmentType.CENTER, after: 40, line: 280, exact: true }),
    p(r(text, { font: F.mono, size: 30, bold: true, color: ok ? "6EE7A8" : "FF7A7A" }), { align: AlignmentType.CENTER, after: 0, line: 360, exact: true }),
  ]);
}

function bigIdea(label, text) {
  return [table([1500, TW - 1500], [[
    cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [image("art:bulb.png", 72)] })], { w: 1500, fill: C.tintGold, m: { top: 140, bottom: 140, left: 160, right: 0 } }),
    cell([
      p(r(label, { font: F.head, size: 20, bold: true, color: C.orange, sp: 40 }), { after: 20, line: 300, exact: true }),
      p(r(text, { size: 25, bold: true }), { after: 0, line: 300 }),
    ], { w: TW - 1500, fill: C.tintGold, m: { top: 160, bottom: 160, left: 160, right: 280 } }),
  ]], { borders: box(C.gold, 24) }), gap(12)];
}


// inline figure — sits inside the story at the moment it shows; never splits across pages
function figure({ crash, img, width, cap, color }) {
  return [gap(6), table([TW], [[cell([
    p([r("PICTURE THIS", { font: F.head, size: 18, bold: true, color, sp: 40 }), r("\t"), r(`SPARX CRASH COUNT  ·  ${crash}`, { font: F.head, size: 18, bold: true, color: C.orange, sp: 40 })],
      { after: 80, line: 280, exact: true, tabs: [{ type: TabStopType.RIGHT, position: TW }], border: undefined }),
    new Paragraph({ children: [], spacing: { before: 0, after: 120, line: 120, lineRule: "exact" }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color, space: 1 } } }),
    centerImg(img, width),
    ...(cap ? [p(r(cap, { size: 18, italics: true, color: C.soft }), { align: AlignmentType.CENTER, before: 80, after: 0, line: 260 })] : []),
  ], { w: TW })]]), gap(14)];
}

// Picture This / Do & Discover pages
function picturePage({ sec, kind, crash, title, img, width, cap, color, bookmark }) {
  const k = `SECTION ${sec}  ·  ${kind}`;
  const kick = p([
    bookmark ? new Bookmark({ id: bookmark, children: [r(k, { font: F.head, size: 18, bold: true, color, sp: 40 })] }) : r(k, { font: F.head, size: 18, bold: true, color, sp: 40 }),
    ...(crash ? [r("\t"), r(`SPARX CRASH COUNT  ·  ${crash}`, { font: F.head, size: 18, bold: true, color: C.orange, sp: 40 })] : []),
  ], { after: 60, line: 280, exact: true, pageBreak: true, tabs: [{ type: TabStopType.RIGHT, position: TW }] });
  return [kick, rule(color), pageTitle(title), centerImg(img, width), ...(cap ? [caption(cap)] : [gap(14)])];
}
const rule = (color) => new Paragraph({ children: [], spacing: { before: 0, after: 120, line: 120, lineRule: "exact" }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color, space: 1 } } });

// =========================================================================
// CONTENT
// =========================================================================
const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));

// ---------- Chapter opener ----------
add(p(r("HANDS-ON AI FOR KIDS", { font: F.head, size: 18, bold: true, color: C.blue, sp: 60 }), { after: 100, line: 280, exact: true }));
add(opener({ label: "CHAPTER 2", title: "The Portal to AI Land", color: C.blue, sub: "Part Two — the adventure continues with Newton, Byte & SparX" }));
add(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 240 }, children: [image("art:av_newton.png", 76), r("      "), image("art:av_byte.png", 76), r("      "), image("art:av_sparx.png", 76)] }));
add(p(r("THE STORY SO FAR", { font: F.head, size: 18, bold: true, color: C.teal, sp: 60 }), { after: 0, line: 280, exact: true }));
add(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { after: 120, line: 520, lineRule: "exact" }, children: [r("Where We Left Off", { font: F.head, size: 36, bold: true, color: C.ink })] }));
add(rule(C.teal));
add(story("At the school science fair, a glowing Prism recognised Newton as human and Byte as robot — but confidently called SparX a bird."));
add(story("To teach it better, Newton learned what AI is, how it learns from examples, and how clear prompts guide useful answers. Byte found a small camera inside the Prism, and Newton collected varied drone photos of SparX — with one cookie-filled ‘hero pose’ safely left out of the training pile."));
add(story("Before they begin the final training, Byte leads the team to a display of glowing nesting boxes that maps the AI family.", { after: 200 }));
add(quote("SPARX SAYS", "SparX", "I meant to do that.", "SparX (about everything)"));

// ---------- Contents ----------
add(p(r("CHAPTER 2", { font: F.head, size: 18, bold: true, color: C.blue, sp: 60 }), { after: 0, line: 280, exact: true, pageBreak: true }));
add(new Paragraph({ spacing: { after: 120, line: 640, lineRule: "exact" }, children: [r("Contents", { font: F.head, size: 48, bold: true })] }));
add(rule(C.blue));
const tocHead = (t, col) => p(r(t, { font: F.head, size: 19, bold: true, color: col, sp: 40 }), { before: 200, after: 80, line: 300, exact: true });
const tocRow = (label, anchor, page, o = {}) => new Paragraph({
  spacing: { after: 60, line: 360, lineRule: "exact" }, indent: o.sub ? { left: 440 } : undefined,
  tabStops: [{ type: TabStopType.RIGHT, position: TW, leader: "dot" }],
  children: [new InternalHyperlink({ anchor, children: [
    r(label, { font: o.sub ? F.body : F.head, size: o.sub ? 22 : 25, bold: !o.sub, color: o.sub ? C.soft : (o.color || C.ink), italics: o.sub }),
    r("\t" + page, { font: F.head, size: o.sub ? 22 : 25, bold: true, color: o.color || C.blue }),
  ] })],
});
add(tocHead("THE STORY CONTINUES  ·  SECTIONS 1–3", C.blue));
add(tocRow("Section 1 · The AI Family Tree", "s1", PAGES.s1, { color: C.blue }));
add(tocRow("Your Turn 1 — activity and summary", "yt1", PAGES.yt1, { sub: true }));
add(tocRow("Section 2 · Try AI Safely", "s2", PAGES.s2, { color: C.green }));
add(tocRow("Your Turn 2 — activity and summary", "yt2", PAGES.yt2, { sub: true }));
add(tocRow("Section 3 · The Portal to AI Land", "s3", PAGES.s3, { color: C.purple }));
add(tocRow("Your Turn 3 — activity and summary", "yt3", PAGES.yt3, { sub: true }));
add(tocHead("WHEN YOU GET TO THE END", C.teal));
add(tocRow("AI Explorer · Level 1", "lvl1", PAGES.lvl1));
add(tocRow("Everything You Learned", "learned", PAGES.learned));
add(tocRow("Unplugged Missions — two games, no screens", "unplugged", PAGES.unplugged));
add(tocRow("Amazing AI Facts and the People Behind Them", "facts", PAGES.facts));
add(tocRow("Parents’ Corner", "parents", PAGES.parents));
add(tocRow("Glossary — Acronyms & Key Words", "glossary", PAGES.glossary));

// ---------- Section 1 ----------
add(p([], { pageBreak: true, after: 0, line: 20, exact: true }));
add(opener({ label: "SECTION 1", title: "The AI Family Tree", color: C.blue, dots: 1, bookmark: "s1" }));
add(story("Byte led them to the glowing display Newton had spotted: four boxes, each tucked neatly inside the next like magical nesting toys."));
add(story("Newton squinted at the boxes."));
add(figure({ crash: 5, img: "ch1_image10.jpg", width: 560, cap: "Four ideas, tucked neatly inside one another like magical nesting boxes.", color: C.blue }));
add(dialogue([["Newton", "Whoa... are these four different AIs?"], ["Byte", "Not different AIs — one big family. Each idea lives inside a bigger one. Watch."]]));
add(story("Byte tapped the biggest box. SparX, naturally, flew straight into it.", { before: 80 }));
add(dialogue([["SparX", "I’m in the big one! The wall says... A-I. Roomy. Smells like the future."]]));
add(story("He bumped through into a smaller box glowing green.", { before: 80 }));
add(dialogue([["SparX", "*Machine Learning!* This one learns from examples. Like me learning which walls hurt most."]]));
add(story("Another bump. A smaller purple box lit up around him.", { before: 80 }));
add(dialogue([["SparX", "*Deep Learning!* Clues stacked in layers. I feel smarter already. Ow."]]));
add(story("One last wobble dropped him into the tiniest box of all.", { before: 80 }));
add(dialogue([
  ["SparX", "And THIS little one must be the cookie box."],
  ["Byte", "That one is an *LLM*, SparX — brilliant with words. Still not cookies. And notice: every small box still sits inside the big one. It is all AI."],
  ["Newton", "So the Prism uses the picture kind, not the word kind."],
  ["Byte", "Exactly the right question to ask."],
  ["Newton", "Does the Prism know it’s sitting inside all four boxes?"],
  ["Byte", "It doesn’t know a thing about itself. That part is your job."],
]));
add(story("With the AI family mapped, Newton looked back at the waiting Prism. He knew what kind of system it was — and where its picture-learning job fitted.", { before: 80, after: 200 }));
add(quote("BYTE SAYS", "Byte", "Biggest reader, smallest box. The size of an idea is not the size of its job."));
add(notebook("Draw four squares inside each other. Label them AI, Machine Learning, Deep Learning, LLM. That is the whole family on one page."));
add(missionMeter("MISSION METER", "PRISM TRAINING", 4, "You mapped the AI family from biggest idea to smallest. Now you know where the Prism fits. Challenge step 4 complete."));

add(picturePage({ sec: 1, kind: "DO & DISCOVER", title: "The AI Family Tree", img: "ch1_image11.jpg", width: 624, color: C.blue, bookmark: "yt1" }));

// ---------- Section 2 ----------
add(p([], { pageBreak: true, after: 0, line: 20, exact: true }));
add(opener({ label: "SECTION 2", title: "Try AI Safely", color: C.green, dots: 2, bookmark: "s2" }));
add(story("With the AI family mapped, Newton carried the drone photos back to the Prism. He reached for the training slot, but Byte stopped him."));
add(dialogue([
  ["Byte", "Before you open any AI tool, you run the safety checklist. Every single time. Ready?"],
  ["SparX", "Ooh, rules! I love ignoring— I mean, following those."],
]));
add(story("Newton got out his notebook and wrote fast as Byte spoke.", { before: 80 }));
add(dialogue([
  ["Byte", "*Rule one — a grown-up first.* Never open an AI tool on your own. A trusted adult stays close, the same way they would at a swimming pool."],
  ["Newton", "Got it. Grown-up first."],
  ["Byte", "*Rule two — keep private things private.* Some things are just yours: your full name, your home address, the name of your school, your phone number, your passwords, and clear photos of your face."],
  ["Newton", "What about things that are not secret?"],
  ["Byte", "Good question. Your favourite colour, a made-up robot name, the fact that dinosaurs are brilliant — all fine to share. The test is simple: could a stranger use this to find me or fool me? If yes, keep it in."],
  ["SparX", "My big secret is that I am ninety percent cookie. But you already knew that."],
  ["Newton", "And if the tool asks me for a private thing anyway?"],
  ["Byte", "Then you stop, and you tell your grown-up. A safe tool never needs your secrets to help you. Treat an AI like a helpful stranger — it can answer questions, but it does not get to know where you live."],
  ["Newton", "A helpful stranger. That makes it click."],
  ["Byte", "*Rule three — an AI can sound completely sure and still be completely wrong.* So check anything important with a grown-up, a book, or a website you trust."],
  ["Newton", "Like when it called SparX a bird, with total confidence?"],
  ["Byte", "Exactly that. Confident is not the same as correct."],
  ["Byte", "*Rule four — be kind, and trust your gut.* Never use an AI to be mean to anyone. And if an answer ever feels scary, rude, or just wrong, close it and tell a grown-up. That is not tattling — that is being smart."],
  ["Newton", "So: grown-up close, secrets in, double-check the answers, stay kind, and speak up if it feels off."],
  ["Byte", "Perfect. You just said the whole checklist in one breath. Now — with your grown-up right beside you — you are ready. Show it the photos."],
]));
add(story("With an adult beside him, Newton fed in his drone photos of SparX, one by one. The Prism blinked.", { before: 80, keepNext: true }));
add(scan("LARGE BEE — 41% SURE.", false));
add(dialogue([["SparX", "A BEE? I’ve got propellers, not wings!"]]));
add(story("Four photos were not enough — it had only seen him from the front. So, still with the grown-up helping, they photographed SparX from every angle: above, below, mid-spin, upside down in a plant pot. Newton checked each photo showed only SparX — no faces, no names, nothing private — then fed them all in. The Prism went quiet for three long seconds. Then the words changed:", { before: 80, keepNext: true }));
add(scan("SMALL DRONE — 94% SURE.", true));
add(figure({ crash: 6, img: "image3.png", width: 470, color: C.green }));
add(dialogue([
  ["SparX", "NINETY-FOUR! I’m practically famous."],
  ["Byte", "See? The Prism was sure it saw a bee, and it was wrong. Then it was sure it saw a small drone, and it was right. Confidence did not decide — better examples did."],
  ["Newton", "And I never handed it a single secret to get there."],
  ["Byte", "That is the whole game: safe, checked, and kind."],
  ["SparX", "Also famous. Do not forget famous."],
]));
add(gap(8));
add(quote("BYTE SAYS", "Byte", "Being sure isn’t the same as being right. Always ask what the AI learned from.", "Byte"));
add(notebook("Before you use any AI: Is a grown-up here? Am I keeping private things private? Have I checked the answer instead of just trusting it?"));
add(missionMeter("MISSION METER", "PRISM TRAINING", 5, "You trained the Prism safely: grown-up close, private details protected, answers checked, and kindness switched on. Challenge step 5 complete."));

add(picturePage({ sec: 2, kind: "DO & DISCOVER", title: "Try AI Safely", img: "image4.png", width: 624, color: C.green, bookmark: "yt2" }));

// ---------- Section 3 ----------
add(p([], { pageBreak: true, after: 0, line: 20, exact: true }));
add(opener({ label: "SECTION 3", title: "The Portal to AI Land", color: C.purple, dots: 3, bookmark: "s3" }));
add(story("The Prism hummed once, then folded open into a doorway of light. Its training display glowed: *SMALL DRONE. NAME: SPARX.*"));
add(figure({ crash: 7, img: "image5.png", width: 470, color: C.purple }));
add(dialogue([
  ["Byte", "It knows what SparX is now. It’ll let him through."],
  ["SparX", "Because I’m a small drone. Officially. In writing."],
  ["Newton", "What’s on the other side?"],
  ["Byte", "Superpowers. Machines that see and hear. Inventions nobody’s built yet."],
  ["SparX", "Are there cookies?"],
  ["Byte", "Possibly."],
  ["SparX", "Then I’m in."],
  ["Newton", "What if I get something wrong in there?"],
  ["Byte", "Then you’ll have learned something. That’s not the opposite of getting it right. It’s how you get there."],
  ["Newton", "I did touch the Prism when the sign said not to."],
  ["Byte", "You did. And then you fixed it. Both of those count."],
  ["Newton", "Wait — what if the portal closes behind us?"],
  ["Byte", "Then we solve the next problem together. That is what explorers do."],
]));
add(story("Newton checked his notebook one last time, took a breath, and stepped forward.", { before: 80 }));
add(dialogue([
  ["Newton", "Ready."],
  ["SparX", "Ready! Probably! Mostly!"],
  ["Byte", "Then let’s go, AI Explorer. The next chapter is on the other side."],
]));
add(gap(8));
add(quote("BYTE SAYS", "Byte", "You don’t need to know everything to start. You just need one good question."));
add(notebook("Write your portal question in pencil. Every good scientist changes the question once they have started looking for the answer."));
add(quote("SPARX-ISM", "SparX", "Something incredible is waiting to be discovered... probably behind the thing I just knocked over.", "SparX-ism"));
add(missionMeter("MISSION METER  ·  COMPLETE", "KEYS TO FREE SPARX", 6, "All six challenge steps complete. The Prism reads: SMALL DRONE. Name: SparX. Portal: OPEN.", "STATUS: UNLOCKED"));

add(picturePage({ sec: 3, kind: "DO & DISCOVER", title: "The Portal to AI Land", img: "image6.png", width: 624, color: C.purple, bookmark: "yt3" }));

// ---------- Back matter ----------
const backKicker = (t, bm, color = C.teal) => p([new Bookmark({ id: bm, children: [r(t, { font: F.head, size: 18, bold: true, color, sp: 40 })] })], { after: 60, line: 280, exact: true, pageBreak: true });
const backTitle = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 120, line: 600, lineRule: "exact" }, children: [r(t, { font: F.head, size: 44, bold: true, color: C.ink })] });

add(backKicker("MISSION COMPLETE", "lvl1"), backTitle("AI Explorer · Level 1"), rule(C.teal), centerImg("image7.png", 624));

add(backKicker("CHAPTER 2  ·  SUMMARY", "learned"), backTitle("Everything You Learned"), rule(C.teal));
const learnItem = (n, title, text, col, extra = []) => [table([900, TW - 900], [[
  cell([p(r(String(n), { font: F.head, size: 44, bold: true, color: C.white }), { align: AlignmentType.CENTER, after: 0, line: 560, exact: true })], { w: 900, fill: col, va: VerticalAlign.TOP, m: { top: 120, bottom: 0, left: 0, right: 0 } }),
  cell([
    p(r(title, { font: F.head, size: 26, bold: true, color: col }), { after: 40, line: 340, exact: true }),
    p(r(text, { size: 23 }), { after: extra.length ? 100 : 0, line: 290 }),
    ...extra,
  ], { w: TW - 900, fill: "F7F8FB", va: VerticalAlign.TOP, m: { top: 140, bottom: 160, left: 240, right: 240 } }),
]], { cantSplit: true }), gap(10)];
add(learnItem(1, "The AI family tree", "Artificial Intelligence is the biggest family. Machine Learning fits inside it, Deep Learning fits inside Machine Learning, and LLMs fit inside Deep Learning. The Prism uses picture patterns rather than the word-focused job of an LLM.", C.blue));
add(learnItem(2, "Try AI safely", "Keep a grown-up nearby, protect private details, check important answers, stay kind, and speak up if an AI answer feels wrong. Confidence is not the same as correctness.", C.green));
add(learnItem(3, "Better examples open doors", "Varied, carefully checked drone photos helped the Prism replace its bird and bee guesses with SMALL DRONE — and opened the portal to AI Land.", C.purple));
const miniSay = (who, t) => { const col = AV[who][1]; return p([r(who + ":  ", { font: F.head, size: 21, bold: true, color: col }), r(t, { size: 22, italics: true })], { after: 50, line: 280 }); };
add(learnItem(4, "Mistakes are clues", "Even the best inventors get things wrong — and that is exactly where the learning hides.", C.orange, [
  miniSay("SparX", "I got it wrong! I must be a bad robot!"),
  miniSay("Byte", "No, SparX — a wrong answer is just a clue for the next try."),
  miniSay("Newton", "And you don’t need to know everything to start. One good question is enough to begin any adventure in science!"),
]));
add(bigIdea("★  BIG IDEA  ★", "Map the AI family, train with varied examples, use AI safely, and treat every mistake as a clue that points to a better answer!"));

add(backKicker("NO SCREENS REQUIRED", "unplugged"), rule(C.teal), centerImg("image8.png", 576), gap(14));
add(quote("BYTE SAYS", "Byte", "Curiosity grows best when children feel safe to ask, test, laugh, rethink, and try again.", "Byte"));

add(backKicker("AMAZING AI FACTS", "facts"), rule(C.teal), gap(10), centerImg("image9.jpg", 624));

add(backKicker("A QUICK GUIDE FOR GROWN-UPS", "parents"), rule(C.teal), centerImg("image10.png", 560), caption("A grown-up helps Newton connect creativity, privacy and thoughtful design."));

add(backKicker("CHAPTER 2 GLOSSARY", "glossary"), backTitle("Acronyms & Key Words"), rule(C.teal));
add(p(r("Big ideas become easier when you know the words. Come back here whenever you need a quick reminder.", { size: 22, italics: true, color: C.soft }), { after: 200, line: 290 }));
const gloss = [
  ["Classifier", "An AI system that sorts things into groups, such as cat or dog."],
  ["Confidence", "How sure an AI is about a guess, shown as a percentage. High confidence is not the same as being correct."],
  ["Deep Learning", "Learning in layers — edges, then shapes, then whole objects."],
  ["LLM", "Large Language Model — an AI trained on huge amounts of text that predicts what word comes next."],
  ["Machine Learning", "The part of AI that learns from examples instead of fixed rules."],
  ["Privacy", "Keeping personal information safe and controlling who can see it."],
  ["Prompt", "An instruction you give an AI about what you want it to do or create."],
  ["Prompt Recipe", "A simple way to ask an AI: be clear, add details, show an example, then improve it."],
  ["Uncertainty", "How unsure an AI is about its guess, often shown as a confidence percentage."],
];
const gw = [2700, TW - 2700];
const hl = { style: BorderStyle.SINGLE, size: 4, color: C.line };
add(new Table({
  width: { size: TW, type: WidthType.DXA }, columnWidths: gw, layout: TableLayoutType.FIXED,
  borders: { top: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, bottom: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, left: NONE, right: NONE, insideHorizontal: hl, insideVertical: NONE },
  rows: gloss.map(([t, d], i) => new TableRow({ cantSplit: true, children: [
    cell([p(r(t, { font: F.head, size: 24, bold: true, color: C.teal }), { after: 0, line: 300 })], { w: gw[0], fill: i % 2 ? "FFFFFF" : C.tintTeal, va: VerticalAlign.TOP, m: { top: 100, bottom: 100, left: 200, right: 120 } }),
    cell([p(r(d, { size: 22 }), { after: 0, line: 290 })], { w: gw[1], fill: i % 2 ? "FFFFFF" : C.tintTeal, va: VerticalAlign.TOP, m: { top: 100, bottom: 100, left: 160, right: 200 } }),
  ] })),
}));
add(gap(18));
add(table([TW], [[cell([
  p(r("NEXT UP  ·  CHAPTER 3", { font: F.head, size: 19, bold: true, color: C.orange, sp: 40 }), { after: 40, line: 280, exact: true }),
  p(r("The portal closed behind them with a soft click. SparX patted his cargo hatch, then went very quiet — which never happens. The cookie tin he had been guarding was still on the other side. Next mission: AI Superpowers. And one very small rescue.", { size: 23, bold: true }), { after: 0, line: 300 }),
], { w: TW, fill: C.tintOrange, borders: { left: { style: BorderStyle.SINGLE, size: 36, color: C.orange }, top: NONE, bottom: NONE, right: NONE }, m: { top: 160, bottom: 180, left: 300, right: 300 } })]]));
add(p(r("END OF CHAPTER 2", { font: F.head, size: 20, bold: true, color: C.soft, sp: 80 }), { align: AlignmentType.CENTER, before: 280, after: 0, line: 300 }));

// =========================================================================
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  r("Hands-On AI for Kids  ·  Chapter 2  ·  ", { font: F.head, size: 17, color: "8A8FA3" }),
  new TextRun({ children: [PageNumber.CURRENT], font: F.head, size: 18, bold: true, color: C.blue }),
] })] });

const doc = new Document({
  creator: "Hands-On AI for Kids", title: "Chapter 2 · The Portal to AI Land", description: "Hands-On AI for Kids — Chapter 2",
  styles: {
    default: { document: { run: { font: F.body, size: 24, color: C.ink } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: F.head, size: 56, bold: true }, paragraph: { outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: F.head, size: 36, bold: true }, paragraph: { outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11520, height: 14400 }, margin: { top: 1080, bottom: 1150, left: 1080, right: 1080, header: 500, footer: 560 }, pageNumbers: { start: 1 } } },
    footers: { default: footer },
    children: body,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(__dirname + "/Chapter2_The_Portal_to_AI_Land_v2.docx", b); console.log("ok"); });
