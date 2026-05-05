import { getDbPool } from "@/lib/db";
import type { Article, Author, Category } from "@/types/article";

type ArticleRow = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string | null;
  author_slug: string;
  category_slug: string;
  tags: string[];
  reading_time: string;
  hero_image: string | null;
  seo_title: string;
  seo_description: string;
  status: Article["status"];
  intent: Article["intent"];
  cta: string;
  safety_note: string | null;
  introduction: string | null;
  related_slugs: string[];
  insight_impulse: Article["insightImpulse"];
  sections: Article["sections"];
  faq: Article["faq"];
  quiz: Article["quiz"];
  author_name: string;
};

type CategoryRow = {
  slug: string;
  title: string;
  short_description: string;
  seo_title: string;
  meta_description: string;
  seed_ideas: string[];
};

type AuthorRow = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
};

function mapArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.date,
    updated: row.updated ?? undefined,
    author: row.author_name,
    category: row.category_slug,
    tags: row.tags,
    readingTime: row.reading_time,
    heroImage: row.hero_image ?? undefined,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status,
    intent: row.intent,
    cta: row.cta,
    safetyNote: row.safety_note ?? undefined,
    introduction: row.introduction ?? undefined,
    relatedSlugs: row.related_slugs,
    insightImpulse: row.insight_impulse,
    sections: row.sections,
    faq: row.faq,
    quiz: row.quiz,
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    seedIdeas: row.seed_ideas,
  };
}

function mapAuthor(row: AuthorRow): Author {
  return {
    slug: row.slug,
    name: row.name,
    role: row.role,
    bio: row.bio,
    credentials: row.credentials,
  };
}

async function withFallback<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const pool = getDbPool();
    if (!pool) return fallback;
    return await loader();
  } catch (error) {
    console.warn("Database content fallback was used:", error);
    return fallback;
  }
}

export async function getPublishedArticlesFromStore() {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return [] as Article[];

    const result = await pool.query<ArticleRow>(
      `
        SELECT
          a.slug,
          a.title,
          a.description,
          a.date::text AS date,
          a.updated::text AS updated,
          a.author_slug,
          a.category_slug,
          a.tags,
          a.reading_time,
          a.hero_image,
          a.seo_title,
          a.seo_description,
          a.status,
          a.intent,
          a.cta,
          a.safety_note,
          a.introduction,
          a.related_slugs,
          a.insight_impulse,
          a.sections,
          a.faq,
          a.quiz,
          au.name AS author_name
        FROM runpsy_articles a
        JOIN runpsy_authors au ON au.slug = a.author_slug
        WHERE a.status = 'published'
        ORDER BY a.sort_order ASC, a.slug ASC
      `,
    );

    return result.rows.map(mapArticle);
  }, [] as Article[]);
}

export async function getArticleBySlugFromStore(slug: string) {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return null;

    const result = await pool.query<ArticleRow>(
      `
        SELECT
          a.slug, a.title, a.description, a.date::text AS date, a.updated::text AS updated,
          a.author_slug, a.category_slug, a.tags, a.reading_time, a.hero_image,
          a.seo_title, a.seo_description, a.status, a.intent, a.cta,
          a.safety_note, a.introduction, a.related_slugs, a.insight_impulse,
          a.sections, a.faq, a.quiz, au.name AS author_name
        FROM runpsy_articles a
        JOIN runpsy_authors au ON au.slug = a.author_slug
        WHERE a.slug = $1 AND a.status = 'published'
        LIMIT 1
      `,
      [slug]
    );

    return result.rows[0] ? mapArticle(result.rows[0]) : null;
  }, null);
}

export async function getCategoriesFromStore() {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return [] as Category[];

    const result = await pool.query<CategoryRow>(
      `
        SELECT slug, title, short_description, seo_title, meta_description, seed_ideas
        FROM runpsy_categories
        ORDER BY sort_order ASC, slug ASC
      `,
    );

    return result.rows.map(mapCategory);
  }, [] as Category[]);
}

