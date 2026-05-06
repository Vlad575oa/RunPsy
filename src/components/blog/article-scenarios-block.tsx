"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

type ArticleScenariosBlockProps = {
  title: string;
  action: string;
  outcomes: string[];
  step?: number;
};

export function ArticleScenariosBlock({ title, action, outcomes, step }: ArticleScenariosBlockProps) {
  const [flipped, setFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Действие", content: action, isAction: true },
    ...outcomes.map((o, i) => ({ label: `Исход ${i + 1}`, content: o, isAction: false })),
  ];

  const active = tabs[activeTab];

  return (
    <section className="scroll-mt-24 rounded-[2rem] border border-[#eadfcf] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf4ea_100%)] p-5 shadow-[0_18px_52px_rgba(111,45,26,0.08)]">
      <div className="flex items-center gap-3">
        <ChevronRight className="h-6 w-6 shrink-0 text-[var(--accent)]" />
        <div>
          <div className="flex items-center gap-2">
            {step && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[10px] font-bold text-[var(--accent)]">{step}</span>}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Развилка</p>
          </div>
          <h2 className="mt-1 font-serif text-xl text-[var(--accent-deep)] sm:text-2xl">{title}</h2>
        </div>
      </div>

      {/* Mobile: tabs */}
      <div className="mt-6 sm:hidden">
        <div className="flex rounded-2xl bg-[#f5ece0] p-1 gap-1">
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === i
                  ? "bg-white text-[var(--accent-deep)] shadow-sm"
                  : "text-[var(--text-soft)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className={`mt-3 rounded-[1.4rem] border p-4 ${
            active.isAction
              ? "border-[#f0e0ca] bg-white"
              : "border-[#cfe0d8] bg-[#f5fbf8]"
          }`}
        >
          {active.isAction && (
            <p className="mb-2 font-serif text-base font-medium text-[var(--text)]">Что вы делаете дальше</p>
          )}
          <p className="text-sm leading-6 text-[var(--text-soft)]">{active.content}</p>
        </div>
      </div>

      {/* Desktop: flip card */}
      <div className="hidden sm:block">
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="mt-4 block w-full rounded-[1.8rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <div className="relative min-h-[280px] [perspective:1400px]">
            <div
              className="relative h-full min-h-[280px] w-full transition-transform duration-500 [transform-style:preserve-3d]"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              <div
                className="absolute inset-0 rounded-[1.8rem] border border-[#f0e0ca] bg-white px-6 py-6 shadow-[0_18px_44px_rgba(111,45,26,0.08)]"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center rounded-full bg-[var(--accent)]/10 p-1.5 text-[var(--accent)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                      <path d="M3 3v5h5"/>
                    </svg>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Лицевая сторона · нажмите, чтобы перевернуть</p>
                </div>
                <h3 className="mt-4 font-serif text-3xl leading-tight text-[var(--text)]">Что вы делаете дальше</h3>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">{action}</p>
              </div>

              <div
                className="absolute inset-0 rounded-[1.8rem] border border-[#d8e7e0] bg-[#f5fbf8] px-6 py-6 shadow-[0_18px_44px_rgba(23,97,79,0.10)]"
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#17614f]">Обратная сторона</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {outcomes.map((outcome, index) => (
                    <div key={index} className="rounded-[1.4rem] border border-[#cfe0d8] bg-white/88 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f8b79]">Сценарий {index + 1}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
