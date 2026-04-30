import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/blog" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        Вернуться в блог
      </Link>
      <h1 className="mt-4 text-4xl leading-tight">{article.title}</h1>
      <p className="mt-4 text-lg leading-8 text-[var(--text-soft)]">{article.description}</p>

      <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-5 text-sm text-[var(--text-soft)]">
        <p>
          <span className="font-semibold text-[var(--text)]">Интент:</span> {article.intent}
        </p>
        <p>
          <span className="font-semibold text-[var(--text)]">Кластер:</span> {article.cluster}
        </p>
        <p>
          <span className="font-semibold text-[var(--text)]">FAQ:</span> {article.faqCount}+
        </p>
        <p>
          <span className="font-semibold text-[var(--text)]">Обновлено:</span> {article.updatedAt}
        </p>
      </div>

      {article.sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="text-2xl">{section.title}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--text-soft)]">
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}

      {article.safetyNote ? (
        <section className="mt-8 rounded-2xl border border-[var(--warn)]/35 bg-[#fff7ef] p-5">
          <h2 className="text-xl text-[var(--warn)]">Safety-блок</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{article.safetyNote}</p>
        </section>
      ) : null}

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl">Следующий шаг</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.cta}</p>
        <Link
          href="/consultation"
          className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Перейти к диагностике
        </Link>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-xl">Дисклеймер</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
          Этот материал носит информационный характер и не заменяет личную работу
          с психологом, психотерапевтом или врачом.
        </p>
      </section>
    </article>
  );
}
