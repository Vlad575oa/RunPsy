import Link from "next/link";
import { Menu } from "lucide-react";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/articles", label: "Статьи" },
  { href: "/tests", label: "Тесты" },
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
        <details className="relative md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)] [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" />
          </summary>
          <nav className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-white/20 bg-white/85 p-2 shadow-lg backdrop-blur-xl">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-white hover:text-[var(--text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
