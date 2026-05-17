"use client";

import { useState, useRef } from "react";
import { Compass, ChevronRight } from "lucide-react";
import type { PsychologyTest } from "@/lib/tests-content";
import { TestsWorkbench } from "./tests-workbench";

type Cluster = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  text: string;
  border: string;
};

const clusters: Cluster[] = [
  { id: "all",       label: "Все",              emoji: "",   color: "bg-[var(--bg-soft)]",  text: "text-[var(--text)]",       border: "border-[var(--line)]" },
  { id: "relations", label: "Отношения",        emoji: "💜", color: "bg-[#f3ecff]",         text: "text-[#6b3fa0]",           border: "border-[#d6b8f5]" },
  { id: "anxiety",   label: "Тревога и стресс", emoji: "🔵", color: "bg-[#e8f3ff]",         text: "text-[#2563b0]",           border: "border-[#b3d4f7]" },
  { id: "self",      label: "Самооценка",       emoji: "🍑", color: "bg-[#fff4e8]",         text: "text-[#a05a1a]",           border: "border-[#f5ceaa]" },
  { id: "work",      label: "Работа",           emoji: "🌿", color: "bg-[#eafff4]",         text: "text-[#1a6b45]",           border: "border-[#a8e8c8]" },
  { id: "family",    label: "Семья",            emoji: "🌸", color: "bg-[#fff0f0]",         text: "text-[#9b2d2d]",           border: "border-[#f5b8b8]" },
  { id: "body",      label: "Тело и энергия",   emoji: "✨", color: "bg-[#fffff0]",         text: "text-[#7a7a10]",           border: "border-[#e5e5a0]" },
  { id: "growth",    label: "Рост",             emoji: "🪻", color: "bg-[#f0f0ff]",         text: "text-[#3b3b9b]",           border: "border-[#b8b8f0]" },
];

