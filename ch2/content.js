// =========================================================================
// CHAPTER 2 CONTENT — Design A (matches the latest Chapter 1), i-Nova replaces the Prism
// =========================================================================
const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));
const SEC = { 1: C.blue, 2: C.green, 3: C.purple };
const label = (t, color, o = {}) => p(o.bm ? [new Bookmark({ id: o.bm, children: [r(t, { font: F.head, size: 18, bold: true, color, sp: 50 })] })] : [r(t, { font: F.head, size: 18, bold: true, color, sp: 50 })], { after: o.after ?? 40, line: 280, exact: true, pageBreak: o.pageBreak, keepNext: true, before: o.before });
const intro = (t) => p(md(t, { size: 22, italics: true, color: C.soft }), { after: 200, line: 290 });
const pageBreakPara = () => p([], { pageBreak: true, after: 0, line: 20, exact: true });
const INOVA = "4338CA", INOVA_TINT = "ECEBFC";
AV["i-Nova"] = ["art:av_inova.png", INOVA, INOVA_TINT];

// placeholder pictures — each one is a real image at the final shape, so Word's "Change Picture" swaps it in place
const PH = {
  1: "Section 2 — i-Nova guesses LARGE BEE",
  2: "Section 2 — i-Nova gets it right: SMALL DRONE",
  3: "Section 2 — Your Turn: Try AI Safely activity sheet",
  4: "Section 3 — i-Nova opens the portal",
  5: "Section 3 — Your Turn: The Explorer’s Check activity sheet",
};
Object.entries(PH).forEach(([n, d]) => { ALT[`placeholder_${n}.png`] = { name: `IMAGE ${n} PLACEHOLDER`, desc: `Replace with Image ${n}: ${d}. Right-click > Change Picture > From a File.` }; });

// activity sheets run 0.25in into each margin so they print as large as possible (still inside KDP/IngramSpark no-bleed limits)
const wideImg = (file) => new Paragraph({ alignment: AlignmentType.CENTER, indent: { left: -360, right: -360 }, spacing: { after: 0 }, children: [image(file, 672)] });
const activityPage = (kicker, file, bm, color) => [label(kicker, color, { pageBreak: true, bm }), rule(color), wideImg(file)];
// back-matter banner — each page gets its own colour
const banner = (lbl, title, color, bm, sub) => opener({ label: lbl, title, color, bookmark: bm, sub });

// i-Nova scan readout (same look as Chapter 1)
function inovaScan(result, ok, note) {
  return panel([
    p([r("i-NOVA SCAN", { font: F.head, size: 18, bold: true, color: "A5B4FC", sp: 60 })], { align: AlignmentType.CENTER, after: 40, line: 280, exact: true }),
    ...(note ? [p(r(note, { size: 22, italics: true, color: "C9D6EA" }), { align: AlignmentType.CENTER, after: 40, line: 300 })] : []),
    p([r(result, { font: F.mono, size: 28, bold: true, color: ok ? "6EE7A8" : "FF7A7A" })], { align: AlignmentType.CENTER, after: 0, line: 340, exact: true }),
  ]);
}

// redesigned summary (as Chapter 1): coloured header, definition panel, example cards, numbered key points
function summary2({ color, tint, kicker, question, def, examples, points, bm, exHead = "EXAMPLES" }) {
  const out = [];
  out.push(table([TW], [[cell([
    p([bm ? new Bookmark({ id: bm, children: [r(kicker, { font: F.head, size: 18, bold: true, color: "FFFFFF", sp: 60 })] }) : r(kicker, { font: F.head, size: 18, bold: true, color: "FFFFFF", sp: 60 })], { after: 20, line: 280, exact: true }),
    p(r(question, { font: F.head, size: 40, bold: true, color: C.white }), { after: 0, line: 520, exact: true }),
  ], { w: TW, fill: color, m: { top: 200, bottom: 200, left: 360, right: 360 } })]]));
  out.push(table([TW], [[cell([
    p(r("WHAT IT MEANS", { font: F.head, size: 17, bold: true, color, sp: 50 }), { after: 40, line: 260, exact: true }),
    p(def, { after: 0, line: 300 }),
  ], { w: TW, fill: tint, m: { top: 180, bottom: 200, left: 360, right: 360 } })]]));
  out.push(gap(14));
  out.push(p(r(exHead, { font: F.head, size: 18, bold: true, color, sp: 50 }), { after: 80, line: 280, exact: true, keepNext: true }));
  const n = examples.length, g = 160, w = Math.floor((TW - g * (n - 1)) / n);
  const cols = []; const cells = [];
  examples.forEach((e, i) => {
    cols.push(w); cells.push(cell([
      p(r(`EXAMPLE ${i + 1}`, { font: F.head, size: 16, bold: true, color, sp: 40 }), { after: 40, line: 240, exact: true }),
      p(md(e, { size: 21, accent: color }), { after: 0, line: 270 }),
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
      cell([p(md(t, { size: 22, accent: color }), { after: 0, line: 280 })], { w: TW - 700, fill: i % 2 ? "FFFFFF" : tint, m: { top: 110, bottom: 110, left: 220, right: 220 } }),
    ] })) }));
  return out;
}

