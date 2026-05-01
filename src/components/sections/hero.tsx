import Link from "next/link";

export function Hero() {
  return (
    <section className="rounded-3xl border border-[var(--line)] bg-white p-8 shadow-sm md:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">RunPsy · практичная психология</p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-5xl">
        Психология отношений без тумана и стыда
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
        Короткие, спокойные материалы для моментов, когда в отношениях, тревоге или расставании нужно не «держаться», а понять ближайший шаг.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/start-here" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Начать с маршрута
        </Link>
        <Link href="/articles" className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--accent-deep)] transition hover:bg-[var(--bg-soft)]">
          Читать статьи
        </Link>
      </div>
    </section>
  );
}
