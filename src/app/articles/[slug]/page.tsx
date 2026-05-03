import Script from "next/script";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { ArticleChecklist } from "@/components/blog/article-checklist";
import { ArticleDialogueBlock } from "@/components/blog/article-dialogue-block";
import { ArticleScenariosBlock } from "@/components/blog/article-scenarios-block";
import { renderGlossaryInline } from "@/components/blog/glossary-inline";
import { InteractiveQuiz } from "@/components/blog/interactive-quiz";
import { getArticleBySlugFromStore, getPublishedArticlesFromStore } from "@/lib/content-store";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, faqSchema } from "@/lib/schema";
import type { Article, ArticleSection } from "@/types/article";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type DialogueItem = {
  trigger?: ReactNode;
  response: ReactNode;
  note?: ReactNode;
};

const isChecklistTitle = (title: string) => title.toLowerCase().includes("чек-лист");
const isDialogueTitle = (title: string) => title.toLowerCase().includes("конструктор диалогов");
const isScenarioTitle = (title: string) => title.toLowerCase().includes("сценарии 50/50");
const isModelTitle = (title: string) => title.toLowerCase().includes("почему это происходит");
const isBadAdviceTitle = (title: string) => title.toLowerCase().includes("плохие советы");

export const dynamic = "force-dynamic";

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

function stripChecklistPrefix(value: string) {
  return value.replace(/^\s*\[[xX\s]?\]\s*/, "").trim();
}

function extractChecklistItems(section: ArticleSection | undefined, article: Article) {
  const sectionItems = (section?.paragraphs ?? []).map(stripChecklistPrefix).filter(Boolean);
  if (sectionItems.length) return sectionItems;
  return article.insightImpulse.checklist.map(stripChecklistPrefix).filter(Boolean);
}

function parseDialogueFromParagraphs(paragraphs: string[], articlePath: string, sectionId: string): DialogueItem[] {
  const items = paragraphs.flatMap((paragraph) => {
    const normalized = paragraph.trim();
    const insteadMatch = normalized.match(/(?:Вместо|вместо)\s+[«"](.+?)[»"]\s*[—-]\s*[«"](.+?)[»"]/u);

    if (insteadMatch) {
      return [
        {
          trigger: renderGlossaryInline(insteadMatch[1], articlePath, sectionId),
          response: renderGlossaryInline(insteadMatch[2], articlePath, sectionId),
        },
      ];
    }

    return [
      {
        response: renderGlossaryInline(normalized.replace(/^[«"]|[»"]$/g, ""), articlePath, sectionId),
      },
    ];
  });

  return items.filter((item) => item.response);
}

function buildDialogueItems(article: Article, articlePath: string, sectionId: string, section: ArticleSection | undefined) {
  const fromSection = parseDialogueFromParagraphs(section?.paragraphs ?? [], articlePath, sectionId);
  if (fromSection.length) return fromSection;

  return article.insightImpulse.dialogue.map((item) => ({
    trigger: renderGlossaryInline(item.instead, articlePath, sectionId),
    response: renderGlossaryInline(item.try, articlePath, sectionId),
    note: renderGlossaryInline(item.why, articlePath, sectionId),
  }));
}

function getScenarioOutcomes(article: Article, section: ArticleSection | undefined) {
  const outcomes = (section?.paragraphs ?? []).filter(Boolean);
  if (outcomes.length) return outcomes;
  return [
    ...article.insightImpulse.twoSides.firstItems.slice(0, 1),
    ...article.insightImpulse.twoSides.secondItems.slice(0, 1),
  ];
}

function getScenarioAction(article: Article) {
  const microAction = article.sections.find((section) => section.title.toLowerCase().includes("микро-действ"));
  return microAction?.paragraphs[0] ?? article.insightImpulse.microAction;
}

