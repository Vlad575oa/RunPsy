"use client";

import { Sparkles } from "lucide-react";
import type { ArticleInsightImpulse } from "@/types/article";

type InsightImpulseProps = {
  title: string;
  impulse: ArticleInsightImpulse;
};

export function InsightImpulse({ title, impulse }: InsightImpulseProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="border-b border-[var(--line)] bg-[linear-gradient(135deg,rgba(207,107,62,0.12),rgba(180,236,214,0.32),rgba(255,255,255,0.7))] p-6 md:p-7">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent-deep)]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Инсайт-Импульс
        </p>
        <h2 className="mt-2 font-serif text-2xl md:text-3xl">{title}: опыт за 5 минут</h2>
        <p className="mt-3 max-w-[78ch] text-sm leading-6 text-[var(--text-soft)]">{impulse.painPoint}</p>
      </div>
    </section>
  );
}
