#!/usr/bin/env node
// Generator script: reads the markdown and produces insert-batch9.ts
const fs = require("fs");
const path = require("path");

const mdPath = "/Users/vladislavolejnik/Downloads/articles_151_299_neuro_minimalism.md";
const outPath = "/Users/vladislavolejnik/Desktop/runpsy/site/scripts/insert-batch9.ts";

// ---------- transliteration ----------
function translit(str) {
  const map = {
    "а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z",
    "и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r",
    "с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"ts","ч":"ch","ш":"sh",
    "щ":"shch","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya",
    "А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ё":"Yo","Ж":"Zh","З":"Z",
    "И":"I","Й":"Y","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R",
    "С":"S","Т":"T","У":"U","Ф":"F","Х":"Kh","Ц":"Ts","Ч":"Ch","Ш":"Sh",
    "Щ":"Shch","Ъ":"","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya",
  };
  return str.split("").map(c => map[c] !== undefined ? map[c] : c).join("");
}

function toSlug(title) {
  return translit(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ---------- category detection ----------
function detectCategory(title, body) {
  const t = (title + " " + body).toLowerCase();
  if (/финанс|деньг|бедн|богатств|доход|зарплат/.test(t)) return "anxiety-and-stress";
  if (/выгор|усталост|истощ|энерг|отдых|бездел/.test(t)) return "burnout-and-energy";
  if (/тревог|стресс|паника|страх|беспокой/.test(t)) return "anxiety-and-stress";
  if (/нарцисс|газлайт|манипул|абьюз|токсич|насили/.test(t)) return "relationships";
  if (/партнер|отношен|любов|секс|интимн|влечен|либидо/.test(t)) return "relationships";
  if (/границ|конфликт|общен|диалог|коммуник|отказ|нет/.test(t)) return "boundaries-and-communication";
  if (/самооцен|самоуважен|стыд|вина|самолюб|принят/.test(t)) return "self-awareness";
  if (/осознанн|рефлекс|мышлен|осознан|идентичн/.test(t)) return "self-awareness";
  if (/привычк|прокрастин|дисципл|мотивац|продуктивн|тайм/.test(t)) return "burnout-and-energy";
  if (/травм|детств|родит|семья|детск/.test(t)) return "emotional-maturity";
  if (/эмоц|чувств|злост|гнев|обид|грусть|радост/.test(t)) return "emotional-maturity";
  return "self-awareness";
}

// ---------- tags generation ----------
const TAG_MAP = {
  "anxiety-and-stress": ["тревога", "стресс", "нервная система", "кортизол", "осознанность"],
  "burnout-and-energy": ["выгорание", "энергия", "усталость", "продуктивность", "восстановление"],
  "relationships": ["отношения", "близость", "доверие", "партнёр", "психология"],
  "boundaries-and-communication": ["границы", "общение", "конфликт", "коммуникация", "самозащита"],
  "self-awareness": ["самопознание", "саморефлексия", "идентичность", "ценности", "осознанность"],
  "emotional-maturity": ["эмоции", "зрелость", "принятие", "эмпатия", "чувства"],
};

function generateTags(category, title) {
  const base = TAG_MAP[category] || TAG_MAP["self-awareness"];
  // pick 5 from base
  return base.slice(0, 5);
}

// ---------- quiz generation ----------
function generateQuiz(title, category) {
  return {
    title: "Проверьте себя",
    description: title,
    questions: [
      {
        question: `Насколько тема «${title}» актуальна для вас прямо сейчас?`,
        options: ["Очень актуальна", "Иногда сталкиваюсь", "Пока не моя история"],
      },
      {
        question: "Пробовали ли вы уже менять этот паттерн?",
        options: ["Да, и есть результат", "Пробовал, но сложно", "Нет, только начинаю"],
      },
    ],
    resultNote:
      "Осознание — первый шаг к изменению. Ваш мозг нейропластичен и способен формировать новые реакции в любом возрасте.",
  };
}

// ---------- parse markdown ----------
const md = fs.readFileSync(mdPath, "utf8");
const lines = md.split("\n");

// Split into article blocks
const articleStarts = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^## (\d+)\. (.+)/);
  if (m) articleStarts.push({ lineIdx: i, num: parseInt(m[1]), title: m[2].trim() });
}

function getBlock(startLine, endLine) {
  return lines.slice(startLine, endLine).join("\n");
}

function extractSection(block, header) {
  // header is like "**1. Суть за 30 секунд**" or "**Введение в проблему**"
  const escapedHeader = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escapedHeader + "\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n---|\n## |$)");
  const m = block.match(re);
  if (!m) return "";
  return m[1].trim();
}

