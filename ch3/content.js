// =========================================================================
// CHAPTER 3 CONTENT — Design A, pictures placed where their scene happens
// =========================================================================
const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));
AV.Beacon = ["art:av_beacon.png", "B8901F", "FFF6DC"];
const SEC = { 1: C.blue, 2: C.teal, 3: C.green, 4: C.purple, 5: C.orange };
const TINT = { 1: C.tintBlue, 2: C.tintTeal, 3: C.tintGreen, 4: C.tintPurple, 5: C.tintOrange };
const bmRun = (bm, run) => (bm ? new Bookmark({ id: bm, children: [run] }) : run);
const label = (t, color, o = {}) => p([bmRun(o.bm, r(t, { font: F.head, size: 18, bold: true, color, sp: 50 }))], { after: o.after ?? 40, line: 280, exact: true, pageBreak: o.pageBreak, keepNext: true, before: o.before });
const h1 = (t, o = {}) => new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 0, after: 100, line: 640, lineRule: "exact" }, children: [r(t, { font: F.head, size: o.size || 48, bold: true, color: o.color || C.ink })] });
const intro = (t) => p(md(t, { size: 22, italics: true, color: C.soft }), { after: 200, line: 290 });
const bullet = (runs, o = {}) => new Paragraph({ children: Array.isArray(runs) ? runs : md(runs, { size: o.size || 23 }), numbering: { reference: "bul", level: 0 }, spacing: { after: o.after ?? 60, line: 290 } });
const pageBreakPara = () => p([], { pageBreak: true, after: 0, line: 20, exact: true });
function card(head, color, tint, children, o = {}) {
  return [table([TW], [[cell([
    p(r(head, { font: F.head, size: 19, bold: true, color, sp: 50 }), { after: 80, line: 300, exact: true }),
    ...children,
  ], { w: TW, fill: tint, borders: o.stripe ? { left: { style: BorderStyle.SINGLE, size: 36, color }, top: NONE, bottom: NONE, right: NONE } : box(color, 12), m: { top: 160, bottom: 180, left: 320, right: 320 } })]], { cantSplit: o.cantSplit !== false }), gap(14)];
}
const sub = (t, color = C.ink) => p(r(t, { font: F.head, size: 23, bold: true, color }), { before: 100, after: 40, line: 320, exact: true, keepNext: true });
const para = (t, o = {}) => p(md(t, { size: 23 }), { after: 80, line: 290, ...o });

// a story block: dialogue lines and narration interleaved — ["Who", "text"] or ["~", "narration"]
const scene = (lines) => {
  const out = [];
  lines.forEach(([w, t], i) => {
    if (w === "~") out.push(story(t, { before: i ? 80 : 0 }));
    else out.push(...say(w, t));
  });
  return out;
};
// inline picture with its crash-count note
function pic({ img, width, color, crash, note, bm }) {
  return [gap(6), table([TW], [[cell([
    p([bmRun(bm, r("PICTURE THIS", { font: F.head, size: 18, bold: true, color, sp: 40 })), r("\t"), r(`SPARX CRASH COUNT  ·  ${crash}`, { font: F.head, size: 18, bold: true, color: C.orange, sp: 40 })],
      { after: 80, line: 280, exact: true, tabs: [{ type: TabStopType.RIGHT, position: TW }] }),
    new Paragraph({ children: [], spacing: { before: 0, after: 120, line: 120, lineRule: "exact" }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color, space: 1 } } }),
    centerImg(img, width),
    p([r(`Crash ${crash}: `, { font: F.head, size: 19, bold: true, color: C.orange }), r(note, { size: 19, italics: true, color: C.soft })], { align: AlignmentType.CENTER, before: 80, after: 0, line: 260 }),
  ], { w: TW })]]), gap(14)];
}
const keyIdea = (t) => bigIdea("THE BIG IDEA", `“${t}” — Byte`);
const summary = (n, q, def, examples, points) => card("SUMMARY", SEC[n], TINT[n], [
  sub(q, SEC[n]), para(def),
  sub("Examples in the real world", SEC[n]), ...examples.map((e) => bullet(e)),
  sub("Key Points", SEC[n]), ...points.map((e, i) => bullet(e, { after: i === points.length - 1 ? 0 : 60 })),
], { cantSplit: true });
const doPage = (n, title, img, bm) => [label(`SECTION ${n}  ·  DO & DISCOVER`, SEC[n], { pageBreak: true, bm }), rule(SEC[n]), p(r(title, { font: F.head, size: 40, bold: true }), { after: 160, line: 560, exact: true }), centerImg(img, 624)];

