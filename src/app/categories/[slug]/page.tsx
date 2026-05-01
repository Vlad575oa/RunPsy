import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/article-card";
import { getArticlesByCategory, getCategoryBySlug } from "@/lib/content";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const articles = getArticlesByCategory(slug);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="font-serif text-4xl">{category.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)]">{category.shortDescription}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
