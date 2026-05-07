import Script from "next/script";
import { TestsCatalog } from "@/components/tests/tests-catalog";
import { psychologyTests } from "@/lib/tests-content";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Психологические навигаторы 3D | RunPsy",
  description:
    "28 психологических навигаторов: не ярлык, а карта — что запускает, как вы реагируете, что помогает. Привязанность, тревога, выгорание, границы, отношения.",
  path: "/tests",
});

export default function TestsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Психологические навигаторы RunPsy",
    description: "Интерактивные навигаторы 3D для самопознания: состояние сейчас, устойчивый паттерн, контекст-триггеры.",
    url: `${siteUrl}/tests`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: psychologyTests.length,
      itemListElement: psychologyTests.map((item, index) => ({
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
      <TestsCatalog
        tests={psychologyTests}
      />
    </div>
  );
}
