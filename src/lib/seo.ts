import type { Metadata } from "next";

export const siteUrl = "https://runpsy.ru";
export const siteName = "RunPsy";

const defaultKeywords = [
  "психология отношений",
  "тесты по психологии",
  "психологические чек-листы",
  "созависимость",
  "тревожная привязанность",
  "личные границы",
  "расставание",
  "выгорание",
  "самооценка",
];

export function buildMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const canonical = `${siteUrl}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical },
    keywords: defaultKeywords,
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
