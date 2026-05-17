import { getDbPool } from "@/lib/db";
import type { Article, ArticleSection, ArticleFaq } from "@/types/article";

const SITE_URL = "https://runpsy.ru";

export const dynamic = "force-dynamic";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toUTCString().replace("GMT", "+0000");
}

function articleToHtml(article: Article): string {
  const parts: string[] = [];

  if (article.heroImage) {
    parts.push(`<figure><img src="${SITE_URL}${article.heroImage}" alt="${escapeXml(article.title)}" /></figure>`);
  }

  if (article.introduction) {
    parts.push(`<p>${article.introduction}</p>`);
  }

  for (const section of article.sections ?? []) {
    const s = section as ArticleSection;
    if (s.title) parts.push(`<h2>${escapeXml(s.title)}</h2>`);
    for (const para of s.paragraphs ?? []) {
      parts.push(`<p>${para}</p>`);
    }
  }

  const faq = article.faq ?? [];
  if (faq.length > 0) {
    parts.push("<h2>Часто задаваемые вопросы</h2>");
    for (const item of faq as ArticleFaq[]) {
      parts.push(`<h3>${escapeXml(item.question)}</h3><p>${item.answer}</p>`);
    }
  }

  if (article.cta) {
    parts.push(`<p><strong>${escapeXml(article.cta)}</strong></p>`);
  }

  parts.push(`<p><a href="${SITE_URL}/articles/${article.slug}">Читать полностью на RunPsy</a></p>`);

  return parts.join("\n");
}

function buildRss(articles: Article[]): string {
  const items = articles
    .slice(0, 100)
    .map((a) => {
      const url = `${SITE_URL}/articles/${a.slug}`;
      const pubDate = toRfc822(a.date);
      const content = articleToHtml(a);
      const enclosure = a.heroImage
        ? `<enclosure url="${SITE_URL}${a.heroImage}" type="image/jpeg" />`
        : "";
      const description = escapeXml(a.description ?? "");

      return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <category>native-draft</category>
      ${enclosure}
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RunPsy — практичная психология отношений</title>
    <link>${SITE_URL}</link>
    <description>Меньше шума, больше ясных шагов. Статьи по психологии отношений.</description>
    <language>ru</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

export async function GET() {
  const pool = getDbPool();

  let articles: Article[] = [];

  if (pool) {
    const result = await pool.query(`
      SELECT
        a.slug, a.title, a.description, a.date::text AS date, a.updated::text AS updated,
        a.author_slug, a.category_slug, a.tags, a.reading_time, a.hero_image,
        a.seo_title, a.seo_description, a.status, a.intent, a.cta,
        a.safety_note, a.introduction, a.sections, a.faq,
        au.name AS author_name
      FROM runpsy_articles a
      JOIN runpsy_authors au ON au.slug = a.author_slug
      WHERE a.status = 'published'
      ORDER BY a.date DESC
      LIMIT 100
    `);

    articles = result.rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      description: r.description ?? "",
      date: r.date,
      updated: r.updated,
      author: r.author_name,
      authorSlug: r.author_slug,
      category: r.category_slug,
      tags: r.tags ?? [],
      readingTime: r.reading_time ?? "",
      heroImage: r.hero_image ?? undefined,
      seoTitle: r.seo_title ?? r.title,
      seoDescription: r.seo_description ?? r.description ?? "",
      status: r.status,
      intent: r.intent,
      cta: r.cta ?? "",
      safetyNote: r.safety_note,
      introduction: r.introduction,
      relatedSlugs: [],
      insightImpulse: {} as Article["insightImpulse"],
      sections: Array.isArray(r.sections) ? r.sections : JSON.parse(r.sections ?? "[]"),
      faq: Array.isArray(r.faq) ? r.faq : JSON.parse(r.faq ?? "[]"),
      quiz: {} as Article["quiz"],
    }));
  }

  const xml = buildRss(articles);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