// ---------------------------------------------------------------- opener
add(p(r("HANDS-ON AI FOR KIDS", { font: F.head, size: 18, bold: true, color: C.blue, sp: 60 }), { after: 100, line: 280, exact: true }));
add(opener({ label: "CHAPTER 3", title: "The Superpowers of AI", color: C.blue }));
add(centerImg("image1.png", 576));

// ---------------------------------------------------------------- before you begin
add(label("BEFORE YOU BEGIN", C.teal, { pageBreak: true, bm: "prev" }));
add(h1("Previously, at the Science Fair..."));
add(rule(C.teal));
add(story("Newton touched a prism he was told not to touch. A drone called SparX got stuck as an “unknown object”. Newton freed him — not by giving the machine a better brain, but by giving it better examples. Then a portal opened, and the three of them stepped through.", { after: 220 }));
add(card("THREE THINGS YOU ALREADY KNOW", C.teal, C.tintTeal, [
  bullet("AI doesn’t think like a person. It finds patterns in examples that people picked.", { after: 100 }),
  bullet("Being sure is not the same as being right.", { after: 100 }),
  bullet("Getting it wrong is just a clue for your next try.", { after: 0 }),
]));
add(card("AND ONE SMALL PROBLEM...", C.orange, C.tintOrange, [
  para("SparX left his cookie tin on the other side of the portal, in a science hall that is now locked until Monday. He has not stopped thinking about it.", { after: 120 }),
  ...say("SparX", "I am fine. Everything is fine. The cookies are fine. Are the cookies fine?").slice(0, 1),
], { stripe: true }));
add(quote("BYTE SAYS", "Byte", "You already have everything you need to start. This chapter just turns the lights on.", "Byte"));

// ---------------------------------------------------------------- contents
add(label("CHAPTER MAP", C.blue, { pageBreak: true }));
add(new Paragraph({ spacing: { after: 60, line: 640, lineRule: "exact" }, children: [r("Contents", { font: F.head, size: 48, bold: true })] }));
add(p(r("Find any part of the adventure in seconds.", { size: 21, italics: true, color: C.soft }), { after: 80, line: 280 }));
add(rule(C.blue));
const tocHead = (t, col) => p(r(t, { font: F.head, size: 18, bold: true, color: col, sp: 40 }), { before: 140, after: 50, line: 280, exact: true });
const tocRow = (lbl, anchor, o = {}) => new Paragraph({
  spacing: { after: 20, line: o.sub ? 290 : 320, lineRule: "exact" }, indent: o.sub ? { left: 440 } : undefined,
  tabStops: [{ type: TabStopType.RIGHT, position: TW, leader: "dot" }],
  children: [new InternalHyperlink({ anchor, children: [
    r(lbl, { font: o.sub ? F.body : F.head, size: o.sub ? 20 : 23, bold: !o.sub, color: o.sub ? C.soft : (o.color || C.ink), italics: o.sub }),
    r("\t" + (PAGES[anchor] || "?"), { font: F.head, size: o.sub ? 20 : 23, bold: true, color: o.color || C.blue }),
  ] })],
});
add(tocHead("GETTING STARTED", C.teal));
add(tocRow("Previously, at the Science Fair...", "prev"));
add(tocRow("Your Superpower Map", "map"));
add(tocHead("THE STORY  ·  FIVE STAGES", C.blue));
[[1, "Welcome to AI Land"], [2, "The SEE Gate"], [3, "The HEAR Gate"], [4, "The THINK Gate"], [5, "The CREATE Gate"]].forEach(([n, t]) => {
  add(tocRow(`Section ${n} · ${t}`, `s${n}`, { color: SEC[n] }));
  add(tocRow("Picture This", `s${n}pic`, { sub: true }));
  add(tocRow("Do & Discover", `s${n}do`, { sub: true }));
});
add(tocHead("WHEN YOU GET TO THE END", C.teal));
add(tocRow("Finale · The Fifth Key", "finale"));
add(tocRow("Everything You Learned", "learned"));
add(tocRow("Puzzle Challenge · Crossword", "puzzle"));
add(tocRow("True Stories · Amazing AI Facts", "true"));
add(tocRow("Puzzle Challenge · Answer Key", "answers"));
add(tocRow("Glossary · Key Words", "glossary"));

// ---------------------------------------------------------------- superpower map
add(label("HOW THIS CHAPTER WORKS", C.teal, { pageBreak: true, bm: "map" }));
add(h1("Your Superpower Map"));
add(rule(C.teal));
add(centerImg("image2.png", 576));
add(gap(14));
add(quote("SPARX-ISM", "SparX", "A map! Finally. Now I can get lost with total confidence."));