// ---------------------------------------------------------------- PAGE 1 · opener + story so far
add(p(r("HANDS-ON AI FOR KIDS", { font: F.head, size: 18, bold: true, color: C.blue, sp: 60 }), { after: 100, line: 280, exact: true }));
add(opener({ label: "CHAPTER 2", title: "The Portal to AI Land", color: C.blue, sub: "Part Two — the adventure continues with Newton, Byte & SparX" }));
add(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 240 }, children: [image("art:av_newton.png", 76), r("      "), image("art:av_byte.png", 76), r("      "), image("art:av_sparx.png", 76), r("      "), image("art:av_inova.png", 76)] }));
add(label("THE STORY SO FAR", C.teal, { after: 0 }));
add(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { after: 120, line: 520, lineRule: "exact" }, children: [r("Where We Left Off", { font: F.head, size: 36, bold: true, color: C.ink })] }));
add(rule(C.teal));
add(story("At the school science fair, *i-Nova*, the Ever-learning AI, recognised Newton as human and Byte as robot — but confidently called SparX a bird."));
add(story("To teach it better, Newton learned what AI is, how it learns from examples, and how clear prompts guide useful answers. Byte pulled a small camera out of the hatch on his tummy, and Newton took clear drone photos of SparX. This time, there were no cookie photos!"));
add(story("Before they begin the final training, Byte leads the team to a display of glowing nesting boxes that maps the AI family.", { after: 200 }));
add(quote("SPARX SAYS", "SparX", "I meant to do that.", "SparX (about everything)"));

// ---------------------------------------------------------------- Contents
add(label("CHAPTER 2", C.blue, { pageBreak: true }));
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
add(tocHead("THE STORY CONTINUES  ·  SECTIONS 1–3", C.blue));
add(tocRow("Section 1 · The AI Family Tree", "s1", { color: SEC[1] }));
add(tocRow("Your Turn 1 — summary and activity", "yt1", { sub: true }));
add(tocRow("Section 2 · Try AI Safely", "s2", { color: SEC[2] }));
add(tocRow("Your Turn 2 — summary and activity", "yt2", { sub: true }));
add(tocRow("Section 3 · The Portal to AI Land", "s3", { color: SEC[3] }));
add(tocRow("Your Turn 3 — summary and activity", "yt3", { sub: true }));
add(tocHead("WHEN YOU GET TO THE END", C.teal));
add(tocRow("AI Explorer · Level 1", "lvl1"));
add(tocRow("Everything You Learned", "learned"));
add(tocRow("Unplugged Missions — two games, no screens", "unplugged"));
add(tocRow("Amazing AI Facts and the People Behind Them", "facts"));
add(tocRow("Parents’ Corner", "parents"));
add(tocRow("Glossary — Acronyms & Key Words", "glossary"));