function getRenderableSections(article: Article) {
  const sections = [...article.sections];

  if (!sections.some((section) => isDialogueTitle(section.title))) {
    sections.push({
      title: "Конструктор диалогов",
      paragraphs: article.insightImpulse.dialogue.map((item) => `Вместо «${item.instead}» — «${item.try}»`),
    });
  }

  if (!sections.some((section) => isScenarioTitle(section.title))) {
    sections.push({
      title: "Сценарии 50/50",
      paragraphs: [
        article.insightImpulse.twoSides.firstItems[0] ?? "Первый исход зависит от того, выдерживаете ли вы паузу и контакт с реальностью.",
        article.insightImpulse.twoSides.secondItems[0] ?? "Второй исход показывает, что происходит, если действовать по старому автоматическому шаблону.",
      ],
    });
  }

  if (!sections.some((section) => isChecklistTitle(section.title))) {
    sections.push({
      title: "Чек-лист",
      paragraphs: article.insightImpulse.checklist.map((item) => `[ ] ${stripChecklistPrefix(item)}`),
    });
  }

  return sections;
}

function renderDefaultParagraphs(paragraphs: string[], articlePath: string, sectionId: string) {
  return paragraphs.map((paragraph, index) => (
    <p key={`${sectionId}-paragraph-${index}`}>{renderGlossaryInline(paragraph, articlePath, sectionId)}</p>
  ));
}

function renderModelSection(section: ArticleSection, articlePath: string, sectionId: string) {
  const [lead, ...details] = section.paragraphs;
  return (
    <section id={sectionId} className="scroll-mt-24 rounded-[2rem] border border-[#d7deeb] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fd_100%)] p-6 shadow-[0_18px_44px_rgba(38,45,67,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5d6fa6]">Модель</p>
      <h2 className="mt-2 font-serif text-2xl text-[#20253a]">{section.title}</h2>
      <div className="mt-4 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
        <p>{renderGlossaryInline(lead, articlePath, sectionId)}</p>
      </div>
      {details.length ? (
        <details className="mt-5 rounded-[1.4rem] border border-[#d7deeb] bg-white/85 p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[#445785] marker:content-none">Углубиться в нейробиологию</summary>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--text-soft)]">{renderDefaultParagraphs(details, articlePath, sectionId)}</div>
        </details>
      ) : null}
    </section>
  );
}

