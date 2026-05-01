import Link from "next/link";
import type { Article } from "@/types/article";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <h3 className="font-serif text-2xl">Похожие материалы</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4 transition hover:bg-[var(--bg-soft)]">
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--accent)]">{article.intent}</p>
            <p className="mt-1 text-sm font-semibold">{article.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
