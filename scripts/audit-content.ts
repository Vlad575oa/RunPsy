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

async function auditContent() {
  loadLocalEnv();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // Categories
    const catRes = await client.query("SELECT slug, title FROM runpsy_categories");
    console.log("Categories:");
    for (const cat of catRes.rows) {
      const countRes = await client.query("SELECT count(*) FROM runpsy_articles WHERE category_slug = $1 AND status = 'published'", [cat.slug]);
      console.log(`- ${cat.title} (${cat.slug}): ${countRes.rows[0].count} articles`);
    }

    // Authors
    const authRes = await client.query("SELECT name, role, slug FROM runpsy_authors");
    console.log("\nAuthors:");
    for (const auth of authRes.rows) {
       console.log(`- ${auth.name} (${auth.role})`);
    }

    // Intent distribution
    const intentRes = await client.query("SELECT intent, count(*) FROM runpsy_articles WHERE status = 'published' GROUP BY intent");
    console.log("\nIntent Distribution:");
    for (const intent of intentRes.rows) {
      console.log(`- ${intent.intent}: ${intent.count}`);
    }

  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

auditContent();
