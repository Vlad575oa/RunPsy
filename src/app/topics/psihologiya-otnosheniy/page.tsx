import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Психология отношений мужчины и женщины",
  description:
    "Pillar-страница: кризисные темы, личные границы, восстановление доверия и рабочие алгоритмы для пары.",
};

const clusterMap = [
  {
    title: "Кризис и отдаление",
    problem: "Партнер охладел, пропала близость, разговоры уходят в тишину.",
    nextStep: "Начните с карты причин и безопасного сценария диалога.",
    articleSlug: "pochemu-muzhchina-otdalyaetsya",
  },
  {
    title: "Расставание и восстановление",
    problem: "Боль после разрыва, эмоциональные качели, потеря опоры.",
    nextStep: "Перейдите к протоколу 72 часа -> 7 дней -> 30 дней.",
    articleSlug: "kak-perezhit-rasstavanie",
  },
  {
    title: "Токсичность и безопасность",
    problem: "Повторяющиеся циклы обесценивания, страха и контроля.",
    nextStep: "Оцените маркеры риска и подготовьте план безопасных действий.",
    articleSlug: "toksichnye-otnosheniya-priznaki",
  },
];

export default function PillarPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl leading-tight">Психология отношений мужчины и женщины</h1>
      <p className="mt-4 max-w-3xl text-[var(--text-soft)]">
        Это hub-страница проекта: здесь собраны приоритетные кризисные темы,
        практические гайды и маршруты, с которых лучше начать в зависимости от
        вашей ситуации.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {clusterMap.map((cluster) => (
          <article key={cluster.title} className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-xl">{cluster.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{cluster.problem}</p>
            <p className="mt-2 text-sm font-medium text-[var(--accent-deep)]">{cluster.nextStep}</p>
            <Link
              href={`/blog/${cluster.articleSlug}`}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline"
            >
              Открыть материал
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl">Навигация по боли</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-[var(--text-soft)]">
          <li>Если срочно нужен план действий после конфликта: начните со статьи про отдаление.</li>
          <li>Если боль после разрыва не отпускает: переходите к 30-дневному плану восстановления.</li>
          <li>Если есть признаки опасного цикла: изучите материал о токсичности и блок безопасности.</li>
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl">Актуальные статьи</h2>
        <div className="mt-4 space-y-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 transition hover:bg-[var(--bg-soft)]"
            >
              <p className="text-sm font-semibold text-[var(--text)]">{article.title}</p>
              <p className="mt-1 text-xs text-[var(--text-soft)]">{article.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
