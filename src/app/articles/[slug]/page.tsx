import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { ArticleChecklist } from "@/components/blog/article-checklist";
import { ArticleDialogueBlock } from "@/components/blog/article-dialogue-block";
import { ArticleScenariosBlock } from "@/components/blog/article-scenarios-block";
import { renderGlossaryInline } from "@/components/blog/glossary-inline";
import { InteractiveQuiz } from "@/components/blog/interactive-quiz";
import { getArticleBySlugFromStore, getCategoriesFromStore, getReadNextArticles } from "@/lib/content-store";
import { RelatedArticles } from "@/components/blog/related-articles";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
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
const isResearchTitle = (title: string) => title.toLowerCase().includes("исследования");

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
  return (article.insightImpulse.checklist ?? []).map(stripChecklistPrefix).filter(Boolean);
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

  return (article.insightImpulse.dialogue ?? []).map((item) => ({
    trigger: renderGlossaryInline(item.instead, articlePath, sectionId),
    response: renderGlossaryInline(item.try, articlePath, sectionId),
    note: renderGlossaryInline(item.why, articlePath, sectionId),
  }));
}

function getScenarioOutcomes(article: Article, section: ArticleSection | undefined) {
  const outcomes = (section?.paragraphs ?? []).filter(Boolean);
  if (outcomes.length) return outcomes;
  return [
    ...(article.insightImpulse.twoSides?.firstItems?.slice(0, 1) ?? []),
    ...(article.insightImpulse.twoSides?.secondItems?.slice(0, 1) ?? []),
  ];
}

function getScenarioAction(article: Article) {
  const microAction = article.sections.find((section) => section.title.toLowerCase().includes("микро-действ"));
  return microAction?.paragraphs[0] ?? article.insightImpulse.microAction ?? "";
}

