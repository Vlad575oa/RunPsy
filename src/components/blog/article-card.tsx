import Link from "next/link";
import type { Article } from "@/types/article";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
      <p className="text-xs uppercase tracking-[0.08em] text-[var(--accent)]">{article.intent}</p>
      <h3 className="mt-2 font-serif text-2xl leading-tight">{article.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.description}</p>
      <div className="mt-auto flex items-center justify-between pt-5 text-xs text-[var(--text-soft)]">
        <span>{article.readingTime}</span>
        <span>{article.date}</span>
      </div>
      <Link href={`/articles/${article.slug}`} className="mt-4 inline-flex rounded-full bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--accent-deep)] transition hover:bg-[var(--bg-soft)]">
        Читать статью
      </Link>
    </article>
  );
}
