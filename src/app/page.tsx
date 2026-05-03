import { ArticleExpander } from "@/components/blog/article-expander";
import { Pagination } from "@/components/blog/pagination";
import { SearchForm } from "@/components/blog/search-form";
import { getCategoriesFromStore, getPublishedArticlesFromStore } from "@/lib/content-store";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "RunPsy — статьи по психологии отношений",
  description:
    "Практичная психология отношений: статьи про тревогу, границы, расставание, созависимость, самооценку и выгорание.",
  path: "/",
});

const PER_PAGE = 10;

type HomePageProps = {
  searchParams?: Promise<{ q?: string; category?: string; page?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const category = params?.category?.trim() ?? "";
  const page = Math.max(1, parseInt(params?.page ?? "1", 10));

  const [allArticles, categories] = await Promise.all([
    getPublishedArticlesFromStore(),
    getCategoriesFromStore(),
  ]);

  const filtered = allArticles.filter((article) => {
    const matchesQuery = !query || article.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || article.category === category;
    return matchesQuery && matchesCategory;
  });

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      {/* Поиск и фильтр */}
      <section className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm md:p-6">
        <SearchForm categories={categories} currentCategory={category} currentQuery={query} />
      </section>

      {/* Результат и сетка */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-soft)]">
            {total === 0
              ? "Ничего не найдено"
              : query || category
              ? `Найдено: ${total}`
              : `Все статьи · ${total}`}
          </p>
        </div>

        {paginated.length === 0 ? (
          <div className="rounded-2xl border border-[var(--line)] bg-white p-10 text-center text-sm text-[var(--text-soft)]">
            По вашему запросу ничего не найдено. Попробуйте изменить поиск или категорию.
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((article) => (
              <ArticleExpander key={article.slug} article={article} />
            ))}
          </div>
        )}

        {total > PER_PAGE && (
          <div className="mt-8">
            <Pagination page={page} total={total} perPage={PER_PAGE} query={query} category={category} />
          </div>
        )}
      </section>
    </div>
  );
}
