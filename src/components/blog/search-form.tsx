"use client";

import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/types/article";

export function SearchForm({ categories }: { categories: Category[] }) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div>
      {/* Строка поиска */}
      <form action="/articles" className="flex gap-2">
        <label className="sr-only" htmlFor="home-search">Поиск по статьям</label>
        <input
          id="home-search"
          name="q"
          type="search"
          placeholder="Найти статью: расставание, тревога..."
          className="min-h-12 flex-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 text-base outline-none transition placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:bg-white"
        />
        {/* Мобиль: лупа. Десктоп: Искать */}
        <button
          type="submit"
          className="grid min-h-12 min-w-12 place-items-center rounded-full bg-[var(--accent)] px-4 text-white transition hover:opacity-90 sm:px-7"
          aria-label="Искать"
        >
          <Search className="h-5 w-5 sm:hidden" />
          <span className="hidden text-sm font-semibold sm:inline">Искать</span>
        </button>
      </form>

      {/* Мобиль: кнопка Фильтр. Десктоп: все категории */}
      <div className="mt-4">
        {/* Десктоп — горизонтальный список категорий */}
        <div className="hidden sm:flex sm:flex-wrap sm:gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-white"
            >
              {category.title}
            </Link>
          ))}
        </div>

        {/* Мобиль — кнопка Фильтр + выпадающий список */}
        <div className="relative sm:hidden">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" />
            Категории
            <ChevronDown className={`h-4 w-4 text-[var(--text-soft)] transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
          </button>

          {filterOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-lg">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  onClick={() => setFilterOpen(false)}
                  className="block px-4 py-3 text-sm text-[var(--text)] transition hover:bg-[var(--bg)] hover:text-[var(--accent-deep)]"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
