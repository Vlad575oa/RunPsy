import { existsSync, readFileSync } from "node:fs";
import { Client } from "pg";
import { articles, authors, categories } from "../src/lib/content";

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
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/g, "");

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

async function main() {
  loadLocalEnv();

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS runpsy_authors (
        slug TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        bio TEXT NOT NULL,
        credentials JSONB NOT NULL DEFAULT '[]'::jsonb,
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS runpsy_categories (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        short_description TEXT NOT NULL,
        seo_title TEXT NOT NULL,
        meta_description TEXT NOT NULL,
        seed_ideas JSONB NOT NULL DEFAULT '[]'::jsonb,
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS runpsy_articles (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        updated DATE,
        author_slug TEXT NOT NULL REFERENCES runpsy_authors(slug) ON DELETE RESTRICT,
        category_slug TEXT NOT NULL REFERENCES runpsy_categories(slug) ON DELETE RESTRICT,
        tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        reading_time TEXT NOT NULL,
        hero_image TEXT,
        seo_title TEXT NOT NULL,
        seo_description TEXT NOT NULL,
        status TEXT NOT NULL,
        intent TEXT NOT NULL,
        cta TEXT NOT NULL,
        safety_note TEXT,
        related_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
        insight_impulse JSONB NOT NULL,
        sections JSONB NOT NULL,
        faq JSONB NOT NULL,
        quiz JSONB NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`ALTER TABLE runpsy_authors ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`);
    await client.query(`ALTER TABLE runpsy_categories ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`);
    await client.query(`ALTER TABLE runpsy_articles ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`);

    for (const [index, author] of authors.entries()) {
      await client.query(
        `
          INSERT INTO runpsy_authors (slug, name, role, bio, credentials, sort_order)
          VALUES ($1, $2, $3, $4, $5::jsonb, $6)
          ON CONFLICT (slug) DO UPDATE
          SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            bio = EXCLUDED.bio,
            credentials = EXCLUDED.credentials,
            sort_order = EXCLUDED.sort_order
        `,
        [author.slug, author.name, author.role, author.bio, JSON.stringify(author.credentials), index],
      );
    }

    for (const [index, category] of categories.entries()) {
      await client.query(
        `
          INSERT INTO runpsy_categories (slug, title, short_description, seo_title, meta_description, seed_ideas, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
          ON CONFLICT (slug) DO UPDATE
          SET
            title = EXCLUDED.title,
            short_description = EXCLUDED.short_description,
            seo_title = EXCLUDED.seo_title,
            meta_description = EXCLUDED.meta_description,
            seed_ideas = EXCLUDED.seed_ideas,
            sort_order = EXCLUDED.sort_order
        `,
        [
          category.slug,
          category.title,
          category.shortDescription,
          category.seoTitle,
          category.metaDescription,
          JSON.stringify(category.seedIdeas),
          index,
        ],
      );
    }

    for (const [index, article] of articles.entries()) {
      await client.query(
        `
          INSERT INTO runpsy_articles (
            slug,
            title,
            description,
            date,
            updated,
            author_slug,
            category_slug,
            tags,
            reading_time,
            hero_image,
            seo_title,
            seo_description,
            status,
            intent,
            cta,
            safety_note,
            related_slugs,
            insight_impulse,
            sections,
            faq,
            quiz,
            sort_order
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18::jsonb, $19::jsonb, $20::jsonb, $21::jsonb, $22
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
          "runpsy-editorial-team",
          article.category,
          JSON.stringify(article.tags),
          article.readingTime,
          article.heroImage ?? null,
          article.seoTitle,
          article.seoDescription,
          article.status,
          article.intent,
          article.cta,
          article.safetyNote ?? null,
          JSON.stringify(article.relatedSlugs),
          JSON.stringify(article.insightImpulse),
          JSON.stringify(article.sections),
          JSON.stringify(article.faq),
          JSON.stringify(article.quiz),
          index,
        ],
      );
    }

    const counts = await client.query<{
      authors_count: string;
      categories_count: string;
      articles_count: string;
    }>(`
      SELECT
        (SELECT COUNT(*) FROM runpsy_authors) AS authors_count,
        (SELECT COUNT(*) FROM runpsy_categories) AS categories_count,
        (SELECT COUNT(*) FROM runpsy_articles) AS articles_count
    `);

    await client.query("COMMIT");

    const row = counts.rows[0];
    console.log(
      JSON.stringify(
        {
          imported: {
            authors: Number(row.authors_count),
            categories: Number(row.categories_count),
            articles: Number(row.articles_count),
          },
        },
        null,
        2,
      ),
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
