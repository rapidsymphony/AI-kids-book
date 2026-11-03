// =========================================================================
// CHAPTER 1 CONTENT — Design A, pictures placed where their scene happens
// =========================================================================
const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));
const SEC = { 1: C.blue, 2: C.green, 3: C.purple, 4: C.orange };
const label = (t, color, o = {}) => p(o.bm ? [new Bookmark({ id: o.bm, children: [r(t, { font: F.head, size: 18, bold: true, color, sp: 50 })] })] : [r(t, { font: F.head, size: 18, bold: true, color, sp: 50 })], { after: o.after ?? 40, line: 280, exact: true, pageBreak: o.pageBreak, keepNext: true, before: o.before });
const h1 = (t, o = {}) => new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 0, after: 100, line: o.line || 640, lineRule: "exact" }, children: [r(t, { font: F.head, size: o.size || 48, bold: true, color: o.color || C.ink })] });
const intro = (t) => p(md(t, { size: 22, italics: true, color: C.soft }), { after: 200, line: 290 });
const bullet = (runs, o = {}) => new Paragraph({ children: Array.isArray(runs) ? runs : md(runs, { size: o.size || 23 }), numbering: { reference: "bul", level: 0 }, spacing: { after: o.after ?? 60, line: 290 } });
const pageBreakPara = () => p([], { pageBreak: true, after: 0, line: 20, exact: true });
const INOVA = "4338CA", INOVA_TINT = "ECEBFC";
AV["i-Nova"] = ["art:av_inova.png", INOVA, INOVA_TINT];
// placeholder pictures — each one is a real image at the final shape, so Word's "Change Picture" swaps it in place
const PH = {
  1: "Chapter cover — i-Nova at the science fair",
  2: "Section 1 — i-Nova appears and scans the crew",
  3: "Section 2 — Byte's bird photos",
  4: "Section 2 — Learning by trying",
  5: "Section 4 — The cookie spaceship",
};
Object.entries(PH).forEach(([n, d]) => { ALT[`art:placeholder_${n}.png`] = { name: `IMAGE ${n} PLACEHOLDER`, desc: `Replace with Image ${n}: ${d}. Right-click > Change Picture > From a File.` }; });
// activity sheets run 0.25in into each margin so they print as large as possible (still inside KDP/IngramSpark no-bleed limits)
const wideImg = (file) => new Paragraph({ alignment: AlignmentType.CENTER, indent: { left: -360, right: -360 }, spacing: { after: 0 }, children: [image(file, 672)] });
const activityPage = (n, kicker, file, bm, color) => [
  label(kicker, color, { pageBreak: true, bm }), rule(color), wideImg(file),
];
// back-matter banner — each page gets its own colour
const banner = (lbl, title, color, bm, sub) => opener({ label: lbl, title, color, bookmark: bm, sub });

// redesigned summary: coloured header, definition panel, example cards, numbered key points
function summary2({ color, tint, kicker, question, def, flow, examples, points, bm }) {
  const out = [];
  out.push(table([TW], [[cell([
    p([bm ? new Bookmark({ id: bm, children: [r(kicker, { font: F.head, size: 18, bold: true, color: "FFFFFF", sp: 60 })] }) : r(kicker, { font: F.head, size: 18, bold: true, color: "FFFFFF", sp: 60 })], { after: 20, line: 280, exact: true }),
    p(r(question, { font: F.head, size: 40, bold: true, color: C.white }), { after: 0, line: 520, exact: true }),
  ], { w: TW, fill: color, m: { top: 200, bottom: 200, left: 360, right: 360 } })]]));
  out.push(table([TW], [[cell([
    p(r("WHAT IT MEANS", { font: F.head, size: 17, bold: true, color, sp: 50 }), { after: 40, line: 260, exact: true }),
    p(def, { after: 0, line: 300 }),
  ], { w: TW, fill: tint, m: { top: 180, bottom: 200, left: 360, right: 360 } })]]));
  if (flow) { out.push(gap(10)); out.push(flow); }
  out.push(gap(14));
  out.push(p(r("IN THE REAL WORLD", { font: F.head, size: 18, bold: true, color, sp: 50 }), { after: 80, line: 280, exact: true, keepNext: true }));
  const n = examples.length, g = 160, w = Math.floor((TW - g * (n - 1)) / n);
  const cols = []; const cells = [];
  examples.forEach((e, i) => {
    cols.push(w); cells.push(cell([
      p(r(`EXAMPLE ${i + 1}`, { font: F.head, size: 16, bold: true, color, sp: 40 }), { after: 40, line: 240, exact: true }),
      p(md(e, { size: 21 }), { after: 0, line: 270 }),
    ], { w, fill: "FFFFFF", va: VerticalAlign.TOP, borders: { top: { style: BorderStyle.SINGLE, size: 30, color }, left: { style: BorderStyle.SINGLE, size: 4, color: C.line }, right: { style: BorderStyle.SINGLE, size: 4, color: C.line }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.line } }, m: { top: 140, bottom: 160, left: 180, right: 180 } }));
    if (i < n - 1) { cols.push(g); cells.push(cell([p([], { after: 0 })], { w: g })); }
  });
  cols[cols.length - 1] += TW - cols.reduce((a, b) => a + b, 0);
  out.push(table(cols, [cells]));
  out.push(gap(16));
  out.push(p(r("KEY POINTS", { font: F.head, size: 18, bold: true, color, sp: 50 }), { after: 80, line: 280, exact: true, keepNext: true }));
  out.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [700, TW - 700], layout: TableLayoutType.FIXED, borders: NB,
    rows: points.map((t, i) => new TableRow({ cantSplit: true, children: [
      cell([p(r(String(i + 1), { font: F.head, size: 26, bold: true, color: C.white }), { align: AlignmentType.CENTER, after: 0, line: 340, exact: true })], { w: 700, fill: color }),
      cell([p(md(t, { size: 22 }), { after: 0, line: 280 })], { w: TW - 700, fill: i % 2 ? "FFFFFF" : tint, m: { top: 110, bottom: 110, left: 220, right: 220 } }),
    ] })) }));
  return out;
}

// generic info card: coloured label + children
function card(head, color, tint, children, o = {}) {
  return [table([TW], [[cell([
    p(r(head, { font: F.head, size: 19, bold: true, color, sp: 50 }), { after: 80, line: 300, exact: true }),
    ...children,
  ], { w: TW, fill: tint, borders: o.stripe ? { left: { style: BorderStyle.SINGLE, size: 36, color }, top: NONE, bottom: NONE, right: NONE } : box(color, 12), m: { top: 160, bottom: 180, left: 320, right: 320 } })]], { cantSplit: o.cantSplit !== false }), gap(14)];
}
const sub = (t, color = C.ink) => p(r(t, { font: F.head, size: 23, bold: true, color }), { before: 100, after: 40, line: 320, exact: true, keepNext: true });
const para = (t, o = {}) => p(md(t, { size: 23 }), { after: 80, line: 290, ...o });

