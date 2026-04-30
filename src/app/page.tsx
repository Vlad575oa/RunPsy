import Link from "next/link";
import { articles, siteFacts, topTopics, weekOnePlan } from "@/lib/content";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10 md:py-14">
      <section className="rounded-3xl border border-[var(--line)] bg-white p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
          SERP-анализ RU · 30.04.2026
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-tight md:text-5xl">
          Психология отношений: кризисные гайды, сценарии разговоров и опора на факты из открытой выдачи
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-soft)]">
          Мы строим контент вокруг горячих запросов: отдаление, расставание,
          токсичность, границы. Утверждения о метриках без платных SEO-баз маркируем
          как гипотезы, а не как точные цифры.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/topics/psihologiya-otnosheniy"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Открыть pillar-страницу
          </Link>
          <Link
            href="/consultation"
            className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--accent-deep)] transition hover:bg-[var(--bg-soft)]"
          >
            Диагностика за 20 минут
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoBlock title="Факт (SERP)" tone="ok" items={siteFacts.fact} />
        <InfoBlock title="Наблюдение" tone="warn" items={siteFacts.observation} />
        <InfoBlock title="Гипотеза/оценка" tone="accent" items={siteFacts.hypothesis} />
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-white p-8">
        <h2 className="text-3xl">Приоритетные кластеры и монетизация</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {topTopics.map((topic) => (
            <article key={topic.title} className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                {topic.intent}
              </p>
              <h3 className="mt-2 text-xl">{topic.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Ключ: {topic.key}</p>
              <p className="mt-2 text-sm font-medium text-[var(--accent-deep)]">
                Продукт: {topic.monetization}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-white p-8">
        <h2 className="text-3xl">Первые статьи (high-intent)</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                {article.cluster}
              </p>
              <h3 className="mt-2 text-xl leading-tight">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{article.description}</p>
              <Link
                href={`/blog/${article.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline"
              >
                Читать статью
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-white p-8">
        <h2 className="text-3xl">Первые действия на 7 дней</h2>
        <ol className="mt-6 space-y-3 text-sm leading-6 text-[var(--text-soft)]">
          {weekOnePlan.map((item) => (
            <li key={item} className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3">
              {item}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function InfoBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "ok" | "warn" | "accent";
}) {
  const toneClass =
    tone === "ok"
      ? "text-[var(--ok)]"
      : tone === "warn"
        ? "text-[var(--warn)]"
        : "text-[var(--accent-deep)]";

  return (
    <article className="rounded-2xl border border-[var(--line)] bg-white p-6">
      <h2 className={`text-xl ${toneClass}`}>{title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--text-soft)]">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </article>
  );
}
