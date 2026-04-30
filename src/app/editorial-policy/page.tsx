import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редакционная политика",
  description: "Принципы подготовки материалов по психологии в проекте RunPsy.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl">Редакционная политика</h1>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl">Принципы</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-[var(--text-soft)]">
          <li>Разделяем формулировки на факт (SERP), наблюдение и гипотезу.</li>
          <li>Не публикуем неподтвержденные точные SEO-метрики как факт.</li>
          <li>Ставим безопасность и ясность выше кликбейта.</li>
          <li>В кризисных материалах используем мягкие и неультимативные рекомендации.</li>
          <li>Регулярно обновляем статьи и помечаем дату обновления.</li>
        </ul>
      </section>
    </div>
  );
}
