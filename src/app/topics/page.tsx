import { ObsidianTopicMap } from "@/components/topics/obsidian-topic-map";
import { categories, getPublishedArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Карта тем | RunPsy",
  description: "Навигация по ключевым направлениям контента RunPsy.",
  path: "/topics",
});

export default function TopicsPage() {
  return <ObsidianTopicMap articles={getPublishedArticles()} categories={categories} />;
}
