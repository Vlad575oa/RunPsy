import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/blog", label: "Блог" },
  { href: "/topics/psihologiya-otnosheniy", label: "Pillar" },
  { href: "/consultation", label: "Консультация" },
  { href: "/about-expert", label: "Эксперт" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--line)] bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--accent-deep)]">
            RunPsy
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-[var(--text-soft)]">
          <p>© 2026 RunPsy. Контент проекта не заменяет психотерапию и медицинскую помощь.</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <Link href="/editorial-policy" className="hover:text-[var(--text)]">
              Редакционная политика
            </Link>
            <Link href="/disclaimer" className="hover:text-[var(--text)]">
              Дисклеймер
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