// ================================================================ SECTION 1
add(pageBreakPara());
add(opener({ label: "SECTION 1", title: "Welcome to AI Land", color: SEC[1], dots: 1, total: 5, bookmark: "s1" }));
add(story("The portal dropped them onto a floor made of soft light. The floor hummed, and the air smelled a little like warm electricity. Above them, four giant gates glowed in a ring — an eye, an ear, a brain, a paintbrush. In the middle stood the *Beacon*, tall as a tower... and flickering."));
add(pic({ img: "image3.png", width: 470, color: SEC[1], crash: 10, note: "tried to high-five the Beacon and missed the whole tower", bm: "s1pic" }));
add(scene([
  ["Newton", "It’s beautiful. Why is that big light doing that?"],
  ["Byte", "The Beacon is fading. AI Land runs on it. When it goes dark, nothing works — including the door home."],
  ["SparX", "Home! My cookies! We have to go back!"],
  ["Byte", "We will. Four keys light the Beacon — but look closely. There’s a fifth slot, smaller than the rest. Nothing in AI Land fits it. We’ll work out what does."],
  ["~", "A soft voice echoed from the Beacon itself — calm, and very sure of itself."],
  ["Beacon", "*FOUR KEYS. FOUR GATES. EARN THEM BEFORE THE LIGHT RUNS OUT.*"],
  ["Newton", "That’s a lot like the Prism. Locking at four o’clock, all over again."],
  ["Byte", "It is. And you already know the secret to beating it."],
  ["Newton", "Better examples, not a better brain."],
  ["Byte", "Every single time. Even Hermione checks her answers twice."],
]));
add(gap(8));
add(notebook("The Beacon set a countdown, just like the prism did. Write down one problem you solved faster because you had a deadline."));
add(keyIdea("Four gates, four keys — and one question only a person can answer."));
add(summary(1, "What are the four AI “superpowers” in AI Land?",
  "AI can perform different kinds of intelligent tasks. The four gates represent four useful abilities: SEE pictures, HEAR speech, THINK by finding patterns and making predictions, and CREATE new content. These abilities come from patterns learned from examples and data.",
  ["Computer vision can recognise objects in pictures.", "Speech AI can turn spoken words into text.", "Language or game AI can predict likely words, choices or moves.", "Generative AI can create text, pictures, sounds and more."],
  ["Different AI systems are built for different jobs.", "AI learns patterns from examples; it does not think exactly like a person.", "People choose the goal, provide examples and check the result."]));
add(doPage(1, "Welcome to AI Land", "image4.png", "s1do"));

// ================================================================ SECTION 2
add(pageBreakPara());
add(opener({ label: "SECTION 2", title: "The SEE Gate", color: SEC[2], dots: 2, total: 5, bookmark: "s2" }));
add(story("The first gate was a giant glowing eye. As they stepped close, the whole world turned into tiny coloured squares, then snapped back to normal. One stray square did not snap back. It blinked two tiny eyes, wobbled, and bobbed along after the crew like a lost little pixel. Newton called it *Blip*."));
add(pic({ img: "image5.png", width: 400, color: SEC[2], crash: 11, note: "read his own reflection and filed himself under “stranger”", bm: "s2pic" }));
add(scene([
  ["SparX", "Aw. He’s lost too. Little guy — are you trying to get home, same as my cookies?"],
  ["~", "Blip gave one small, unsure blink. Nobody knew where he came from — not even Blip."],
  ["Newton", "Whoa. For a second everything was made of little squares."],
  ["Byte", "To a machine, a picture is just numbers — one for the colour of every tiny square. A vision model hunts through those numbers for patterns that might be a face, a dog, or something else."],
  ["SparX", "So the prism saw my pixels perfectly. It just couldn’t name the pattern!"],
  ["Byte", "Exactly. Seeing and naming are two different jobs."],
  ["Newton", "That’s still kind of amazing — it read a whole picture out of nothing but numbers."],
  ["Byte", "It is. This kind of seeing helps doctors spot illness in a scan, and helps a car notice someone stepping into the road."],
  ["Newton", "Easy, then — I’ll show the gate one clear photo of a stop sign and it’ll know every stop sign forever."],
  ["Byte", "Try it. But even Ash needed more than one Pokémon."],
  ["~", "In the gate’s pretend training game, Newton gave it one perfect photo. It worked once. Then a tilted, muddy sign in shadow made the gate fail. Blip flashed over the missing edge, showing Newton exactly which clue had gone missing."],
  ["Newton", "Oh. One photo isn’t enough. It needs stop signs in rain, at night, bent, far away..."],
  ["Byte", "Now the training set is much better. Lots of different examples, all labelled correctly, help a machine handle the real world."],
]));
add(gap(8));
add(notebook("Look at a single letter “A” written five different ways. Your eyes still read “A”. That flexibility is exactly what a SEE machine has to learn."));
add(keyIdea("A machine doesn’t see what a thing is. It sees a pattern that usually means that thing."));
add(quote("SPARX SAYS", "SparX", "I looked into the eye gate and it labelled me “large confused snack”. Rude. Accurate. Rude."));
add(summary(2, "What is Computer Vision?",
  "Computer Vision is the way AI works with digital pictures. A picture is made of tiny coloured squares called pixels. A vision model studies patterns in those pixels and uses labelled training examples to guess what an object might be.",
  ["Phones can recognise faces in photos.", "Doctors can use AI to help spot patterns in medical scans.", "Cars can use cameras and AI to notice signs, lanes, people and vehicles."],
  ["AI reads pixel patterns rather than seeing exactly like a human.", "One perfect example is not enough; varied and correctly labelled examples help.", "A confident guess can still be wrong, so important results should be checked."]));