// ================================================================ SECTION 1
add(pageBreakPara());
add(opener({ label: "SECTION 1", title: "The AI Family Tree", color: SEC[1], dots: 1, total: 3, bookmark: "s1" }));
add(story("Byte led them to the glowing display Newton had spotted: four boxes, each tucked neatly inside the next like magical nesting toys."));
add(story("Newton squinted at the boxes."));
add(figure({ img: "ch1_image10.jpg", width: 560, cap: "Four ideas, tucked neatly inside one another like magical nesting boxes.", color: SEC[1] }));
add(dialogue([["Newton", "Whoa... are these four different AIs?"], ["Byte", "Not different AIs — one big family. Each idea lives inside a bigger one. Watch."]]));
add(story("Byte tapped the biggest box. SparX, naturally, flew straight into it.", { before: 80 }));
add(dialogue([
  ["SparX", "I’m in the big box! It says AI. It’s huge in here!"],
  ["Byte", "*AI* means *Artificial Intelligence*. It is the biggest family of all. Every machine that can learn, spot patterns or solve problems lives in this box."],
  ["i-Nova", "Including me. I am an AI. A very wise one. I have read four million pages."],
]));
add(story("He bumped through into a smaller box glowing green.", { before: 80 }));
add(dialogue([["SparX", "*Machine Learning!* This one learns from examples. Like me learning which walls hurt most."]]));
add(story("Another bump. A smaller purple box lit up around him.", { before: 80 }));
add(dialogue([["SparX", "*Deep Learning!* Clues stacked in layers. I feel smarter already. Ow."]]));
add(story("One last wobble dropped him into the tiniest box of all.", { before: 80 }));
add(dialogue([
  ["SparX", "And THIS little one must be the cookie box."],
  ["Byte", "That one is an *LLM*, SparX — brilliant with words. Still not cookies. And notice: every small box still sits inside the big one. It is all AI."],
  ["Newton", "i-Nova reads and talks. So is it the word kind?"],
  ["Byte", "Yes. And now it is learning the picture kind too. That is why it needs our photos."],
  ["Newton", "Does i-Nova know it’s sitting inside all four boxes?"],
  ["Byte", "It doesn’t know a thing about itself. That part is your job."],
  ["i-Nova", "Incorrect. I know everything. Except, possibly, drones."],
]));
add(story("Newton looked back at i-Nova. Now he knew what kind of AI it was. He also knew what it still had to learn: how to see SparX properly.", { before: 80, after: 200 }));
add(quote("BYTE SAYS", "Byte", "The smallest box can still do the biggest job.", "Byte"));
add(notebook("Draw four squares inside each other. Label them AI, Machine Learning, Deep Learning, LLM. That is the whole family on one page."));
add(missionMeter("CHALLENGE METER", "i-NOVA TRAINING", 4, "You mapped the AI family from biggest idea to smallest. Now you know where i-Nova fits. Challenge step 4 complete."));
add(pageBreakPara());
add(summary2({ color: SEC[1], tint: C.tintBlue, kicker: "YOUR TURN 1  ·  SUMMARY", question: "What is the AI Family Tree?", bm: "yt1",
  def: md("*Artificial Intelligence (AI)* is the biggest family. *Machine Learning* is part of AI, *Deep Learning* is part of Machine Learning, and *Large Language Models (LLMs)* are one kind of deep-learning system that works especially with language.", { size: 23, accent: SEC[1] }),
  examples: [
    "Machine Learning learns patterns from examples.",
    "Deep Learning learns patterns in layers, such as simple clues first and more complex patterns later.",
    "An LLM works with language and predicts likely words. i-Nova reads and talks like an LLM, and now it is learning picture patterns too.",
  ],
  points: [
    "AI is the broadest idea; the smaller ideas fit inside it like nesting boxes.",
    "Not every AI system is an LLM — different AI systems are built for different jobs.",
    "i-Nova is learning to be a *classifier*: an AI that sorts what it sees into groups, such as “bird” or “drone”, using examples of SparX.",
  ],
}));
add(activityPage("SECTION 1  ·  DO & DISCOVER  ·  YOUR TURN 1", "ch1_image11.jpg", null, SEC[1]));

