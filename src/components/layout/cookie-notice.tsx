"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const COOKIE_CONSENT_KEY = "runpsy_cookie_consent_v1";

export function CookieNotice() {
  const [dismissed, setDismissed] = useState(false);
  const visibleFromStorage = useSyncExternalStore(
    () => () => {},
    () => !window.localStorage.getItem(COOKIE_CONSENT_KEY),
    () => false,
  );
  const visible = visibleFromStorage && !dismissed;

  function acceptCookies() {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setDismissed(true);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white/95 p-4 shadow-lg backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-[var(--text-soft)]">
          Мы используем технически необходимые cookie для корректной работы сайта.
          Подробнее в разделе{" "}
          <Link href="/cookies" className="font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
            «Настройки файлов Cookie»
          </Link>.
        </p>
        <button
          type="button"
          onClick={acceptCookies}
          className="shrink-0 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
