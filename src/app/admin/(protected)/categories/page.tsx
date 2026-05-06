import { getDbPool } from "@/lib/db";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type CategoryRow = {
  slug: string;
  title: string;
  short_description: string | null;
  sort_order: number | null;
  article_count: string;
};

export default async function CategoriesPage() {
  const pool = getDbPool();
  let categories: CategoryRow[] = [];

  if (pool) {
    const result = await pool.query<CategoryRow>(
      `SELECT c.slug, c.title, c.short_description, c.sort_order,
              COUNT(a.slug) as article_count
       FROM runpsy_categories c
       LEFT JOIN runpsy_articles a ON a.category_slug = c.slug
       GROUP BY c.slug, c.title, c.short_description, c.sort_order
       ORDER BY c.sort_order NULLS LAST, c.title`
    );
    categories = result.rows;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Категории</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-4 py-4 font-medium">Название</th>
              <th className="px-4 py-4 font-medium">Описание</th>
              <th className="px-4 py-4 font-medium">Порядок</th>
              <th className="px-4 py-4 font-medium">Статьи</th>
              <th className="px-4 py-4 font-medium">Сайт</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Нет категорий
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.slug} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5 text-slate-600">
                      {c.slug}
                    </code>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">{c.title}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs max-w-xs">
                    <span className="line-clamp-2">{c.short_description ?? "—"}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-center">{c.sort_order ?? "—"}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {parseInt(c.article_count, 10)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/topics/${c.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
