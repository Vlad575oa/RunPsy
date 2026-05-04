import { ChevronRight } from "lucide-react";
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

export function ArticleDialogueBlock({ title, items, step }: ArticleDialogueBlockProps) {
  return (
    <details className="group scroll-mt-24 rounded-2xl border border-[#d6deef] bg-[linear-gradient(180deg,#fbfcff_0%,#f2f6ff_100%)] p-5 shadow-[0_12px_36px_rgba(52,76,136,0.07)]">
      <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none outline-none">
        <ChevronRight className="h-6 w-6 text-[#5d6fa6] transition-transform duration-200 group-open:rotate-90 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            {step && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5d6fa6]/10 text-[10px] font-bold text-[#5d6fa6]">{step}</span>}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5d6fa6]">Инструмент разговора</p>
          </div>
          <h2 className="mt-1 font-serif text-xl text-[#22263a]">{title}</h2>
        </div>
      </summary>

      <div className="mt-4 divide-y divide-[#e4eaf5]">
        {items.map((item, index) => (
          <div key={index} className="py-3">
            {item.trigger ? (
              <p className="mb-1 text-sm text-[#7f8db8]">
                <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em]">Триггер:</span>
                {item.trigger}
              </p>
            ) : null}
            <p className="text-sm leading-6 text-[#22263a]">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1f7a63]">Ответ:</span>
              {item.response}
            </p>
            {item.note ? <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">{item.note}</p> : null}
          </div>
        ))}
      </div>
    </details>
  );
}
