import Script from "next/script";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticlePracticeTools } from "@/components/blog/article-practice-tools";
import { DisclaimerBlock } from "@/components/blog/disclaimer-block";
import { InsightImpulse } from "@/components/blog/insight-impulse";
import { InteractiveQuiz } from "@/components/blog/interactive-quiz";
import { RelatedArticles } from "@/components/blog/related-articles";
import { getArticleBySlug, getPublishedArticles, getRelatedArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, faqSchema } from "@/lib/schema";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/articles/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = getRelatedArticles(article.relatedSlugs);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Script id={`schema-article-${article.slug}`} type="application/ld+json">
        {JSON.stringify(articleSchema(article))}
      </Script>
      <Script id={`schema-faq-${article.slug}`} type="application/ld+json">
        {JSON.stringify(faqSchema(article))}
      </Script>

      <Link href="/articles" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        ← Назад к статьям
      </Link>

      <article className="mt-4 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
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

        <InsightImpulse title={article.title} impulse={article.insightImpulse} />

        <div className="mt-8 space-y-6" id="content">
          {article.sections.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.title} className="scroll-mt-24 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6">
              <h2 className="font-serif text-2xl">{section.title}</h2>
              <div className="mt-3 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <ArticlePracticeTools slug={article.slug} sectionTitle={section.title} />
            </section>
          ))}

          {article.safetyNote ? (
            <section className="rounded-2xl border border-[#e7bd9f] bg-[#fff4ea] p-6">
              <h2 className="font-serif text-2xl text-[var(--accent-deep)]">Важная оговорка</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{article.safetyNote}</p>
            </section>
          ) : null}

          <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <h2 className="font-serif text-2xl">Что можно сделать дальше</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.cta}</p>
          </section>

          <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <h2 className="font-serif text-2xl">Вопросы и ответы</h2>
            <div className="mt-4 space-y-4">
              {article.faq.map((item) => (
                <article key={item.question} className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
                  <h3 className="font-semibold">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <InteractiveQuiz slug={article.slug} quiz={article.quiz} />

          <DisclaimerBlock />
          <RelatedArticles articles={relatedArticles} />
        </div>
      </article>
    </div>
  );
}