function cleanText(t) {
  return t.replace(/^[-*\[\]x ]+/gm, "").replace(/\n+/g, " ").trim();
}

function extractChecklistItems(text) {
  const items = [];
  for (const line of text.split("\n")) {
    const cleaned = line.replace(/^[-*\[\]x ]+/, "").trim();
    if (cleaned) items.push(cleaned);
  }
  return items.filter(Boolean).slice(0, 5);
}

const articles = [];

for (let i = 0; i < articleStarts.length; i++) {
  const { lineIdx, num, title } = articleStarts[i];
  const nextLineIdx = i + 1 < articleStarts.length ? articleStarts[i + 1].lineIdx : lines.length;
  const block = getBlock(lineIdx, nextLineIdx);

  const intro = cleanText(extractSection(block, "**Введение в проблему**"));
  const sect1 = cleanText(extractSection(block, "**1. Суть за 30 секунд**"));
  const sect2 = cleanText(extractSection(block, "**2. Точка боли**"));
  const sect3 = cleanText(extractSection(block, "**3. Почему это происходит (через модели)**"));
  const sect4Raw = extractSection(block, "**4. Плохие советы**");
  const sect4 = cleanText(sect4Raw);
  const sect5 = cleanText(extractSection(block, "**5. Что помогает**"));
  const sect6 = cleanText(extractSection(block, "**6. Микро-действие**"));
  const sect7 = cleanText(extractSection(block, "**7. Конструктор диалогов (с собой / с партнером)**"));
  const sect8 = cleanText(extractSection(block, "**8. Сценарии 50/50**"));
  const sect9Raw = extractSection(block, "**9. Чек-лист**");
  const sect9 = cleanText(sect9Raw);
  const sect10 = cleanText(extractSection(block, "**10. Когда нужен специалист**"));
  const sect11 = cleanText(extractSection(block, "**11. Итог «что сделать сегодня»**"));

  const slug = toSlug(title);
  const category = detectCategory(title, block);
  const tags = generateTags(category, title);
  const quiz = generateQuiz(title, category);
  const sortOrder = 101 + (num - 151);

  // description = first sentence of intro, trimmed
  const description = (intro.split(".")[0] + ".").replace(/^Тема '.*?' вскрывает /, "").trim() ||
    `Практический разбор темы «${title}» через призму нейробиологии.`;

  // seo_description
  const seoDescription = sect1.split(".")[0] + "." || `Нейробиология и практика: ${title}.`;

  // checklist items
  const checklistItems = extractChecklistItems(sect9Raw);

  // dialogue
  const dialogue = [{
    instead: "Избегать ситуации или реагировать автоматически",
    try: sect7 ? sect7.split(".")[0] + "." : `Я замечаю этот паттерн и выбираю осознанную паузу.`,
    why: "Осознанная реакция вместо автоматической — первый шаг к изменению нейронного пути.",
  }];

  // twoSides - from sect8
  const twoSidesParts = sect8.split("Либо").filter(Boolean).map(s => s.trim());
  const side1 = twoSidesParts[0] || "Вы замечаете паттерн и останавливаете его, сохраняя ресурс.";
  const side2 = twoSidesParts[1] || "Поддаетесь автоматизму, но потом анализируете срыв без чувства вины.";

  articles.push({
    num, title, slug, category, tags, sortOrder,
    description: description.slice(0, 300),
    seoDescription: seoDescription.slice(0, 200),
    intro: intro || `Тема «${title}» требует внимательного взгляда на механизмы нашей нервной системы.`,
    sect1, sect2, sect3, sect4, sect5, sect6, sect7, sect8, sect9, sect10, sect11,
    checklistItems: checklistItems.length ? checklistItems : [
      "Замечаю ли я этот паттерн в своей жизни?",
      "Реагирую ли я автоматически или осознанно?",
      "Делаю ли я паузу между стимулом и реакцией?",
    ],
    dialogue,
    side1, side2,
    quiz,
  });
}

