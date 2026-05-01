import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Политика приватности | RunPsy",
  description: "Как мы обрабатываем данные и где проходят границы конфиденциальности.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="font-serif text-4xl">Политика приватности</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
        Мы используем данные только для ответа на обращения и отправки письма, если вы на него подписались.
      </p>
    </div>
  );
}