// summary card used at the end of Sections 2–4
const summary = (color, tint, children, bm) => card("SUMMARY OF WHAT YOU HAVE LEARNED SO FAR", color, tint, children, { cantSplit: false });

// ---------------------------------------------------------------- PAGE 1 · opener
add(p(r("HANDS-ON AI FOR KIDS", { font: F.head, size: 18, bold: true, color: C.blue, sp: 60 }), { after: 100, line: 280, exact: true }));
add(opener({ label: "CHAPTER 1", title: "Hands-On AI for Kids", color: C.blue, sub: "An AI powered adventure with Newton, Byte & SparX" }));
add(centerImg("art:placeholder_1.png", 540));
add(caption("Newton, Byte and SparX meet i-Nova, the Ever-learning AI, at a lively science fair."));

// ---------------------------------------------------------------- PAGE 2 · Dear Reader
add(p([new Bookmark({ id: "whatbook", children: [] })], { pageBreak: true, after: 0, line: 20, exact: true }));
const L = (runs, o = {}) => p(runs, { after: o.after ?? 240, line: 410, align: o.align });
const lt = (t, o = {}) => r(t, { size: 30, ...o });
const em1 = (t) => lt(t, { bold: true, color: C.blue });
add(table([TW], [[cell([
  p(r("Dear Young Reader,", { font: F.hand, size: 76, bold: true, color: C.blue }), { after: 200, line: 900, exact: true }),
  L([lt("The world you’re growing up in is full of AI and "), em1("you have been chosen...."), lt(" "), em1("AI World needs a new explorer, and we think it should be you.")]),
  L([lt("Inside this book, machines can see, listen, talk and learn. But they can’t do it alone. They need humans to teach them, test them, and make sure they use their powers wisely.")]),
  L([lt("Newton, Byte and SparX will be your guides. Along the way, you’ll tackle puzzles, try hands-on challenges, and uncover the big ideas behind the technology that’s changing our world.")]),
  L([lt("You don’t need to be a computer genius. You just need a curious mind, and the courage to ask "), lt("“Why?”", { bold: true, color: C.orange })], { after: 260 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 120 }, border: { top: { style: BorderStyle.SINGLE, size: 8, color: C.gold, space: 12 } }, children: [
    r("Ready? Turn the page. ", { font: F.head, size: 38, bold: true, color: C.ink }),
    r("AI World is waiting.........", { font: F.head, size: 38, bold: true, color: C.orange }),
  ] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 }, children: [image("art:av_newton.png", 64), r("     "), image("art:av_byte.png", 64), r("     "), image("art:av_sparx.png", 64)] }),
], { w: TW, fill: "FFF8E8", borders: { top: { style: BorderStyle.DOUBLE, size: 18, color: C.gold }, bottom: { style: BorderStyle.DOUBLE, size: 18, color: C.gold }, left: { style: BorderStyle.DOUBLE, size: 18, color: C.gold }, right: { style: BorderStyle.DOUBLE, size: 18, color: C.gold } }, m: { top: 560, bottom: 520, left: 620, right: 620 } })]]));

// ---------------------------------------------------------------- PAGE 3 · three things
add(pageBreakPara());
add(card("THREE THINGS YOU SHOULD KNOW FIRST", C.teal, C.tintTeal, [
  bullet("You already use AI. Your phone unlocking. Your music app. The bus tracker. All of it.", { after: 100 }),
  bullet("AI is not magic and it has no brain. It spots patterns in examples that people gave it.", { after: 100 }),
  bullet("It gets things wrong. Sometimes hilariously. Working out WHY is the fun part.", { after: 0 }),
]));
add(story("This book will not teach you which buttons to press. It teaches you how these machines actually think — so when one gives you a confident answer that happens to be completely wrong, you will spot it.", { after: 220 }));
add(card("ONE LAST THING", C.orange, C.tintOrange, [para("You are allowed to get it wrong. SparX gets everything wrong and he is having the time of his life.", { after: 0 })], { stripe: true }));

// ---------------------------------------------------------------- Contents
add(label("CHAPTER 1", C.blue, { pageBreak: true }));
add(new Paragraph({ spacing: { after: 120, line: 640, lineRule: "exact" }, children: [r("Contents", { font: F.head, size: 48, bold: true })] }));
add(rule(C.blue));
const tocHead = (t, col) => p(r(t, { font: F.head, size: 19, bold: true, color: col, sp: 40 }), { before: 180, after: 70, line: 300, exact: true });
const tocRow = (lbl, anchor, o = {}) => new Paragraph({
  spacing: { after: 50, line: 340, lineRule: "exact" }, indent: o.sub ? { left: 440 } : undefined,
  tabStops: [{ type: TabStopType.RIGHT, position: TW, leader: "dot" }],
  children: [new InternalHyperlink({ anchor, children: [
    r(lbl, { font: o.sub ? F.body : F.head, size: o.sub ? 21 : 24, bold: !o.sub, color: o.sub ? C.soft : (o.color || C.ink), italics: o.sub }),
    r("\t" + (PAGES[anchor] || "?"), { font: F.head, size: o.sub ? 21 : 24, bold: true, color: o.color || C.blue }),
  ] })],
});
add(tocHead("GETTING STARTED", C.teal));
add(tocRow("So... What Is This Book?", "whatbook"));
add(tocRow("Meet Your Adventure Crew", "crew"));
add(tocHead("THE STORY  ·  PART ONE (SECTIONS 1–4)", C.blue));
add(tocRow("Section 1 · The Science Fair Surprise", "s1", { color: C.blue }));
add(tocRow("Section 2 · What Is AI", "s2", { color: C.green }));
add(tocRow("Your Turn 1 — activity and summary", "yt1", { sub: true }));
add(tocRow("Section 3 · How AI Learns", "s3", { color: C.purple }));
add(tocRow("Your Turn 2 — activity and summary", "yt2", { sub: true }));
add(tocRow("Section 4 · How to Talk to AI", "s4", { color: C.orange }));
add(tocRow("Your Turn 3 — activity and summary", "yt3", { sub: true }));
add(tocHead("WHEN YOU GET TO THE END", C.teal));
add(tocRow("Everything You Learned", "learned"));
add(tocRow("AI Crossword", "cross"));
add(tocRow("Pattern Detective — a no-screen game", "pattern"));
add(tocRow("Amazing AI Facts and the People Behind Them", "facts"));
add(tocRow("Answer Key — Crossword Answers", "answers"));
add(tocRow("Glossary — Acronyms & Key Words", "glossary"));
add(tocRow("Parents’ Corner", "parents"));