add(doPage(2, "The SEE Gate", "image6.png", "s2do"));

// ================================================================ SECTION 3
add(pageBreakPara());
add(opener({ label: "SECTION 3", title: "The HEAR Gate", color: SEC[3], dots: 3, total: 5, bookmark: "s3" }));
add(story("One key earned. Behind them the Beacon glowed faint blue at its base — then dimmed a notch, as if it were counting down. The second gate was a giant ear. Newton’s words turned into a wave, then into tiny number-dots, then into letters. Blip hopped along the dots like stepping-stones."));
add(pic({ img: "image7.png", width: 400, color: SEC[3], crash: 12, note: "heard “land”, screamed “sand”, and dived at the floor", bm: "s3pic" }));
add(scene([
  ["Newton", "My voice turned into a squiggle!"],
  ["Byte", "Sound travels in waves. A microphone turns those waves into numbers called *samples*. Speech AI matches their patterns to examples it learned in training, then guesses the most likely words."],
  ["SparX", "Watch — HEY GATE, FETCH ME A COOKIE!"],
  ["~", "The gate wrote: *“HEY GATE, FETCH ME A ROOKIE.”*"],
  ["SparX", "A ROOKIE? I said cookie! With a C! A delicious C!"],
  ["Byte", "It matched sound patterns that were close and picked the wrong word. “Cookie” and “rookie” sound almost the same, and SparX’s engine noise made it harder to hear."],
  ["Newton", "So a noisy room makes it worse? Like the Great Hall at Hogwarts?"],
  ["Byte", "Noise, being far away, or voices that don’t sound like its training can make it slip up. And accents aren’t mistakes — the machine just needs fair, varied examples to learn from."],
  ["SparX", "Wait — this is the Prism all over again. Better examples, not a better brain! Give it my whole sentence, not one noisy word."],
  ["Newton", "Good thinking, SparX. So — quiet the noise, give it a whole sentence, then check what it wrote down."],
  ["~", "Blip lit up the noisiest part of the sound wave. Together they hushed SparX’s engine and gave the gate a whole sentence. This time it wrote the words correctly and glowed. The HEAR key clicked into place, and Blip flashed gold."],
]));
add(gap(8));
add(notebook("Say “I scream” and “ice cream” out loud. They sound almost identical. Your brain uses the whole sentence to tell them apart. Speech AI uses context too — but it still gets things wrong."));
add(keyIdea("Speech AI turns sound patterns into likely words. The words around them help — but it can still get the meaning wrong."));
add(quote("SPARX-ISM", "SparX", "One day a machine will understand the word “cookie”. Until then, I suffer."));
add(summary(3, "What is Speech Recognition?",
  "Speech Recognition is AI that turns spoken sound into the most likely written words. A microphone changes sound waves into number samples. The AI compares their patterns with training examples and uses nearby words as context to make a better guess.",
  ["Voice assistants can listen to spoken commands.", "Phones and computers can turn speech into typed text.", "Automatic captions can create text from videos or meetings."],
  ["Sound becomes numbers that a machine can process.", "Noise, distance and unfamiliar voices can reduce accuracy.", "Context helps distinguish similar sounds such as “cookie” and “rookie”.", "Fair training needs examples from many different voices and accents."]));
add(doPage(3, "The HEAR Gate", "image8.png", "s3do"));

