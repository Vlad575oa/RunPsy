import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "С чего начать | RunPsy",
  description: "Не знаете с чего начать? Это руководство поможет разобраться: тесты, статьи и инструменты RunPsy по вашей ситуации.",
  path: "/start-here",
});

export default function StartHerePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="font-serif text-4xl">С чего начать</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
        Если внутри шумно, не берите сразу десять материалов. Выберите один вопрос и один маленький шаг.
      </p>
      <ol className="mt-6 space-y-3 text-sm leading-6 text-[var(--text-soft)]">
        <li className="rounded-xl border border-[var(--line)] bg-white p-4">1. Выберите тему в <Link href="/topics" className="font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">карте</Link>.</li>
        <li className="rounded-xl border border-[var(--line)] bg-white p-4">2. Прочитайте одну статью до конца, без параллельных вкладок.</li>
        <li className="rounded-xl border border-[var(--line)] bg-white p-4">3. Выпишите одно действие на сегодня. Этого достаточно для старта.</li>
      </ol>
    </div>
  );
}
