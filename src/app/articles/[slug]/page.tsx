import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { ArticleChecklist } from "@/components/blog/article-checklist";
import { ArticleDialogueBlock } from "@/components/blog/article-dialogue-block";
import { ArticleScenariosBlock } from "@/components/blog/article-scenarios-block";
import { ArticleTOC } from "@/components/blog/article-toc";
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
const isSourcesTitle = (title: string) => title.toLowerCase().includes("источник");

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

// Plain text section — numbered heading + flowing text, no card
function renderTextSection(
  section: ArticleSection,
  articlePath: string,
  sectionId: string,
  num: number,
  accentColor = "var(--accent)"
) {
  return (
    <section id={sectionId} className="scroll-mt-24">
      <h2 className="flex items-baseline gap-2.5 font-serif text-[1.55rem] leading-tight text-[var(--text)]">
        <span style={{ color: accentColor }} className="shrink-0 text-base font-bold opacity-50">
          {num}.
        </span>
        {section.title}
      </h2>
      <div className="mt-4 space-y-4 text-[1.03rem] leading-[1.85] text-[var(--text-soft)]">
        {renderDefaultParagraphs(section.paragraphs, articlePath, sectionId)}
      </div>
    </section>
  );
}

// Bad advice — plain flow with strikethrough
function renderBadAdviceSection(
  section: ArticleSection,
  articlePath: string,
  sectionId: string,
  num: number
) {
  return (
    <section id={sectionId} className="scroll-mt-24">
      <h2 className="flex items-baseline gap-2.5 font-serif text-[1.55rem] leading-tight text-[#732525]">
        <span className="shrink-0 text-base font-bold text-[#b24747] opacity-50">{num}.</span>
        {section.title}
      </h2>
      <div className="mt-4 space-y-3 text-[1.03rem] leading-[1.85] text-[#8d5d5d]">
        {section.paragraphs.map((paragraph, index) => (
          <p key={`${sectionId}-bad-${index}`}>
            <span className="line-through decoration-[#d77474] decoration-2">
              {renderGlossaryInline(paragraph, articlePath, sectionId)}
            </span>
          </p>
        ))}
      </div>
    </section>
  );
}

// Research section — plain flow, no card
function renderResearchSection(
  section: ArticleSection,
  articlePath: string,
  sectionId: string,
  num: number
) {
  return (
    <section id={sectionId} className="scroll-mt-24">
      <h2 className="flex items-baseline gap-2.5 font-serif text-[1.55rem] leading-tight text-[#1a3a6b]">
        <span className="shrink-0 text-base font-bold text-[#2563a8] opacity-50">{num}.</span>
        {section.title}
      </h2>
      <div className="mt-4 space-y-4 text-[1.03rem] leading-[1.85] text-[var(--text-soft)]">
        {renderDefaultParagraphs(section.paragraphs, articlePath, sectionId)}
      </div>
    </section>
  );
}

