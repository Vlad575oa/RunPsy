import { getDbPool } from "@/lib/db";
import { notFound } from "next/navigation";
import ArticleEditForm from "../ArticleEditForm";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ArticleEditPage({ params }: PageProps) {
  const { slug } = await params;
  const pool = getDbPool();
  if (!pool) return <div className="p-8 text-red-600">Нет подключения к БД</div>;

  const result = await pool.query(
    `SELECT slug, title, description, date, updated, author_slug, category_slug, tags,
            reading_time, hero_image, seo_title, seo_description, status, intent,
            cta, safety_note, introduction, related_slugs, insight_impulse,
            sections, faq, quiz
     FROM runpsy_articles WHERE slug = $1`,
    [slug]
  );

  if (!result.rows.length) notFound();

  const article = result.rows[0];

  // Fetch categories for select
  const catsResult = await pool.query(
    `SELECT slug, title FROM runpsy_categories ORDER BY sort_order`
  );

  return (
    <ArticleEditForm
      article={article}
      categories={catsResult.rows}
    />
  );
}
