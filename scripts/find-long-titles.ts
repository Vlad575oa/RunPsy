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

async function findLongTitles() {
  loadLocalEnv();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT slug, seo_title FROM runpsy_articles WHERE length(seo_title) > 70 AND status = 'published'"
    );

    console.log(`Found ${result.rowCount} long SEO titles:\n`);
    result.rows.forEach((row: any) => {
      console.log(`Slug: ${row.slug}`);
      console.log(`Title (${row.seo_title.length}): ${row.seo_title}`);
      console.log("---");
    });

  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

findLongTitles();
