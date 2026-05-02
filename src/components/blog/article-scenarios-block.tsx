"use client";

import { useState } from "react";

type ArticleScenariosBlockProps = {
  title: string;
  action: string;
  outcomes: string[];
};

export function ArticleScenariosBlock({ title, action, outcomes }: ArticleScenariosBlockProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="scroll-mt-24 rounded-[2rem] border border-[#eadfcf] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf4ea_100%)] p-6 shadow-[0_18px_52px_rgba(111,45,26,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Развилка</p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--accent-deep)]">{title}</h2>
        </div>
        <p className="text-xs text-[var(--text-soft)]">Нажмите на карточку, чтобы перевернуть</p>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="mt-6 block w-full rounded-[1.8rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Лицевая сторона</p>
              <h3 className="mt-4 font-serif text-3xl leading-tight text-[var(--text)]">Что вы делаете дальше</h3>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">{action}</p>
              <div className="mt-8 inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-soft)]">Нажмите, чтобы увидеть два исхода</div>
            </div>

            <div
              className="absolute inset-0 rounded-[1.8rem] border border-[#d8e7e0] bg-[#f5fbf8] px-6 py-6 shadow-[0_18px_44px_rgba(23,97,79,0.10)]"
              style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#17614f]">Обратная сторона</p>
              <h3 className="mt-4 font-serif text-3xl leading-tight text-[#10382f]">Два вероятных исхода</h3>
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
    </section>
  );
}
