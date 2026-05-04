import { existsSync, readFileSync } from "node:fs";
import { Client } from "pg";
function loadEnv() {
  const content = readFileSync(".env.local", "utf8");
  for (const line of content.split(/\r?\n/)) {
    const sep = line.indexOf("=");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const val = line.slice(sep + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}
async function main() {
  loadEnv();
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("SELECT slug FROM runpsy_categories ORDER BY slug");
  console.log(res.rows.map((r: any) => r.slug).join("\n"));
  await client.end();
}
main().catch(console.error);
