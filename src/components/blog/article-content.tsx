"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";
import { useState } from "react";
import type { Article } from "@/types/article";

const SECTION_META: Record<string, { icon: string }> = {
  "суть":        { icon: "⚡" },
  "точка боли":  { icon: "🎯" },
  "почему":      { icon: "🔍" },
  "советуют":    { icon: "🚫" },
  "помогает":    { icon: "✨" },
  "микро":       { icon: "🏃" },
  "диалог":      { icon: "💬" },
  "50/50":       { icon: "⚖️" },
  "чек-лист":    { icon: "✅" },
  "пример":      { icon: "📖" },
  "исследован":  { icon: "🧠" },
  "специалист":  { icon: "🩺" },
  "итог":        { icon: "🎯" },
};

function getSectionMeta(title: string) {
  const t = title.toLowerCase();
  for (const [key, val] of Object.entries(SECTION_META)) {
    if (t.includes(key)) return val;
  }
  return { icon: "📌" };
}

export function ArticleContent({ article, showTitle = true }: { article: Article; showTitle?: boolean }) {
  const ii = article.insightImpulse;
  // все секции свёрнуты по умолчанию
  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set());

  function toggleSection(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div>
      {showTitle && (
        <h1 className="font-[var(--font-lora)] text-2xl leading-tight text-[var(--text)] md:text-4xl lg:text-5xl">
          {article.title}
        </h1>
      )}

      {/* Введение — всегда открыто */}
      {article.introduction && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[rgba(207,107,62,0.25)] bg-gradient-to-br from-[rgba(207,107,62,0.08)] to-[rgba(207,107,62,0.03)]">
          <div className="border-b border-[rgba(207,107,62,0.15)] px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">📖 Введение в проблему</span>
          </div>
          <div className="px-5 py-5">
            {article.introduction.split(". ").reduce<string[][]>((acc, sentence, i) => {
              const chunk = Math.floor(i / 2);
              if (!acc[chunk]) acc[chunk] = [];
              acc[chunk].push(sentence);
              return acc;
            }, []).map((sentences, i) => (
              <p key={i} className={[
                "font-[var(--font-lora)] text-[1.05rem] leading-8",
                i === 0 ? "font-medium text-[var(--text)]" : "mt-4 text-[var(--text-soft)]",
              ].join(" ")}>
                {sentences.join(". ")}{sentences[sentences.length - 1]?.endsWith(".") ? "" : "."}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Секции — аккордеон, все свёрнуты по умолчанию */}
      <div className="mt-6 space-y-2">
        {article.sections.map((section, i) => {
          const isOpen = openSections.has(i);
          const meta = getSectionMeta(section.title);
          const isChecklist  = section.title.toLowerCase().includes("чек-лист");
          const isDialogue   = section.title.toLowerCase().includes("диалог");
          const isTwoSides   = section.title.toLowerCase().includes("50/50");
          const isMicro      = section.title.toLowerCase().includes("микро");
          const isSpecialist = section.title.toLowerCase().includes("специалист");
          const isResult     = section.title.toLowerCase().includes("итог") || section.title.toLowerCase().includes("сегодня");
          const preview      = section.paragraphs[0]?.slice(0, 80);

          return (
            <div key={i} className={[
              "overflow-hidden rounded-2xl border transition-all duration-200",
              isOpen
                ? "border-[rgba(255,255,255,0.6)] bg-white/50 shadow-sm backdrop-blur-xl"
                : "border-[rgba(255,255,255,0.4)] bg-white/30 backdrop-blur-xl hover:bg-white/40",
            ].join(" ")}>
              <button type="button" onClick={() => toggleSection(i)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left">
                <span className="text-lg">{meta.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--text)]">{section.title}</p>
                  {!isOpen && preview && (
                    <p className="mt-0.5 truncate text-xs text-[var(--text-soft)]">{preview}…</p>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--text-soft)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 px-5 pb-5">
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className="font-[var(--font-lora)] text-[1rem] leading-8 text-[var(--text-soft)]">{p}</p>
                      ))}

                      {isChecklist && ii.checklist && ii.checklist.length > 0 && (
                        <div className="mt-3 rounded-xl border border-emerald-200/50 bg-emerald-50/50 p-4">
                          <ul className="space-y-2">
                            {ii.checklist.map((item, k) => (
                              <li key={k} className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
                                <span className="mt-1 h-4 w-4 shrink-0 rounded border border-emerald-400/50 bg-white/60" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isDialogue && ii.dialogue && ii.dialogue.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {ii.dialogue.map((d, k) => (
                            <div key={k} className="rounded-xl border border-blue-100/60 bg-blue-50/20 p-4">
                              <p className="text-xs text-[var(--text-soft)] line-through opacity-60">❌ {d.instead}</p>
                              <p className="mt-1 text-sm font-medium text-[var(--text)]">✓ {d.try}</p>
                              <p className="mt-1 text-xs text-[var(--text-soft)]">{d.why}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {isTwoSides && ii.twoSides && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-[rgba(255,255,255,0.55)] bg-white/50 p-3">
                            <p className="mb-2 text-xs font-semibold text-[var(--accent-deep)]">{ii.twoSides.firstTitle}</p>
                            <ul className="space-y-1">
                              {ii.twoSides.firstItems.map((item, k) => (
                                <li key={k} className="text-xs text-[var(--text-soft)]">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-xl border border-[rgba(255,255,255,0.55)] bg-white/50 p-3">
                            <p className="mb-2 text-xs font-semibold text-[var(--accent)]">{ii.twoSides.secondTitle}</p>
                            <ul className="space-y-1">
                              {ii.twoSides.secondItems.map((item, k) => (
                                <li key={k} className="text-xs text-[var(--text-soft)]">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          {ii.twoSides.bridge && (
                            <div className="col-span-2 rounded-xl bg-[rgba(207,107,62,0.08)] px-4 py-3 text-xs text-[var(--text-soft)]">
                              {ii.twoSides.bridge}
                            </div>
                          )}
                        </div>
                      )}

                      {isMicro && ii.microAction && (
                        <div className="mt-3 flex items-start gap-3 rounded-xl border border-[rgba(207,107,62,0.3)] bg-[rgba(207,107,62,0.07)] px-4 py-3">
                          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                          <p className="text-sm leading-7 text-[var(--text-soft)]">{ii.microAction}</p>
                        </div>
                      )}

                      {isSpecialist && article.safetyNote && (
                        <div className="mt-3 rounded-xl border border-red-200/50 bg-red-50/25 px-4 py-3">
                          <p className="text-sm leading-7 text-[var(--text-soft)]">{article.safetyNote}</p>
                        </div>
                      )}

                      {isResult && (
                        <div className="mt-3 rounded-xl border border-[rgba(207,107,62,0.3)] bg-[rgba(207,107,62,0.08)] px-4 py-3">
                          <p className="text-sm font-semibold text-[var(--accent-deep)]">{article.cta}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
