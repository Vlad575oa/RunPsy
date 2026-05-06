import { getDbPool } from "@/lib/db";

type CategoryStat = { title: string; count: number };
type IntentStat = { intent: string; count: number };

export default async function AdminDashboard() {
  const pool = getDbPool();

  let total = 0;
  let published = 0;
  let draft = 0;
  let byCategory: CategoryStat[] = [];
  let byIntent: IntentStat[] = [];

  if (pool) {
    const [totals, cats, intents] = await Promise.all([
      pool.query<{ status: string; cnt: string }>(
        `SELECT status, COUNT(*) as cnt FROM runpsy_articles GROUP BY status`
      ),
      pool.query<{ title: string; count: string }>(
        `SELECT c.title, COUNT(a.slug) as count
         FROM runpsy_categories c
         LEFT JOIN runpsy_articles a ON a.category_slug = c.slug
         GROUP BY c.slug, c.title
         ORDER BY count DESC`
      ),
      pool.query<{ intent: string; cnt: string }>(
        `SELECT intent, COUNT(*) as cnt FROM runpsy_articles GROUP BY intent ORDER BY cnt DESC`
      ),
    ]);

    for (const row of totals.rows) {
      const n = parseInt(row.cnt, 10);
      total += n;
      if (row.status === "published") published = n;
      if (row.status === "draft") draft = n;
    }

    byCategory = cats.rows.map((r) => ({ title: r.title, count: parseInt(r.count, 10) }));
    byIntent = intents.rows.map((r) => ({ intent: r.intent ?? "—", count: parseInt(r.cnt, 10) }));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <StatCard label="Всего статей" value={total} color="#3b82f6" />
        <StatCard label="Опубликовано" value={published} color="#22c55e" />
        <StatCard label="Черновики" value={draft} color="#94a3b8" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* By category */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">По категориям</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-medium">Категория</th>
                <th className="pb-2 font-medium text-right">Статьи</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map((c) => (
                <tr key={c.title} className="border-b border-slate-50 last:border-0">
                  <td className="py-2 text-slate-700">{c.title}</td>
                  <td className="py-2 text-right font-semibold text-slate-900">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* By intent */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">По интенту</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-medium">Интент</th>
                <th className="pb-2 font-medium text-right">Статьи</th>
              </tr>
            </thead>
            <tbody>
              {byIntent.map((i) => (
                <tr key={i.intent} className="border-b border-slate-50 last:border-0">
                  <td className="py-2">
                    <IntentBadge intent={i.intent} />
                  </td>
                  <td className="py-2 text-right font-semibold text-slate-900">{i.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-4xl font-bold" style={{ color }}>
        {value}
      </span>
    </div>
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
      {intent}
    </span>
  );
}
