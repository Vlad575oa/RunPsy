import type { MetadataRoute } from "next";
import {
  getAuthorsFromStore,
  getCategoriesFromStore,
  getPublishedArticlesFromStore,
} from "@/lib/content-store";

const SITE_URL = "https://runpsy.ru";

const staticRoutes = [
  "/",
  "/articles",
  "/tests",
  "/topics",
  "/about",
  "/contact",
  "/newsletter",
  "/resources",
  "/start-here",
  "/editorial-policy",
  "/privacy",
  "/terms",
  "/cookies",
  "/disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, authors] = await Promise.all([
    getPublishedArticlesFromStore(),
    getCategoriesFromStore(),
    getAuthorsFromStore(),
  ]);

  const now = new Date();

  const staticItems: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/articles" || route === "/tests" ? 0.9 : 0.7,
  }));

  const articleItems: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: article.updated ? new Date(article.updated) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryItems: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const authorItems: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${SITE_URL}/authors/${author.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticItems, ...articleItems, ...categoryItems, ...authorItems];
}