function renderBadAdviceSection(section: ArticleSection, articlePath: string, sectionId: string) {
  return (
    <section id={sectionId} className="scroll-mt-24 rounded-[2rem] border border-[#f0d2d2] bg-[#fff9f9] p-6 shadow-[0_16px_40px_rgba(120,36,36,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b24747]">Не работает</p>
      <h2 className="mt-2 font-serif text-2xl text-[#732525]">{section.title}</h2>
      <div className="mt-4 space-y-3 text-[1.03rem] leading-8 text-[#8d5d5d]">
        {section.paragraphs.map((paragraph, index) => (
          <p key={`${sectionId}-bad-advice-${index}`} className="decoration-[#d77474] decoration-2 line-through/20">
            <span className="line-through decoration-[#d77474] decoration-2">{renderGlossaryInline(paragraph, articlePath, sectionId)}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlugFromStore(slug);
  if (!article) notFound();

  const articlePath = `/articles/${article.slug}`;
  const sections = getRenderableSections(article);

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

      <article className="mt-4 rounded-none border-y border-[var(--line)] bg-white p-6 shadow-sm sm:rounded-[2rem] sm:border md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{article.intent}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-[1.02] text-[var(--text)] md:text-6xl">{article.title}</h1>
        <section className="mt-8 rounded-[2rem] border border-[#e8e0d5] bg-[linear-gradient(135deg,rgba(251,244,234,0.8),rgba(255,250,245,0.95))] p-6 shadow-[0_14px_40px_rgba(111,45,26,0.07)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Введение в проблему</p>
          <div className="mt-4 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
            {(article.introduction ?? article.description).split("\n\n").map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
          </div>
        </section>
        <section className="mt-8 rounded-[2rem] border border-[#cfe3da] bg-[linear-gradient(135deg,rgba(208,247,232,0.7),rgba(255,247,238,0.95))] p-6 shadow-[0_18px_48px_rgba(23,97,79,0.10)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#17614f]">Суть за 30 секунд</p>
          <div className="mt-4 space-y-4 text-lg leading-8 text-[#1d3b34]">
            {article.sections
              .find((section) => section.title === "Суть за 30 секунд")
              ?.paragraphs.map((paragraph, index) => (
                <p key={`section-essence-${index}`}>{renderGlossaryInline(paragraph, articlePath, "section-essence")}</p>
              ))}
          </div>
        </section>
        <p className="mt-4 text-sm text-[var(--text-soft)]">{article.date} · {article.readingTime}</p>

        <details className="mt-7 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
          <summary className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)] marker:text-[var(--accent)]">
            Содержание
          </summary>
          <nav className="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-soft)] md:grid-cols-2" aria-label="Содержание статьи">
            {sections.map((section, index) => (
              <a key={`${section.title}-${index}`} className="rounded-xl px-3 py-2 transition hover:bg-white hover:text-[var(--text)]" href={`#section-${index + 1}`}>
                {index + 1}. {section.title}
              </a>
            ))}
          </nav>
        </details>

        <div className="mt-10 space-y-7" id="content">
          {sections.map((section, index) => {
            const sectionId = `section-${index + 1}`;
            const dialogueItems = isDialogueTitle(section.title) ? buildDialogueItems(article, articlePath, sectionId, section) : [];
            const scenarioOutcomes = isScenarioTitle(section.title) ? getScenarioOutcomes(article, section) : [];
            const checklistItems = isChecklistTitle(section.title) ? extractChecklistItems(section, article) : [];

            if (section.title === "Суть за 30 секунд") return null;
            if (isModelTitle(section.title)) return <div key={sectionId}>{renderModelSection(section, articlePath, sectionId)}</div>;
            if (isBadAdviceTitle(section.title)) return <div key={sectionId}>{renderBadAdviceSection(section, articlePath, sectionId)}</div>;
            if (isDialogueTitle(section.title)) {
              return <ArticleDialogueBlock key={sectionId} title={section.title} items={dialogueItems} />;
            }
            if (isScenarioTitle(section.title)) {
              return (
                <ArticleScenariosBlock
                  key={sectionId}
                  title={section.title}
                  action={getScenarioAction(article)}
                  outcomes={scenarioOutcomes.map((outcome) => outcome.replace(/^Либо\s*/u, ""))}
                />
              );
            }
            if (isChecklistTitle(section.title)) {
              return <ArticleChecklist key={sectionId} slug={article.slug} title={section.title} items={checklistItems} />;
            }

            return (
              <section
                id={sectionId}
                key={sectionId}
                className={`scroll-mt-24 rounded-[2rem] border p-6 ${
                  section.title === "Что помогает"
                    ? "border-[#b7ded0] bg-[#f2fff9] shadow-[0_18px_44px_rgba(23,97,79,0.08)]"
                    : "border-[var(--line)] bg-[var(--bg)]"
                }`}
              >
                <h2 className={`font-serif text-2xl ${section.title === "Что помогает" ? "text-[#17614f]" : "text-[var(--text)]"}`}>{section.title}</h2>
                <div className="mt-3 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
                  {renderDefaultParagraphs(section.paragraphs, articlePath, sectionId)}
                </div>
              </section>
            );
          })}

          {article.safetyNote ? (
            <section className="rounded-2xl border border-[#e7bd9f] bg-[#fff4ea] p-6">
              <h2 className="font-serif text-2xl text-[var(--accent-deep)]">Важная оговорка</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{renderGlossaryInline(article.safetyNote, articlePath, "section-safety")}</p>
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