// ================================================================ SECTION 4
add(pageBreakPara());
add(opener({ label: "SECTION 4", title: "The THINK Gate", color: SEC[4], dots: 4, total: 5, bookmark: "s4" }));
add(story("Two keys now, and warm gold climbed higher up the Beacon — though its tip still flickered. The third gate was a giant brain wired with light. Blip hovered over a blank like a tiny cursor: *“The cat sat on the ___.”*"));
add(scene([
  ["Byte", "Reader, predict the missing word before I explain. What clue did you use?"],
  ["Newton", "Mat! The cat sat on the mat."],
]));
add(pic({ img: "image9.png", width: 380, color: SEC[4], crash: 13, note: "predicted the wall would move; the wall did not", bm: "s4pic" }));
add(scene([
  ["Byte", "A language model often guesses “mat” because it saw that word pattern a lot in training. Game AI works another way — it tries out possible moves and scores them."],
  ["Newton", "So if it’s a great guesser, it’s basically always right?"],
  ["Byte", "Three different things. *Confidence* is how sure the machine feels. *Evidence* is stuff we can check. *Correct* means the guess actually matches real life. Feeling sure is not the same as being right."],
  ["~", "Newton typed: “The astronaut planted a ___.” The gate guessed “flag”. For “The gardener planted a ___”, Blip held up a seed — but the gate still guessed “flag” and got it wrong."],
  ["Newton", "It guessed flag for the gardener! It picked the most common word, not the one that made sense."],
  ["Byte", "Newton and Blip spotted a clue the gate missed. A likely guess isn’t the same as really understanding."],
]));
add(gap(8));
add(notebook("Cover the last word of a sentence in a book and guess it. You’re playing a similar guessing game — but your brain works very differently, using meaning and real-life experience a machine doesn’t have."));
add(keyIdea("A language model guesses likely words. A likely answer is not proof that it’s right."));
add(quote("BYTE SAYS", "Byte", "The smartest guess in the room is still a guess. Treat it like one."));
add(summary(4, "How does AI “think” or make predictions?",
  "AI does not think exactly like a human. Different systems find patterns and make predictions in different ways. A language model can predict likely words, while game AI can test possible moves and score them. A prediction is a best guess based on patterns.",
  ["A keyboard can suggest the next word you may type.", "A video app can recommend what you might watch next.", "A chess program can compare possible moves before choosing one."],
  ["Confidence is how sure the AI is about its guess.", "Evidence is information that can be checked.", "Correct means the answer matches the real world.", "A confident or common answer is not automatically correct."]));
add(doPage(4, "The THINK Gate", "image10.png", "s4do"));

// ================================================================ SECTION 5
add(pageBreakPara());
add(opener({ label: "SECTION 5", title: "The CREATE Gate", color: SEC[5], dots: 5, total: 5, bookmark: "s5" }));
add(story("Three keys, three colours rising up the Beacon — yet the light kept fading. The last gate was a giant paintbrush dripping light. Blip pointed to the floating words: *TELL ME WHAT TO MAKE.*"));
add(pic({ img: "image11.png", width: 400, color: SEC[5], crash: 14, note: "hugged a painted cookie at full flying speed", bm: "s5pic" }));
add(scene([
  ["Byte", "This is *generative AI*. It trained on tons of examples and learned patterns from them. Now it uses those patterns to make brand-new things."],
  ["Newton", "Does it copy, or build something new from patterns? Reader, take a guess."],
  ["Byte", "It usually mixes patterns together in a new way, but sometimes it copies bits it memorised. Clear instructions help — but you still need to check what it makes, and the real artists and writers still deserve credit."],
  ["SparX", "MY TURN. Gate! Make me a cookie as big as the Hulk!"],
  ["~", "The gate painted the most perfect cookie anyone had ever seen — golden, warm, glowing. SparX screamed with joy and flew straight at it... and passed clean through. It was only light. Blip tested the cookie’s edge, passed straight through it, then held up a tiny NOT REAL sign. SparX nibbled it anyway and got nothing but a mouthful of glow."],
  ["SparX", "It’s... it’s not real. It looks real. I can see every chocolate chip. But it’s not there."],
  ["Byte", "That’s the most important thing in this whole chapter, SparX. Generative AI can make things that look totally real but are made-up, wrong, or meant to trick you."],
  ["Newton", "So a picture, or a voice, or a video could look real and still be made up?"],
  ["Byte", "Yes. Which is why we always ask: *who made this, and how would I check?*"],
]));
add(gap(8));
add(notebook("Write a fuzzy instruction like “make a drawing”, then rewrite it with three clear details. Watch how much easier it is to picture."));
add(keyIdea("AI-made things aren’t automatically true or false. Ask where it came from, why, and how you could check it."));
add(quote("SPARX-ISM", "SparX", "I have hugged the cookie. The cookie was made of pixels. Beautiful, golden pixels."));
add(summary(5, "What is Generative AI?",
  "Generative AI learns patterns from many examples and uses those patterns to make new content. It can create text, pictures, audio, video or code. The instruction you give it is called a prompt, and clearer prompts usually guide it towards a more useful result.",
  ["Chatbots can create explanations, stories and ideas.", "Image generators can create a picture from a written prompt.", "AI tools can help create music, voices, video or computer code."],
  ["Generative AI creates from learned patterns; its output is not automatically a fact.", "Clear prompts help steer the result but cannot guarantee it is correct.", "AI-made pictures, voices or videos can look real even when they are made up.", "Check important information and give real creators credit when appropriate."]));