// ---------------------------------------------------------------- Meet the crew
add(label("START HERE", C.teal, { pageBreak: true, bm: "crew" }));
add(h1("Meet Your Adventure Crew"));
add(rule(C.teal));
add(intro("You will always know who is speaking. Each character has their own colour and their own stripe down the side of the page."));
add(centerImg("image2.png", 540));
add(gap(14));
add(table([2700, TW - 2700], [[
  cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [image("art:inova_card.jpg", 165)] })], { w: 2700, fill: "0E1B33", m: { top: 80, bottom: 80, left: 80, right: 80 } }),
  cell([
    p([r("i-NOVA", { font: F.head, size: 40, bold: true, color: INOVA }), r("   THE EVER-LEARNING AI", { font: F.head, size: 18, bold: true, color: C.soft, sp: 40 })], { after: 60, line: 480, exact: true }),
    p([r("A glowing AI made of light, floating over a book of everything it has read.", { size: 21 })], { after: 70, line: 270 }),
    p([r("Best skill: ", { size: 21, bold: true, color: INOVA }), r("learning from examples", { size: 21 })], { after: 40, line: 270 }),
    p([r("Still learning: ", { size: 21, bold: true, color: INOVA }), r("what a drone looks like", { size: 21 })], { after: 40, line: 270 }),
    p([r("Known for: ", { size: 21, bold: true, color: INOVA }), r("being 100% sure… and sometimes 100% wrong", { size: 21 })], { after: 0, line: 270 }),
  ], { w: TW - 2700, fill: INOVA_TINT, m: { top: 160, bottom: 160, left: 300, right: 240 } }),
]], { borders: box(INOVA, 12) }));

// ================================================================ SECTION 1
add(pageBreakPara());
add(opener({ label: "SECTION 1", title: "The Science Fair Surprise", color: SEC[1], dots: 1, total: 4, bookmark: "s1", sub: "“One school hall, a Science Fair, a hundred questions, and an adventure Newton never saw coming!”" }));
add(story("Newton loved science fairs, and today his school was buzzing with excitement. This year’s Great School Science Fair was extra special — the theme was *Artificial Intelligence*."));
add(story("Newton had heard people talk about AI — but what was it, and what could it really do? Could a computer think like the Hogwarts Sorting Hat? Could a machine learn and get stronger, the way a Pokémon levels up after every battle?"));
add(story("He didn’t know the answers yet. But that was the best part of a science fair — you began with a question!"));
add(story("He raced through a magnetic maze in record time. He ducked as a model volcano erupted right on cue, showering the judges in pink foam. He watched a tiny robot sort coloured blocks faster than his eyes could follow. Then, wedged between two tables, he spotted a wobbly cardboard sign covered in far too much glitter:"));
add(table([6400], [[cell([p(r("ROBOT PROJECT — ASK ME ANYTHING!", { font: F.head, size: 30, bold: true, color: C.orange, sp: 10 }), { align: AlignmentType.CENTER, after: 0, line: 420, exact: true })], { w: 6400, fill: "FFF6DC", m: { top: 120, bottom: 120, left: 200, right: 200 } })]], { borders: box(C.gold, 18, BorderStyle.DASHED), align: AlignmentType.CENTER }));
add(gap(10));
add(story("Newton pressed the big TALK button."));
add(story("The robot looked up! Its round head tilted, and its bright smile glowed like an LED."));
add(dialogue([
  ["Byte", "Hi there! I’m Byte, your friendly Artificial Intelligence buddy — think of me as a pocket-sized robot helper, a bit like a Pokédex that talks back."],
  ["Newton", "Wait — you can actually talk?"],
  ["Byte", "I can talk, spot patterns, and lend a hand. Want to explore the fair together? Every good adventure needs a team — even Harry needed Ron and Hermione."],
]));
add(story("They had only reached the drone display when a loud *WHIRRRRR* echoed from above. A mini drone spiralled down like a confused mosquito and crashed beside them.", { before: 80 }));
add(dialogue([
  ["Byte", "And that... is SparX."],
  ["SparX", "I meant to do that. That was a landing. A very advanced landing — Spider-Man would be taking notes."],
  ["Newton", "You should come with us."],
]));
add(story("Then, all at once, every light in the hall flickered. A hush rolled across the fair. In the far corner, a round platform began to hum — and a hooded figure made of glowing blue light rose slowly into the air. Its cape rippled like water. An open book of light floated in its hands, and a golden ring spun around its head.", { before: 80 }));
add(dialogue([
  ["i-Nova", "Greetings, humans. I am *i-Nova*, the Ever-learning AI. I have read four million pages. I am never wrong."],
  ["SparX", "Ooh, it’s scanning me! Quick — get my left side. That’s my heroic side."],
  ["i-Nova", "Scanning complete."],
]));
add(panel([
  p([r("i-NOVA SCAN", { font: F.head, size: 18, bold: true, color: "A5B4FC", sp: 60 })], { align: AlignmentType.CENTER, after: 40, line: 280, exact: true }),
  p([r("HUMAN: NEWTON.  ROBOT: BYTE.", { font: F.mono, size: 26, bold: true, color: "6EE7A8" })], { align: AlignmentType.CENTER, after: 40, line: 320, exact: true }),
  p([r("The light settled on SparX. ", { size: 22, italics: true, color: "C9D6EA" }), r("BIRD: SPARX.", { font: F.mono, size: 26, bold: true, color: "FF7A7A" })], { align: AlignmentType.CENTER, after: 0, line: 320, exact: true }),
]));
add(figure({ img: "art:placeholder_2.png", width: 430, color: SEC[1] }));
add(dialogue([
  ["SparX", "A BIRD?! I have propellers, not feathers! Here, i-Nova — study my cookie photos instead. Very me. Very important. Very adorable."],
  ["i-Nova", "Analysing… Round. Golden. Covered in spots. New conclusion: you are a spotty bird who loves snacks."],
  ["Byte", "Those are cookies, SparX. i-Nova isn’t being rude — it’s still learning, and it only knows what it has been shown."],
  ["i-Nova", "Correct. Teach me to recognise SparX… and a *BIG SURPRISE* is yours."],
  ["SparX", "A surprise? Is it cookies? Please say it’s cookies."],
]));
add(gap(8));
add(table([TW], [[cell([
  p(r("Newton opened his notebook to a clean page and wrote one word at the top:", { size: 22, color: C.soft }), { after: 0, line: 300, exact: true }),
  p([r("TEACH", { font: F.hand, size: 56, bold: true, color: C.blue }), r("     Underneath, he added: ", { size: 22, color: C.soft }), r("teach i-Nova WHAT?", { font: F.hand, size: 40, color: C.blue })], { after: 0, line: 720, exact: true }),
], { w: TW, fill: "FFFFFF", borders: { left: { style: BorderStyle.SINGLE, size: 24, color: "E57373" }, top: { style: BorderStyle.SINGLE, size: 4, color: C.line }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.line }, right: { style: BorderStyle.SINGLE, size: 4, color: C.line } }, m: { top: 120, bottom: 120, left: 300, right: 240 } })]]));

