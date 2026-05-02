import Script from "next/script";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { InteractiveQuiz } from "@/components/blog/interactive-quiz";
import { getArticleBySlugFromStore, getPublishedArticlesFromStore } from "@/lib/content-store";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, faqSchema } from "@/lib/schema";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getPublishedArticlesFromStore();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlugFromStore(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/articles/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlugFromStore(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-0 py-10 sm:px-6">
      <Script id={`schema-article-${article.slug}`} type="application/ld+json">
        {JSON.stringify(articleSchema(article))}
      </Script>
      <Script id={`schema-faq-${article.slug}`} type="application/ld+json">
        {JSON.stringify(faqSchema(article))}
      </Script>

      <Link href="/articles" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        ← Назад к статьям
      </Link>

      <article className="mt-4 rounded-none border-y border-[var(--line)] bg-white p-6 shadow-sm sm:rounded-3xl sm:border md:p-8">
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--accent)]">{article.intent}</p>
        <h1 className="mt-2 font-serif text-[clamp(2rem,4vw,3.3rem)] leading-tight">{article.title}</h1>
        <p className="mt-4 max-w-[72ch] text-lg leading-8 text-[var(--text-soft)]">{article.description}</p>
        <p className="mt-3 text-sm text-[var(--text-soft)]">{article.date} · {article.readingTime}</p>

        <details className="mt-7 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
          <summary className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)] marker:text-[var(--accent)]">
            Содержание
          </summary>
          <nav className="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-soft)] md:grid-cols-2" aria-label="Содержание статьи">
            {article.sections.map((section, index) => (
              <a key={section.title} className="rounded-xl px-3 py-2 transition hover:bg-white hover:text-[var(--text)]" href={`#section-${index + 1}`}>
                {index + 1}. {section.title}
              </a>
            ))}
          </nav>
        </details>

        <div className="mt-8 space-y-6" id="content">
          {article.sections.map((section, index) => (
            <section
              id={`section-${index + 1}`}
              key={section.title}
              className={`scroll-mt-24 rounded-2xl border p-6 ${
                section.title === "Суть за 30 секунд"
                  ? "border-[#b7ded0] bg-[linear-gradient(135deg,rgba(207,107,62,0.10),rgba(180,236,214,0.28),rgba(255,255,255,0.88))]"
                  : section.title === "Что помогает"
                    ? "border-[#b7ded0] bg-[#eafff6]/80"
                    : "border-[var(--line)] bg-[var(--bg)]"
              }`}
            >
              <h2
                className={`font-serif text-2xl ${
                  section.title === "Что помогает" || section.title === "Суть за 30 секунд" ? "text-[#17614f]" : ""
                }`}
              >
                {section.title}
              </h2>
              <div className="mt-3 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {article.safetyNote ? (
            <section className="rounded-2xl border border-[#e7bd9f] bg-[#fff4ea] p-6">
              <h2 className="font-serif text-2xl text-[var(--accent-deep)]">Важная оговорка</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{article.safetyNote}</p>
            </section>
          ) : null}

          <section className="rounded-2xl border border-[#e7d9bf] bg-[#fff8ec] p-6">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 marker:content-none">
                <ChevronRight className="h-5 w-5 text-[var(--accent-deep)] transition-transform duration-200 group-open:rotate-90" />
                <h2 className="font-serif text-2xl text-[var(--accent-deep)]">Вопросы и ответы</h2>
              </summary>
              <div className="mt-4 space-y-3">
                {article.faq.map((item) => (
                  <details key={item.question} className="group/faq rounded-xl border border-[#ecdcc0] bg-white/90 p-4">
                    <summary className="flex cursor-pointer list-none items-center gap-2 marker:content-none">
                      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--accent-deep)] transition-transform duration-200 group-open/faq:rotate-90" />
                      <h3 className="font-semibold">{item.question}</h3>
                    </summary>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </details>
          </section>

          <InteractiveQuiz slug={article.slug} quiz={article.quiz} />
        </div>
      </article>
    </div>
  );
}
