"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileText,
  Folder,
  GitFork,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import ReactMarkdown from "react-markdown";
import type { Article, Category } from "@/types/article";
import { isUpdatedArticle } from "@/lib/updated-articles";

type ObsidianTopicMapProps = {
  articles: Article[];
  categories: Category[];
};

type GraphNode = {
  slug: string;
  title: string;
};

export function ObsidianTopicMap({ articles, categories }: ObsidianTopicMapProps) {
  const [selectedSlug, setSelectedSlug] = useState(articles[0]?.slug ?? "");
  const [query, setQuery] = useState("");
  const [collapsedExplorer, setCollapsedExplorer] = useState(false);
  const [openCategories, setOpenCategories] = useState(() => new Set(categories.map((category) => category.slug)));
  const { resolvedTheme, setTheme } = useTheme();

  const selectedArticle = articles.find((article) => article.slug === selectedSlug) ?? articles[0];
  const selectedCategory = categories.find((category) => category.slug === selectedArticle?.category);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return articles;

    return articles.filter((article) =>
      [article.title, article.description, article.category, ...article.tags, ...article.sections.map((section) => section.title)]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [articles, query]);

  const markdown = useMemo(() => (selectedArticle ? articleToMarkdown(selectedArticle) : ""), [selectedArticle]);
  const linkedNotes = useMemo(() => buildLinkedNotes(selectedArticle, articles), [selectedArticle, articles]);

  function toggleCategory(slug: string) {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  if (!selectedArticle) {
    return null;
  }

  return (
    <section className="bg-transparent text-[var(--text)]">
      <div className="mx-auto grid min-h-[calc(100vh-74px)] w-full grid-cols-1 border-y border-[var(--line)] lg:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside
          className={[
            "border-r border-[rgba(255,255,255,0.45)] bg-white/45 shadow-[0_18px_40px_rgba(111,45,26,0.08)] backdrop-blur-2xl transition-all duration-300",
            collapsedExplorer ? "hidden lg:block lg:w-[76px]" : "w-full lg:w-[320px]",
          ].join(" ")}
        >
          <div className="flex min-h-16 items-center justify-between border-b border-[rgba(255,255,255,0.45)] px-4">
            <div className={collapsedExplorer ? "hidden" : "flex items-center gap-2"}>
              <Brain className="h-5 w-5 text-[var(--accent)]" />
              <div>
                <p className="text-sm font-semibold">Psychology Topics</p>
                <p className="text-xs text-[var(--text-soft)]">{articles.length} markdown notes</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCollapsedExplorer((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(255,255,255,0.5)] bg-white/35 text-[var(--text-soft)] transition hover:bg-white/70 hover:text-[var(--text)]"
              aria-label={collapsedExplorer ? "Open explorer" : "Collapse explorer"}
            >
              {collapsedExplorer ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          {collapsedExplorer ? (
            <div className="flex flex-col items-center gap-3 py-5">
              <Menu className="h-5 w-5 text-[var(--text-soft)]" />
              <FileText className="h-5 w-5 text-[var(--accent)]" />
              <GitFork className="h-5 w-5 text-[var(--accent-deep)]" />
            </div>
          ) : (
            <div className="p-4">
              <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.5)] bg-white/40 px-3 text-sm text-[var(--text-soft)] backdrop-blur-xl">
                <Search className="h-4 w-4 text-[var(--text-soft)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-transparent outline-none placeholder:text-[var(--text-soft)]"
                />
              </label>

              <div className="mt-5 space-y-2">
                {categories.map((category) => {
                  const categoryArticles = filteredArticles.filter((article) => article.category === category.slug);
                  if (categoryArticles.length === 0) return null;
                  const isOpen = openCategories.has(category.slug);

                  return (
                    <div key={category.slug} className="rounded-2xl border border-[rgba(255,255,255,0.5)] bg-white/32 backdrop-blur-xl">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.slug)}
                        className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm font-semibold text-[var(--text)] transition hover:bg-white/55"
                      >
                        {isOpen ? <ChevronDown className="h-4 w-4 text-[var(--text-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--text-soft)]" />}
                        <Folder className="h-4 w-4 text-[var(--accent)]" />
                        <span className="min-w-0 flex-1 truncate">{category.title}</span>
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-[var(--text-soft)]">{categoryArticles.length}</span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 px-2 pb-2">
                              {categoryArticles.map((article) => (
                                <button
                                  key={article.slug}
                                  type="button"
                                  onClick={() => setSelectedSlug(article.slug)}
                                  className={[
                                    "flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
                                    article.slug === selectedArticle.slug
                                      ? "bg-white/72 text-[var(--accent-deep)] ring-1 ring-[rgba(207,107,62,0.25)]"
                                      : "text-[var(--text-soft)] hover:bg-white/50 hover:text-[var(--text)]",
                                    isUpdatedArticle(article.slug) ? "border border-emerald-400/70" : "border border-transparent",
                                  ].join(" ")}
                                >
                                  <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                                  <span className="min-w-0 flex-1 truncate">{article.title}.md</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        <div className="min-w-0 bg-transparent">
          <div className="sticky top-[73px] z-10 flex min-h-16 items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.45)] bg-white/40 px-5 backdrop-blur-2xl">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-soft)]">
                <button type="button" onClick={() => setSelectedSlug(articles[0].slug)} className="transition hover:text-[var(--accent-deep)]">
                  RunPsy Vault
                </button>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>{selectedCategory?.title ?? "Psychology Topics"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="truncate text-[var(--text)]">{selectedArticle.title}.md</span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]/80">Breadcrumbs 2.0</p>
            </div>

            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.55)] bg-white/45 px-3 text-sm text-[var(--text)] transition hover:bg-white/72"
            >
              <Moon className="h-4 w-4" />
              <Sun className="h-4 w-4" />
              Theme
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={selectedArticle.slug}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className={`mx-auto max-w-3xl px-6 py-10 md:px-10 ${isUpdatedArticle(selectedArticle.slug) ? "rounded-2xl border border-emerald-400/80 bg-emerald-50/20" : ""}`}
            >
              <div className="mb-7 flex flex-wrap items-center gap-2">
                {selectedArticle.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full border border-[rgba(255,255,255,0.55)] bg-white/40 px-3 py-1 text-xs text-[var(--text-soft)] backdrop-blur-xl">
                    #{tag}
                  </span>
                ))}
              </div>

              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="font-[var(--font-lora)] text-4xl leading-tight text-[var(--text)] md:text-5xl">{children}</h1>,
                  h2: ({ children }) => <h2 className="mt-10 font-[var(--font-lora)] text-2xl text-[var(--text)]">{children}</h2>,
                  p: ({ children }) => <p className="mt-5 font-[var(--font-lora)] text-[1.05rem] leading-8 text-[var(--text-soft)]">{children}</p>,
                  ul: ({ children }) => <ul className="mt-5 space-y-2 font-[var(--font-lora)] text-[var(--text-soft)]">{children}</ul>,
                  li: ({ children }) => <li className="ml-5 list-disc leading-8">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="mt-7 rounded-2xl border border-[rgba(255,255,255,0.55)] bg-white/42 px-5 py-4 font-[var(--font-lora)] text-[var(--accent-deep)] backdrop-blur-xl">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => <strong className="font-semibold text-[var(--text)]">{children}</strong>,
                }}
              >
                {markdown}
              </ReactMarkdown>
            </motion.article>
          </AnimatePresence>
        </div>

        <aside className="border-l border-[rgba(255,255,255,0.45)] bg-white/45 p-5 backdrop-blur-2xl">
          <section className="sticky top-[96px]">
            <div className="rounded-3xl border border-[rgba(255,255,255,0.55)] bg-white/42 p-5 shadow-[0_24px_50px_rgba(111,45,26,0.12)] backdrop-blur-2xl">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[rgba(207,107,62,0.14)] text-[var(--accent-deep)]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">AI Summary</h2>
                    <p className="text-xs text-[var(--text-soft)]">Notebook-style context card</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--text-soft)]">
                  <p>{selectedArticle.description}</p>
                  <div className="rounded-2xl border border-[rgba(255,255,255,0.55)] bg-white/55 p-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-deep)]">
                      <CircleDot className="h-3.5 w-3.5" />
                      Next step
                    </p>
                    <p>{selectedArticle.quiz.questions[2]?.options[0]}</p>
                  </div>
                  <div className="rounded-2xl border border-[rgba(255,255,255,0.55)] bg-white/55 p-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                      <BookOpen className="h-3.5 w-3.5" />
                      Linked notes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {linkedNotes.slice(0, 4).map((node) => (
                        <button
                          key={node.slug}
                          type="button"
                          onClick={() => setSelectedSlug(node.slug)}
                          className="rounded-full bg-white/80 px-3 py-1 text-xs text-[var(--text-soft)] transition hover:bg-white hover:text-[var(--accent-deep)]"
                        >
                          {node.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function articleToMarkdown(article: Article) {
  const sections = article.sections
    .map((section) => `## ${section.title}\n\n${section.paragraphs.join("\n\n")}`)
    .join("\n\n");
  const faq = article.faq.map((item) => `- **${item.question}** ${item.answer}`).join("\n");

  return `# ${article.title}

> ${article.description}

${sections}

## Вопросы и ответы

${faq}

## Мини-тест

${article.quiz.description}

${article.quiz.questions.map((question) => `- **${question.question}** ${question.options.join(" / ")}`).join("\n")}
`;
}

function buildLinkedNotes(article: Article, articles: Article[]): GraphNode[] {
  return articles
    .filter((candidate) => candidate.slug !== article.slug && (article.relatedSlugs.includes(candidate.slug) || candidate.category === article.category))
    .slice(0, 7)
    .map((candidate) => ({
      slug: candidate.slug,
      title: candidate.title,
    }));
}