// ================================================================ SECTION 2
add(pageBreakPara());
add(opener({ label: "SECTION 2", title: "Try AI Safely", color: SEC[2], dots: 2, total: 3, bookmark: "s2" }));
add(story("With the AI family mapped, Newton carried the drone photos back to i-Nova. He held up the first one, but Byte stopped him."));
add(dialogue([
  ["Byte", "Before you open any AI tool, you run the safety checklist. Every single time. Ready?"],
  ["SparX", "Ooh, rules! I love ignoring— I mean, following those."],
]));
add(story("Newton got out his notebook and wrote fast as Byte spoke.", { before: 80 }));
add(dialogue([
  ["Byte", "*Rule one — always use AI with a grown-up.* Never open an AI tool on your own. A trusted adult stays close, the same way they would at a swimming pool."],
  ["Newton", "Got it. Grown-up first."],
  ["Byte", "*Rule two — never share your private details.* Some things are just yours: your full name, your home address, the name of your school, your phone number, your passwords, and clear photos of your face."],
  ["Newton", "What about things that are not secret?"],
  ["Byte", "Good question. Your favourite colour, a made-up robot name, the fact that dinosaurs are brilliant — all fine to share. The test is simple: could a stranger use this to find me or fool me? If yes, keep it in."],
  ["SparX", "My big secret is that I am 90% cookie. But you already knew that."],
  ["Newton", "And if the tool asks me for a private thing anyway?"],
  ["Byte", "Then you stop, and you tell your grown-up. A safe tool never needs your secrets to help you. Treat an AI like a helpful stranger — it can answer questions, but it does not get to know where you live."],
  ["Newton", "A helpful stranger. That makes it click."],
  ["Byte", "*Rule three — don’t just trust AI. Check it.* An AI can sound completely sure and still be completely wrong. So check anything important with a grown-up, a book, or a website you trust."],
  ["Newton", "Like when it called SparX a bird, with total confidence?"],
  ["Byte", "Exactly that. Confident is not the same as correct."],
  ["i-Nova", "I was not wrong. I was simply early."],
  ["Byte", "*Rule four — don’t bully because AI says so.* Never use an AI to be mean to anyone. And if an answer ever feels scary, rude, or just wrong, close it and tell a grown-up. That is not tattling — that is being smart."],
  ["Newton", "So: grown-up close, secrets in, double-check the answers, stay kind, and speak up if it feels off."],
  ["Byte", "Perfect. You just said the whole checklist in one breath. Now — with your grown-up right beside you — you are ready. Now get the photos ready to train i-Nova!"],
]));
add(story("With an adult beside him, Newton held up his drone photos of SparX, one by one. i-Nova’s blue light passed slowly over each one.", { before: 80, keepNext: true }));
add(dialogue([["i-Nova", "Analysing… Small. Buzzing. Flies in circles. Conclusion:"]]));
add(inovaScan("LARGE BEE — 41% SURE.", false));
add(dialogue([["SparX", "A BEE? I’ve got propellers, not wings!"]]));
add(figure({ img: "placeholder_1.png", width: 420, color: SEC[2] }));
add(dialogue([
  ["i-Nova", "I am only 41% sure. Even I can tell that is a guess."],
  ["Byte", "That number is how sure i-Nova feels. It is not how right it is."],
]));
add(story("Four photos were not enough. i-Nova had seen thousands of birds, but hardly any drones. So, still with the grown-up helping, they took lots more photos of SparX: from above, from below, mid-spin, and even upside down after a crash. Newton checked each photo showed only SparX — no faces, no names, nothing private — then showed them all to i-Nova. i-Nova went quiet for three long seconds. Then the words changed:", { before: 80, keepNext: true }));
add(inovaScan("SMALL DRONE — 94% SURE.", true));
add(figure({ img: "placeholder_2.png", width: 420, color: SEC[2] }));
add(dialogue([
  ["SparX", "NINETY-FOUR! I’m practically famous."],
  ["Byte", "See? i-Nova guessed a bee, and it was wrong. Then it was 94% sure it saw a small drone, and it was right. Confidence did not decide — better examples did."],
  ["Newton", "And I never handed it a single secret to get there."],
  ["Byte", "That is the whole game: safe, checked, and kind."],
  ["SparX", "Also famous. Do not forget famous."],
  ["i-Nova", "Thank you, humans. I have learned a new word: drone. I will now use it for everything."],
]));
add(gap(8));
add(quote("BYTE SAYS", "Byte", "Smart explorers use AI with a grown-up, keep their secrets safe, and check every answer.", "Byte"));
add(notebook("Before you use any AI: Is a grown-up here? Am I keeping my private details safe? Have I checked the answer instead of just trusting it?"));
add(missionMeter("CHALLENGE METER", "i-NOVA TRAINING", 5, "You trained i-Nova safely: grown-up close, private details protected, answers checked, and kindness switched on. Challenge step 5 complete."));
add(pageBreakPara());
add(summary2({ color: SEC[2], tint: C.tintGreen, kicker: "YOUR TURN 2  ·  SUMMARY", question: "What does it mean to use AI safely?", bm: "yt2",
  def: md("Using AI safely means having a trusted grown-up nearby, keeping personal information private, checking important answers, staying kind, and speaking up if something feels wrong.", { size: 23, accent: SEC[2] }),
  examples: [
    "*Safe to share:* a favourite colour, a made-up robot name or a drawing.",
    "*Keep private:* your full name, home address, school name, phone number, passwords and clear face photos.",
    "i-Nova was 41% sure SparX was a bee, then 94% sure he was a small drone after it received better, more varied examples.",
  ],
  points: [
    "*Confidence* is how sure an AI is; it does not prove the answer is correct.",
    "Better and more varied examples can improve an AI classifier.",
    "Never blindly trust an important AI answer — check it with a grown-up or another trusted source.",
    "Use AI to help, never to bully or harm someone.",
  ],
}));
add(activityPage("SECTION 2  ·  DO & DISCOVER  ·  YOUR TURN 2", "placeholder_3.png", null, SEC[2]));

