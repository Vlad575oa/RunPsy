"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { PsychologyDialogue } from "@/lib/tests-content";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Отношения":       { bg: "bg-[#f3ecff]", text: "text-[#6b3fa0]", border: "border-[#d6b8f5]" },
  "Тревога":         { bg: "bg-[#e8f3ff]", text: "text-[#2563b0]", border: "border-[#b3d4f7]" },
  "Выгорание":       { bg: "bg-[#eafff4]", text: "text-[#1a6b45]", border: "border-[#a8e8c8]" },
  "Самооценка":      { bg: "bg-[#fff4e8]", text: "text-[#a05a1a]", border: "border-[#f5ceaa]" },
  "Границы":         { bg: "bg-[#fff0f0]", text: "text-[#9b2d2d]", border: "border-[#f5b8b8]" },
  "Работа":          { bg: "bg-[#f0fff4]", text: "text-[#1a5c3a]", border: "border-[#9adbb8]" },
  "Семья":           { bg: "bg-[#fff8e8]", text: "text-[#8a5a00]", border: "border-[#f5d88a]" },
  "Коммуникация":    { bg: "bg-[#f0f4ff]", text: "text-[#2a4098]", border: "border-[#b0c0f5]" },
  "Саморегуляция":   { bg: "bg-[#f5f0ff]", text: "text-[#5a2898]", border: "border-[#c8a8f5]" },
  "Привязанность":   { bg: "bg-[#fff0f8]", text: "text-[#9b2060]", border: "border-[#f5b0d8]" },
  "Цифровая гигиена":{ bg: "bg-[#f0f8ff]", text: "text-[#1a5a80]", border: "border-[#90c8f0]" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "bg-[var(--bg-soft)]", text: "text-[var(--text-soft)]", border: "border-[var(--line)]" };
}

export function DialoguesCatalog({ dialogues }: { dialogues: PsychologyDialogue[] }) {
  const categories = ["Все", ...Array.from(new Set(dialogues.map((d) => d.category))).sort()];
  const [active, setActive] = useState("Все");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = active === "Все" ? dialogues : dialogues.filter((d) => d.category === active);

  async function copyResponse(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      setTimeout(() => setCopiedId((current) => (current === key ? null : current)), 1800);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <>
      {/* Фильтр */}
      <div className="sticky top-[57px] z-10 -mx-6 bg-white/90 px-6 py-3 backdrop-blur-md border-b border-[var(--line)]">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const style = cat === "Все" ? null : getCategoryStyle(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  active === cat
                    ? cat === "Все"
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : `${style?.bg} ${style?.text} ${style?.border}`
                    : "border-[var(--line)] bg-white text-[var(--text-soft)] hover:bg-[var(--bg-soft)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[var(--text-soft)]">
          {filtered.length} {filtered.length === 1 ? "диалог" : filtered.length < 5 ? "диалога" : "диалогов"}
        </p>
      </div>

      {/* Список диалогов */}
      <div className="mt-6 space-y-4">
        {filtered.map((dialogue) => {
          const style = getCategoryStyle(dialogue.category);
          const isOpen = expanded === dialogue.id;

          return (
            <article
              key={dialogue.id}
              className="rounded-3xl border border-[#d6deef] bg-[linear-gradient(180deg,#fbfcff_0%,#f4f7ff_100%)] shadow-[0_4px_20px_rgba(52,76,136,0.06)] overflow-hidden"
            >
              {/* Шапка — кликабельна */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : dialogue.id)}
                className="w-full px-6 py-5 text-left flex items-start gap-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5d6fa6]/10 text-sm font-bold text-[#5d6fa6] mt-0.5">
                  {dialogue.step}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${style.bg} ${style.text} ${style.border}`}>
                    {dialogue.category}
                  </span>
                  <h2 className="mt-1.5 font-serif text-xl text-[#22263a]">{dialogue.title}</h2>
                  <p className="mt-1 text-sm text-[var(--text-soft)] line-clamp-2">{dialogue.description}</p>
                </div>
                <span className={`mt-1 shrink-0 text-[#5d6fa6] text-lg transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  ↓
                </span>
              </button>

              {/* Контент */}
              {isOpen && (
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {dialogue.items.map((item, index) => (
                      <div key={index} className="rounded-2xl border border-[#d6deef] bg-white/80 p-4">
                        {item.trigger ? (
                          <p className="text-sm text-[#6d7fae]">
                            <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.12em]">Триггер:</span>
                            {item.trigger}
                          </p>
                        ) : null}
                        <div className="mt-2 flex items-start justify-between gap-3">
                          <p className="text-sm leading-6 text-[#22263a]">
                            <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2a7a5f]">Ответ:</span>
                            {item.response}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyResponse(item.response, `${dialogue.id}-${index}`)}
                            className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d6deef] bg-white text-[#5d6fa6] transition hover:bg-[#f4f7ff]"
                            aria-label="Копировать ответ"
                            title={copiedId === `${dialogue.id}-${index}` ? "Скопировано" : "Копировать ответ"}
                          >
                            {copiedId === `${dialogue.id}-${index}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        {item.note ? (
                          <p className="mt-2 text-xs leading-5 text-[var(--text-soft)] italic">{item.note}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
