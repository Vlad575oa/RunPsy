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

async function prepareOptimization() {
  loadLocalEnv();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // 1. Get long titles
    const titleRes = await client.query(
      "SELECT slug, seo_title FROM runpsy_articles WHERE length(seo_title) > 70 AND status = 'published'"
    );

    console.log("=== 24 OPTIMIZED TITLES ===");
    const optimizations = titleRes.rows.map(row => {
        let newTitle = row.seo_title.split('|')[0].trim();
        if (newTitle.length > 65) {
             newTitle = newTitle.replace('Блуждающий нерв и ЖКТ: почему «бабочки в животе» — это не всегда про любовь', 'Блуждающий нерв и ЖКТ: почему бабочки в животе — не любовь')
                               .replace('Нейробиология отказа: почему слово «Нет» вызывает физическую боль', 'Нейробиология отказа: почему слово «Нет» вызывает боль')
                               .replace('Эффект свидетеля: почему мы ждем помощи от других и не помогаем сами', 'Эффект свидетеля: почему мы не помогаем другим сами')
                               .replace('Кошмары как дефрагментация: зачем амигдала проигрывает страшные сценарии во сне', 'Зачем снятся кошмары: роль амигдалы и дефрагментация сна')
                               .replace('Психология цвета в интерфейсах и быту: как оттенки меняют уровень дофамина', 'Психология цвета: как оттенки меняют уровень дофамина')
                               .replace('Биология горя: что происходит с мозгом при утрате и как не застрять в ней', 'Биология горя: что происходит с мозгом и как пережить утрату')
                               .replace('Выгорание как биологический предохранитель: когда «пробки» выбивает навсегда', 'Выгорание как биологический предохранитель: причины и риски')
                               .replace('Эффект онлайн-растормаживания: почему люди становятся агрессивными в комментариях', 'Почему люди агрессивны в сети: эффект онлайн-растормаживания')
                               .replace('Осанка и уверенность: как положение позвоночника меняет уровень тестостерона', 'Осанка и уверенность: как положение тела меняет тестостерон')
                               .replace('Личные границы как иммунитет: что происходит с мозгом при их нарушении', 'Личные границы как иммунитет: влияние на мозг и психику')
                               .replace('Страх смерти и дофамин: почему мы рискуем, когда боимся бессмысленности', 'Страх смерти и дофамин: почему мы рискуем при экзистенц. болях')
                               .replace('Токсичная продуктивность: когда саморазвитие становится формой насилия', 'Токсичная продуктивность: когда саморазвитие — форма насилия');
        }
        return { slug: row.slug, old: row.seo_title, new: newTitle };
    });
    
    optimizations.forEach(opt => {
        console.log(`Slug: ${opt.slug}`);
        console.log(`Old (${opt.old.length}): ${opt.old}`);
        console.log(`New (${opt.new.length}): ${opt.new}`);
        console.log("---");
    });

  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

prepareOptimization();
