import Link from "next/link";
import type { Article } from "@/types/article";
import { isUpdatedArticle } from "@/lib/updated-articles";

export function ArticleCard({ article, highlighted = false }: { article: Article; highlighted?: boolean }) {
  const shouldHighlight = highlighted || isUpdatedArticle(article.slug);
  return (
    <Link href={`/articles/${article.slug}`} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      <article
        className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 ${
          shouldHighlight
            ? "border-emerald-500 ring-1 ring-emerald-100 hover:border-emerald-600"
            : "border-[var(--line)] hover:border-[var(--accent)]"
        }`}
      >
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--accent)]">{article.intent}</p>
        <h3 className={`mt-2 font-serif text-2xl leading-tight ${shouldHighlight ? "text-emerald-800" : ""}`}>{article.title}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-[var(--text-soft)]">
          <span>{article.readingTime}</span>
          <span>{article.date}</span>
        </div>
      </article>
    </Link>
  );
}
