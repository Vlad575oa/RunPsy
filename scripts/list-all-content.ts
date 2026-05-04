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
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

async function main() {
  loadLocalEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const catsRes = await client.query("SELECT slug, title FROM runpsy_categories ORDER BY sort_order");
    const articlesRes = await client.query("SELECT category_slug, title, sort_order FROM runpsy_articles ORDER BY sort_order");

    console.log("=== КАТЕГОРИИ И СТАТЬИ RUNPSY ===\n");

    for (const cat of catsRes.rows) {
      console.log(`\n📂 КАТЕГОРИЯ: ${cat.title} (${cat.slug})`);
      const catArticles = articlesRes.rows.filter(a => a.category_slug === cat.slug);
      if (catArticles.length === 0) {
        console.log("   (статей нет)");
      } else {
        catArticles.forEach(a => {
          console.log(`   - [${a.sort_order}] ${a.title}`);
        });
      }
    }

  } finally {
    await client.end();
  }
}

main().catch(console.error);
