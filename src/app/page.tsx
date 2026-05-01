import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";
import { categories, getPublishedArticles } from "@/lib/content";

export default function HomePage() {
  const articles = getPublishedArticles();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-9 px-6 py-10">
      <section className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm md:p-6">
        <form action="/articles" className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="home-search">Поиск по статьям</label>
          <input
            id="home-search"
            name="q"
            type="search"
            placeholder="Найти статью: расставание, тревога, границы..."
            className="min-h-12 w-full rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 text-base outline-none transition placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:bg-white"
          />
          <button className="min-h-12 rounded-full bg-[var(--accent)] px-7 text-sm font-semibold text-white transition hover:opacity-90" type="submit">
            Искать
          </button>
        </form>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-white"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl">Статьи для быстрого старта</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-soft)]">
              Выберите тему, которая ближе к вашей ситуации. Внутри каждой статьи есть содержание, ответы на частые вопросы и короткий тест.
            </p>
          </div>
          <Link href="/articles" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
            Смотреть все
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <NewsletterCTA />
    </div>
  );
}