export async function getCategoryBySlugFromStore(slug: string) {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return null;

    const result = await pool.query<CategoryRow>(
      `SELECT slug, title, short_description, seo_title, meta_description, seed_ideas FROM runpsy_categories WHERE slug = $1`,
      [slug]
    );

    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  }, null);
}

export async function getAuthorsFromStore() {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return [] as Author[];

    const result = await pool.query<AuthorRow>(
      `
        SELECT slug, name, role, bio, credentials
        FROM runpsy_authors
        ORDER BY sort_order ASC, slug ASC
      `,
    );

    return result.rows.map(mapAuthor);
  }, [] as Author[]);
}

export async function getAuthorBySlugFromStore(slug: string) {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return null;

    const result = await pool.query<AuthorRow>(
      `SELECT slug, name, role, bio, credentials FROM runpsy_authors WHERE slug = $1`,
      [slug]
    );

    return result.rows[0] ? mapAuthor(result.rows[0]) : null;
  }, null);
}

export async function getRelatedArticlesFromStore(slugs: string[]) {
  if (slugs.length === 0) return [];
  
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return [] as Article[];

    const result = await pool.query<ArticleRow>(
      `
        SELECT
          a.slug, a.title, a.description, a.date::text AS date, a.updated::text AS updated,
          a.author_slug, a.category_slug, a.tags, a.reading_time, a.hero_image,
          a.seo_title, a.seo_description, a.status, a.intent, a.cta,
          a.safety_note, a.introduction, a.related_slugs, a.insight_impulse,
          a.sections, a.faq, a.quiz, au.name AS author_name
        FROM runpsy_articles a
        JOIN runpsy_authors au ON au.slug = a.author_slug
        WHERE a.slug = ANY($1) AND a.status = 'published'
      `,
      [slugs]
    );

    return result.rows.map(mapArticle);
  }, [] as Article[]);
}

export async function getReadNextArticles(currentSlug: string, relatedSlugs: string[], categorySlug: string, limit = 3): Promise<Article[]> {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return [] as Article[];

    const cols = `a.slug, a.title, a.description, a.date::text AS date, a.updated::text AS updated,
      a.author_slug, a.category_slug, a.tags, a.reading_time, a.hero_image,
      a.seo_title, a.seo_description, a.status, a.intent, a.cta,
      a.safety_note, a.introduction, a.related_slugs, a.insight_impulse,
      a.sections, a.faq, a.quiz, au.name AS author_name`;

    // 1. Fetch explicitly listed related articles
    if (relatedSlugs.length > 0) {
      const res = await pool.query<ArticleRow>(
        `SELECT ${cols} FROM runpsy_articles a
         JOIN runpsy_authors au ON au.slug = a.author_slug
         WHERE a.slug = ANY($1) AND a.status = 'published'
         LIMIT $2`,
        [relatedSlugs, limit]
      );
      if (res.rows.length >= limit) return res.rows.map(mapArticle);
      // If not enough, top up from same category below
      const found = res.rows.map(mapArticle);
      const foundSlugs = found.map((a) => a.slug);
      const need = limit - found.length;
      const res2 = await pool.query<ArticleRow>(
        `SELECT ${cols} FROM runpsy_articles a
         JOIN runpsy_authors au ON au.slug = a.author_slug
         WHERE a.category_slug = $1 AND a.status = 'published'
           AND a.slug <> $2 AND NOT (a.slug = ANY($3))
         ORDER BY random() LIMIT $4`,
        [categorySlug, currentSlug, foundSlugs, need]
      );
      return [...found, ...res2.rows.map(mapArticle)];
    }

    // 2. No explicit related — pick from same category
    const res = await pool.query<ArticleRow>(
      `SELECT ${cols} FROM runpsy_articles a
       JOIN runpsy_authors au ON au.slug = a.author_slug
       WHERE a.category_slug = $1 AND a.status = 'published' AND a.slug <> $2
       ORDER BY random() LIMIT $3`,
      [categorySlug, currentSlug, limit]
    );
    return res.rows.map(mapArticle);
  }, [] as Article[]);
}

