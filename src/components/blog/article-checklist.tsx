"use client";

import { useEffect, useMemo, useState } from "react";

type ArticleChecklistProps = {
  slug: string;
  title: string;
  items: string[];
};

export function ArticleChecklist({ slug, title, items }: ArticleChecklistProps) {
  const storageKey = useMemo(() => `runpsy:checklist:${slug}:${title}`, [slug, title]);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = window.localStorage.getItem(`runpsy:checklist:${slug}:${title}`);
      return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // ignore local storage errors
    }
  }, [checked, storageKey]);

  const completed = items.filter((item) => checked[item]).length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <section className="scroll-mt-24 rounded-[1.9rem] border border-[#d8eadf] bg-white p-6 shadow-[0_16px_50px_rgba(22,97,79,0.08)]">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#17614f]">Практика</p>
          <h2 className="mt-2 font-serif text-xl text-[#10382f] sm:text-2xl">{title}</h2>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-soft)]">
            <span>Прогресс</span>
            <span>{completed}/{items.length}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6f2ed]">
            <div className="h-full rounded-full bg-[#17614f] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => {
          const isChecked = Boolean(checked[item]);
          return (
            <label
              key={item}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                isChecked ? "border-[#a7d4c3] bg-[#edf8f3]" : "border-[var(--line)] bg-[var(--bg)] hover:border-[#bfded2]"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setChecked((current) => ({ ...current, [item]: !current[item] }))}
                className="mt-1 h-4 w-4 rounded border-[#7cae9c] text-[#17614f] focus:ring-[#17614f]"
              />
              <span className={`text-sm leading-6 ${isChecked ? "text-[#10382f]" : "text-[var(--text-soft)]"}`}>{item}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
