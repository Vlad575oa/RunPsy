import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Диагностика ситуации",
  description:
    "Стартовая консультация по ситуации в отношениях: отдаление, токсичность, расставание, восстановление доверия.",
};

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl">Диагностика ситуации за 20 минут</h1>
      <p className="mt-4 text-[var(--text-soft)]">
        Формат подходит, если сейчас нужен трезвый разбор без давления: что с
        вами происходит, где главная точка риска и какой первый шаг даст опору.
      </p>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl">Что получите</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-[var(--text-soft)]">
          <li>Карту ситуации: факты, триггеры, повторяющийся паттерн.</li>
          <li>Первый протокол действий на 72 часа.</li>
          <li>Рекомендацию по формату помощи: индивидуально или в программе.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl">Запрос на консультацию</h2>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          Напишите на <a className="font-semibold" href="mailto:hello@runpsy.ru">hello@runpsy.ru</a> и укажите тему письма
          «Диагностика 20 минут». Мы ответим с доступными слотами.
        </p>
      </section>
    </div>
  );
}
