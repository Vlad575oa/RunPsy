import { articles as fallbackArticles, authors as fallbackAuthors, categories as fallbackCategories } from "@/lib/content";
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
    if (!pool) return fallbackArticles.filter((article) => article.status === "published");

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
  }, fallbackArticles.filter((article) => article.status === "published"));
}

export async function getArticleBySlugFromStore(slug: string) {
  const articles = await getPublishedArticlesFromStore();
  return articles.find((article) => article.slug === slug);
}

export async function getCategoriesFromStore() {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return fallbackCategories;

    const result = await pool.query<CategoryRow>(
      `
        SELECT slug, title, short_description, seo_title, meta_description, seed_ideas
        FROM runpsy_categories
        ORDER BY sort_order ASC, slug ASC
      `,
    );

    return result.rows.map(mapCategory);
  }, fallbackCategories);
}

export async function getCategoryBySlugFromStore(slug: string) {
  const categories = await getCategoriesFromStore();
  return categories.find((category) => category.slug === slug);
}

export async function getAuthorsFromStore() {
  return withFallback(async () => {
    const pool = getDbPool();
    if (!pool) return fallbackAuthors;

    const result = await pool.query<AuthorRow>(
      `
        SELECT slug, name, role, bio, credentials
        FROM runpsy_authors
        ORDER BY sort_order ASC, slug ASC
      `,
    );

    return result.rows.map(mapAuthor);
  }, fallbackAuthors);
}

export async function getAuthorBySlugFromStore(slug: string) {
  const authors = await getAuthorsFromStore();
  return authors.find((author) => author.slug === slug);
}

export async function getRelatedArticlesFromStore(slugs: string[]) {
  const articles = await getPublishedArticlesFromStore();
  return articles.filter((article) => slugs.includes(article.slug));
}

export async function getArticlesByCategoryFromStore(slug: string) {
  const articles = await getPublishedArticlesFromStore();
  return articles.filter((article) => article.category === slug);
}

