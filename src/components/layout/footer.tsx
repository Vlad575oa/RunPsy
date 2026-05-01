import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h2 className="font-serif text-xl text-[var(--accent-deep)]">RunPsy</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
            Практичная психология отношений: меньше шума, больше ясных шагов.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">Навигация</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
            <li><Link href="/about">О проекте</Link></li>
            <li><Link href="/articles">Статьи</Link></li>
            <li><Link href="/topics">Карта</Link></li>
            <li><Link href="/resources">Ресурсы</Link></li>
            <li><Link href="/contact">Контакт</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">Важно</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
            <li><Link href="/editorial-policy">Редполитика</Link></li>
            <li><Link href="/privacy">Политика приватности</Link></li>
            <li><Link href="/disclaimer">Дисклеймер</Link></li>
            <li><Link href="/newsletter">Рассылка</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
