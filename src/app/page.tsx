import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { getCategoriesFromStore, getPublishedArticlesFromStore } from "@/lib/content-store";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "RunPsy — статьи, тесты и чек-листы по психологии отношений",
  description:
    "Практичная психология отношений: 250 статей, 25 тестов и 25 чек-листов про тревогу, границы, расставание, созависимость, самооценку и выгорание.",
  path: "/",
});

export default async function HomePage() {
  const [articles, categories] = await Promise.all([getPublishedArticlesFromStore(), getCategoriesFromStore()]);

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
        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-center text-xs font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-white sm:px-4 sm:text-sm"
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
        <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
