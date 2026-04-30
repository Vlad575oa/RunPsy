import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Блог",
  description: "Кризисные гайды по отношениям, границам и восстановлению после расставания.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl">Блог RunPsy</h1>
      <p className="mt-4 max-w-3xl text-[var(--text-soft)]">
        Статьи построены по структуре: быстрый ответ → причины/признаки →
        алгоритм действий → FAQ → мягкий CTA.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
              {article.intent}
            </p>
            <h2 className="mt-2 text-2xl leading-tight">{article.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.description}</p>
            <p className="mt-3 text-sm text-[var(--text-soft)]">Обновлено: {article.updatedAt}</p>
            <Link
              href={`/blog/${article.slug}`}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline"
            >
              Открыть материал
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
