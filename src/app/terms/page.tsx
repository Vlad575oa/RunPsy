import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Условия использования | RunPsy",
  description: "Правила использования материалов и сервисов сайта RunPsy.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        ← На главную
      </Link>
      <h1 className="font-serif text-4xl">Условия использования</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">Дата вступления в силу: 01.05.2026</p>
      <div className="mt-6 space-y-6 text-sm leading-7 text-[var(--text-soft)]">
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">1. Общие положения</h2>
          <p className="mt-2">
            Настоящие условия регулируют использование сайта RunPsy. Используя сайт, вы подтверждаете согласие с этими условиями.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">2. Информационный характер материалов</h2>
          <p className="mt-2">
            Материалы сайта носят информационный характер и не являются медицинской услугой, психотерапией, диагностикой или индивидуальной консультацией.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">3. Интеллектуальные права</h2>
          <p className="mt-2">
            Тексты, структура и визуальные материалы сайта охраняются законом. Копирование и распространение материалов без письменного согласия правообладателя не допускается, кроме случаев, прямо разрешенных законом.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">4. Ограничение ответственности</h2>
          <p className="mt-2">
            Администрация сайта не несет ответственность за решения, принятые пользователем исключительно на основании материалов сайта без обращения к профильному специалисту.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">5. Обратная связь</h2>
          <p className="mt-2">
            По вопросам использования сайта и правовым запросам: vlad575@mail.ru, +7 (926) 317-72-26.
          </p>
        </section>
      </div>
    </div>
  );
}