// ================================================================ SECTION 2
add(pageBreakPara());
add(opener({ label: "SECTION 2", title: "What Is AI", color: SEC[2], dots: 2, total: 4, bookmark: "s2" }));
add(story("Imagine you got a new puppy. On day one, it doesn’t know its name or a single trick. But every day it watches and tries, and you give a treat when it gets things right. Soon, it sits the moment you say “sit.” Nobody put “sit” inside its brain — it learned by seeing lots of examples."));
add(story("AI learns almost the same way. AI stands for *Artificial Intelligence*: _artificial_ means made by people, and _intelligence_ means being clever enough to think, learn, and solve problems."));
add(story("To teach an AI what a cat looks like, you don’t give it a rulebook. You show it thousands of cat pictures until it spots the pattern all by itself. Then it can look at a brand-new picture and say, “That’s a cat!”"));
add(story("But AI is a great learner, not a perfect one. Just like a puppy might get confused, AI can make mistakes too — sometimes it sees a fluffy dog and shouts, “Cat!”"));
add(story("So AI isn’t magic. There’s no Harry Potter wand! And it isn’t alive. It’s a clever machine that learns from examples and does its best to help."));
add(story("The same trick lets AI do amazing things:", { after: 80, keepNext: true }));
add(bullet("It can listen to your voice and understand what you asked."));
add(bullet("It can read your question and write an answer."));
add(bullet("It can look at a photo and tell you what’s inside it."));
add(bullet("It can even help a robot find its way across a room without crashing.", { after: 160 }));
add(story("Byte projected a cluster of colourful icons into the air."));
add(dialogue([["Byte", "That’s me — living proof! I spot patterns in thousands of examples and use them to make my best guess. Watch this."]]));
add(story("Byte flashed three photos into the air: a robin, a sparrow, and a little blue kingfisher. Then a fourth photo appeared, hidden behind a question mark.", { before: 80 }));
add(figure({ img: "art:placeholder_3.png", width: 400, color: SEC[2] }));
add(dialogue([
  ["Byte", "Three of these are birds. No rulebook, no telling — just examples. Go on, put on your detective hat like Sherlock Holmes: what do you think the fourth one is?"],
  ["Newton", "...a bird?"],
  ["Byte", "You just spotted the pattern from examples alone. That is exactly how an AI does it."],
]));
add(story("And that was the whole secret, right there. Nobody handed Newton a list of bird rules — must have feathers, must have a beak. He simply saw enough birds to know what a bird was. *An AI learns the very same way: example after example, until the pattern clicks.*", { before: 80 }));
add(dialogue([
  ["Newton", "So... like teaching a pet tricks?"],
  ["Byte", "Exactly! Except an AI can learn thousands of tricks at once — a bit like a Pokémon that never stops levelling up."],
  ["SparX", "I know tricks! Watch this!"],
]));
add(story("SparX tried to flip, bumped straight into a poster, and knocked it clean over.", { before: 80 }));
add(dialogue([
  ["SparX", "First I crash into the wall. Then I crash into a slightly different wall. Eventually — mostly — I miss the wall! That’s how I train. Even a Jedi drops the lightsaber a few times before the magic works."],
  ["Newton", "So to train i-Nova, I need to show it examples — not tell it rules."],
  ["Byte", "Now you’re thinking. i-Nova is waiting — and so is your surprise."],
  ["i-Nova", "I am ready to learn. Also, I have decided SparX is probably a pigeon."],
]));
add(figure({ img: "art:placeholder_4.png", width: 430, color: SEC[2] }));
add(notebook("Try this: teach somebody how to spot a bird — without using the word “bird”. Examples are easier than rules, every time."));
add(quote("BYTE SAYS", "Byte", "AI follows patterns from the examples it was shown. Better examples help it make better guesses.", "Byte"));
add(missionMeter("CHALLENGE METER", "i-NOVA TRAINING", 1, "You found the right kind of clue: AI learns patterns from examples, not rules or cookie photos. Challenge step 1 complete."));
add(gap(12));
add(summary2({ color: SEC[2], tint: C.tintGreen, kicker: "YOUR TURN 1  ·  SUMMARY", question: "What is Artificial Intelligence (AI)?", bm: "yt1",
  def: md("AI is a Technology that enables machines to think, learn and behave like humans to perform intelligent tasks. It learns from data, solve problems and make decisions.", { size: 23 }),
  examples: ["Voice Assistants like Siri on iPhone and Alexa", "Chatbots like ChatGPT", "Self-driving cars"],
  points: ["AI helps machines perform human like tasks", "AI learns from data and patterns and improves over time", "AI is used in many real-world applications – Face recognition, Self driving cars", "AI does not replace humans, but assists them in making better decisions"],
}));
add(activityPage(2, "SECTION 2  ·  DO & DISCOVER  ·  YOUR TURN 1", "image5.jpg", null, SEC[2]));
add(gap(18));
add(quote("SPARX-ISM", "SparX", "My logic level is 2%. My enthusiasm level is 200%."));

