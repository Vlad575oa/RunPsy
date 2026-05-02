import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Настройки файлов Cookie | RunPsy",
  description: "Информация о cookie и способах управления ими на сайте RunPsy.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        ← На главную
      </Link>
      <h1 className="font-serif text-4xl">Настройки файлов Cookie</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">Дата вступления в силу: 01.05.2026</p>
      <div className="mt-6 space-y-6 text-sm leading-7 text-[var(--text-soft)]">
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">1. Что такое Cookie</h2>
          <p className="mt-2">
            Cookie — это небольшие текстовые файлы, которые браузер сохраняет на устройстве пользователя для корректной работы сайта.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">2. Какие Cookie мы используем</h2>
          <p className="mt-2">
            На текущий момент сайт использует только технически необходимые cookie и служебные данные, которые обеспечивают работу интерфейса и безопасность.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">3. Управление Cookie</h2>
          <p className="mt-2">
            Вы можете ограничить или отключить cookie в настройках своего браузера. Это может повлиять на корректность работы отдельных функций сайта.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">4. Контакты</h2>
          <p className="mt-2">
            По вопросам обработки данных и cookie: vlad575@mail.ru, +7 (926) 317-72-26.
          </p>
        </section>
      </div>
    </div>
  );
}
