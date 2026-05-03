import Link from "next/link";
import type { Article } from "@/types/article";
import { isUpdatedArticle } from "@/lib/updated-articles";

const CATEGORY_ICONS: Record<string, string> = {
  "relationships": "💑",
  "attachment-and-intimacy": "🫂",
  "couple-boundaries": "🔐",
  "anxiety-and-stress": "🌀",
  "burnout-and-energy": "⚡",
  "breakup-recovery": "🌱",
  "crises-and-breakups": "💔",
  "boundaries-and-communication": "🗣️",
  "family-and-parenting": "🏠",
  "emotional-maturity": "🪞",
  "male-female-psychology": "☯️",
  "self-worth-and-growth": "✨",
  "habits-and-motivation": "🎯",
  "learning-and-focus": "📚",
};

const INTENT_COLORS: Record<string, string> = {
  "кризисный": "text-rose-500 bg-rose-50/60 border-rose-200/50",
  "эмоциональный": "text-violet-500 bg-violet-50/60 border-violet-200/50",
  "информационный": "text-[var(--accent)] bg-[rgba(207,107,62,0.07)] border-[rgba(207,107,62,0.2)]",
};

export function ArticleCard({ article, highlighted = false }: { article: Article; highlighted?: boolean }) {
  const shouldHighlight = highlighted || isUpdatedArticle(article.slug);
  const icon = CATEGORY_ICONS[article.category] ?? "📌";
  const intentClass = INTENT_COLORS[article.intent] ?? INTENT_COLORS["информационный"];
  const preview = (article.introduction ?? article.description).slice(0, 90);

  return (
    <Link href={`/articles/${article.slug}`} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      <article
        className={[
          "group flex h-full flex-col rounded-2xl border p-4 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5",
          shouldHighlight
            ? "border-emerald-400/60 bg-emerald-50/30 hover:border-emerald-500/70"
            : "border-[rgba(255,255,255,0.55)] bg-white/45 hover:border-[rgba(207,107,62,0.35)] hover:bg-white/60",
        ].join(" ")}
      >
        {/* Иконка + интент */}
        <div className="flex items-center justify-between">
          <span className="text-xl">{icon}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${intentClass}`}>
            {article.intent}
          </span>
        </div>

        {/* Заголовок */}
        <h3 className={`mt-3 font-[var(--font-lora)] text-sm font-semibold leading-snug sm:text-base ${shouldHighlight ? "text-emerald-800" : "text-[var(--text)]"}`}>
          {article.title}
        </h3>

        {/* Превью */}
        <p className="mt-2 text-xs leading-5 text-[var(--text-soft)] sm:text-sm sm:leading-6">
          {preview}{preview.length >= 90 ? "…" : ""}
        </p>

        {/* Теги */}
        {article.tags.length > 0 && (
          <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-[rgba(255,255,255,0.55)] bg-white/50 px-2 py-0.5 text-[10px] text-[var(--text-soft)]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Футер */}
        <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-[var(--text-soft)]">
          <span>{article.readingTime}</span>
          <span className="hidden sm:inline opacity-60">{article.date}</span>
        </div>
      </article>
    </Link>
  );
}