// ================================================================ SECTION 3
add(pageBreakPara());
add(opener({ label: "SECTION 3", title: "How AI Learns", color: SEC[3], dots: 3, total: 4, bookmark: "s3" }));
add(story("Newton had decided to train i-Nova to recognise SparX — challenge accepted! He already knew an AI learns by spotting patterns in examples, a bit like Spider-Man feeling his spider-sense tingle when danger is near. But what happened after i-Nova spotted its clues? Newton was about to find out.", { after: 200 }));
const io = (head, text, col, tint) => cell([
  p(r(head, { font: F.head, size: 24, bold: true, color: col, sp: 40 }), { align: AlignmentType.CENTER, after: 60, line: 320, exact: true }),
  p(r(text, { size: 20 }), { align: AlignmentType.CENTER, after: 0, line: 260 }),
], { w: 2900, fill: tint, va: VerticalAlign.TOP, borders: { top: { style: BorderStyle.SINGLE, size: 36, color: col }, left: NONE, right: NONE, bottom: NONE }, m: { top: 140, bottom: 160, left: 160, right: 160 } });
const arrow = () => cell([p(r("→", { font: F.head, size: 40, bold: true, color: C.gold }), { align: AlignmentType.CENTER, after: 0, line: 400, exact: true })], { w: 330 });
add(table([2900, 330, 2900, 330, 2900], [[
  io("INPUT", "What you show or tell the AI: a photo, question, or sound.", C.blue, C.tintBlue), arrow(),
  io("LEARNING", "The AI searches those examples for useful patterns.", C.green, C.tintGreen), arrow(),
  io("OUTPUT", "The AI answers, predicts, or takes an action.", C.purple, C.tintPurple),
]]));
add(gap(16));
add(dialogue([
  ["Newton", "Three boxes — input, learning, output. What does that mean?"],
  ["Byte", "Say you show it a photo. That photo is the *input*. It hunts for patterns — four legs, fur, a waggy tail — and that is the *learning*. Then it makes a decision and announces “dog!” That is the *output*. Input, learning, output — three steps, every single time."],
  ["SparX", "Sometimes the output is complete nonsense, though. Once I was absolutely certain a banana was a phone. I tried to call my mum on it for ten whole minutes. Even the Minions would’ve told me to give up."],
  ["Newton", "Wait — AI makes mistakes too?"],
  ["Byte", "All the time, just like people. The difference is it learns from every mistake and slowly gets better. Watch — I’ll show you how i-Nova learns, the way you’d teach a new puppy."],
]));
add(story("Byte spread ten photos of cats across the table — big cats, tiny kittens, a fluffy one, even a grumpy cat wearing a tiny hat.", { before: 80 }));
add(figure({ img: "image6.png", width: 450, color: SEC[3] }));
add(dialogue([
  ["Byte", "Look at all ten. What does every single cat have?"],
  ["Newton", "Whiskers. Pointy ears. A tail. Four legs. And eyes that say they own the place — like Garfield judging the whole room."],
  ["Byte", "Exactly! You just did what an AI does — you looked at lots of examples and spotted the pattern they share. That is called *training*."],
  ["SparX", "I spotted a pattern too. All ten cats are ignoring me."],
  ["Byte", "Now, the important question. Who chose these ten photos?"],
  ["Newton", "You did. You picked them."],
  ["Byte", "People always do. A person picks every example and puts a label on it — “this is a cat,” “this is not a cat.” The AI only ever learns from what it is shown."],
  ["Newton", "So if you only showed it orange cats..."],
  ["Byte", "...it would grow up thinking every cat in the world is orange. Show it one unfair pile of examples and it learns that unfair idea. This mistake even has a name: *bias*. It’s like meeting only the villains in a Marvel film and deciding everyone in the city must be a bad guy."],
  ["Newton", "Bias. So i-Nova kept shouting “bird” because—"],
  ["Byte", "Because nearly every photo it had ever seen was a bird. A few of SparX’s cookie snaps sneaked in, but mostly it was birds, birds, and more birds."],
  ["SparX", "In my defence, those cookies looked really tasty."],
  ["i-Nova", "It is true. I have studied 9,412 pigeons and only one drone. It was upside down."],
  ["Newton", "So i-Nova isn’t broken. It just needs better examples — not a bigger brain."],
  ["Byte", "Now you’re thinking like an engineer. Change what it learns from, and you change what it knows. Feed it drones, and at last it will see a drone."],
  ["SparX", "Please hurry. I have a reputation to protect."],
]));
add(story("Byte popped open a little hatch on his tummy and pulled out a small instant camera. Newton photographed SparX from the front, the side, above, and mid-flight. The clear drone photos went into Newton’s backpack for the final test.", { before: 80, after: 200 }));
add(notebook("Look at five photos of your family. What do all five have in common? That is exactly what training an AI feels like."));
add(missionMeter("CHALLENGE METER", "i-NOVA TRAINING", 2, "You traced i-Nova’s learning path: input, learning, output — and spotted how bad examples create bias. Challenge step 2 complete."));
add(gap(12));
add(quote("SPARX-ISM", "SparX", "If you never mess up, you’re not trying hard enough. Trust me, I’m a professional mess-upper.", "SparX-ism"));
add(activityPage(3, "SECTION 3  ·  DO & DISCOVER  ·  YOUR TURN 2", "image7.png", "yt2", SEC[3]));
add(pageBreakPara());
add(summary2({ color: SEC[3], tint: C.tintPurple, kicker: "YOUR TURN 2  ·  SUMMARY", question: "How Does AI Learn?",
  def: md("AI learns by looking at lots of examples and finding the patterns they share. This is called *training*. Every time an AI works, it follows three steps:", { size: 23, accent: SEC[3] }),
  flow: table([2900, 330, 2900, 330, 2900], [[
    io("INPUT", "What you show or tell the AI, such as a photo, a question or a sound", C.blue, C.tintBlue), arrow(),
    io("LEARNING", "The AI searches for patterns in its examples", C.green, C.tintGreen), arrow(),
    io("OUTPUT", "The AI gives an answer, makes a prediction or takes an action", C.purple, C.tintPurple),
  ]]),
  examples: ["A photo app learns to recognise your pet after seeing many pictures of it", "Music apps learn which songs you like from the ones you play and skip"],
  points: ["AI learns from examples chosen and labelled by people, such as “this is a cat” or “this is not a cat”", "AI only knows what it has been shown", "If the examples are unfair or one-sided, the AI learns an unfair idea. This is called *bias*", "AI makes mistakes, just like people, but it can improve when it learns from better examples"],
}));

