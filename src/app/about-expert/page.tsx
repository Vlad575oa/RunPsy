import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Об эксперте",
  description: "Профиль автора и редакционная прозрачность проекта RunPsy.",
};

export default function AboutExpertPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl">Об эксперте и редакционной команде</h1>
      <p className="mt-4 text-[var(--text-soft)]">
        Этот раздел заполняется реальными данными: образование, сертификаты,
        опыт практики, специализация и формат супервизии.
      </p>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl">E-E-A-T блок</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-6 text-[var(--text-soft)]">
          <li>Автор: ФИО, профиль и подтвержденная квалификация.</li>
          <li>Редактор: проверка формулировок и рисков в YMYL-темах.</li>
          <li>Дата обновления материалов: видна на каждой статье.</li>
          <li>Источники: APA, ВОЗ, систематические обзоры, мета-анализы.</li>
        </ul>
      </section>
    </div>
  );
}
