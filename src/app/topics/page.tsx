import { ObsidianTopicMap } from "@/components/topics/obsidian-topic-map";
import { getCategoriesFromStore, getPublishedArticlesFromStore } from "@/lib/content-store";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Карта тем | RunPsy",
  description: "Навигация по ключевым направлениям контента RunPsy.",
  path: "/topics",
});

export default async function TopicsPage() {
  const [articles, categories] = await Promise.all([getPublishedArticlesFromStore(), getCategoriesFromStore()]);
  return <ObsidianTopicMap articles={articles} categories={categories} />;
}
