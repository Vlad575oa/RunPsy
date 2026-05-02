import type { Metadata } from "next";
import Link from "next/link";
import { glossaryEntries } from "@/lib/glossary";

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

      <div className="mt-8 rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {glossaryEntries.map((entry) => (
            <a
              key={entry.slug}
              href={`#${entry.slug}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text-soft)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
            >
              <span className="block font-semibold text-[var(--text)]">{entry.term}</span>
              <span className="mt-1 block leading-5">{entry.short}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {glossaryEntries.map((entry) => (
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
              <Link href={backHref} className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
                Вернуться к статье
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
