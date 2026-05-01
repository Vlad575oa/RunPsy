import { ArticleCard } from "@/components/blog/article-card";
import { categories, getPublishedArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Статьи по психологии отношений | RunPsy",
  description: "Практичные статьи о тревоге, границах, отношениях и восстановлении.",
  path: "/articles",
});

type ArticlesPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const articles = getPublishedArticles();
  const normalizedQuery = query.toLowerCase();
  const filteredArticles = normalizedQuery
    ? articles.filter((article) => {
        const categoryTitle = categories.find((category) => category.slug === article.category)?.title ?? "";
        return [
          article.title,
          article.description,
          article.intent,
          categoryTitle,
          ...article.tags,
          ...article.sections.flatMap((section) => [section.title, ...section.paragraphs]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
    : articles;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="font-serif text-4xl">Статьи</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
        Материалы с реальными сценариями: без стыда, без «магического мышления», с уважением к сложности жизни.
      </p>

      <form action="/articles" className="mt-7 grid gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 md:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="articles-search">Поиск по статьям</label>
        <input
          id="articles-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Поиск по теме, слову или ситуации"
          className="min-h-12 rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 outline-none transition focus:border-[var(--accent)] focus:bg-white"
        />
        <button className="min-h-12 rounded-full bg-[var(--accent)] px-7 text-sm font-semibold text-white transition hover:opacity-90" type="submit">
          Искать
        </button>
      </form>

      {query ? (
        <p className="mt-5 text-sm text-[var(--text-soft)]">
          Найдено: {filteredArticles.length} по запросу «{query}».
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