add(doPage(5, "The CREATE Gate", "image12.png", "s5do"));

// ================================================================ FINALE
add(pageBreakPara());
add(opener({ label: "FINALE", title: "The Fifth Key", color: C.navy, bookmark: "finale", sub: "After the four gates" }));
add(story("Newton had asked the paintbrush gate for one last picture: the four gates of AI Land in a ring. It painted five. He asked again, slower, naming them one at a time, and checked until the picture matched. The gate flared. The CREATE key clicked home, a fourth colour climbed the Beacon — and the tower stayed exactly as dim as it had been all along."));
add(scene([
  ["SparX", "FOUR KEYS! Portal! Open! ... Portal?"],
  ["~", "Nothing opened. Beside the four filled keyholes, the fifth slot waited: small, dark, and shaped like nothing anybody was carrying."],
  ["Newton", "The little one. It’s still empty."],
  ["SparX", "I’ve got it! Blip — you’re the smallest thing here. Get in the slot!"],
  ["~", "Blip gave it a serious go. He lined himself up, held his glow in, and slid straight through without touching a single edge. He came back looking embarrassed and slightly folded."],
  ["Byte", "It isn’t a keyhole, SparX. Look at the shape of it."],
  ["Newton", "It’s a handprint. A small one. About... my size."],
  ["Beacon", "*FOUR KEYS FOUND. THE FIFTH IS NOT IN AI LAND.*"],
  ["SparX", "Not in AI Land? Then where is it?"],
  ["Newton", "Not where. Who."],
  ["~", "Newton looked back at the four gates, one at a time, the way you check your answers before you hand the test in."],
  ["Newton", "Every gate needed a person. The eye couldn’t spot a stop sign until I gave it better photos. The ear couldn’t hear SparX until we hushed his engine and gave it a whole sentence. The brain said “flag” for a gardener, and it took us to notice. The paintbrush made a cookie that wasn’t there, and it took us to check."],
  ["Byte", "Now say the last bit."],
  ["Newton", "*A machine can guess. Only a person can decide whether the guess is good enough.*"],
  ["Byte", "That’s the fifth key. It was never lying around in AI Land waiting to be found. You walked in carrying it."],
  ["~", "Newton put his hand flat on the slot."],
  ["~", "The Beacon did not flicker. It blazed — white first, then every colour at once, so bright that the four gates hummed like struck bells. High above, the countdown ring stopped counting down and simply glowed."],
  ["Beacon", "*FIFTH KEY ACCEPTED: A CURIOUS PERSON WHO CHECKS. AI LAND IS AWAKE.*"],
  ["~", "Then the light did something nobody expected. A thread of it reached down and touched Blip, and Blip lit up like a struck match — and all at once they understood. He hadn’t wandered in from anywhere. He was a piece of the Beacon’s own light, shaken loose when it began to fade. He had been trying to get home this whole time. Exactly like SparX."],
  ["SparX", "Go on, little guy. Cookies can wait. Home is home."],
  ["~", "Blip flew one delighted loop around SparX’s rotors, blinked twice — thank you — and rose into the Beacon, where he settled near the very top and glowed brighter than anything else in AI Land."],
  ["Newton", "He was never a lost pixel. He was a missing piece of the light."],
  ["Byte", "And the best clue-spotter here. Every time we missed something, Blip was already pointing at it."],
  ["~", "Behind them the portal opened, round and warm. Through it they could see the science hall, locked and quiet for the weekend, the empty fair tables, and the big clock on the wall — still not quite at four o’clock."],
  ["Byte", "Four gates, four keys, one fifth slot. Ready to go home?"],
  ["~", "They stepped through together."],
  ["SparX", "MY TIN! It’s right here! It never even moved!"],
  ["Newton", "So — was the cookie tin the fifth key all along, SparX?"],
  ["SparX", "No. But it is the second most important key in this entire building, and I am taking it home."],
  ["~", "He popped the lid and handed them round, one each, and held up a single crumb towards the portal light as it narrowed — to a thread, then to a dot. One small, bright pixel. Blinking goodbye."],
]));
add(gap(8));
add(notebook("The fifth key was a person who checks. Write down one thing you double-checked this week — and one thing you believed straight away without checking."));
add(keyIdea("Machines find the patterns. People decide what the patterns are worth."));
add(panel([
  p(r("THE FIFTH KEY", { font: F.head, size: 22, bold: true, color: "FFD86B", sp: 60 }), { align: AlignmentType.CENTER, after: 60, line: 320, exact: true }),
  p(r("Every gate needed a person. People choose the examples, ask the questions and check the answers. A machine can guess — only you can decide whether the guess is good enough.", { size: 25, bold: true, italics: true, color: C.white }), { align: AlignmentType.CENTER, after: 0, line: 320 }),
]));
add(quote("SPARX-ISM", "SparX", "I was the fifth key. I was not the fifth key. But I was standing extremely close to the fifth key, and nobody can take that away from me."));
add(card("SUMMARY", C.navy, "EEF1F7", [
  sub("What is the “Fifth Key”?", C.navy),
  para("The Fifth Key is human judgement. AI can find patterns, make predictions and create content, but people choose the examples, ask the questions and decide whether an answer is useful, fair, safe and correct enough for the situation."),
  sub("Examples in the real world", C.navy),
  bullet("A student checks an AI answer before using it for schoolwork."),
  bullet("A doctor reviews AI-supported findings instead of trusting the machine alone."),
  bullet("A family checks whether an AI-made picture, voice or story is real before sharing it."),
  sub("Key Points", C.navy),
  bullet("Machines find patterns; people decide what those patterns are worth."),
  bullet("Being confident is not the same as being correct."),
  bullet("Good AI use means staying curious, asking questions and checking important answers."),
  bullet("AI works best as a tool that assists people rather than replacing human judgement.", { after: 0 }),
], { cantSplit: false }));

