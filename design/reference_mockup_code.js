// Mockup: 3 background styles × (story page + full-page activity page), at bleed size 8.125" × 10.25"
const { Header, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType } = require("docx");
AV["i-Nova"] = ["art:av_inova.png", "4338CA", "ECEBFC"];
const PW = 11700, PH = 14760; // 8.125" × 10.25" (bleed on top, bottom and outside edge)
const pageImg = (file, wIn, yIn, behind) => new ImageRun({
  type: file.endsWith(".jpg") ? "jpg" : "png", data: fs.readFileSync(ART + file),
  transformation: { width: Math.round(wIn * 96), height: Math.round(wIn * 96 * (file.startsWith("bg_") ? 10.25 / 8.125 : 1)) },
  floating: {
    horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
    verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yIn * 914400) },
    behindDocument: behind, allowOverlap: true, wrap: { type: TextWrappingType.NONE },
  },
});
const bgHeader = (style) => new Header({ children: [new Paragraph({ children: [pageImg(`bg_${style}.png`, 8.125, 0, true)] })] });
const nameTag = (t) => p([r(`  STYLE: ${t}  `, { font: F.head, size: 16, bold: true, color: C.white, shading: shade(C.ink), sp: 40 })], { align: AlignmentType.RIGHT, after: 120, line: 280, exact: true });

function storyPage(styleName) {
  return [
    nameTag(styleName),
    story("Then, all at once, every light in the hall flickered. A hush rolled across the fair. In the far corner, a round platform began to hum — and a hooded figure made of glowing blue light rose slowly into the air."),
    ...dialogue([
      ["i-Nova", "Greetings, humans. I am *i-Nova*, the Ever-learning AI. I have read four million pages. I am never wrong."],
      ["SparX", "Ooh, it’s scanning me! Quick — get my left side. That’s my heroic side."],
      ["i-Nova", "Scanning complete."],
    ]),
    gap(6),
    ...panel([
      p([r("i-NOVA SCAN", { font: F.head, size: 18, bold: true, color: "A5B4FC", sp: 60 })], { align: AlignmentType.CENTER, after: 40, line: 280, exact: true }),
      p([r("HUMAN: NEWTON.  ROBOT: BYTE.", { font: F.mono, size: 26, bold: true, color: "6EE7A8" })], { align: AlignmentType.CENTER, after: 40, line: 320, exact: true }),
      p([r("The light settled on SparX. ", { size: 22, italics: true, color: "C9D6EA" }), r("BIRD: SPARX.", { font: F.mono, size: 26, bold: true, color: "FF7A7A" })], { align: AlignmentType.CENTER, after: 0, line: 320, exact: true }),
    ]),
    ...dialogue([
      ["SparX", "A BIRD?! I have propellers, not feathers! Here, i-Nova — study my cookie photos instead."],
      ["i-Nova", "Analysing… Round. Golden. Covered in spots. New conclusion: you are a spotty bird who loves snacks."],
      ["Byte", "Those are cookies, SparX. i-Nova isn’t being rude — it’s still learning, and it only knows what it has been shown."],
    ]),
    gap(6),
    ...notebook("Write one thing you could show i-Nova so it learns what a drone really looks like."),
  ];
}
function activityPage(styleName) {
  return [
    nameTag(styleName),
    p([r("SECTION 3  ·  DO & DISCOVER  ·  YOUR TURN 2", { font: F.head, size: 18, bold: true, color: C.purple, sp: 50 })], { after: 0, line: 300, exact: true }),
    new Paragraph({ spacing: { after: 0 }, children: [pageImg("image7.png", 8.125, 1.55, false)] }),
  ];
}
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [r("Hands-On AI for Kids  ·  Chapter 1  ·  mockup", { font: F.head, size: 17, color: "8A8FA3" })] })] });
const props = { page: { size: { width: PW, height: PH }, margin: { top: 1260, bottom: 1330, left: 1080, right: 1260, header: 0, footer: 560 } } };
const STYLES = [["pastel", "PASTEL DOODLES"], ["circuits", "STARRY CIRCUITS"], ["notebook", "NOTEBOOK PAPER"]];
const sections = [];
STYLES.forEach(([k, n]) => {
  sections.push({ properties: props, headers: { default: bgHeader(k) }, footers: { default: footer }, children: storyPage(n) });
  sections.push({ properties: props, headers: { default: bgHeader(k) }, footers: { default: footer }, children: activityPage(n) });
});
const doc = new Document({ styles: { default: { document: { run: { font: F.body, size: 24, color: C.ink } } } }, sections });
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(__dirname + "/Background_Mockups.docx", b); console.log("ok"); });
