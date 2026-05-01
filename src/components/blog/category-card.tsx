import Link from "next/link";
import type { Category } from "@/types/article";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <h3 className="font-serif text-2xl">{category.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{category.shortDescription}</p>
      <ul className="mt-4 space-y-1 text-sm text-[var(--text-soft)]">
        {category.seedIdeas.slice(0, 3).map((idea) => (
          <li key={idea}>• {idea}</li>
        ))}
      </ul>
      <Link href={`/categories/${category.slug}`} className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        Смотреть категорию
      </Link>
    </article>
  );
}
