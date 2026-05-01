import Link from "next/link";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/articles", label: "Статьи" },
  { href: "/topics", label: "Карта" },
  { href: "/newsletter", label: "Рассылка" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-bold text-[var(--accent-deep)]">
          RunPsy
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-white/60 hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
          Диагностика
        </Link>
      </div>
    </header>
  );
}
