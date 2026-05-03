"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function Pagination({ page, total, perPage, query, category }: {
  page: number;
  total: number;
  perPage: number;
  query: string;
  category: string;
}) {
  const router = useRouter();
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  function go(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    router.push(`/?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button onClick={() => go(page - 1)} disabled={page === 1}
        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--text-soft)] transition hover:border-[var(--accent)] hover:text-[var(--text)] disabled:opacity-30">
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => (
        <button key={p} onClick={() => go(p)}
          className={[
            "grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition",
            p === page
              ? "bg-[var(--accent)] text-white"
              : "border border-[var(--line)] text-[var(--text-soft)] hover:border-[var(--accent)] hover:text-[var(--text)]",
          ].join(" ")}>
          {p}
        </button>
      ))}

      <button onClick={() => go(page + 1)} disabled={page === totalPages}
        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--text-soft)] transition hover:border-[var(--accent)] hover:text-[var(--text)] disabled:opacity-30">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