// ---------- generate TypeScript ----------
function esc(s) {
  return (s || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${");
}

function jsStr(s) {
  return JSON.stringify(s || "");
}

function jsArr(arr) {
  return JSON.stringify(arr);
}

let ts = `import { existsSync, readFileSync } from "node:fs";
import { Client } from "pg";

function loadLocalEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const content = readFileSync(file, "utf8");
    for (const line of content.split(/\\r?\\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const sep = trimmed.indexOf("=");
      if (sep === -1) continue;
      const key = trimmed.slice(0, sep).trim();
      const val = trimmed.slice(sep + 1).trim().replace(/^['""]|['""]$/g, "");
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

const articles = [
`;

for (const a of articles) {
  const {
    title, slug, category, tags, sortOrder,
    description, seoDescription,
    intro, sect1, sect2, sect3, sect4, sect5, sect6, sect7, sect8, sect9, sect10, sect11,
    checklistItems, dialogue, side1, side2, quiz,
  } = a;

  // Split sect8 for twoSides
  const twoSides = {
    firstTitle: "Если применить этот подход",
    firstItems: [side1],
    secondTitle: "Если избегать изменений",
    secondItems: [side2],
    bridge: sect11 ? sect11.split(".")[0] + "." : "Осознание — первый шаг к трансформации.",
  };

  const sectionTitles = [
    "Суть за 30 секунд",
    "Точка боли",
    "Почему это происходит",
    "Что обычно советуют неправильно",
    "Что действительно помогает",
    "Микро-действие на 5 минут",
    "Конструктор диалогов",
    "Сценарии 50/50",
    "Чек-лист самопроверки",
    "Когда нужна помощь специалиста",
    "Итог: что понять и сделать сегодня",
  ];
  const sectionTexts = [sect1, sect2, sect3, sect4, sect5, sect6, sect7, sect8, sect9, sect10, sect11];

  const sectionsStr = sectionTitles.map((t, i) => {
    const text = sectionTexts[i] || "";
    const paragraphs = text.split(/(?<=[.!?])\s+(?=[А-ЯA-Z«])/).filter(Boolean).slice(0, 3);
    const finalParas = paragraphs.length ? paragraphs : [text || `Раздел «${t}» для статьи «${title}».`];
    return `      {
        title: ${jsStr(t)},
        paragraphs: ${JSON.stringify(finalParas)},
      }`;
  }).join(",\n");

  const checklistStr = JSON.stringify(checklistItems);

  const dialogueItem = dialogue[0];
  const dialogueStr = `[{
        instead: ${jsStr(dialogueItem.instead)},
        try: ${jsStr(dialogueItem.try)},
        why: ${jsStr(dialogueItem.why)},
      }]`;

  const twoSidesFirstItems = JSON.stringify(twoSides.firstItems);
  const twoSidesSecondItems = JSON.stringify(twoSides.secondItems);

  const quizQs = quiz.questions.map(q => `        {
          question: ${jsStr(q.question)},
          options: ${JSON.stringify(q.options)},
        }`).join(",\n");

  ts += `  {
    slug: ${jsStr(slug)},
    title: ${jsStr(title)},
    description: ${jsStr(description)},
    date: "2026-05-03",
    author_slug: "runpsy-editorial-team",
    category_slug: ${jsStr(category)},
    tags: ${jsArr(tags)},
    reading_time: "7 мин",
    seo_title: ${jsStr(title + " | RunPsy")},
    seo_description: ${jsStr(seoDescription)},
    status: "published",
    intent: "практический",
    cta: ${jsStr(sect11 || "Начните с малого — сделайте один шаг сегодня.")},
    safety_note: ${jsStr(sect10 || "Если симптомы значительно ухудшают качество жизни — обратитесь к специалисту.")},
    related_slugs: [],
    introduction: ${jsStr(intro)},
    insight_impulse: {
      painPoint: ${jsStr(sect2)},
      essence: [{
        title: "Суть за 30 секунд",
        text: ${jsStr(sect1)},
      }],
      microAction: ${jsStr(sect6)},
      checklist: ${checklistStr},
      dialogue: ${dialogueStr},
      twoSides: {
        firstTitle: ${jsStr(twoSides.firstTitle)},
        firstItems: ${twoSidesFirstItems},
        secondTitle: ${jsStr(twoSides.secondTitle)},
        secondItems: ${twoSidesSecondItems},
        bridge: ${jsStr(twoSides.bridge)},
      },
      visualMetaphor: { title: "", description: "" },
    },
    sections: [
${sectionsStr}
    ],
    faq: [],
    quiz: {
      title: ${jsStr(quiz.title)},
      description: ${jsStr(quiz.description)},
      questions: [
${quizQs}
      ],
      resultNote: ${jsStr(quiz.resultNote)},
    },
    sort_order: ${sortOrder},
  },
`;
}

ts += `];

const INSERT_SQL = \`
  INSERT INTO articles (
    slug, title, description, date, author_slug, category_slug,
    tags, reading_time, seo_title, seo_description, status, intent,
    cta, safety_note, related_slugs, introduction, insight_impulse,
    sections, faq, quiz, sort_order
  ) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    date = EXCLUDED.date,
    author_slug = EXCLUDED.author_slug,
    category_slug = EXCLUDED.category_slug,
    tags = EXCLUDED.tags,
    reading_time = EXCLUDED.reading_time,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    status = EXCLUDED.status,
    intent = EXCLUDED.intent,
    cta = EXCLUDED.cta,
    safety_note = EXCLUDED.safety_note,
    related_slugs = EXCLUDED.related_slugs,
    introduction = EXCLUDED.introduction,
    insight_impulse = EXCLUDED.insight_impulse,
    sections = EXCLUDED.sections,
    faq = EXCLUDED.faq,
    quiz = EXCLUDED.quiz,
    sort_order = EXCLUDED.sort_order
\`;

async function main() {
  loadLocalEnv();
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Connected. Inserting", articles.length, "articles...");
  let ok = 0;
  for (const a of articles) {
    try {
      await client.query(INSERT_SQL, [
        a.slug, a.title, a.description, a.date, a.author_slug, a.category_slug,
        a.tags, a.reading_time, a.seo_title, a.seo_description, a.status, a.intent,
        a.cta, a.safety_note, a.related_slugs, a.introduction,
        JSON.stringify(a.insight_impulse),
        JSON.stringify(a.sections),
        JSON.stringify(a.faq),
        JSON.stringify(a.quiz),
        a.sort_order,
      ]);
      ok++;
      console.log(\`  [\${ok}/\${articles.length}] \${a.slug}\`);
    } catch (err) {
      console.error(\`  ERROR \${a.slug}:\`, err.message);
    }
  }
  await client.end();
  console.log("Done:", ok, "inserted/updated.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

fs.writeFileSync(outPath, ts, "utf8");
console.log("Generated:", outPath);
console.log("Articles:", articles.length);
