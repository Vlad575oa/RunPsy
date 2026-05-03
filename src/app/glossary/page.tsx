import type { Metadata } from "next";
import Link from "next/link";
import { glossaryEntries } from "@/lib/glossary";
import { GlossarySearch } from "@/components/blog/glossary-search";

export const metadata: Metadata = {
  title: "Словарь терминов | RunPsy",
  description: "Краткие объяснения психологических терминов и сокращений, которые встречаются в статьях RunPsy.",
};

type GlossaryPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function GlossaryPage({ searchParams }: GlossaryPageProps) {
  const params = await searchParams;
  const backHref = params.from ? decodeURIComponent(params.from) : "/articles";

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Справочник</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-[var(--text)]">Словарь терминов RunPsy</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
            Здесь собраны сокращения, англоязычные модели и сложные слова, которые встречаются в статьях. Чтобы не терять нить,
            со словаря можно сразу вернуться в то место, откуда вы пришли.
          </p>
        </div>
        <Link
          href={backHref}
          className="inline-flex items-center rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)] shadow-sm transition hover:border-[var(--accent)] hover:bg-[#fff7ef]"
        >
          ← Вернуться назад
        </Link>
      </div>

      <GlossarySearch entries={glossaryEntries} backHref={backHref} />
    </div>
  );
}
