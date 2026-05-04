import { Client } from "pg";
import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    if (!existsSync(file)) continue;
    const content = readFileSync(file, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

export async function addArticleToDb(article: any) {
  loadLocalEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(
      `
      INSERT INTO runpsy_articles (
        slug, title, description, date, updated, author_slug, category_slug, 
        tags, reading_time, hero_image, seo_title, seo_description, 
        status, intent, cta, safety_note, introduction, related_slugs, 
        insight_impulse, sections, faq, quiz, sort_order
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::jsonb, $19::jsonb, $20::jsonb, $21::jsonb, $22::jsonb, $23
      )
      ON CONFLICT (slug) DO UPDATE
      SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        date = EXCLUDED.date,
        updated = EXCLUDED.updated,
        author_slug = EXCLUDED.author_slug,
        category_slug = EXCLUDED.category_slug,
        tags = EXCLUDED.tags,
        reading_time = EXCLUDED.reading_time,
        hero_image = EXCLUDED.hero_image,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description,
        status = EXCLUDED.status,
        intent = EXCLUDED.intent,
        cta = EXCLUDED.cta,
        safety_note = EXCLUDED.safety_note,
        introduction = EXCLUDED.introduction,
        related_slugs = EXCLUDED.related_slugs,
        insight_impulse = EXCLUDED.insight_impulse,
        sections = EXCLUDED.sections,
        faq = EXCLUDED.faq,
        quiz = EXCLUDED.quiz,
        sort_order = EXCLUDED.sort_order,
        imported_at = NOW()
      `,
      [
        article.slug,
        article.title,
        article.description,
        article.date,
        article.updated ?? null,
        article.author_slug ?? "runpsy-editorial-team",
        article.category,
        JSON.stringify(article.tags ?? []),
        article.readingTime,
        article.heroImage ?? null,
        article.seoTitle,
        article.seoDescription,
        article.status ?? "published",
        article.intent,
        article.cta,
        article.safetyNote ?? null,
        article.introduction ?? null,
        JSON.stringify(article.relatedSlugs ?? []),
        JSON.stringify(article.insightImpulse),
        JSON.stringify(article.sections),
        JSON.stringify(article.faq),
        JSON.stringify(article.quiz),
        article.sort_order ?? 0
      ]
    );
    console.log(`Successfully added/updated article: ${article.slug}`);
  } finally {
    await client.end();
  }
}