function renderSourceText(source: string) {
  const markdownLinkMatch = source.match(/^\s*\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s*$/i);
  if (markdownLinkMatch) {
    const [, label, href] = markdownLinkMatch;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline">
        {label}
      </a>
    );
  }

  const urlRegex = /(https?:\/\/[^\s)]+)/gi;
  const matches = [...source.matchAll(urlRegex)];
  if (!matches.length) return <span>{source}</span>;

  const nodes: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    const href = match[0];
    const start = match.index ?? 0;

    if (start > cursor) {
      nodes.push(<span key={`txt-${index}`}>{source.slice(cursor, start)}</span>);
    }

    nodes.push(
      <a
        key={`url-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:no-underline"
      >
        {href}
      </a>,
    );
    cursor = start + href.length;
  });

  if (cursor < source.length) {
    nodes.push(<span key="txt-last">{source.slice(cursor)}</span>);
  }

  return <>{nodes}</>;
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

  // Build TOC — preserve original index so IDs match DOM (section-${originalIndex+1})
  // Источники goes last; Сценарии 50/50 excluded (interactive block, not a reading section)
  const allTocMapped = sections.map((s, i) => ({ id: `section-${i + 1}`, title: s.title }));
  const mainTocItems = allTocMapped.filter(({ title }) =>
    title !== "Суть за 30 секунд" &&
    !isSourcesTitle(title) &&
    !isScenarioTitle(title)
  );
  const sourcesTocItem = allTocMapped.find(({ title }) => isSourcesTitle(title));
  const tocItems = sourcesTocItem ? [...mainTocItems, sourcesTocItem] : mainTocItems;

  return (
    <div className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1900px] px-0 py-10 sm:px-6">
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

        {/* TOP ROW: hero image (left) + TOC (right) — desktop only */}
        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:items-stretch">
          {/* Hero image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={article.heroImage ?? "/images/articles/placeholder.webp"}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1160px"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60" />
          </div>

          {/* TOC — right of hero, desktop only */}
          <aside className="hidden lg:flex flex-col border-l border-[var(--line)] px-5 py-6">
            <ArticleTOC items={tocItems} />
          </aside>
        </div>

        {/* CONTENT — full width, below hero+TOC */}
        <div className="p-6 md:p-10">
          {/* Header */}
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{article.intent}</p>
          <h1 className="mt-3 font-serif text-2xl leading-[1.1] text-[var(--text)] sm:text-4xl md:text-5xl md:leading-[1.06]">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-soft)]">
            <Link href={`/authors/${article.authorSlug}`} className="font-semibold text-[var(--text)] hover:underline">
              {article.author}
            </Link>
            <span className="opacity-30">·</span>
            <time dateTime={article.date}>{article.date}</time>
            <span className="opacity-30">·</span>
            <span>{article.readingTime}</span>
          </div>

          {/* Introduction */}
          <div className="mt-8 space-y-4 text-[1.08rem] leading-[1.9] text-[var(--text-soft)]">
            {(article.introduction ?? article.description).split("\n\n").map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
          </div>

          {/* Краткая выжимка */}
          {article.sections.find((s) => s.title === "Суть за 30 секунд") && (
            <aside className="mt-8 rounded-2xl border-l-4 border-[#17614f] bg-[#f2fff9] px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#17614f]">Краткая выжимка</p>
              <div className="mt-3 space-y-3 text-[1.03rem] leading-[1.8] text-[#1d3b34]">
                {article.sections
                  .find((s) => s.title === "Суть за 30 секунд")
                  ?.paragraphs.map((paragraph, index) => (
                    <p key={`essence-${index}`}>{renderGlossaryInline(paragraph, articlePath, "section-essence")}</p>
                  ))}
              </div>
            </aside>
          )}

          {/* Sections — full width */}
          <div className="mt-10 space-y-10" id="content">
          {sections.map((section, index) => {
                const sectionId = `section-${index + 1}`;
                const num = index + 1;

                if (section.title === "Суть за 30 секунд") return null;
                if (isSourcesTitle(section.title)) return null; // rendered separately below

                // Interactive / highlighted blocks — keep as card inserts
                if (isDialogueTitle(section.title)) {
                  const dialogueItems = buildDialogueItems(article, articlePath, sectionId, section);
                  return <ArticleDialogueBlock key={sectionId} title={section.title} items={dialogueItems} />;
                }
                if (isScenarioTitle(section.title)) {
                  const scenarioOutcomes = getScenarioOutcomes(article, section);
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
                  const checklistItems = extractChecklistItems(section, article);
                  return <ArticleChecklist key={sectionId} slug={article.slug} title={section.title} items={checklistItems} />;
                }

                // Text-flow blocks — no card, just numbered heading + prose
                if (isModelTitle(section.title)) {
                  return (
                    <div key={sectionId}>
                      {renderTextSection(section, articlePath, sectionId, num, "#5d6fa6")}
                    </div>
                  );
                }
                if (isBadAdviceTitle(section.title)) {
                  return <div key={sectionId}>{renderBadAdviceSection(section, articlePath, sectionId, num)}</div>;
                }
                if (isResearchTitle(section.title)) {
                  return <div key={sectionId}>{renderResearchSection(section, articlePath, sectionId, num)}</div>;
                }

                // Default text section
                return (
                  <div key={sectionId}>
                    {renderTextSection(section, articlePath, sectionId, num)}
                  </div>
                );
              })}

              {/* Safety note — subtle left-border insert */}
              {article.safetyNote && (
                <aside className="rounded-r-xl border-l-4 border-[#e7bd9f] bg-[#fff8f0] py-4 pl-5 pr-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-deep)]">Важная оговорка</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    {renderGlossaryInline(article.safetyNote, articlePath, "section-safety")}
                  </p>
                </aside>
              )}

              {/* FAQ — accordion card */}
              {article.faq.length > 0 && (
                <section className="rounded-2xl border border-[#e7d9bf] bg-[#fff8ec] p-6">
                  <h2 className="font-serif text-2xl text-[var(--accent-deep)]">Вопросы и ответы</h2>
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
                </section>
              )}

              <InteractiveQuiz slug={article.slug} quiz={article.quiz} />

              {/* Sources block */}
              {sections.some((s) => isSourcesTitle(s.title)) && (
                <details className="group rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 marker:content-none">
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-soft)] transition-transform duration-200 group-open:rotate-90" />
                    <span className="text-sm font-semibold text-[var(--text-soft)]">Источники</span>
                  </summary>
                  <ul className="space-y-2 px-5 pb-5 pt-1">
                    {sections
                      .find((s) => isSourcesTitle(s.title))
                      ?.paragraphs.map((source, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-soft)]/40" />
                          <span>{renderSourceText(source)}</span>
                        </li>
                      ))}
                  </ul>
                </details>
              )}

              <RelatedArticles articles={relatedArticles} categoryTitle={category?.title} />
          </div>{/* end sections */}
        </div>{/* end content */}
      </article>
    </div>
  );
}
