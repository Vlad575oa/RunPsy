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
    const res = await client.query("SELECT COUNT(*) FROM runpsy_articles");
    console.log(`Total articles in runpsy_articles: ${res.rows[0].count}`);
    
    const statusRes = await client.query("SELECT status, COUNT(*) FROM runpsy_articles GROUP BY status");
    console.log("\nBreakdown by status:");
    statusRes.rows.forEach(row => console.log(`${row.status}: ${row.count}`));

  } finally {
    await client.end();
  }
}

main().catch(console.error);
