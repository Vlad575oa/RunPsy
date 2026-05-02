import Script from "next/script";
import { TestsWorkbench } from "@/components/tests/tests-workbench";
import { psychologyChecklists, psychologyTests } from "@/lib/tests-content";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Психологические тесты и чек-листы онлайн | RunPsy",
  description:
    "25 интерактивных психологических тестов и 25 чек-листов: привязанность, тревога, выгорание, самооценка, границы, ревность, созависимость и отношения.",
  path: "/tests",
});

export default function TestsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Психологические тесты и чек-листы RunPsy",
    description: "Интерактивные тесты и чек-листы для самопроверки в темах отношений, тревоги, границ и восстановления.",
    url: `${siteUrl}/tests`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: psychologyTests.length + psychologyChecklists.length,
      itemListElement: [...psychologyTests, ...psychologyChecklists].map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
      })),
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <Script id="schema-tests-collection" type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </Script>
      <section className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--accent)]">RunPsy · интерактив</p>
        <h1 className="mt-2 font-serif text-4xl">Тесты и чек-листы</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-soft)]">
          25 популярных психологических тестов и 25 практичных чек-листов. Это не медицинская диагностика, а спокойный способ увидеть ближайший шаг и сохранить результат.
        </p>
      </section>

      <TestsWorkbench tests={psychologyTests} checklists={psychologyChecklists} />
    </div>
  );
}
