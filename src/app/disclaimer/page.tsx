import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дисклеймер",
  description: "Границы ответственности и назначение контента проекта RunPsy.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl">Дисклеймер</h1>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6 text-sm leading-6 text-[var(--text-soft)]">
        <p>
          Материалы RunPsy носят информационный и образовательный характер.
          Они не являются медицинским диагнозом, индивидуальной психотерапией
          или экстренной помощью.
        </p>
        <p className="mt-4">
          Если ваше состояние быстро ухудшается или есть риск вреда себе/другим,
          обратитесь в экстренные службы и к профильным специалистам очно.
        </p>
      </section>
    </div>
  );
}
