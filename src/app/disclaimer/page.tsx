import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Дисклеймер | RunPsy",
  description: "Ограничения контента: статьи не заменяют терапию и медицинскую помощь.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="font-serif text-4xl">Дисклеймер</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
        Контент RunPsy носит информационный характер и не является психотерапией, диагностикой или медицинской рекомендацией.
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
        Если состояние кажется интенсивным, длительным или небезопасным, обратитесь к квалифицированному специалисту и экстренным службам в вашем регионе.
      </p>
    </div>
  );
}