const testMeta: Record<string, { cluster: string; newTitle: string; duration: number; popular?: boolean }> = {
  "attachment-style":        { cluster: "relations", newTitle: "Как вы любите под давлением",             duration: 8, popular: true  },
  "anxiety-now":             { cluster: "anxiety",   newTitle: "Что внутри вас прямо сейчас",              duration: 4                },
  "burnout-risk":            { cluster: "work",      newTitle: "Сколько вас осталось",                     duration: 5, popular: true  },
  "self-esteem":             { cluster: "self",      newTitle: "Как вы обращаетесь с собой после удара",   duration: 5                },
  "procrastination":         { cluster: "work",      newTitle: "Почему вы останавливаетесь перед важным",  duration: 5                },
  "relationship-satisfaction":{ cluster: "relations",newTitle: "Что происходит между вами",               duration: 5                },
  "boundaries":              { cluster: "self",      newTitle: "Где заканчиваетесь вы",                    duration: 5, popular: true  },
  "codependency":            { cluster: "relations", newTitle: "Чья жизнь вы живёте",                      duration: 5                },
  "jealousy":                { cluster: "relations", newTitle: "Когда близость становится контролем",       duration: 5                },
  "emotional-intelligence":  { cluster: "growth",    newTitle: "Слышите ли вы себя",                       duration: 5                },
  "impostor-syndrome":       { cluster: "self",      newTitle: "Почему вы не верите своим достижениям",    duration: 5, popular: true  },
  "stress-resilience":       { cluster: "anxiety",   newTitle: "Как вы держитесь под давлением",           duration: 5                },
  "social-anxiety":          { cluster: "anxiety",   newTitle: "Почему люди вас пугают",                   duration: 5                },
  "digital-overload":        { cluster: "work",      newTitle: "Что делает телефон с вашей психикой",      duration: 5                },
  "communication":           { cluster: "relations", newTitle: "Как вы ведёте себя, когда больно",         duration: 5                },
  "perfectionism":           { cluster: "self",      newTitle: "Цена вашей планки",                        duration: 5                },
  "loneliness":              { cluster: "body",      newTitle: "Насколько вы одни внутри",                 duration: 5                },
  "anger-regulation":        { cluster: "anxiety",   newTitle: "Что делает ваш гнев",                      duration: 5                },
  "parental-burnout":        { cluster: "family",    newTitle: "Сколько родителя осталось в вас",          duration: 5                },
  "teen-contact":            { cluster: "family",    newTitle: "Слышат ли вас дома",                       duration: 5                },
  "money-conflict":          { cluster: "relations", newTitle: "Деньги или отношения — что рвётся",        duration: 5                },
  "love-or-dependence":      { cluster: "relations", newTitle: "Это любовь или страх потерять",            duration: 5, popular: true  },
  "breakup-recovery":        { cluster: "relations", newTitle: "Где вы сейчас в этой боли",               duration: 5                },
  "trauma-triggers":         { cluster: "anxiety",   newTitle: "Откуда эта реакция на самом деле",         duration: 5                },
  "sleep-stress":            { cluster: "body",      newTitle: "Почему тело не отпускает ночью",           duration: 5                },
  "life-values":             { cluster: "growth",    newTitle: "Своей ли жизнью вы живёте",               duration: 5                },
  "body-awareness":          { cluster: "body",      newTitle: "Что тело пытается вам сказать",            duration: 5                },
  "work-boundaries":         { cluster: "work",      newTitle: "Где кончается работа и начинаетесь вы",    duration: 5                },
  "express-self-esteem":     { cluster: "self",      newTitle: "Как вы видите себя изнутри",                duration: 8                },
  "childhood-patterns":      { cluster: "growth",    newTitle: "Следы детства в взрослой жизни",            duration: 8                },
  "life-tone":               { cluster: "anxiety",   newTitle: "Где пропала радость",                       duration: 8, popular: true  },
  "early-experience":        { cluster: "growth",    newTitle: "В каком возрасте вы остановились внутри",   duration: 8                },
  "victim-pattern":          { cluster: "growth",    newTitle: "Жертва или автор своей жизни",              duration: 8                },
  "feminine-energy":         { cluster: "self",      newTitle: "Ваш внутренний женский ритм",               duration: 8                },
  "emotional-balance":       { cluster: "anxiety",   newTitle: "Когда внутри слишком тихо",                 duration: 8                },
  "inner-polarity":          { cluster: "self",      newTitle: "Ваша внутренняя сила: мягкость и твёрдость",duration: 8                },
  "career-compass":          { cluster: "work",      newTitle: "Где живёт ваша профессиональная энергия",   duration: 8, popular: true  },
  "deep-codependency":       { cluster: "relations", newTitle: "Где заканчиваюсь я и начинается другой",    duration: 8                },
  "inner-tension":           { cluster: "anxiety",   newTitle: "Напряжение, которое не отпускает",          duration: 8                },
  "self-focus":              { cluster: "self",      newTitle: "Насколько вы в центре своего мира",         duration: 8                },
  "attachment-deep":         { cluster: "relations", newTitle: "Как вы держитесь за тех, кого любите",      duration: 8, popular: true  },
  "body-signals":            { cluster: "anxiety",   newTitle: "Что ваше тело говорит о тревоге",           duration: 8                },
  "inner-rules":             { cluster: "growth",    newTitle: "Правила, которые вами управляют",           duration: 8                },
  "parental-bond":           { cluster: "family",    newTitle: "Я и мои родители: кто я без них",           duration: 8, popular: true  },
};

function getCluster(clusterId: string): Cluster {
  return clusters.find((c) => c.id === clusterId) ?? clusters[0];
}

type Props = {
  tests: PsychologyTest[];
};