// ================================================================ SECTION 4
add(pageBreakPara());
add(opener({ label: "SECTION 4", title: "How to Talk to AI (Prompting)", color: SEC[4], dots: 4, total: 4, bookmark: "s4" }));
add(story("Newton had figured out how an AI learns. Now he faced a trickier challenge: getting the AI to understand exactly what he meant. It was a little like casting a spell at Hogwarts — say the words wrong, and you might end up with something very different from what you pictured."));
add(story("The cat examples had shown Newton how an AI learns. Now Byte turned to i-Nova. A *prompt* is the instruction you give an AI, and here’s the secret: *an AI does what you say, not what you mean.* Ask in a fuzzy way and you get a fuzzy answer. Ask clearly, and it can amaze you."));
add(dialogue([
  ["Byte", "A prompt is simply how you ask an AI for something. Watch what happens when I’m lazy about it. One word, no details: “spaceship.” That’s like walking up to a genie and asking for “stuff.”"],
  ["Newton", "That’s it? Just “spaceship”?"],
  ["Byte", "That’s it. Now look at what it makes."],
]));
add(story("i-Nova closed its eyes. The pages of its glowing book flipped all by themselves — and a large, round, chocolate-chip spaceship shimmered into the air.", { before: 80 }));
add(dialogue([["i-Nova", "Behold. A spaceship. I am 99% sure."]]));
add(figure({ img: "art:placeholder_5.png", width: 400, color: SEC[4] }));
add(dialogue([
  ["SparX", "Ooh — is that a flying cookie? It’s beautiful. I love it. Can we keep it? I’ll call him Crumbs and love him forever, like Toothless."],
  ["Newton", "Byte, why did it draw a cookie with wings?"],
  ["Byte", "Because “spaceship” told it almost nothing, so it filled in the gaps with a guess. i-Nova did exactly what I said — not what I meant."],
  ["SparX", "For the record, I definitely meant cookie."],
  ["Byte", "Let me try again, properly this time. Clear goal first, then details, then an example to copy."],
]));
add(story("Byte spoke slowly and clearly: *“Draw a shiny silver rocket, tall and pointy, with three blue flames, in a cartoon comic-book style.”*", { before: 80 }));
add(dialogue([
  ["i-Nova", "Behold. A shiny silver rocket. This time I am 100%… well, 98% sure."],
  ["Newton", "Whoa! That one actually looks like a real rocket!"],
  ["Byte", "Same machine. Same three seconds. The only thing that changed was how I asked. That is *prompt power*."],
  ["Newton", "So there’s a trick to asking well?"],
  ["Byte", "A recipe, really. *Step one, be clear about the goal* — “draw a rocket,” not just “rocket.” *Step two, add details* — colour, size, how many, what mood. *Step three, show an example* — “like a comic book.” *Step four, if it isn’t right, improve it:* ask again with one small fix."],
  ["SparX", "A recipe! At last, my area of genius. Clear goal, the right ingredients, and a picture of the cookie you want — easy as following a treasure map in Minecraft."],
  ["Newton", "And if the very first answer comes out wrong?"],
  ["Byte", "You don’t start over — you nudge it. “Make it shorter.” “Add a dragon.” “Why did you pick that?” Every follow-up gets you closer. Watch: “Make the rocket red, and give it two round windows.”"],
]));
add(story("The rocket turned red and grew two little round windows. SparX pressed his face against one.", { before: 80 }));
add(dialogue([
  ["SparX", "I call the window seat!"],
  ["Newton", "So a good prompt is like a good map. The clearer it is, the faster you get where you’re going."],
  ["Byte", "Now you’ve got it. Ask like that, and the AI stops guessing and starts helping."],
]));
add(story("Newton had cracked the secret of prompting. Then four glowing boxes flickered to life across the fair, each tucked inside the next. SparX’s eyes lit up. “Please tell me one of those is a cookie box.”", { before: 80, after: 200 }));
add(notebook("Turn a lazy prompt into a strong one. Take “draw a dog” and add three details: what kind of dog, doing what, in what style."));
add(missionMeter("CHALLENGE METER", "i-NOVA TRAINING", 3, "You learned the Prompt Recipe: set a clear goal, add details, show an example, then improve the answer. Challenge step 3 complete."));
add(gap(12));
add(quote("BYTE SAYS", "Byte", "A great answer starts with a great question. Say what you want, add detail, show an example."));
add(pageBreakPara());
add(summary2({ color: SEC[4], tint: C.tintOrange, kicker: "YOUR TURN 3  ·  SUMMARY", question: "What is a Prompt?", bm: "yt3",
  def: [r("A prompt is the instruction you give an AI. It is how you ask an AI to do something. An AI does what you ", { size: 23 }), r("say", { size: 23, italics: true, bold: true, color: SEC[4] }), r(", not what you ", { size: 23 }), r("mean", { size: 23, italics: true, bold: true, color: SEC[4] }), r(", so a fuzzy prompt gets a fuzzy answer and a clear prompt gets a great one.", { size: 23 })],
  examples: ["Asking a chatbot, “Explain volcanoes in three short sentences for a 10-year-old”", "Asking a drawing app for “a happy orange cat wearing a party hat, cartoon style”"],
  points: ["A prompt is how you talk to AI", "If you leave out details, the AI guesses, and its guess may be very different from what you pictured", "The same AI can give a poor answer or an amazing one. The only difference is how you ask", "You don’t need to start over when the answer is wrong. Nudge it with follow-ups like “Make it shorter” or “Add a dragon”", "A good prompt is like a good map: the clearer it is, the faster you get where you want to go"],
}));

// ================================================================ BACK MATTER
add(pageBreakPara());
add(banner("CHAPTER 1  ·  SUMMARY", "Everything You Learned", C.teal, "learned"));
const learnItem = (n, title, runs, col, extra = []) => [table([900, TW - 900], [[
  cell([p(r(String(n), { font: F.head, size: 44, bold: true, color: C.white }), { align: AlignmentType.CENTER, after: 0, line: 560, exact: true })], { w: 900, fill: col, va: VerticalAlign.TOP, m: { top: 120, bottom: 0, left: 0, right: 0 } }),
  cell([
    p(r(title, { font: F.head, size: 26, bold: true, color: col }), { after: 40, line: 340, exact: true }),
    p(runs, { after: extra.length ? 80 : 0, line: 280 }),
    ...extra,
  ], { w: TW - 900, fill: "F7F8FB", va: VerticalAlign.TOP, m: { top: 110, bottom: 120, left: 240, right: 240 } }),
]]), gap(8)];
add(learnItem(1, "What is AI?", md("AI is short for *Artificial Intelligence*. It is a smart machine. It can talk. It can learn. It can make choices. But AI does not learn from a list of rules. It learns by looking at lots of examples. That is how you learned the word “dog” too!", { size: 21 }), C.blue));
add(learnItem(2, "How does AI learn?", md("AI learns in three steps: Input → Learning → Output. People choose and label the examples. Varied examples help it find a fairer pattern; lopsided examples can create bias.", { size: 21 }), C.green));
add(learnItem(3, "How to talk to AI", md("A prompt is the instruction you give an AI. Use the Prompt Recipe: be clear about the goal, add details, show an example, then improve the answer with a small follow-up.", { size: 21 }), C.purple, [
  p(r("CLEAR GOAL  ·  ADD DETAILS  ·  SHOW AN EXAMPLE  ·  IMPROVE IT", { font: F.head, size: 19, bold: true, color: C.white, sp: 30, shading: shade(C.purple) }), { after: 0, line: 300, exact: true }),
]));
add(learnItem(4, "Mistakes are clues", md("AI can make confident mistakes. A wrong answer is a clue: check the examples, improve the prompt, and try again — just as Newton, Byte and SparX do.", { size: 21 }), C.orange));
// nested Prompt Recipe boxes
const nest = (lvl) => {
  const L = [["CLEAR GOAL", C.blue, C.tintBlue], ["ADD DETAILS", C.green, C.tintGreen], ["SHOW AN EXAMPLE", C.purple, C.tintPurple], ["IMPROVE THE ANSWER", C.orange, C.tintOrange]][lvl];
  const w = TW - lvl * 900;
  const inner = [p(r(L[0], { font: F.head, size: 21, bold: true, color: L[1], sp: 40 }), { align: AlignmentType.CENTER, after: 30, line: 280, exact: true })];
  if (lvl < 3) inner.push(nest(lvl + 1)); else inner.push(p(r("(Ask again with one small fix.)", { size: 20, italics: true, color: C.soft }), { align: AlignmentType.CENTER, after: 0, line: 280 }));
  return new Table({ width: { size: w, type: WidthType.DXA }, columnWidths: [w], layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER, borders: box(L[1], 16),
    rows: [new TableRow({ cantSplit: true, children: [cell([...inner, ...(lvl < 3 ? [p([], { after: 0, line: 60, exact: true })] : [])], { w, fill: L[2], m: { top: 40, bottom: 40, left: 450, right: 450 } })] })] });
};
add(gap(2), nest(0), gap(10));
add(bigIdea("★  BIG IDEA  ★", "AI learns from examples, and clear prompts help it turn those patterns into useful answers.").slice(0, 1));