// ================================================================ SECTION 3
add(pageBreakPara());
add(opener({ label: "SECTION 3", title: "The Portal to AI Land", color: SEC[3], dots: 3, total: 3, bookmark: "s3" }));
add(story("i-Nova rose higher above its glowing platform. Its book of light flipped open to a blank page."));
add(dialogue([
  ["i-Nova", "One final test. To give you your *BIG SURPRISE*, I must recognise SparX in a photo I have never seen before."],
]));
add(story("Byte took one more photo, with the grown-up watching: SparX zooming past a dark window, lit only by his own blinking lights.", { before: 80, keepNext: true }));
add(dialogue([["i-Nova", "Analysing… Small. Blinking. Flying at night. Conclusion:"]]));
add(inovaScan("FIREFLY — 99% SURE.", false));
add(dialogue([
  ["SparX", "A FIREFLY? I am a precision flying machine!"],
  ["Newton", "Wait. Every photo we showed it was taken in the bright hall. It has never seen SparX in the dark."],
  ["Byte", "That is the question every AI engineer asks: what did it learn from? A test with a brand-new photo shows you what is missing."],
]));
add(story("So they dimmed the lights and took three more photos of SparX in the dark. i-Nova studied them, one by one.", { before: 80, keepNext: true }));
add(inovaScan("SMALL DRONE. NAME: SPARX. DAY OR NIGHT — 96% SURE.", true));
add(dialogue([
  ["i-Nova", "I have learned something new. I do that. I am the Ever-learning AI. And now — your BIG SURPRISE."],
]));
add(story("i-Nova raised its book of light. The glowing platform hummed once, then folded open into a doorway of light. The book glowed: *SMALL DRONE. NAME: SPARX.*", { before: 80 }));
add(figure({ img: "placeholder_4.png", width: 420, color: SEC[3] }));
add(dialogue([
  ["Byte", "It knows what SparX is now. It’ll let him through."],
  ["SparX", "Because I’m a small drone. Officially. In writing."],
  ["Newton", "What’s on the other side?"],
  ["Byte", "Superpowers. Machines that see and hear. Inventions nobody’s built yet."],
  ["SparX", "Are there cookies?"],
  ["Byte", "Possibly."],
  ["SparX", "Then I’m in."],
  ["Newton", "What if I get something wrong in AI Land?"],
  ["Byte", "Then you’ll learn something. Remember the firefly? A mistake shows you what to fix next."],
  ["Newton", "I did show i-Nova only daytime photos."],
  ["Byte", "You did. And then you fixed it. Both of those count."],
  ["Newton", "Wait — what if we get stuck in there?"],
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
add(notebook("Test it on something new! Show an AI an example it has never seen. If it gets it wrong, ask: what was missing from its examples?"));
add(quote("SPARX-ISM", "SparX", "Something incredible is waiting to be discovered... probably behind the thing I just knocked over.", "SparX-ism"));
add(missionMeter("CHALLENGE METER  ·  COMPLETE", "i-NOVA TRAINING", 6, "You tested i-Nova with a brand-new photo, found what was missing, and helped it learn. All six challenge steps complete. i-Nova reads: SMALL DRONE. Name: SparX. Portal: OPEN.", "STATUS: PORTAL OPEN"));
add(pageBreakPara());
add(summary2({ color: SEC[3], tint: C.tintPurple, kicker: "YOUR TURN 3  ·  SUMMARY", question: "What does it mean to be an AI Explorer?", bm: "yt3",
  def: md("An AI Explorer does not need to know everything before starting. Good explorers ask clear questions, learn from mistakes, check what they discover, and keep improving their ideas.", { size: 23, accent: SEC[3] }),
  examples: [
    "Newton asks what could be on the other side of the portal.",
    "When Newton worries about getting something wrong, Byte reminds him that mistakes can lead to the next better try.",
    "i-Nova opens the portal only after it passes a test with a brand-new photo. When it got the night photo wrong, the team added night photos and it learned.",
  ],
  points: [
    "A wrong answer can be a useful clue, not the end of the experiment.",
    "One good question is enough to begin exploring.",
    "Curiosity, checking and trying again are important human skills when using AI.",
    "*Testing* means checking an AI with examples it has never seen. Its mistakes show you what to teach it next.",
  ],
}));
add(activityPage("SECTION 3  ·  DO & DISCOVER  ·  YOUR TURN 3", "placeholder_5.png", null, SEC[3]));

// ================================================================ BACK MATTER
add(pageBreakPara());
add(banner("MISSION COMPLETE", "AI Explorer · Level 1", "B8901F", "lvl1"));
add(centerImg("image7.png", 600));

add(pageBreakPara());
add(banner("CHAPTER 2  ·  SUMMARY", "Everything You Learned", C.teal, "learned"));
const learnItem = (n, title, runs, col, extra = []) => [table([900, TW - 900], [[
  cell([p(r(String(n), { font: F.head, size: 44, bold: true, color: C.white }), { align: AlignmentType.CENTER, after: 0, line: 560, exact: true })], { w: 900, fill: col, va: VerticalAlign.TOP, m: { top: 120, bottom: 0, left: 0, right: 0 } }),
  cell([
    p(r(title, { font: F.head, size: 26, bold: true, color: col }), { after: 40, line: 340, exact: true }),
    p(runs, { after: extra.length ? 80 : 0, line: 290 }),
    ...extra,
  ], { w: TW - 900, fill: "F7F8FB", va: VerticalAlign.TOP, m: { top: 120, bottom: 140, left: 240, right: 240 } }),
]]), gap(10)];
add(learnItem(1, "The AI family tree", md("Artificial Intelligence is the biggest family. Machine Learning fits inside it, Deep Learning fits inside Machine Learning, and LLMs fit inside Deep Learning. i-Nova reads and talks like an LLM, and it is learning picture patterns too.", { size: 22 }), C.blue));
add(learnItem(2, "Try AI safely", md("Keep a grown-up nearby, protect private details, check important answers, stay kind, and speak up if an AI answer feels wrong. Confidence is not the same as correctness.", { size: 22 }), C.green));
add(learnItem(3, "Better examples open doors", md("Varied, carefully checked drone photos helped i-Nova replace its bird and bee guesses with SMALL DRONE. A test with a brand-new photo showed what it still had to learn — and opened the portal to AI Land.", { size: 22 }), C.purple));
const miniSay = (who, t) => { const col = AV[who][1]; return p([r(who + ":  ", { font: F.head, size: 21, bold: true, color: col }), r(t, { size: 22, italics: true })], { after: 50, line: 280 }); };
add(learnItem(4, "Mistakes are clues", md("Even the best inventors get things wrong — and that is exactly where the learning hides.", { size: 22 }), C.orange, [
  miniSay("SparX", "I got it wrong! I must be a bad robot!"),
  miniSay("Byte", "No, SparX — a wrong answer is just a clue for the next try."),
  miniSay("Newton", "And you don’t need to know everything to start. One good question is enough to begin any adventure in science!"),
]));
add(bigIdea("★  BIG IDEA  ★", "Map the AI family, train with varied examples, use AI safely, and treat every mistake as a clue that points to a better answer!").slice(0, 1));

add(pageBreakPara());
add(banner("NO SCREENS REQUIRED", "Unplugged Missions", C.purple, "unplugged"));
add(centerImg("image8.png", 540), gap(12));
add(quote("BYTE SAYS", "Byte", "Curiosity grows best when children feel safe to ask, test, laugh, rethink, and try again.", "Byte"));

add(pageBreakPara());
add(banner("TRUE STORIES", "Amazing AI Facts", C.navy, "facts"));
add(intro("Every one of these really happened. Some of them are still happening right now."));
add(centerImg("image9.jpg", 624));

add(pageBreakPara());
add(banner("A QUICK GUIDE FOR GROWN-UPS", "Parents’ Corner", C.blue, "parents"));
add(centerImg("image10.png", 520));
add(caption("A grown-up helps Newton connect creativity, privacy and thoughtful design."));

add(pageBreakPara());
add(banner("CHAPTER 2 GLOSSARY", "Acronyms & Key Words", C.green, "glossary"));
add(intro("Big ideas become easier when you know the words. Come back here whenever you need a quick reminder."));
const gloss = [
  ["Classifier", "An AI system that sorts things into groups, such as cat or dog."],
  ["Confidence", "How sure an AI is about a guess, shown as a percentage. High confidence is not the same as being correct."],
  ["Deep Learning", "Learning in layers — edges, then shapes, then whole objects."],
  ["LLM", "Large Language Model — an AI trained on huge amounts of text that predicts what word comes next."],
  ["Machine Learning", "The part of AI that learns from examples instead of fixed rules."],
  ["Privacy", "Keeping personal information safe and controlling who can see it."],
  ["Prompt", "An instruction you give an AI about what you want it to do or create."],
  ["Prompt Recipe", "A simple way to ask an AI: be clear, add details, show an example, then improve it."],
  ["Testing", "Checking an AI with brand-new examples it has never seen, to find out what it still gets wrong."],
  ["Uncertainty", "How unsure an AI is about its guess, often shown as a confidence percentage."],
];
const gw = [2700, TW - 2700];
add(new Table({
  width: { size: TW, type: WidthType.DXA }, columnWidths: gw, layout: TableLayoutType.FIXED,
  borders: { top: { style: BorderStyle.SINGLE, size: 12, color: C.green }, bottom: { style: BorderStyle.SINGLE, size: 12, color: C.green }, left: NONE, right: NONE, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: C.line }, insideVertical: NONE },
  rows: gloss.map(([t, d], i) => new TableRow({ cantSplit: true, children: [
    cell([p(r(t, { font: F.head, size: 24, bold: true, color: C.green }), { after: 0, line: 300 })], { w: gw[0], fill: i % 2 ? "FFFFFF" : C.tintGreen, va: VerticalAlign.TOP, m: { top: 100, bottom: 100, left: 200, right: 120 } }),
    cell([p(r(d, { size: 22 }), { after: 0, line: 290 })], { w: gw[1], fill: i % 2 ? "FFFFFF" : C.tintGreen, va: VerticalAlign.TOP, m: { top: 100, bottom: 100, left: 160, right: 200 } }),
  ] })),
}));

// ---------- next up
add(pageBreakPara());
add(banner("NEXT UP  ·  CHAPTER 3", "The Superpowers of AI", C.orange));
add(story("The portal closed behind them with a soft click. SparX spun round to look back, then went very quiet — which never happens. His cookie tin was still back at the science fair, on the other side."));
add(story("Next mission: AI Superpowers. And one very small rescue.", { after: 220 }));
add(quote("SPARX SAYS", "SparX", "Nobody panic. Those cookies know how to wait for me.", "SparX"));
add(p(r("END OF CHAPTER 2", { font: F.head, size: 20, bold: true, color: C.soft, sp: 80 }), { align: AlignmentType.CENTER, before: 320, after: 0, line: 300 }));

// =========================================================================
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  r("Hands-On AI for Kids  ·  Chapter 2  ·  ", { font: F.head, size: 17, color: "8A8FA3" }),
  new TextRun({ children: [PageNumber.CURRENT], font: F.head, size: 18, bold: true, color: C.blue }),
] })] });
const doc = new Document({
  creator: "Hands-On AI for Kids", title: "Chapter 2 · The Portal to AI Land", description: "Hands-On AI for Kids — Chapter 2",
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "●", alignment: AlignmentType.LEFT, style: { run: { color: C.gold, size: 18 }, paragraph: { indent: { left: 400, hanging: 280 } } } }] }] },
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
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(__dirname + "/Chapter2_The_Portal_to_AI_Land_v3.docx", b); console.log("ok"); });
