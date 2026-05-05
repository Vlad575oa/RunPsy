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
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const canonical = `${siteUrl}${path}`;
  const ogImage = image ?? `${siteUrl}/og-default.webp`;

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
