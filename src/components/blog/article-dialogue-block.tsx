"use client";

import { MessageCircle, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

type DialogueItem = {
  trigger?: ReactNode;
  response: ReactNode;
  note?: ReactNode;
};

type ArticleDialogueBlockProps = {
  title: string;
  items: DialogueItem[];
  step?: number;
};

export function ArticleDialogueBlock({ title, items }: ArticleDialogueBlockProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-[var(--text-soft)]" />
          <span className="text-lg font-semibold text-[var(--text)]">{title}</span>
        </div>
        <ChevronUp className={`h-5 w-5 text-[var(--text-soft)] transition-transform duration-200 ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="px-6 pb-6">
          {/* Summary lines */}
          <div className="mb-5 space-y-3">
            {items.map((item, i) =>
              item.trigger ? (
                <p key={i} className="text-base leading-7 text-[var(--text)]">
                  Вместо «{item.trigger}» — «{item.response}»
                </p>
              ) : null
            )}
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] p-4">
                {item.trigger && (
                  <p className="mb-2 text-sm text-rose-400 line-through decoration-rose-400">
                    ✗ {item.trigger}
                  </p>
                )}
                <p className="text-base font-semibold leading-6 text-[var(--text)]">
                  ✓ {item.response}
                </p>
                {item.note && (
                  <p className="mt-2 text-sm leading-5 text-[var(--text-soft)]">{item.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
