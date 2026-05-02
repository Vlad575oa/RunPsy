import Link from "next/link";
import type { Article } from "@/types/article";
import { isUpdatedArticle } from "@/lib/updated-articles";

export function ArticleCard({ article, highlighted = false }: { article: Article; highlighted?: boolean }) {
  const shouldHighlight = highlighted || isUpdatedArticle(article.slug);
  return (
    <Link href={`/articles/${article.slug}`} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      <article
        className={`flex h-full flex-col rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 sm:p-6 ${
          shouldHighlight
            ? "border-emerald-500 ring-1 ring-emerald-100 hover:border-emerald-600"
            : "border-[var(--line)] hover:border-[var(--accent)]"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--accent)] sm:text-xs">{article.intent}</p>
        <h3 className={`mt-1.5 font-serif text-sm leading-tight sm:mt-2 sm:text-2xl ${shouldHighlight ? "text-emerald-800" : ""}`}>{article.title}</h3>
        <p className="mt-2 hidden text-sm leading-6 text-[var(--text-soft)] sm:block">{article.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[var(--text-soft)] sm:pt-5">
          <span>{article.readingTime}</span>
          <span className="hidden sm:inline">{article.date}</span>
        </div>
      </article>
    </Link>
  );
}