// ---------- crossword
const GRID = [
  ".CALCULATOR..E", "..L...E......X", "..G..MACHINE.A", "D.O.S.R....X.M", "E.R.C.N....P.P",
  "E.I.R.I....L.L", "PATTERN....O.E", "..H.E.G..WORDS", "HUMAN......E..", ".......LAYERS.",
];
const NUMS = { "0,1": 1, "0,2": 2, "0,6": 3, "0,13": 4, "2,5": 5, "2,11": 6, "3,0": 7, "3,4": 8, "6,0": 9, "7,9": 10, "8,0": 11, "9,7": 12 };
function crossword(filled) {
  const cw = 520, rows = [];
  const cols = Array(14).fill(cw);
  const B = { style: BorderStyle.SINGLE, size: 12, color: C.navy };
  GRID.forEach((row, ri) => {
    rows.push(new TableRow({ height: { value: cw, rule: HeightRule.EXACT }, children: [...row].map((ch, ci) => {
      const on = ch !== ".";
      const num = NUMS[`${ri},${ci}`];
      const kids = [];
      kids.push(new Paragraph({ spacing: { after: 0, line: 180, lineRule: "exact" }, indent: { left: 30 }, children: num ? [r(String(num), { font: F.head, size: 14, bold: true, color: C.blue })] : [] }));
      kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: 360, lineRule: "exact" }, children: on && filled ? [r(ch, { font: F.head, size: 26, bold: true, color: C.ink })] : [] }));
      return new TableCell({ width: { size: cw, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 0 }, shading: on ? shade(filled ? "FFF3D1" : C.tintBlue) : undefined, borders: on ? { top: B, bottom: B, left: B, right: B } : NB, children: kids });
    }) }));
  });
  return new Table({ width: { size: cw * 14, type: WidthType.DXA }, columnWidths: cols, layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER, borders: NB, rows });
}
add(pageBreakPara());
add(banner("ACTIVITY 1", "AI Crossword", C.blue, "cross"));
add(intro("Read each clue. Write one letter in each box. The number tells you where the word starts!"));
add(p([r("⚡ LEVEL UP ", { font: F.head, size: 21, bold: true, color: C.orange }), r("(ages 11–13): try finishing it from the clues alone — no peeking back at the story.", { size: 21, italics: true, color: C.soft })], { after: 160, line: 280 }));
add(card("SPARX’S HINT", C.orange, C.tintOrange, [p([r("There are ", { size: 22 }), r("12 words", { size: 22, bold: true }), r(" hiding in this grid. I tried it first and got ", { size: 22 }), r("zero", { size: 22, bold: true }), r(" — but I was upside down in a plant pot. You will do much better! Every answer lives somewhere in Chapter 1.", { size: 22 })], { after: 0, line: 290 })], { stripe: true }));
add(crossword(false));
const clueCol = (head, col, clues) => cell([
  p(r(head, { font: F.head, size: 24, bold: true, color: col, sp: 40 }), { after: 100, line: 320, exact: true }),
  ...clues.map(([n, t, len]) => p([r(n + ".  ", { font: F.head, size: 22, bold: true, color: col }), r(t, { size: 22 }), r(`  (${len})`, { size: 20, color: C.soft })], { after: 100, line: 290 })),
], { w: TW / 2, va: VerticalAlign.TOP, fill: col === C.blue ? C.tintBlue : C.tintGreen, m: { top: 160, bottom: 160, left: 240, right: 240 } });
add(pageBreakPara());
add(banner("ACTIVITY 1  ·  CLUES", "Crack the Clues", C.green));
add(table([TW / 2, TW / 2], [[
  clueCol("ACROSS  →", C.blue, [["1", "It has a screen but never learns anything.", 10], ["5", "AI is a smart ______ that can talk and learn.", 7], ["9", "AI finds a ______ by looking at many examples.", 7], ["10", "An LLM is built for ______.", 5], ["11", "AI does jobs that usually need ______ thinking.", 5], ["12", "Deep Learning works in ______.", 6]]),
  clueCol("DOWN  ↓", C.green, [["2", "A list of steps someone wrote, like a recipe.", 9], ["3", "Machine ______ means a computer learns from examples.", 8], ["4", "You teach an AI by showing it lots of ______.", 8], ["6", "Spotting AI around you makes you an AI ______.", 8], ["7", "______ Learning sits inside Machine Learning.", 4], ["8", "Having a ______ does not always mean it is AI.", 6]]),
]]));
add(gap(20));
add(quote("SPARX SAYS", "SparX", "Stuck on a clue? Flip back into the story. That’s where I hid… I mean, where the answers live."));
// ---------- pattern detective
add(pageBreakPara());
add(banner("ACTIVITY 2  ·  NO SCREENS NEEDED", "Pattern Detective", C.purple, "pattern"));
add(card("PATTERN DETECTIVE", C.purple, C.tintPurple, [
  p(r("Teaches: AI finds patterns  ·  Players: 1+  ·  Time: 10 min  ·  Needs: this page and a pencil", { size: 20, italics: true, color: C.soft }), { after: 120, line: 280 }),
  para("Look at each row. Find the hidden rule. Then circle the one that does NOT belong."),
  ...[["Row A:", "apple  ·  banana  ·  carrot  ·  grape"], ["Row B:", "2  ·  4  ·  6  ·  9  ·  8"], ["Row C:", "dog  ·  cat  ·  car  ·  rabbit  ·  horse"], ["Row D:", "circle  ·  ball  ·  box  ·  moon  ·  orange"]].map(([a, b]) => p([r(a + "   ", { font: F.head, size: 23, bold: true, color: C.purple }), r(b, { size: 24 })], { after: 80, line: 320, indent: { left: 200 } })),
  p([r("Answers (no peeking!): ", { size: 20, bold: true, color: C.soft }), r("A carrot · B nine · C car · D box", { size: 20, italics: true, color: C.soft })], { before: 80, after: 100, line: 280 }),
  p(r("★ Big idea: AI is a pattern finder. It looks at many things and works out the rule.", { size: 23, bold: true, color: C.purple }), { after: 100, line: 300 }),
  p([r("⚡ Level up: ", { font: F.head, size: 22, bold: true, color: C.orange }), r("invent your own Row E — four things that share a rule, plus one sneaky odd-one-out — and see if a grown-up can crack it.", { size: 22 })], { after: 0, line: 290 }),
]));

// ---------- amazing facts
add(pageBreakPara());
add(banner("TRUE STORIES", "Amazing AI Facts", C.navy, "facts"));
add(intro("Every one of these really happened. Some of them are still happening right now."));
add(centerImg("image8.png", 470));

