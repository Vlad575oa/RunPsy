import { Client } from "pg";
import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    if (!existsSync(file)) continue;
    const content = readFileSync(file, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      let [key, ...parts] = trimmed.split("=");
      let value = parts.join("=").trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key.trim()] = value;
    }
    break;
  }
}

async function analyzeLinking() {
  loadLocalEnv();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // Get all articles with their text content and current related_slugs
    const result = await client.query(
      "SELECT title, slug, category_slug, sections, related_slugs FROM runpsy_articles WHERE status = 'published'"
    );

    const articles = result.rows;
    console.log(`Analyzing ${articles.length} articles for linking opportunities...\n`);

    const clusters = ['anxiety-and-stress', 'neurobiology', 'relationships'];
    
    for (const cluster of clusters) {
      console.log(`=== Cluster: ${cluster} ===`);
      const clusterArticles = articles.filter(a => a.category_slug === cluster);
      
      for (const article of clusterArticles) {
        const contentText = JSON.stringify(article.sections).toLowerCase();
        const currentRelated = article.related_slugs || [];
        
        // Find other articles in the same cluster that are mentioned or relevant
        const potentialLinks = clusterArticles
          .filter(other => other.slug !== article.slug && !currentRelated.includes(other.slug))
          .filter(other => {
            // Simple keyword match: if the title of another article (or key part of it) is in this content
            const otherTitleKeywords = other.title.toLowerCase().split(' ').filter((w: string) => w.length > 4);
            return otherTitleKeywords.some((keyword: string) => contentText.includes(keyword));
          })
          .slice(0, 3); // Top 3 opportunities

        if (potentialLinks.length > 0) {
          console.log(`Article: ${article.title} (${article.slug})`);
          console.log(`Current related: [${currentRelated.join(', ')}]`);
          console.log(`Missing opportunities:`);
          potentialLinks.forEach(p => console.log(`  - ${p.title} (${p.slug})`));
          console.log("---");
        }
      }
    }

  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

analyzeLinking();
