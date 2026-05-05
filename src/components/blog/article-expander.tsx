"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ArticleContent } from "@/components/blog/article-content";
import type { Article } from "@/types/article";

const CATEGORY_THEMES: Record<string, { icon: string; label: string; badge: string }> = {
  "relationships":           { icon: "❤️",  label: "Отношения",        badge: "bg-rose-50 border-rose-200/60 text-rose-500" },
  "attachment-and-intimacy": { icon: "🤝",  label: "Привязанность",    badge: "bg-purple-50 border-purple-200/60 text-purple-500" },
  "couple-boundaries":       { icon: "🔑",  label: "Границы в паре",   badge: "bg-indigo-50 border-indigo-200/60 text-indigo-500" },
  "anxiety-and-stress":      { icon: "🌿",  label: "Тревога и стресс", badge: "bg-teal-50 border-teal-200/60 text-teal-500" },
  "burnout-and-energy":      { icon: "🔋",  label: "Выгорание",        badge: "bg-orange-50 border-orange-200/60 text-orange-500" },
  "breakup-recovery":        { icon: "🌱",  label: "После расставания",badge: "bg-green-50 border-green-200/60 text-green-500" },
  "crises-and-breakups":     { icon: "💔",  label: "Кризисы",          badge: "bg-red-50 border-red-200/60 text-red-400" },
  "boundaries-and-communication": { icon: "💬", label: "Коммуникация", badge: "bg-sky-50 border-sky-200/60 text-sky-500" },
  "family-and-parenting":    { icon: "🏡",  label: "Семья",            badge: "bg-amber-50 border-amber-200/60 text-amber-500" },
  "emotional-maturity":      { icon: "🧘",  label: "Зрелость",         badge: "bg-violet-50 border-violet-200/60 text-violet-500" },
  "self-worth-and-growth":   { icon: "🌟",  label: "Самооценка",       badge: "bg-pink-50 border-pink-200/60 text-pink-500" },
};

const DEFAULT_THEME = { icon: "📌", label: "Статья", badge: "bg-[rgba(207,107,62,0.07)] border-[rgba(207,107,62,0.2)] text-[var(--accent)]" };

export function ArticleExpander({ article }: { article: Article }) {
  const [open, setOpen] = useState(true);
  const theme = CATEGORY_THEMES[article.category] ?? DEFAULT_THEME;
  const preview = (article.introduction ?? article.description).slice(0, 100);

  return (
    <div className={[
      "overflow-hidden rounded-2xl border transition-all duration-200",
      open
        ? "border-[rgba(255,255,255,0.6)] bg-white/55 shadow-md backdrop-blur-xl"
        : "border-[rgba(255,255,255,0.45)] bg-white/40 backdrop-blur-xl hover:bg-white/50",
    ].join(" ")}>
      {/* Шапка — всегда видна */}
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left">
        <span className="mt-0.5 text-xl">{theme.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${theme.badge}`}>
              {theme.label}
            </span>
          </div>
          <p className="mt-1.5 font-[var(--font-lora)] text-base font-semibold leading-snug text-[var(--text)] sm:text-lg">
            {article.title}
          </p>
          {!open && (
            <p className="mt-1 text-xs leading-5 text-[var(--text-soft)] sm:text-sm sm:leading-6">
              {preview}{preview.length >= 100 ? "…" : ""}
            </p>
          )}
        </div>
        <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-[var(--text-soft)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Полная статья */}
      {open && (
        <div className="border-t border-[rgba(255,255,255,0.4)] px-5 pb-8 pt-5">
          <ArticleContent article={article} showTitle={false} />
        </div>
      )}
    </div>
  );
}
