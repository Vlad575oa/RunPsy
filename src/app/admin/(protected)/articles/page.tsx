import { getDbPool } from "@/lib/db";
import Link from "next/link";

type SearchParams = {
  status?: string;
  category?: string;
  q?: string;
  page?: string;
};

type ArticleRow = {
  slug: string;
  title: string;
  category_slug: string;
  status: string;
  intent: string;
  date: string;
};

type CategoryRow = { slug: string; title: string };

const LIMIT = 30;

export default async function ArticlesListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "all";
  const categoryFilter = params.category ?? "";
  const search = params.q ?? "";
  const page = parseInt(params.page ?? "1", 10);
  const offset = (page - 1) * LIMIT;

  const pool = getDbPool();
  let articles: ArticleRow[] = [];
  let categories: CategoryRow[] = [];
  let total = 0;

  if (pool) {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (statusFilter !== "all") {
      conditions.push(`a.status = $${idx++}`);
      values.push(statusFilter);
    }
    if (categoryFilter) {
      conditions.push(`a.category_slug = $${idx++}`);
      values.push(categoryFilter);
    }
    if (search) {
      conditions.push(`(a.title ILIKE $${idx} OR a.slug ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows, countRow, cats] = await Promise.all([
      pool.query<ArticleRow>(
        `SELECT a.slug, a.title, a.category_slug, a.status, a.intent, a.date
         FROM runpsy_articles a
         ${where}
         ORDER BY a.date DESC
         LIMIT ${LIMIT} OFFSET ${offset}`,
        values
      ),
      pool.query<{ cnt: string }>(
        `SELECT COUNT(*) as cnt FROM runpsy_articles a ${where}`,
        values
      ),
      pool.query<CategoryRow>(`SELECT slug, title FROM runpsy_categories ORDER BY sort_order`),
    ]);

    articles = rows.rows;
    total = parseInt(countRow.rows[0]?.cnt ?? "0", 10);
    categories = cats.rows;
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Статьи</h1>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        {/* Status tabs */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white">
          {[
            { value: "all", label: "Все" },
            { value: "published", label: "Опубликовано" },
            { value: "draft", label: "Черновики" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="submit"
              name="status"
              value={tab.value}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          name="category"
          defaultValue={categoryFilter}
          onChange={(e) => {
            const form = e.currentTarget.closest("form") as HTMLFormElement;
            if (form) form.submit();
          }}
          className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="flex gap-2 flex-1 min-w-48">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Поиск по названию..."
            className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-700 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input type="hidden" name="status" value={statusFilter} />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "#3b82f6" }}
          >
            Найти
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-4 font-medium">Заголовок</th>
              <th className="px-4 py-4 font-medium">Категория</th>
              <th className="px-4 py-4 font-medium">Статус</th>
              <th className="px-4 py-4 font-medium">Интент</th>
              <th className="px-4 py-4 font-medium">Дата</th>
              <th className="px-4 py-4 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Статьи не найдены
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.slug} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 line-clamp-1">{a.title}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">{a.slug}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 text-xs">{a.category_slug}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-4">
                    <IntentBadge intent={a.intent} />
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{a.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/articles/${a.slug}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                        style={{ background: "#3b82f6" }}
                      >
                        Изменить
                      </Link>
                      <form action={`/api/admin/articles/${a.slug}/status`} method="POST">
                        <button
                          type="submit"
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            a.status === "published"
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {a.status === "published" ? "→ Черновик" : "→ Опубл."}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?status=${statusFilter}&category=${categoryFilter}&q=${search}&page=${p}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
              style={p === page ? { background: "#3b82f6" } : {}}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Опубликовано
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      Черновик
    </span>
  );
}

function IntentBadge({ intent }: { intent: string }) {
  const map: Record<string, string> = {
    "кризисный": "bg-red-100 text-red-700",
    "эмоциональный": "bg-purple-100 text-purple-700",
    "информационный": "bg-blue-100 text-blue-700",
  };
  const cls = map[intent] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {intent ?? "—"}
    </span>
  );
}
