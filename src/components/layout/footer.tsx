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
          <div className="mt-5 space-y-2 text-sm text-[var(--text-soft)]">
            <p>ИНН: 771402421981</p>
            <p>
              Email:{" "}
              <a className="underline-offset-2 hover:underline" href="mailto:vlad575@mail.ru">
                vlad575@mail.ru
              </a>
            </p>
            <p>
              Телефон:{" "}
              <a className="underline-offset-2 hover:underline" href="tel:+79263177226">
                +7 (926) 317-72-26
              </a>
            </p>
            <p>Правообладатель: Олейник Владислав Александрович</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">Навигация</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
            <li><Link href="/about">О проекте</Link></li>
            <li><Link href="/articles">Статьи</Link></li>
            <li><Link href="/topics">Карта</Link></li>
            <li><Link href="/resources">Ресурсы</Link></li>
            <li><Link href="/glossary">Словарь</Link></li>
            <li><Link href="/contact">Контакт</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">Правовая информация</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
            <li><Link href="/privacy">Политика обработки персональных данных</Link></li>
            <li><Link href="/terms">Условия использования</Link></li>
            <li><Link href="/cookies">Настройки файлов Cookie</Link></li>
            <li><a href="/sitemap.xml">Карта сайта</a></li>
            <li><Link href="/disclaimer">Дисклеймер</Link></li>
            <li><Link href="/editorial-policy">Редакционная политика</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 text-sm text-[var(--text-soft)]">
          © 2026, Олейник Владислав Александрович
        </div>
      </div>
    </footer>
  );
}
