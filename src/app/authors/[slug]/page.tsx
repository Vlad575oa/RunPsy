import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/article-card";
import { getPublishedArticles, getAuthorBySlug } from "@/lib/content";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = getPublishedArticles().filter((article) => article.author === author.name);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="font-serif text-4xl">{author.name}</h1>
      <p className="mt-2 text-sm text-[var(--text-soft)]">{author.role}</p>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-soft)]">{author.bio}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