function getRenderableSections(article: Article) {
  const sections = [...article.sections];

  if (!sections.some((section) => isDialogueTitle(section.title)) && article.insightImpulse.dialogue?.length) {
    sections.push({
      title: "Конструктор диалогов",
      paragraphs: article.insightImpulse.dialogue.map((item) => `Вместо «${item.instead}» — «${item.try}»`),
    });
  }

  if (!sections.some((section) => isScenarioTitle(section.title)) && article.insightImpulse.twoSides) {
    sections.push({
      title: "Сценарии 50/50",
      paragraphs: [
        article.insightImpulse.twoSides.firstItems?.[0] ?? "Первый исход зависит от того, выдерживаете ли вы паузу и контакт с реальностью.",
        article.insightImpulse.twoSides.secondItems?.[0] ?? "Второй исход показывает, что происходит, если действовать по старому автоматическому шаблону.",
      ],
    });
  }

  if (!sections.some((section) => isChecklistTitle(section.title)) && article.insightImpulse.checklist?.length) {
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

function renderModelSection(section: ArticleSection, articlePath: string, sectionId: string, step: number) {
  const [lead, ...details] = section.paragraphs;
  return (
    <details open id={sectionId} className="group scroll-mt-24 rounded-[2rem] border border-[#d7deeb] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fd_100%)] p-6 shadow-[0_18px_44px_rgba(38,45,67,0.06)]">
      <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
        <ChevronRight className="h-6 w-6 text-[#5d6fa6] transition-transform duration-200 group-open:rotate-90 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5d6fa6]/10 text-[10px] font-bold text-[#5d6fa6]">{step}</span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5d6fa6]">Модель</p>
          </div>
          <h2 className="mt-1 font-serif text-2xl text-[#20253a]">{section.title}</h2>
        </div>
      </summary>
      <div className="mt-5 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
        <p>{renderGlossaryInline(lead, articlePath, sectionId)}</p>
      </div>
      {details.length ? (
        <div className="mt-5 rounded-[1.4rem] border border-[#d7deeb] bg-white/85 p-4">
          <p className="list-none text-sm font-semibold text-[#445785] marker:content-none mb-3">Углубиться в нейробиологию</p>
          <div className="space-y-4 text-sm leading-7 text-[var(--text-soft)]">{renderDefaultParagraphs(details, articlePath, sectionId)}</div>
        </div>
      ) : null}
    </details>
  );
}

function renderBadAdviceSection(section: ArticleSection, articlePath: string, sectionId: string, step: number) {
  return (
    <details open id={sectionId} className="group scroll-mt-24 rounded-[2rem] border border-[#f0d2d2] bg-[#fff9f9] p-6 shadow-[0_16px_40px_rgba(120,36,36,0.06)]">
      <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
        <ChevronRight className="h-6 w-6 text-[#b24747] transition-transform duration-200 group-open:rotate-90 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b24747]/10 text-[10px] font-bold text-[#b24747]">{step}</span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b24747]">Не работает</p>
          </div>
          <h2 className="mt-1 font-serif text-2xl text-[#732525]">{section.title}</h2>
        </div>
      </summary>
      <div className="mt-5 space-y-3 text-[1.03rem] leading-8 text-[#8d5d5d]">
        {section.paragraphs.map((paragraph, index) => (
          <p key={`${sectionId}-bad-advice-${index}`} className="decoration-[#d77474] decoration-2 line-through/20">
            <span className="line-through decoration-[#d77474] decoration-2">{renderGlossaryInline(paragraph, articlePath, sectionId)}</span>
          </p>
        ))}
      </div>
    </details>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, categories] = await Promise.all([
    getArticleBySlugFromStore(slug),
    getCategoriesFromStore(),
  ]);
  if (!article) notFound();

  const category = categories.find((c) => c.slug === article.category);
  const relatedArticles = await getReadNextArticles(article.slug, article.relatedSlugs, article.category, 3);
  const articlePath = `/articles/${article.slug}`;
  const sections = getRenderableSections(article);

  return (
    <div className="mx-auto w-full max-w-6xl px-0 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(article)) }} />
      {article.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(article)) }} />
      )}
      {category && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(category.slug, category.title, article.title, article.slug)) }} />
      )}

      <nav aria-label="breadcrumb" className="mb-4 hidden items-center gap-1 text-sm text-[var(--text-soft)] sm:flex">
        <Link href="/" className="hover:text-[var(--accent)]">RunPsy</Link>
        {category && (
          <>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <Link href={`/categories/${category.slug}`} className="hover:text-[var(--accent)]">{category.title}</Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="truncate text-[var(--text)]">{article.title}</span>
      </nav>

      <article className="mt-4 overflow-hidden rounded-none border-y border-[var(--line)] bg-white shadow-sm sm:rounded-[2rem] sm:border">
        {/* Hero image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={article.heroImage ?? "/images/articles/placeholder.webp"}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60" />
        </div>

        <div className="p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{article.intent}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-2xl leading-[1.1] text-[var(--text)] sm:text-4xl md:text-6xl md:leading-[1.02]">{article.title}</h1>
        <section className="mt-8 rounded-[2rem] border border-[#e8e0d5] bg-[linear-gradient(135deg,rgba(251,244,234,0.8),rgba(255,250,245,0.95))] p-6 shadow-[0_14px_40px_rgba(111,45,26,0.07)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Введение в проблему</p>
          <div className="mt-4 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
            {(article.introduction ?? article.description).split("\n\n").map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
          </div>
        </section>
        
        <details open className="group mt-8 rounded-[2rem] border border-[#cfe3da] bg-[linear-gradient(135deg,rgba(208,247,232,0.7),rgba(255,247,238,0.95))] p-6 shadow-[0_18px_48px_rgba(23,97,79,0.10)]">
          <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
            <ChevronRight className="h-6 w-6 text-[#17614f] transition-transform duration-200 group-open:rotate-90 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                {(() => {
                  const essenceIndex = sections.findIndex(s => s.title === "Суть за 30 секунд");
                  const step = essenceIndex > -1 ? essenceIndex + 1 : 1;
                  return <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#17614f]/10 text-[10px] font-bold text-[#17614f]">{step}</span>;
                })()}
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#17614f]">Суть за 30 секунд</p>
              </div>
              <h2 className="mt-1 font-serif text-2xl text-[#10382f]">Краткая выжимка</h2>
            </div>
          </summary>
          <div className="mt-5 space-y-4 text-lg leading-8 text-[#1d3b34]">
            {article.sections
              .find((section) => section.title === "Суть за 30 секунд")
              ?.paragraphs.map((paragraph, index) => (
                <p key={`section-essence-${index}`}>{renderGlossaryInline(paragraph, articlePath, "section-essence")}</p>
              ))}
          </div>
        </details>
        
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-soft)]">
          <Link href={`/authors/${article.authorSlug}`} className="font-semibold text-[var(--text)] hover:underline">
            {article.author}
          </Link>
          <span className="opacity-30">·</span>
          <time dateTime={article.date}>{article.date}</time>
          <span className="opacity-30">·</span>
          <span>{article.readingTime}</span>
        </div>

<div className="mt-10 space-y-7" id="content">
          {sections.map((section, index) => {
            const sectionId = `section-${index + 1}`;
            const dialogueItems = isDialogueTitle(section.title) ? buildDialogueItems(article, articlePath, sectionId, section) : [];
            const scenarioOutcomes = isScenarioTitle(section.title) ? getScenarioOutcomes(article, section) : [];
            const checklistItems = isChecklistTitle(section.title) ? extractChecklistItems(section, article) : [];

            if (section.title === "Суть за 30 секунд") return null;
            if (isModelTitle(section.title)) return <div key={sectionId}>{renderModelSection(section, articlePath, sectionId, index + 1)}</div>;
            if (isBadAdviceTitle(section.title)) return <div key={sectionId}>{renderBadAdviceSection(section, articlePath, sectionId, index + 1)}</div>;
            if (isResearchTitle(section.title)) {
              return (
                <details open id={sectionId} key={sectionId} className="group scroll-mt-24 rounded-[2rem] border border-[#b3c8e8] bg-[#f0f6ff] p-6 shadow-[0_18px_44px_rgba(30,80,160,0.07)]">
                  <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
                    <ChevronRight className="h-6 w-6 shrink-0 text-[#2563a8] transition-transform duration-200 group-open:rotate-90" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563a8]/10 text-[10px] font-bold text-[#2563a8]">{index + 1}</span>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563a8]">Раздел</p>
                      </div>
                      <h2 className="mt-1 font-serif text-2xl text-[#1a3a6b]">🧠 {section.title}</h2>
                    </div>
                  </summary>
                  <div className="mt-4 space-y-3 pl-9">
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex} className="leading-relaxed text-[var(--text)]">
                        {renderGlossaryInline(paragraph, articlePath, sectionId)}
                      </p>
                    ))}
                  </div>
                </details>
              );
            }
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
              <details
                open
                id={sectionId}
                key={sectionId}
                className={`group scroll-mt-24 rounded-[2rem] border p-6 ${
                  section.title === "Что помогает"
                    ? "border-[#b7ded0] bg-[#f2fff9] shadow-[0_18px_44px_rgba(23,97,79,0.08)]"
                    : "border-[var(--line)] bg-[var(--bg)]"
                }`}
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
                  <ChevronRight className={`h-6 w-6 transition-transform duration-200 group-open:rotate-90 shrink-0 ${section.title === "Что помогает" ? "text-[#17614f]" : "text-[var(--text-soft)]"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${section.title === "Что помогает" ? "bg-[#17614f]/10 text-[#17614f]" : "bg-[var(--text-soft)]/10 text-[var(--text-soft)]"}`}>{index + 1}</span>
                      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${section.title === "Что помогает" ? "text-[#17614f]" : "text-[var(--text-soft)]"}`}>Раздел</p>
                    </div>
                    <h2 className={`mt-1 font-serif text-2xl ${section.title === "Что помогает" ? "text-[#17614f]" : "text-[var(--text)]"}`}>{section.title}</h2>
                  </div>
                </summary>
                <div className="mt-5 space-y-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">
                  {renderDefaultParagraphs(section.paragraphs, articlePath, sectionId)}
                </div>
              </details>
            );
          })}

          {article.safetyNote ? (
            <details open className="group rounded-2xl border border-[#e7bd9f] bg-[#fff4ea] p-6">
              <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
                <ChevronRight className="h-6 w-6 text-[var(--accent-deep)] transition-transform duration-200 group-open:rotate-90 shrink-0" />
                <h2 className="font-serif text-2xl text-[var(--accent-deep)]">Важная оговорка</h2>
              </summary>
              <div className="mt-4 text-sm leading-6 text-[var(--text-soft)]">{renderGlossaryInline(article.safetyNote, articlePath, "section-safety")}</div>
            </details>
          ) : null}

          <section className="rounded-2xl border border-[#e7d9bf] bg-[#fff8ec] p-6">
            <details open className="group">
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

          <RelatedArticles articles={relatedArticles} categoryTitle={category?.title} />
        </div>
        </div>
      </article>
    </div>
  );
}
