import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/article-card";
import { getArticlesByCategoryFromStore, getCategoryBySlugFromStore } from "@/lib/content-store";
import { buildMetadata } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlugFromStore(slug);
  if (!category) return {};

  return buildMetadata({
    title: category.seoTitle,
    description: category.metaDescription,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlugFromStore(slug);
  if (!category) notFound();
  const articles = await getArticlesByCategoryFromStore(slug);

  return (
    <div className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1900px] px-6 py-10">
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
