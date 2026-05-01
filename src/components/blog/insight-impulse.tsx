"use client";

import { useState } from "react";
import { Brain, Check, Copy, Layers3, MessageSquareText, Sparkles, Target } from "lucide-react";
import type { ArticleInsightImpulse } from "@/types/article";

type InsightImpulseProps = {
  title: string;
  impulse: ArticleInsightImpulse;
};

export function InsightImpulse({ title, impulse }: InsightImpulseProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function copyPhrase(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1600);
    } catch {
      setCopiedIndex(null);
    }
  }

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

      <div className="grid gap-4 p-4 md:grid-cols-[1.05fr_0.95fr] md:p-6">
        <div className="rounded-2xl border border-[#b7ded0] bg-[#eafff6]/80 p-5 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm font-bold text-[#17614f]">
            <Target className="h-4 w-4" aria-hidden="true" />
            Практика · Mint Glass
          </div>
          <p className="mt-3 text-base leading-7 text-[var(--text)]">{impulse.microAction}</p>
        </div>

        <div className="rounded-2xl border border-[#c8eee4]/70 bg-[#0f3b35] p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#bff4df]">
            <Brain className="h-4 w-4" aria-hidden="true" />
            Суть · Deep Teal
          </div>
          <div className="mt-4 space-y-4">
            {impulse.essence.map((item) => (
              <article key={item.title} className="rounded-xl border border-white/10 bg-white/[0.08] p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/78">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white/72 p-5 shadow-sm backdrop-blur-md md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-deep)]">
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
            Конструктор фраз
          </div>
          <div className="mt-4 grid gap-3">
            {impulse.dialogue.map((row, index) => (
              <article key={row.try} className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4 lg:grid-cols-[1fr_1fr_auto]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent)]">Вместо</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{row.instead}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#17614f]">Попробуйте</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text)]">{row.try}</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--text-soft)]">{row.why}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyPhrase(row.try, index)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--accent-deep)] transition hover:border-[#b7ded0] hover:bg-[#eafff6]"
                >
                  {copiedIndex === index ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {copiedIndex === index ? "Скопировано" : "Копировать"}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white/72 p-5 shadow-sm backdrop-blur-md md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-deep)]">
            <Layers3 className="h-4 w-4" aria-hidden="true" />
            Сценарий 50/50
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SidePanel title={impulse.twoSides.firstTitle} items={impulse.twoSides.firstItems} />
            <SidePanel title={impulse.twoSides.secondTitle} items={impulse.twoSides.secondItems} />
          </div>
          <p className="mt-4 rounded-xl bg-[var(--bg)] p-3 text-sm leading-6 text-[var(--text-soft)]">{impulse.twoSides.bridge}</p>
        </div>

        <div className="rounded-2xl border border-[#b7ded0] bg-[radial-gradient(circle_at_8%_50%,rgba(186,247,218,0.56),transparent_28%),linear-gradient(135deg,rgba(15,59,53,0.96),rgba(32,120,102,0.84))] p-5 text-white shadow-sm md:col-span-2">
          <div className="grid gap-3 md:grid-cols-[180px_1fr] md:items-center">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#bff4df]">Визуальный якорь</p>
            <div>
              <h3 className="font-serif text-2xl">{impulse.visualMetaphor.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/80">{impulse.visualMetaphor.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SidePanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
      <h3 className="font-semibold text-[var(--text)]">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-soft)]">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </article>
  );
}