/**
 * Full-text search across title, description, introduction, tags and section
 * paragraphs using PostgreSQL russian-language tsvector.
 * Results are sorted by ts_rank (most relevant first).
 * Falls back to JS substring match on all text fields if DB unavailable.
 */
export async function searchArticlesFromStore(
  query: string,
  categorySlug?: string,
  allArticles?: Article[],
): Promise<Article[]> {
  if (!query.trim()) return [];

  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) throw new Error("no pool");

    // Build a plainto_tsquery so multi-word queries work naturally
    const categoryFilter = categorySlug ? "AND a.category_slug = $2" : "";
    const params: (string)[] = [query];
    if (categorySlug) params.push(categorySlug);

    const result = await pool.query<ArticleRow & { rank: number }>(
      `
        SELECT
          a.slug, a.title, a.description, a.date::text AS date, a.updated::text AS updated,
          a.author_slug, a.category_slug, a.tags, a.reading_time, a.hero_image,
          a.seo_title, a.seo_description, a.status, a.intent, a.cta,
          a.safety_note, a.introduction, a.related_slugs, a.insight_impulse,
          a.sections, a.faq, a.quiz, au.name AS author_name,
          ts_rank(
            to_tsvector('russian',
              coalesce(a.title, '') || ' ' ||
              coalesce(a.description, '') || ' ' ||
              coalesce(a.introduction, '') || ' ' ||
              coalesce(array_to_string(a.tags, ' '), '') || ' ' ||
              coalesce((
                SELECT string_agg(p, ' ')
                FROM runpsy_articles ra2,
                     jsonb_array_elements(ra2.sections) AS s,
                     jsonb_array_elements_text(s->'paragraphs') AS p
                WHERE ra2.slug = a.slug
              ), '')
            ),
            plainto_tsquery('russian', $1)
          ) AS rank
        FROM runpsy_articles a
        JOIN runpsy_authors au ON au.slug = a.author_slug
        WHERE a.status = 'published'
          AND to_tsvector('russian',
            coalesce(a.title, '') || ' ' ||
            coalesce(a.description, '') || ' ' ||
            coalesce(a.introduction, '') || ' ' ||
            coalesce(array_to_string(a.tags, ' '), '')
          ) @@ plainto_tsquery('russian', $1)
          ${categoryFilter}
        ORDER BY rank DESC
      `,
      params,
    );

    return result.rows.map(mapArticle);
  }, jsFallbackSearch(query, categorySlug, allArticles ?? []));
}

function jsFallbackSearch(query: string, categorySlug: string | undefined, articles: Article[]): Article[] {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);

  return articles.filter((a) => {
    if (categorySlug && a.category !== categorySlug) return false;
    const text = [
      a.title,
      a.description,
      a.introduction ?? "",
      a.tags.join(" "),
      ...a.sections.flatMap((s) => s.paragraphs),
    ]
      .join(" ")
      .toLowerCase();
    return words.every((w) => text.includes(w));
  });
}

export async function getArticlesByCategoryFromStore(categorySlug: string) {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return [] as Article[];

    const result = await pool.query<ArticleRow>(
      `
        SELECT
          a.slug, a.title, a.description, a.date::text AS date, a.updated::text AS updated,
          a.author_slug, a.category_slug, a.tags, a.reading_time, a.hero_image,
          a.seo_title, a.seo_description, a.status, a.intent, a.cta,
          a.safety_note, a.introduction, a.related_slugs, a.insight_impulse,
          a.sections, a.faq, a.quiz, au.name AS author_name
        FROM runpsy_articles a
        JOIN runpsy_authors au ON au.slug = a.author_slug
        WHERE a.category_slug = $1 AND a.status = 'published'
        ORDER BY a.sort_order ASC, a.slug ASC
      `,
      [categorySlug]
    );

    return result.rows.map(mapArticle);
  }, [] as Article[]);
}


