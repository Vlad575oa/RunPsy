"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/topics", label: "Темы" },
  { href: "/dialogues", label: "Диалоги" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1900px] items-center justify-between gap-4 px-6 py-4 xl:px-12 2xl:px-20">
        <Link href="/" className="shrink-0 font-serif text-3xl font-bold text-[var(--accent-deep)] leading-none xl:text-4xl">
          RunPsy
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-5 py-3 text-lg font-medium transition xl:text-xl xl:px-6 ${
                pathname === item.href
                  ? "bg-[var(--bg-soft)] text-[var(--text)]"
                  : "text-[var(--text-soft)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/tests"
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg font-semibold transition xl:text-xl xl:px-7 ${
              pathname === "/tests"
                ? "bg-[var(--accent-deep)] text-white shadow-md"
                : "bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-deep)] hover:shadow-md"
            }`}
          >
            <Compass className="h-4 w-4" />
            Тесты
          </Link>
        </div>

        <div className="relative ml-auto md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--text)]"
            aria-label="Меню"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {open && (
            <nav className="absolute right-0 top-12 z-30 w-60 rounded-2xl border border-white/20 bg-white/90 p-2 shadow-xl backdrop-blur-xl">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    pathname === item.href
                      ? "bg-[var(--bg-soft)] text-[var(--text)]"
                      : "text-[var(--text-soft)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mx-2 my-2 border-t border-[var(--line)]" />
              <Link
                href="/tests"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Compass className="h-4 w-4" />
                Тесты
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
