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
const { LevelFormat, HeightRule } = require("docx");

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
function opener({ label, title, color, dots, bookmark, sub, total = 3 }) {
  const dotRuns = dots === undefined ? [] : [r("\t"), ...[...Array(total).keys()].map((i) => r(i < dots ? "●  " : "○  ", { font: F.head, size: 22, color: i < dots ? C.gold : "FFFFFF" }))];
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
    p([r("PICTURE THIS", { font: F.head, size: 18, bold: true, color, sp: 40 }), ...(crash ? [r("\t"), r(`SPARX CRASH COUNT  ·  ${crash}`, { font: F.head, size: 18, bold: true, color: C.orange, sp: 40 })] : [])],
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
    ...(crash ? [...(crash ? [r("\t"), r(`SPARX CRASH COUNT  ·  ${crash}`, { font: F.head, size: 18, bold: true, color: C.orange, sp: 40 })] : [])] : []),
  ], { after: 60, line: 280, exact: true, pageBreak: true, tabs: [{ type: TabStopType.RIGHT, position: TW }] });
  return [kick, rule(color), pageTitle(title), centerImg(img, width), ...(cap ? [caption(cap)] : [gap(14)])];
}
const rule = (color) => new Paragraph({ children: [], spacing: { before: 0, after: 120, line: 120, lineRule: "exact" }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color, space: 1 } } });