export function TestsCatalog({ tests }: Props) {
  const [activeCluster, setActiveCluster] = useState("all");
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const workbenchRef = useRef<HTMLDivElement>(null);

  const popularTests = tests.filter((t) => testMeta[t.id]?.popular);

  const filtered = activeCluster === "all"
    ? tests
    : tests.filter((t) => testMeta[t.id]?.cluster === activeCluster);

  function openTest(id: string) {
    setActiveTestId(id);
    setTimeout(() => {
      workbenchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="space-y-10">

      {/* ── Герой ─────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--line)] bg-gradient-to-br from-white via-[#fff8f2] to-[#ffeedd] px-6 py-6 shadow-sm md:px-10 md:py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[var(--accent)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">RunPsy · Навигаторы 3D</p>
            </div>
            <h1 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
              Ваш психологический навигатор
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-soft)]">
              {tests.length} инструментов — не ярлык, а карта:{" "}
              <strong className="text-[var(--text)]">что запускает → как реагируете → что помогает</strong>.
            </p>
          </div>
          <a
            href="#catalog"
            className="hidden shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-deep)] md:inline-flex"
          >
            К каталогу
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
        <a
          href="#catalog"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-deep)] md:hidden"
        >
          К каталогу
          <ChevronRight className="h-4 w-4" />
        </a>
      </section>

      {/* ── С чего начать ──────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-2xl">Не знаете, с чего начать?</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Выберите то, что сейчас ближе — и мы подберём навигатор:</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {[
            { label: "Я устала и не понимаю почему", id: "burnout-risk" },
            { label: "В отношениях что-то не так", id: "attachment-style" },
            { label: "Я не справляюсь на работе", id: "work-boundaries" },
            { label: "Мне тревожно, не знаю от чего", id: "anxiety-now" },
            { label: "Хочу лучше понять себя", id: "life-values" },
            { label: "Это любовь или зависимость?", id: "love-or-dependence" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => openTest(opt.id)}
              className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Популярные ────────────────────────────────────────────────── */}
      <section id="catalog">
        <div className="flex items-center gap-3">
          <span className="text-lg">🔥</span>
          <h2 className="font-serif text-2xl">Чаще всего начинают с этих</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTests.map((test) => {
            const meta = testMeta[test.id];
            const cluster = meta ? getCluster(meta.cluster) : clusters[0];
            return (
              <TestCard
                key={test.id}
                test={test}
                meta={meta}
                cluster={cluster}
                active={activeTestId === test.id}
                onOpen={() => openTest(test.id)}
              />
            );
          })}
        </div>
      </section>

      {/* ── Фильтры + все тесты ────────────────────────────────────────── */}
      <section>
        <h2 className="font-serif text-2xl">Все навигаторы</h2>

        {/* Фильтр по кластерам */}
        <div className="mt-4 flex flex-wrap gap-2">
          {clusters.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCluster(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                activeCluster === c.id
                  ? `${c.color} ${c.text} ${c.border}`
                  : "border-[var(--line)] bg-white text-[var(--text-soft)] hover:bg-[var(--bg-soft)]"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((test) => {
            const meta = testMeta[test.id];
            const cluster = meta ? getCluster(meta.cluster) : clusters[0];
            return (
              <TestCard
                key={test.id}
                test={test}
                meta={meta}
                cluster={cluster}
                active={activeTestId === test.id}
                onOpen={() => openTest(test.id)}
              />
            );
          })}
        </div>
      </section>

      {/* ── Воркбенч (проходить тест) ──────────────────────────────────── */}
      <div ref={workbenchRef}>
        {activeTestId && (
          <section className="scroll-mt-24">
            <TestsWorkbench
              key={activeTestId}
              tests={tests.filter((t) => t.id === activeTestId)}
              onClose={() => setActiveTestId(null)}
            />
          </section>
        )}
      </div>

      {/* ── Отличие RunPsy ─────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-2xl">Почему RunPsy — это не обычный тест</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[var(--bg-soft)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">Обычный тест</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
              <li>Даёт ярлык: «вы тревожный»</li>
              <li>Один результат</li>
              <li>Читаете — и забываете</li>
              <li>Не объясняет почему</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-[#eafff4] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1a6b45]">RunPsy Навигатор</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">
              <li>Даёт карту: «вот что запускает»</li>
              <li>3 измерения одновременно</li>
              <li>Конкретные шаги — сегодня</li>
              <li>Объясняет механику изнутри</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Дисклеймер ────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">Важно знать</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
          Навигаторы RunPsy — инструменты самопознания, не медицинские диагнозы. Они помогают лучше понять себя и не заменяют работу с психологом. Если вам сейчас тяжело — это нормально. И это повод не только пройти тест, но и поговорить с живым человеком.
        </p>
      </section>

    </div>
  );
}

function TestCard({
  test,
  meta,
  cluster,
  active,
  onOpen,
}: {
  test: PsychologyTest;
  meta: (typeof testMeta)[string] | undefined;
  cluster: Cluster;
  active: boolean;
  onOpen: () => void;
}) {
  const title = meta?.newTitle ?? test.title;
  const duration = meta?.duration ?? 5;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group w-full rounded-2xl border p-5 text-left transition ${
        active
          ? "border-[var(--accent)] bg-[#fff5f0] shadow-md"
          : "border-[var(--line)] bg-white hover:border-[var(--accent)]/50 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${cluster.color} ${cluster.text} ${cluster.border}`}>
          {cluster.label}
        </span>
        <span className="text-[11px] text-[var(--text-soft)]">{duration} мин</span>
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-5 text-[var(--text)] group-hover:text-[var(--accent-deep)]">
        {title}
      </h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--text-soft)]">{test.description}</p>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
        Пройти тест
        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}