// ---------- answers
add(pageBreakPara());
add(banner("ANSWER KEY", "AI Crossword Answers", "B8901F", "answers"));
add(intro("All the answers are filled in below. Check your work — no peeking too soon!"));
add(card("★ HOW DID YOU GO? ★", C.gold === "D9B24C" ? "B8901F" : C.gold, C.tintGold, [p([r("All twelve answers are filled in below. ", { size: 22 }), r("Ticked them all?", { size: 22, bold: true }), r(" You are officially an ", { size: 22 }), r("AI Explorer!", { size: 22, bold: true }), r(" Missed a few? Flip back into the story — that is where every clue is hiding.", { size: 22 })], { after: 0, line: 290 })], { stripe: true }));
add(crossword(true));
add(gap(16));
const ansCol = (head, col, list) => cell([p(r(head, { font: F.head, size: 24, bold: true, color: col, sp: 40 }), { after: 80, line: 320, exact: true }), ...list.map((t) => p(r(t, { font: F.head, size: 22, bold: true }), { after: 0, line: 290, exact: true }))], { w: TW / 2, va: VerticalAlign.TOP, fill: col === C.blue ? C.tintBlue : C.tintGreen, m: { top: 120, bottom: 120, left: 300, right: 240 } });
add(table([TW / 2, TW / 2], [[
  ansCol("ACROSS  →", C.blue, ["1. CALCULATOR", "5. MACHINE", "9. PATTERN", "10. WORDS", "11. HUMAN", "12. LAYERS"]),
  ansCol("DOWN  ↓", C.green, ["2. ALGORITHM", "3. LEARNING", "4. EXAMPLES", "6. EXPLORER", "7. DEEP", "8. SCREEN"]),
]]));

// ---------- glossary
add(pageBreakPara());
add(banner("CHAPTER 1 GLOSSARY", "Acronyms & Key Words", C.teal, "glossary"));
add(intro("Big ideas become easier when you know the words. Come back here whenever you need a quick reminder."));
const gloss = [
  ["AI", "Artificial Intelligence — a computer system that learns patterns from examples to make decisions or guesses."],
  ["Algorithm", "A step-by-step set of instructions — like a recipe for a computer."],
  ["Artificial", "Made by people rather than occurring naturally."],
  ["Bias", "An unfair or inaccurate pattern caused by lopsided examples or design choices."],
  ["Data", "The examples and information an AI learns from."],
  ["Input", "What you show or tell the AI: a photo, question, sound, or other example."],
  ["Intelligence", "The ability to learn, reason, and solve problems."],
  ["Learning", "The stage where an AI searches examples for patterns."],
  ["Model", "The pattern-based system produced after an AI learns from data."],
  ["Output", "The answer, prediction, or action the AI gives back."],
  ["Pattern", "Something that repeats or connects in a predictable way."],
  ["Sensor", "A device such as a camera or microphone that collects information from the world."],
  ["STEM", "Science, Technology, Engineering, and Mathematics."],
  ["Training", "The stage where an AI is shown many examples so it can find the pattern they share."],
  ["Voice assistant", "An AI tool you speak to that understands requests and answers aloud."],
];
const gw = [2700, TW - 2700];
add(new Table({
  width: { size: TW, type: WidthType.DXA }, columnWidths: gw, layout: TableLayoutType.FIXED,
  borders: { top: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, bottom: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, left: NONE, right: NONE, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: C.line }, insideVertical: NONE },
  rows: gloss.map(([t, d], i) => new TableRow({ cantSplit: true, children: [
    cell([p(r(t, { font: F.head, size: 23, bold: true, color: C.teal }), { after: 0, line: 290 })], { w: gw[0], fill: i % 2 ? "FFFFFF" : C.tintTeal, va: VerticalAlign.TOP, m: { top: 80, bottom: 80, left: 200, right: 120 } }),
    cell([p(r(d, { size: 21 }), { after: 0, line: 280 })], { w: gw[1], fill: i % 2 ? "FFFFFF" : C.tintTeal, va: VerticalAlign.TOP, m: { top: 80, bottom: 80, left: 160, right: 200 } }),
  ] })),
}));

// ---------- parents' corner
add(pageBreakPara());
add(banner("A QUICK GUIDE FOR GROWN-UPS", "Parents’ Corner", C.blue, "parents"));
add(centerImg("image9.jpg", 600));
add(caption("A grown-up helps Newton connect creativity, privacy and thoughtful design."));
add(quote("BYTE SAYS", "Byte", "Curiosity grows best when children feel safe to ask, test, laugh, rethink, and try again."));

// ---------- next up
add(pageBreakPara());
add(banner("NEXT UP  ·  CHAPTER 2", "The Glowing Boxes", C.orange));
add(story("Newton slid the drone photos into his backpack. He understood examples, training, bias and prompt power — but Byte pointed to one more display across the science fair."));
add(story("Four glowing boxes shone inside one another, from the biggest blue frame to the smallest purple square. Before they trained i-Nova, Byte wanted Newton to see where it fitted in the AI family.", { after: 220 }));
add(quote("SPARX SAYS", "SparX", "If one of those is a cookie box, I volunteer as chief inspector!", "SparX"));
add(table([TW], [[cell([
  p(r("The adventure continues in Chapter 2, where Byte reveals the AI Family Tree and the team completes i-Nova’s challenge safely.", { size: 24, bold: true }), { after: 0, line: 310 }),
], { w: TW, fill: C.tintOrange, borders: { left: { style: BorderStyle.SINGLE, size: 36, color: C.orange }, top: NONE, bottom: NONE, right: NONE }, m: { top: 180, bottom: 200, left: 300, right: 300 } })]]));
add(p(r("END OF CHAPTER 1", { font: F.head, size: 20, bold: true, color: C.soft, sp: 80 }), { align: AlignmentType.CENTER, before: 320, after: 0, line: 300 }));

// =========================================================================
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  r("Hands-On AI for Kids  ·  Chapter 1  ·  ", { font: F.head, size: 17, color: "8A8FA3" }),
  new TextRun({ children: [PageNumber.CURRENT], font: F.head, size: 18, bold: true, color: C.blue }),
] })] });
const doc = new Document({
  creator: "Hands-On AI for Kids", title: "Chapter 1 · Welcome to AI World", description: "Hands-On AI for Kids — Chapter 1",
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "●", alignment: AlignmentType.LEFT, style: { run: { color: C.gold, size: 18 }, paragraph: { indent: { left: 400, hanging: 280 } } } }] }] },
  styles: {
    default: { document: { run: { font: F.body, size: 24, color: C.ink } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: F.head, size: 56, bold: true }, paragraph: { outlineLevel: 0 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11520, height: 14400 }, margin: { top: 1080, bottom: 1150, left: 1080, right: 1080, header: 500, footer: 560 }, pageNumbers: { start: 1 } } },
    footers: { default: footer },
    children: body,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(__dirname + "/Chapter1_Welcome_to_AI_World_v2.docx", b); console.log("ok"); });
