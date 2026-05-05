import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/article";

const CATEGORY_ACCENT: Record<string, { text: string; badge: string }> = {
  "relationships":                { text: "text-rose-600",    badge: "bg-rose-50 border-rose-200/60 text-rose-500" },
  "attachment-and-intimacy":      { text: "text-purple-600",  badge: "bg-purple-50 border-purple-200/60 text-purple-500" },
  "couple-boundaries":            { text: "text-indigo-600",  badge: "bg-indigo-50 border-indigo-200/60 text-indigo-500" },
  "anxiety-and-stress":           { text: "text-teal-600",    badge: "bg-teal-50 border-teal-200/60 text-teal-500" },
  "burnout-and-energy":           { text: "text-orange-600",  badge: "bg-orange-50 border-orange-200/60 text-orange-500" },
  "breakup-recovery":             { text: "text-green-600",   badge: "bg-green-50 border-green-200/60 text-green-500" },
  "crises-and-breakups":          { text: "text-red-500",     badge: "bg-red-50 border-red-200/60 text-red-400" },
  "boundaries-and-communication": { text: "text-sky-600",     badge: "bg-sky-50 border-sky-200/60 text-sky-500" },
  "family-and-parenting":         { text: "text-amber-600",   badge: "bg-amber-50 border-amber-200/60 text-amber-500" },
  "emotional-maturity":           { text: "text-violet-600",  badge: "bg-violet-50 border-violet-200/60 text-violet-500" },
  "self-worth-and-growth":        { text: "text-pink-600",    badge: "bg-pink-50 border-pink-200/60 text-pink-500" },
  "male-female-psychology":       { text: "text-yellow-600",  badge: "bg-yellow-50 border-yellow-200/60 text-yellow-500" },
  "habits-and-motivation":        { text: "text-lime-600",    badge: "bg-lime-50 border-lime-200/60 text-lime-500" },
  "learning-and-focus":           { text: "text-cyan-600",    badge: "bg-cyan-50 border-cyan-200/60 text-cyan-500" },
  "neuro-detox":                  { text: "text-blue-600",    badge: "bg-blue-50 border-blue-200/60 text-blue-500" },
  "social-ident":                 { text: "text-indigo-600",  badge: "bg-indigo-50 border-indigo-200/60 text-indigo-500" },
  "psychosomatics":               { text: "text-red-600",     badge: "bg-red-50 border-red-200/60 text-red-500" },
  "sex-as-protection":            { text: "text-fuchsia-600", badge: "bg-fuchsia-50 border-fuchsia-200/60 text-fuchsia-500" },
};

const DEFAULT_ACCENT = {
  text: "text-[var(--accent)]",
  badge: "bg-[rgba(207,107,62,0.07)] border-[rgba(207,107,62,0.2)] text-[var(--accent)]",
};

export function RelatedArticles({ articles, categoryTitle }: { articles: Article[]; categoryTitle?: string }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-10 border-t border-[var(--line)] pt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
        Читайте дальше{categoryTitle ? ` · ${categoryTitle}` : ""}
      </p>
      <h2 className="mt-1 font-serif text-2xl text-[var(--text)]">Похожие статьи</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const accent = CATEGORY_ACCENT[article.category] ?? DEFAULT_ACCENT;
          const preview = (article.introduction ?? article.description).slice(0, 80);
          return (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={article.heroImage ?? "/images/articles/placeholder.webp"}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className={`self-start rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${accent.badge}`}>
                  {article.readingTime}
                </span>
                <h3 className={`mt-2 font-[var(--font-lora)] text-sm font-semibold leading-snug sm:text-base ${accent.text}`}>
                  {article.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-[var(--text-soft)]">
                  {preview}{preview.length >= 80 ? "…" : ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
