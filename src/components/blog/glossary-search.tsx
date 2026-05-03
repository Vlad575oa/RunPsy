"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import type { GlossaryEntry } from "@/lib/glossary";

export function GlossarySearch({ entries, backHref }: { entries: GlossaryEntry[]; backHref: string }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? entries.filter((e) => {
        const q = query.toLowerCase();
        return (
          e.term.toLowerCase().includes(q) ||
          e.short.toLowerCase().includes(q) ||
          e.aliases.some((a) => a.toLowerCase().includes(q))
        );
      })
    : entries;

  return (
    <>
      {/* Поиск */}
      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-soft)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти термин..."
            className="min-h-12 w-full rounded-full border border-[var(--line)] bg-white py-3 pl-11 pr-5 text-base outline-none transition placeholder:text-[var(--text-soft)] focus:border-[var(--accent)]"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-[var(--text)]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {query && (
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          {filtered.length === 0 ? "Ничего не найдено" : `Найдено: ${filtered.length}`}
        </p>
      )}

      {/* Карточки */}
      {!query && (
        <div className="mt-6 rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <a key={entry.slug} href={`#${entry.slug}`}
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text-soft)] transition hover:border-[var(--accent)] hover:text-[var(--text)]">
                <span className="block font-semibold text-[var(--text)]">{entry.term}</span>
                <span className="mt-1 block leading-5">{entry.short}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Термины */}
      <div className="mt-8 space-y-5">
        {filtered.map((entry) => (
          <section key={entry.slug} id={entry.slug} className="scroll-mt-24 rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Термин</p>
            <h2 className="mt-2 font-serif text-3xl text-[var(--text)]">{entry.term}</h2>
            <p className="mt-3 text-base leading-7 text-[var(--accent-deep)]">{entry.short}</p>
            <p className="mt-4 text-[1.03rem] leading-8 text-[var(--text-soft)]">{entry.definition}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {entry.aliases.map((alias) => (
                <span key={alias} className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--text-soft)]">
                  {alias}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <a href={backHref} className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
                Вернуться к статье
              </a>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
