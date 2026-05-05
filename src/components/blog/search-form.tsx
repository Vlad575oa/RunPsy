"use client";

import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { Category } from "@/types/article";

export function SearchForm({ categories, currentCategory, currentQuery }: {
  categories: Category[];
  currentCategory: string;
  currentQuery: string;
}) {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState(currentQuery);
  const [isPending, startTransition] = useTransition();

  function navigate(q: string, category: string, page = 1) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(query, currentCategory);
  }

  function selectCategory(slug: string) {
    setFilterOpen(false);
    navigate(query, slug === currentCategory ? "" : slug);
  }

  function clearCategory() {
    navigate(query, "");
  }

  const activeCategory = categories.find((c) => c.slug === currentCategory);

  return (
    <div>
      {/* Строка поиска */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <label className="sr-only" htmlFor="home-search">Поиск по статьям</label>
        <div className="relative flex-1">
          <input
            id="home-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию..."
            className="min-h-12 w-full rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 text-base outline-none transition placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:bg-white"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); navigate("", currentCategory); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-[var(--text)]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="submit"
          className="grid min-h-12 min-w-12 place-items-center rounded-full bg-[var(--accent)] px-4 text-white transition hover:opacity-90 sm:px-7"
          aria-label="Искать">
          <Search className="h-5 w-5 sm:hidden" />
          <span className="hidden text-sm font-semibold sm:inline">Искать</span>
        </button>
      </form>

      {/* Фильтр по категории */}
      <div className="mt-3 flex items-center gap-2">
        {/* Кнопка Фильтр */}
        <div className="relative">
          <button type="button" onClick={() => setFilterOpen((v) => !v)}
            className={[
              "flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
              currentCategory
                ? "border-[var(--accent)] bg-[rgba(207,107,62,0.08)] text-[var(--accent-deep)]"
                : "border-[var(--line)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)]",
            ].join(" ")}>
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">{activeCategory?.title ?? "Категория"}</span>
            <span className="sm:hidden">{activeCategory ? activeCategory.title.split(" ")[0] : "Фильтр"}</span>
            <ChevronDown className={`h-4 w-4 text-[var(--text-soft)] transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
          </button>

          {filterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-xl">
                <button onClick={() => selectCategory("")}
                  className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition hover:bg-[var(--bg)] ${!currentCategory ? "font-semibold text-[var(--accent-deep)]" : "text-[var(--text-soft)]"}`}>
                  Все категории
                </button>
                <div className="h-px bg-[var(--line)]" />
                {categories.map((category) => (
                  <button key={category.slug} onClick={() => selectCategory(category.slug)}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition hover:bg-[var(--bg)] ${currentCategory === category.slug ? "font-semibold text-[var(--accent-deep)]" : "text-[var(--text)]"}`}>
                    {currentCategory === category.slug && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />}
                    <span className="truncate">{category.title}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Активный фильтр — крестик */}
        {activeCategory && (
          <button type="button" onClick={clearCategory}
            className="flex items-center gap-1.5 rounded-full border border-[rgba(207,107,62,0.3)] bg-[rgba(207,107,62,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-deep)] transition hover:opacity-70">
            {activeCategory.title}
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {isPending && <span className="text-xs text-[var(--text-soft)]">…</span>}
      </div>
    </div>
  );
}