// ================================================================ BACK MATTER
add(label("CHAPTER 3  ·  SUMMARY", C.teal, { pageBreak: true, bm: "learned" }));
add(h1("Everything You Learned"));
add(rule(C.teal));
add(intro("One page, four gates and one fifth key — everything Newton, Byte, SparX and Blip worked out in AI Land."));
const gate = (name, col, tint, text) => [table([1700, TW - 1700], [[
  cell([p(r("THE", { font: F.head, size: 17, bold: true, color: C.white, sp: 60 }), { align: AlignmentType.CENTER, after: 0, line: 240, exact: true }), p(r(name, { font: F.head, size: 30, bold: true, color: C.white }), { align: AlignmentType.CENTER, after: 0, line: 360, exact: true }), p(r("GATE", { font: F.head, size: 17, bold: true, color: C.white, sp: 60 }), { align: AlignmentType.CENTER, after: 0, line: 240, exact: true })], { w: 1700, fill: col }),
  cell([p(md(text, { size: 21, accent: col }), { after: 0, line: 280 })], { w: TW - 1700, fill: tint, m: { top: 120, bottom: 120, left: 240, right: 240 } }),
]]), gap(8)];
add(gate("SEE", SEC[2], TINT[2], "A machine turns a picture into numbers and hunts for patterns. One perfect photo isn’t enough — it needs *lots of varied, correctly-labelled examples* to handle the messy real world. *Training* is when it learns; *using* is when it guesses. People pick the examples and check the answers."));
add(gate("HEAR", SEC[3], TINT[3], "A microphone turns sound waves into *number samples*. Speech AI matches those patterns to guess the most likely words. Noise, distance and unfamiliar voices trip it up — nearby words help, but it doesn’t *understand* the way you do. (Just ask SparX about “cookie” versus “rookie”.)"));
add(gate("THINK", SEC[4], TINT[4], "THINK isn’t one big brain — it’s a *word-guesser*, a *move-tester* and a *choice-sorter*, each doing a different job. And three words that are _not_ the same: *confidence* is how sure it feels, *evidence* is what you can check, and *correct* means it matches real life."));
add(gate("CREATE", SEC[5], TINT[5], "Generative AI makes brand-new things from patterns it learned. A clear *prompt* steers it, but can’t promise it’s right. AI pictures, voices and videos can look totally real and still be made up — so always ask *who made this, why,* and *how could I check?* And give the real artists and writers the credit."));
add(gap(6));
add(card("THE GOLDEN THREAD", "B8901F", C.tintGold, [
  para("*Better examples, not a better brain.* Give a machine good examples and it does better work — every time."),
  para("*Feeling sure is not the same as being right.* A confident guess is still a guess."),
  para("*Whatever AI makes, check it.* Ask where it came from, why, and how you’d know.", { after: 0 }),
]));

add(label("PUZZLE CHALLENGE  ·  CROSSWORD", C.teal, { pageBreak: true, bm: "puzzle" }));
add(rule(C.teal));
add(centerImg("image13.png", 576));
add(label("TRUE STORIES", C.teal, { pageBreak: true, bm: "true" }));
add(rule(C.teal));
add(gap(10));
add(centerImg("image14.png", 624));
add(label("PUZZLE CHALLENGE  ·  ANSWER KEY", C.teal, { pageBreak: true, bm: "answers" }));
add(rule(C.teal));
add(centerImg("image15.png", 576));

