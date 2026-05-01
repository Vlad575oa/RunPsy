import Link from "next/link";

export function NewsletterCTA() {
  return (
    <section className="rounded-3xl border border-[var(--line)] bg-white p-8 md:p-10">
      <h2 className="font-serif text-3xl">Письмо, которое не бесит</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
        Раз в неделю: один полезный разбор, один рабочий инструмент, одна честная мысль без «измени жизнь к пятнице».
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/newsletter" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Подписаться
        </Link>
        <Link href="/start-here" className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--accent-deep)] transition hover:bg-[var(--bg-soft)]">
          С чего начать
        </Link>
      </div>
    </section>
  );
}
