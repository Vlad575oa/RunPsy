import Script from "next/script";
import { MessageCircleWarning, Sparkles } from "lucide-react";
import { psychologyDialogues } from "@/lib/tests-content";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { DialoguesCatalog } from "@/components/dialogues/dialogues-catalog";

export const metadata = buildMetadata({
  title: "Диалоги для сложных разговоров | RunPsy",
  description:
    "25 готовых психологических диалогов: что сказать себе, партнёру и близким в сложных ситуациях. Фильтр по темам: отношения, тревога, семья, границы, работа.",
  path: "/dialogues",
});

export default function DialoguesPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Диалоги RunPsy",
    description: "Готовые формулировки для сложных эмоциональных разговоров.",
    url: `${siteUrl}/dialogues`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: psychologyDialogues.length,
      itemListElement: psychologyDialogues.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
      })),
    },
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1900px] px-6 xl:px-12 2xl:px-20 py-10">
      <Script id="schema-dialogues-collection" type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </Script>

      {/* Герой */}
      <section className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-white via-[#f8f8ff] to-[#eef3ff] p-8 shadow-sm md:p-12">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#4a5f98]">
          <MessageCircleWarning className="h-4 w-4" />
          RunPsy · Диалоги
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Что говорить, когда сложно</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-soft)]">
          {psychologyDialogues.length} опорных диалогов для реальных моментов напряжения. Выберите тему,
          найдите ситуацию и адаптируйте фразу под свой голос.
        </p>
      </section>

      {/* Каталог с фильтром */}
      <DialoguesCatalog dialogues={psychologyDialogues} />

      {/* Как использовать */}
      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-6 py-5">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">
          <Sparkles className="h-4 w-4" />
          Как использовать
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
          Выберите одну формулировку, сократите до 1–2 фраз и проговорите вслух заранее. В триггере цель — не звучать идеально, а остаться в контакте с собой.
        </p>
      </section>
    </div>
  );
}