add(label("CHAPTER 3 GLOSSARY", C.teal, { pageBreak: true, bm: "glossary" }));
add(h1("Key Words"));
add(rule(C.teal));
add(intro("New words from AI Land. Come back here whenever one feels fuzzy."));
const gloss = [
  ["Computer Vision", "The way AI looks at digital pictures to find, match, or label patterns."],
  ["Confidence Score", "A number that shows how sure a machine feels about its guess. A high number is not proof it’s right."],
  ["Generative AI", "AI that learns patterns from lots of examples and then makes new text, pictures, sounds, or other things."],
  ["Pixel", "One tiny square or dot in a digital image. Most pictures contain thousands or millions of pixels."],
  ["Prediction", "Using patterns to guess a likely answer. A prediction still needs checking."],
  ["Prompt", "The instruction you give a generative AI. Prompts steer the result but can’t promise it’s right, and the tool may save them."],
  ["Sound Wave", "The tiny back-and-forth pushes in the air that we hear as sound. A microphone turns them into an electric signal and number samples."],
  ["Speech Recognition", "Turning patterns in recorded speech into the most likely written words."],
  ["Training / Using", "Training is when a machine learns from examples people prepared. Using is when the trained machine handles something new."],
];
const gw = [2800, TW - 2800];
add(new Table({
  width: { size: TW, type: WidthType.DXA }, columnWidths: gw, layout: TableLayoutType.FIXED,
  borders: { top: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, bottom: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, left: NONE, right: NONE, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: C.line }, insideVertical: NONE },
  rows: gloss.map(([t, d], i) => new TableRow({ cantSplit: true, children: [
    cell([p(r(t, { font: F.head, size: 23, bold: true, color: C.teal }), { after: 0, line: 290 })], { w: gw[0], fill: i % 2 ? "FFFFFF" : C.tintTeal, va: VerticalAlign.TOP, m: { top: 70, bottom: 70, left: 200, right: 120 } }),
    cell([p(r(d, { size: 22 }), { after: 0, line: 290 })], { w: gw[1], fill: i % 2 ? "FFFFFF" : C.tintTeal, va: VerticalAlign.TOP, m: { top: 70, bottom: 70, left: 160, right: 200 } }),
  ] })),
}));
add(gap(12));
add(table([TW], [[cell([
  p(r("HOW CHAPTER 3 ENDED", { font: F.head, size: 19, bold: true, color: C.orange, sp: 40 }), { after: 60, line: 300, exact: true }),
  p(r("Four keys earned, the Beacon blazing, a lost pixel safely home — and a fifth key that was never a machine at all. It was a person who checks.", { size: 23 }), { after: 100, line: 300 }),
  p(r("Chapter 4 begins a brand-new adventure — same three friends, a very different puzzle.", { size: 23, bold: true }), { after: 0, line: 300 }),
], { w: TW, fill: C.tintOrange, borders: { left: { style: BorderStyle.SINGLE, size: 36, color: C.orange }, top: NONE, bottom: NONE, right: NONE }, m: { top: 180, bottom: 200, left: 300, right: 300 } })]]));
add(p(r("END OF CHAPTER 3", { font: F.head, size: 20, bold: true, color: C.soft, sp: 80 }), { align: AlignmentType.CENTER, before: 140, after: 0, line: 300 }));

// =========================================================================
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  r("Hands-On AI for Kids  ·  Chapter 3  ·  ", { font: F.head, size: 17, color: "8A8FA3" }),
  new TextRun({ children: [PageNumber.CURRENT], font: F.head, size: 18, bold: true, color: C.blue }),
] })] });
const doc = new Document({
  creator: "Hands-On AI for Kids", title: "Chapter 3 · The Superpowers of AI", description: "Hands-On AI for Kids — Chapter 3",
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "●", alignment: AlignmentType.LEFT, style: { run: { color: C.gold, size: 18 }, paragraph: { indent: { left: 400, hanging: 280 } } } }] }] },
  styles: {
    default: { document: { run: { font: F.body, size: 24, color: C.ink } } },
    paragraphStyles: [{ id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: F.head, size: 56, bold: true }, paragraph: { outlineLevel: 0 } }],
  },
  sections: [{
    properties: { page: { size: { width: 11520, height: 14400 }, margin: { top: 1080, bottom: 1150, left: 1080, right: 1080, header: 500, footer: 560 }, pageNumbers: { start: 1 } } },
    footers: { default: footer },
    children: body,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(__dirname + "/Chapter3_The_Superpowers_of_AI.docx", b); console.log("ok"); });
