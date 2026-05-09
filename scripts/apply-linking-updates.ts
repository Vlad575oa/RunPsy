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

async function updateLinks() {
  loadLocalEnv();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query("BEGIN");

    // 1. Stress Cluster Links
    const stressLinks = [
      {
        slug: 'pochemu-vy-prosypaetes-ustavshim',
        related: ['son-i-vosstanovlenie', 'glimfaticheskaya-sistema-kak-mozg-moet-sebya-nochyu-ot-toksinov', 'vygoranie-kak-biologicheskiy-predokhranitel-kogda-probki-vybivaet-navsegda']
      },
      {
        slug: 'pochemu-vy-plachete-bez-vidimoy-prichiny',
        related: ['somatizaciya-nevyskazannye-slova', 'polivagalnaya-teoriya-rezhimy', 'vpityvayu-chuzhie-emotsii']
      },
      {
        slug: 'kak-prinimat-pomoshch',
        related: ['gipernezavisimost-simptom-boli', 'izvineniya-za-sushchestvovanie', 'pochemu-tyazhelo-prosit-o-povyshenii']
      }
    ];

    // 2. Neurobiology Cluster Links
    const neuroLinks = [
      {
        slug: 'desensibilizaciya-realnost',
        related: ['mehanizm-bystrogo-kayfa', 'pornozavisimost-arhitektura', 'neyrobiologiya-minimalizma-pochemu-pustye-стенy-uspokaivayut-amigdalu']
      },
      {
        slug: 'glimfaticheskaya-sistema-kak-mozg-moet-sebya-nochyu-ot-toksinov',
        related: ['pochemu-vy-prosypaetes-ustavshim', 'temperaturnyy-rezhim-sna-pochemu-kholodnaya-komната-lechit-trevogu', 'son-i-vosstanovlenie']
      }
    ];

    const allUpdates = [...stressLinks, ...neuroLinks];

    for (const update of allUpdates) {
      await client.query(
        "UPDATE runpsy_articles SET related_slugs = $1::jsonb WHERE slug = $2",
        [JSON.stringify(update.related), update.slug]
      );
      console.log(`Updated related articles for: ${update.slug}`);
    }

    await client.query("COMMIT");
    console.log("\nInternal linking updates completed successfully.");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

updateLinks();
