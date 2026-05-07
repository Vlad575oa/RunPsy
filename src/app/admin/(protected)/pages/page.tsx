import { getDbPool } from "@/lib/db";
import Link from "next/link";

type PageRow = { slug: string; title: string; updated: string };

const PAGE_LABELS: Record<string, string> = {
  privacy: "Политика приватности",
  terms: "Условия использования",
  cookies: "Настройки файлов Cookie",
  disclaimer: "Дисклеймер",
  "editorial-policy": "Редакционная политика",
};

export default async function PagesListPage() {
  const pool = getDbPool();
  let pages: PageRow[] = [];
  if (pool) {
    const result = await pool.query<PageRow>(
      `SELECT slug, title, updated FROM runpsy_pages ORDER BY slug`
    );
    pages = result.rows;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Страницы футера</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-4 font-medium">Страница</th>
              <th className="px-4 py-4 font-medium">URL</th>
              <th className="px-4 py-4 font-medium">Обновлено</th>
              <th className="px-4 py-4 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  Страницы не найдены
                </td>
              </tr>
            ) : (
              pages.map((p) => (
                <tr key={p.slug} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {PAGE_LABELS[p.slug] ?? p.title}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/${p.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      /{p.slug}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{p.updated}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/pages/${p.slug}/edit`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ background: "#3b82f6" }}
                    >
                      Изменить
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
