import type { Article } from "@/types/article";

const SITE_URL = "https://runpsy.ru";

export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    description: article.description,
    url: `${SITE_URL}/articles/${article.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/articles/${article.slug}` },
    publisher: { "@type": "Organization", name: "RunPsy", url: SITE_URL },
    author: {
      "@type": "Organization",
      name: article.author,
    },
  };
}

export function breadcrumbSchema(categorySlug: string, categoryTitle: string, articleTitle: string, articleSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "RunPsy", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: categoryTitle, item: `${SITE_URL}/categories/${categorySlug}` },
      { "@type": "ListItem", position: 3, name: articleTitle, item: `${SITE_URL}/articles/${articleSlug}` },
    ],
  };
}

export function faqSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
