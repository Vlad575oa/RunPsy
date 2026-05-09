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

async function checkMetadata() {
  loadLocalEnv();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT title, slug, seo_title, seo_description FROM runpsy_articles WHERE status = 'published'"
    );

    console.log(`Checking metadata for ${result.rowCount} articles...\n`);

    let missingSeoTitle = 0;
    let missingSeoDescription = 0;
    let shortSeoTitle = 0;
    let longSeoTitle = 0;
    let shortSeoDescription = 0;
    let longSeoDescription = 0;

    result.rows.forEach((row: any) => {
      if (!row.seo_title) missingSeoTitle++;
      if (!row.seo_description) missingSeoDescription++;

      if (row.seo_title) {
        if (row.seo_title.length < 30) shortSeoTitle++;
        if (row.seo_title.length > 70) longSeoTitle++;
      }

      if (row.seo_description) {
        if (row.seo_description.length < 80) shortSeoDescription++;
        if (row.seo_description.length > 170) longSeoDescription++;
      }
    });

    console.log(`Missing SEO Title: ${missingSeoTitle}`);
    console.log(`Missing SEO Description: ${missingSeoDescription}`);
    console.log(`Short SEO Title (<30 chars): ${shortSeoTitle}`);
    console.log(`Long SEO Title (>70 chars): ${longSeoTitle}`);
    console.log(`Short SEO Description (<80 chars): ${shortSeoDescription}`);
    console.log(`Long SEO Description (>170 chars): ${longSeoDescription}`);

    console.log("\nSample metadata (first 5):");
    result.rows.slice(0, 5).forEach((row: any) => {
      console.log(`- Slug: ${row.slug}`);
      console.log(`  Title: ${row.title}`);
      console.log(`  SEO Title: ${row.seo_title}`);
      console.log(`  SEO Desc: ${row.seo_description}`);
      console.log("---");
    });

  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

checkMetadata();
