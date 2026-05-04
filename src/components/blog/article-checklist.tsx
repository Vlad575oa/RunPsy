"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ArticleChecklistProps = {
  slug: string;
  title: string;
  items: string[];
  step?: number;
};

export function ArticleChecklist({ slug, title, items, step }: ArticleChecklistProps) {
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
    <details className="group scroll-mt-24 rounded-[1.9rem] border border-[#d8eadf] bg-white p-6 shadow-[0_16px_50px_rgba(22,97,79,0.08)]">
      <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
        <ChevronRight className="h-6 w-6 text-[#17614f] transition-transform duration-200 group-open:rotate-90 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {step && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#17614f]/10 text-[10px] font-bold text-[#17614f]">{step}</span>}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#17614f]">Практика</p>
          </div>
          <h2 className="mt-1 font-serif text-xl text-[#10382f] sm:text-2xl">{title}</h2>
        </div>
      </summary>
      
      <div className="mt-6 flex flex-col gap-3">
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
    </details>
  );
}
