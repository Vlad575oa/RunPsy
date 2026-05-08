import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Полезные ресурсы по психологии | RunPsy",
  description: "Подборка книг, инструментов и ресурсов по психологии отношений, тревоги, самооценки и восстановления от RunPsy.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="font-serif text-4xl">Ресурсы</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
        Здесь будут чек-листы, мини-гайды и рабочие шаблоны разговоров.
      </p>
    </div>
  );
}
