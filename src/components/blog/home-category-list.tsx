"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";
import type { Article, Category } from "@/types/article";

type HomeCategoryListProps = {
  articles: Article[];
  categories: Category[];
};

export function HomeCategoryList({ articles, categories }: HomeCategoryListProps) {
  // По умолчанию можно свернуть все или развернуть первую.
  // Развернём все, чтобы было видно контент, или свернём? Пользователь просил "сверни блоки" — значит по умолчанию свёрнуты.
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  function toggleCategory(slug: string) {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const activeCategories = categories.filter(category => 
    articles.some(article => article.category === category.slug)
  );

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-white p-10 text-center text-sm text-[var(--text-soft)]">
        По вашему запросу ничего не найдено. Попробуйте изменить поиск или категорию.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {activeCategories.map(category => {
        const categoryArticles = articles.filter(a => a.category === category.slug);
        const isOpen = openCategories.has(category.slug);

        return (
          <div key={category.slug} className="rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCategory(category.slug)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-gray-50/50"
            >
              {isOpen ? <ChevronDown className="h-5 w-5 text-[var(--text-soft)]" /> : <ChevronRight className="h-5 w-5 text-[var(--text-soft)]" />}
              <Folder className="h-5 w-5 text-[var(--accent)]" />
              <span className="min-w-0 flex-1 truncate font-semibold text-[var(--text)]">{category.title}</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-[var(--text-soft)]">{categoryArticles.length}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--line)] p-5">
                    <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
                      {categoryArticles.map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
