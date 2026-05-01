"use client";

import { useMemo, useState } from "react";

type ArticlePracticeToolsProps = {
  slug: string;
  sectionTitle: string;
};

export function ArticlePracticeTools({ slug, sectionTitle }: ArticlePracticeToolsProps) {
  const normalizedTitle = sectionTitle.toLowerCase();
  const isActionSection = normalizedTitle.includes("что можно сделать сейчас");

  if (!isActionSection) {
    return null;
  }

  return <ImmediateActionPlanner slug={slug} />;
}

function ImmediateActionPlanner({ slug }: { slug: string }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const steps = useMemo(
    () => [
      { id: `${slug}-s1`, label: "Назвать один факт без интерпретации" },
      { id: `${slug}-s2`, label: "Назвать одно чувство короткой фразой" },
      { id: `${slug}-s3`, label: "Сформулировать одну конкретную просьбу" },
      { id: `${slug}-s4`, label: "Назначить время короткого разговора (15-20 минут)" },
    ],
    [slug],
  );

  const doneCount = steps.filter((step) => checked[step.id]).length;
  const progress = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="mt-5 rounded-xl border border-[var(--line)] bg-white p-4">
      <p className="text-sm font-semibold text-[var(--text)]">План на сейчас</p>
      <p className="mt-1 text-xs text-[var(--text-soft)]">Отметьте шаги, которые уже готовы сделать.</p>
      <div className="mt-3 space-y-2">
        {steps.map((step) => (
          <label key={step.id} className="flex items-start gap-3 rounded-lg bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-soft)]">
            <input
              type="checkbox"
              className="mt-0.5 accent-[var(--accent)]"
              checked={Boolean(checked[step.id])}
              onChange={(event) => setChecked((current) => ({ ...current, [step.id]: event.target.checked }))}
            />
            <span>{step.label}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-soft)]">
        Готовность: {doneCount}/{steps.length} ({progress}%)
      </div>
    </div>
  );
}
