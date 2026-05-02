import fs from "node:fs";
import path from "node:path";

type Priority = "high" | "medium" | "low";
type Intent = "кризисный" | "эмоциональный" | "информационный";
type Category =
  | "relationships"
  | "breakup-recovery"
  | "boundaries-and-communication"
  | "anxiety-and-stress"
  | "family-and-parenting"
  | "habits-and-motivation";

type ArticleSeed = {
  title: string;
  slug: string;
  category: Category;
  priority: Priority;
  intent: Intent;
  tags: string[];
  angle: string;
  signals: string[];
  firstStep: string;
  avoid: string;
};

const projectRoot = path.resolve(__dirname, "..");
const planPath = path.join(projectRoot, "EDITORIAL_PLAN_2026.md");
const outputPath = path.join(projectRoot, "src/lib/editorial-plan-seeds.generated.ts");

function normalizePriority(raw: string): Priority {
  if (raw === "P1") return "high";
  if (raw === "P2") return "medium";
  return "low";
}

function inferCategory(slug: string): Category {
  const s = slug.toLowerCase();

  if (s.includes("rasstav") || s.includes("razryv") || s.includes("razvod") || s.includes("byvsh")) return "breakup-recovery";
  if (
    s.includes("granic") ||
    s.includes("kommunik") ||
    s.includes("chuvstv") ||
    s.includes("podderzh") ||
    s.includes("dialog") ||
    s.includes("net-partner")
  ) {
    return "boundaries-and-communication";
  }
  if (
    s.includes("trevog") ||
    s.includes("stress") ||
    s.includes("panich") ||
    s.includes("vygoran") ||
    s.includes("samoreguly") ||
    s.includes("gnev") ||
    s.includes("onemen")
  ) {
    return "anxiety-and-stress";
  }
  if (
    s.includes("reben") ||
    s.includes("podrost") ||
    s.includes("rodit") ||
    s.includes("mama") ||
    s.includes("papa") ||
    s.includes("seme")
  ) {
    return "family-and-parenting";
  }
  if (
    s.includes("motiv") ||
    s.includes("privych") ||
    s.includes("prokrast") ||
    s.includes("fokus") ||
    s.includes("obuchen") ||
    s.includes("disciplin") ||
    s.includes("dofamin")
  ) {
    return "habits-and-motivation";
  }
  return "relationships";
}

function inferIntent(priority: Priority, title: string, slug: string): Intent {
  const joined = `${title} ${slug}`.toLowerCase();
  if (
    priority === "high" &&
    (joined.includes("izmen") ||
      joined.includes("rasstav") ||
      joined.includes("nasilie") ||
      joined.includes("panich") ||
      joined.includes("otverzhen") ||
      joined.includes("otdalya"))
  ) {
    return "кризисный";
  }
  if (priority === "high") return "эмоциональный";
  return "информационный";
}

function makeTags(title: string, slug: string): string[] {
  const tokens = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);

  const fromSlug = slug
    .split("-")
    .filter((w) => w.length > 4)
    .slice(0, 2);

  return Array.from(new Set([...tokens, ...fromSlug])).slice(0, 4);
}

function defaultsByCategory(category: Category) {
  if (category === "relationships") {
    return {
      firstStep: "сначала назовите факт без догадок, затем одно чувство и одну конкретную просьбу",
      avoid: "не переходите к допросу, контролю и ультиматумам на пике эмоций",
      signals: ["повторяется дистанция или напряжение", "разговоры заходят в тупик", "после контакта становится тревожнее"],
    };
  }

  if (category === "breakup-recovery") {
    return {
      firstStep: "соберите план на 24 часа: сон, еда, движение и один контакт с поддерживающим человеком",
      avoid: "не принимайте резкие решения и не ищите обезболивания действиями, за которые потом стыдно",
      signals: ["мысли ходят по кругу", "тянет вернуться в старый сценарий", "базовые дела даются тяжело"],
    };
  }

  if (category === "boundaries-and-communication") {
    return {
      firstStep: "сформулируйте границу или просьбу коротко: что для вас ок, что не ок и какой формат вам подходит",
      avoid: "не заменяйте прямую просьбу сарказмом, намеками и молчаливым наказанием",
      signals: ["сложно говорить прямо", "много обиды после разговоров", "границы постоянно размываются"],
    };
  }

  if (category === "anxiety-and-stress") {
    return {
      firstStep: "сначала стабилизируйте тело: дыхание, опора и короткая пауза, затем выбирайте следующий шаг",
      avoid: "не пытайтесь решать всё сразу, пока нервная система в режиме угрозы",
      signals: ["тревога мешает спать и думать", "внимание скачет", "реакции стали резче и тяжелее"],
    };
  }

  if (category === "family-and-parenting") {
    return {
      firstStep: "выберите один короткий семейный шаг на сегодня и договоритесь о понятном правиле без крика",
      avoid: "не усиливайте давление и стыд там, где нужен контакт и структура",
      signals: ["повторяются одни и те же конфликты", "всем не хватает сил", "разговоры быстро срываются"],
    };
  }

  return {
    firstStep: "уменьшите задачу до шага на 10–15 минут и закрепите его в конкретное время",
    avoid: "не стройте план, который держится только на вдохновении и самокритике",
    signals: ["есть старт, но нет устойчивости", "после срыва всё откатывается", "прогресс не фиксируется"],
  };
}

function parsePlan(raw: string): ArticleSeed[] {
  const lines = raw.split("\n");
  const seeds: ArticleSeed[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    const match = line.match(/^- `?(P[1-3])`?\s+(.+?)\s*$/);
    if (!match) continue;

    const priority = normalizePriority(match[1]);
    const title = match[2].trim().replace(/\.\s*$/, "");
    const slugLine = lines[i + 1]?.trim() ?? "";
    const slugMatch = slugLine.match(/^Slug:\s+`([^`]+)`/);
    if (!slugMatch) continue;
    const slug = slugMatch[1].trim();

    const category = inferCategory(slug);
    const intent = inferIntent(priority, title, slug);
    const defaults = defaultsByCategory(category);

    seeds.push({
      title,
      slug,
      category,
      priority,
      intent,
      tags: makeTags(title, slug),
      angle: `${title} без паники: что происходит, какие шаги работают и каких ошибок лучше избегать`,
      signals: defaults.signals,
      firstStep: defaults.firstStep,
      avoid: defaults.avoid,
    });
  }

  return seeds;
}

function main() {
  const raw = fs.readFileSync(planPath, "utf8");
  const seeds = parsePlan(raw);
  const deduped = Array.from(new Map(seeds.map((item) => [item.slug, item])).values());

  const content = `export type GeneratedArticleSeed = {
  title: string;
  slug: string;
  category: "relationships" | "breakup-recovery" | "boundaries-and-communication" | "anxiety-and-stress" | "family-and-parenting" | "habits-and-motivation";
  priority: "high" | "medium" | "low";
  intent: "кризисный" | "эмоциональный" | "информационный";
  tags: string[];
  angle: string;
  signals: string[];
  firstStep: string;
  avoid: string;
};

export const editorialPlanSeeds: GeneratedArticleSeed[] = ${JSON.stringify(deduped, null, 2)} as const;
`;

  fs.writeFileSync(outputPath, content);
  process.stdout.write(`Generated seeds: ${deduped.length}\\n`);
}

main();
