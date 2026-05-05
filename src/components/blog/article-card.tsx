import Link from "next/link";
import type { Article } from "@/types/article";
import { isUpdatedArticle } from "@/lib/updated-articles";

type CategoryTheme = {
  icon: string;
  label: string;
  border: string;
  bg: string;
  accent: string;
  badge: string;
};

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  "relationships": {
    icon: "❤️",
    label: "Отношения",
    border: "border-rose-200/70",
    bg: "bg-rose-50/40",
    accent: "text-rose-600",
    badge: "bg-rose-50 border-rose-200/60 text-rose-500",
  },
  "attachment-and-intimacy": {
    icon: "🤝",
    label: "Привязанность",
    border: "border-purple-200/70",
    bg: "bg-purple-50/40",
    accent: "text-purple-600",
    badge: "bg-purple-50 border-purple-200/60 text-purple-500",
  },
  "couple-boundaries": {
    icon: "🔑",
    label: "Границы в паре",
    border: "border-indigo-200/70",
    bg: "bg-indigo-50/40",
    accent: "text-indigo-600",
    badge: "bg-indigo-50 border-indigo-200/60 text-indigo-500",
  },
  "anxiety-and-stress": {
    icon: "🌿",
    label: "Тревога и стресс",
    border: "border-teal-200/70",
    bg: "bg-teal-50/40",
    accent: "text-teal-600",
    badge: "bg-teal-50 border-teal-200/60 text-teal-500",
  },
  "burnout-and-energy": {
    icon: "🔋",
    label: "Выгорание",
    border: "border-orange-200/70",
    bg: "bg-orange-50/40",
    accent: "text-orange-600",
    badge: "bg-orange-50 border-orange-200/60 text-orange-500",
  },
  "breakup-recovery": {
    icon: "🌱",
    label: "После расставания",
    border: "border-green-200/70",
    bg: "bg-green-50/40",
    accent: "text-green-600",
    badge: "bg-green-50 border-green-200/60 text-green-500",
  },
  "crises-and-breakups": {
    icon: "💔",
    label: "Кризисы",
    border: "border-red-200/70",
    bg: "bg-red-50/40",
    accent: "text-red-500",
    badge: "bg-red-50 border-red-200/60 text-red-400",
  },
  "boundaries-and-communication": {
    icon: "💬",
    label: "Коммуникация",
    border: "border-sky-200/70",
    bg: "bg-sky-50/40",
    accent: "text-sky-600",
    badge: "bg-sky-50 border-sky-200/60 text-sky-500",
  },
  "family-and-parenting": {
    icon: "🏡",
    label: "Семья",
    border: "border-amber-200/70",
    bg: "bg-amber-50/40",
    accent: "text-amber-600",
    badge: "bg-amber-50 border-amber-200/60 text-amber-500",
  },
  "emotional-maturity": {
    icon: "🧘",
    label: "Зрелость",
    border: "border-violet-200/70",
    bg: "bg-violet-50/40",
    accent: "text-violet-600",
    badge: "bg-violet-50 border-violet-200/60 text-violet-500",
  },
  "male-female-psychology": {
    icon: "⚡",
    label: "Психология пола",
    border: "border-yellow-200/70",
    bg: "bg-yellow-50/40",
    accent: "text-yellow-600",
    badge: "bg-yellow-50 border-yellow-200/60 text-yellow-500",
  },
  "self-worth-and-growth": {
    icon: "🌟",
    label: "Самооценка",
    border: "border-pink-200/70",
    bg: "bg-pink-50/40",
    accent: "text-pink-600",
    badge: "bg-pink-50 border-pink-200/60 text-pink-500",
  },
  "habits-and-motivation": {
    icon: "🎯",
    label: "Мотивация",
    border: "border-lime-200/70",
    bg: "bg-lime-50/40",
    accent: "text-lime-600",
    badge: "bg-lime-50 border-lime-200/60 text-lime-500",
  },
  "learning-and-focus": {
    icon: "📖",
    label: "Фокус",
    border: "border-cyan-200/70",
    bg: "bg-cyan-50/40",
    accent: "text-cyan-600",
    badge: "bg-cyan-50 border-cyan-200/60 text-cyan-500",
  },
  "neuro-detox": {
    icon: "🧠",
    label: "Нейро-детокс",
    border: "border-blue-200/70",
    bg: "bg-blue-50/40",
    accent: "text-blue-600",
    badge: "bg-blue-50 border-blue-200/60 text-blue-500",
  },
  "social-ident": {
    icon: "🎭",
    label: "Социальное Я",
    border: "border-indigo-200/70",
    bg: "bg-indigo-50/40",
    accent: "text-indigo-600",
    badge: "bg-indigo-50 border-indigo-200/60 text-indigo-500",
  },
  "psychosomatics": {
    icon: "🌡️",
    label: "Психосоматика",
    border: "border-red-200/70",
    bg: "bg-red-50/40",
    accent: "text-red-600",
    badge: "bg-red-50 border-red-200/60 text-red-500",
  },
  "sex-as-protection": {
    icon: "🛡️",
    label: "Сексуальность",
    border: "border-fuchsia-200/70",
    bg: "bg-fuchsia-50/40",
    accent: "text-fuchsia-600",
    badge: "bg-fuchsia-50 border-fuchsia-200/60 text-fuchsia-500",
  },
};

const DEFAULT_THEME: CategoryTheme = {
  icon: "📌",
  label: "Статья",
  border: "border-[var(--line)]",
  bg: "bg-white",
  accent: "text-[var(--accent)]",
  badge: "bg-[rgba(207,107,62,0.07)] border-[rgba(207,107,62,0.2)] text-[var(--accent)]",
};

export function ArticleCard({ article, highlighted = false }: { article: Article; highlighted?: boolean }) {
  const shouldHighlight = highlighted || isUpdatedArticle(article.slug);
  const theme = shouldHighlight
    ? { ...DEFAULT_THEME, border: "border-emerald-300/70", bg: "bg-emerald-50/40", accent: "text-emerald-700", badge: "bg-emerald-50 border-emerald-200 text-emerald-600", icon: "✅", label: "Обновлено" }
    : (CATEGORY_THEMES[article.category] ?? DEFAULT_THEME);
  const preview = (article.introduction ?? article.description).slice(0, 90);

  return (
    <Link href={`/articles/${article.slug}`} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      <article className={`group flex h-full flex-col rounded-2xl border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${theme.border} ${theme.bg}`}>

        {/* Иконка + категория */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{theme.icon}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${theme.badge}`}>
            {theme.label}
          </span>
        </div>

        {/* Заголовок */}
        <h3 className={`mt-3 font-[var(--font-lora)] text-sm font-semibold leading-snug sm:text-base ${theme.accent}`}>
          {article.title}
        </h3>

        {/* Превью */}
        <p className="mt-2 text-xs leading-5 text-[var(--text-soft)] sm:text-sm sm:leading-6">
          {preview}{preview.length >= 90 ? "…" : ""}
        </p>

      </article>
    </Link>
  );
}
