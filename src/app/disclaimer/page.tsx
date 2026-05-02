import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Дисклеймер | RunPsy",
  description: "Ограничения контента: статьи не заменяют терапию и медицинскую помощь.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        ← На главную
      </Link>
      <h1 className="font-serif text-4xl">Дисклеймер</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--text-soft)]">
        <p>
          Контент RunPsy носит информационный характер и не является психотерапией, диагностикой, медицинской рекомендацией или заменой очной помощи специалиста.
        </p>
        <p>
          Публикации отражают редакционный взгляд на психологические темы и не учитывают индивидуальные особенности каждого пользователя.
        </p>
        <p>
          Если состояние кажется интенсивным, длительным или небезопасным, необходимо обратиться к квалифицированному специалисту и, при необходимости, в экстренные службы вашего региона.
        </p>
      </div>
    </div>
  );
}
