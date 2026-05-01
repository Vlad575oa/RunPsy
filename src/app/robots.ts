import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Bytespider", "Amazonbot", "ClaudeBot", "PerplexityBot"],
        disallow: ["/articles", "/articles/"],
      },
    ],
    sitemap: "https://runpsy.ru/sitemap.xml",
    host: "https://runpsy.ru",
  };
}

