"use client";

import { useEffect, useState } from "react";

type TOCItem = { id: string; title: string };

export function ArticleTOC({ items }: { items: TOCItem[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-15% 0% -70% 0%" }
    );

    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Содержание статьи">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
        Содержание
      </p>
      <ul className="space-y-0.5">
        {items.map(({ id, title }, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-sm leading-snug transition-colors ${
                active === id
                  ? "font-semibold text-[var(--accent)]"
                  : "text-[var(--text-soft)] hover:text-[var(--text)]"
              }`}
            >
              <span className={`mt-px shrink-0 text-[10px] font-bold ${active === id ? "text-[var(--accent)]" : "text-[var(--text-soft)]/50"}`}>
                {i + 1}
              </span>
              <span className="line-clamp-2">{title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
