import { ObsidianTopicMap } from "@/components/topics/obsidian-topic-map";
import { getCategoriesFromStore, getPublishedArticlesFromStore } from "@/lib/content-store";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Карта тем | RunPsy",
  description: "Навигация по ключевым направлениям контента RunPsy.",
  path: "/topics",
});

const ALLOWED_CATEGORIES = new Set([
  "relationships",
  "anxiety-and-stress",
  "attachment-and-intimacy",
  "social-ident",
  "neuro-detox",
  "emotional-maturity",
  "psychosomatics",
  "habits-and-motivation",
]);

export default async function TopicsPage() {
  let [articles, categories] = await Promise.all([getPublishedArticlesFromStore(), getCategoriesFromStore()]);
  categories = categories.filter((c) => ALLOWED_CATEGORIES.has(c.slug));
  return <ObsidianTopicMap articles={articles} categories={categories} />;
}
