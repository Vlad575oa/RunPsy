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

async function executeUpdates() {
  loadLocalEnv();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query("BEGIN");

    console.log("1. Updating SEO Titles...");
    const titleUpdates = [
      { slug: 'bluzhdayushchiy-nerv-i-zhkt-pochemu-babochki-v-zhivote-eto-ne-vsegda-pro-lyubov', newTitle: 'Блуждающий нерв и ЖКТ: почему бабочки в животе — не любовь' },
      { slug: 'effekt-svidetelya-pochemu-my-zhdem-pomoshchi-ot-drugikh-i-ne-pomogaem-sami', newTitle: 'Эффект свидетеля: почему мы не помогаем другим сами' },
      { slug: 'koshmary-kak-defragmentatsiya-zachem-amigdala-proigryvaet-strashnye-stsenarii-vo', newTitle: 'Зачем снятся кошмары: роль амигдалы и дефрагментация сна' },
      { slug: 'psikhologiya-tsveta-v-interfeysakh-i-bytu-kak-ottenki-menyayut-uroven-dofamina', newTitle: 'Психология цвета: как оттенки меняют уровень дофамина' },
      { slug: 'biologiya-gorya-chto-proiskhodit-s-mozgom-pri-utrate-i-kak-ne-zastryat-v-ney', newTitle: 'Биология горя: что происходит с мозгом и как пережить утрату' },
      { slug: 'vygoranie-kak-biologicheskiy-predokhranitel-kogda-probki-vybivaet-navsegda', newTitle: 'Выгорание как биологический предохранитель: причины и риски' },
      { slug: 'effekt-onlayn-rastormazhivaniya-pochemu-lyudi-stanovyatsya-agressivными-v-kommen', newTitle: 'Почему люди агрессивны в сети: эффект онлайн-растормаживания' },
      { slug: 'osanka-i-uverennost-kak-polozhenie-pozvonochnika-menyaet-uroven-testosterona', newTitle: 'Осанка и уверенность: как положение тела меняет тестостерон' },
      { slug: 'lichnye-granitsy-kak-immunitet-chto-proiskhodit-s-mozgom-pri-ikh-narushenii', newTitle: 'Личные границы как иммунитет: влияние на мозг и психику' },
      { slug: 'strakh-smerti-i-dofamin-pochemu-my-riskuem-kogda-boimsya-bessmyslennosti', newTitle: 'Страх смерти и дофамин: почему мы рискуем при экзистенц. болях' },
      { slug: 'toksichnaya-produktivnost-kogda-samorazvitie-stanovitsya-formoy-nasiliya', newTitle: 'Токсичная продуктивность: когда саморазвитие — форма насилия' },
      { slug: 'neyrobiologiya-otkaza-pochemu-slovo-net-vyzyvaet-fizicheskuyu-bol', newTitle: 'Нейробиология отказа: почему слово «Нет» вызывает боль' },
      { slug: 'strakh-skazat-lyublyu', newTitle: 'Страшно сказать «я тебя люблю» первым: почему и как преодолеть' },
      { slug: 'spletni-i-sotsialnyy-kley-zachem-mozg-trebuet-obsuzhdat-drugikh', newTitle: 'Сплетни и социальный клей: зачем мозг требует обсуждать других' },
      { slug: 'glimfaticheskaya-sistema-kak-mozg-moet-sebya-nochyu-ot-toksinov', newTitle: 'Глимфатическая система: как мозг «моет» себя ночью от токсинов' },
      { slug: 'temperaturnyy-rezhim-sna-pochemu-kholodnaya-komnata-lechit-trevogu', newTitle: 'Температурный режим сна: почему холодная комната лечит тревогу' },
      { slug: 'neyrobiologiya-minimalizma-pochemu-pustye-steny-uspokaivayut-amigdalu', newTitle: 'Нейробиология минимализма: почему пустые стены успокаивают амигдалу' },
      { slug: 'zvukovoy-landshaft-belyy-shum-vs-tishina-chto-luchshe-dlya-kontsentratsii', newTitle: 'Звуковой ландшафт: белый шум vs тишина — что лучше для концентрации' },
      { slug: 'informatsionnoe-ozhirenie-kak-mozg-zakhlamlyaetsya-lishnimi-dannymi', newTitle: 'Информационное ожирение: как мозг захламляется лишними данными' },
      { slug: 'dykhanie-kak-pult-upravleniya-4-protokola-dlya-raznykh-sostoyaniy', newTitle: 'Дыхание как пульт управления: 4 протокола для разных состояний' },
      { slug: 'melatoninovaya-yama-pochemu-svet-smartfona-ubivaet-zavtrashniy-den', newTitle: 'Мелатониновая яма: почему свет смартфона убивает завтрашний день' },
      { slug: 'prizrachnye-uvedomleniya-pochemu-nam-kazhetsya-chto-telefon-vibriruet', newTitle: 'Призрачные уведомления: почему нам кажется, что телефон вибрирует' },
      { slug: 'algoritmicheskaya-polyarizatsiya-kak-lenta-novostey-delaet-nas-radikalami', newTitle: 'Алгоритмическая поляризация: как лента новостей делает нас радикалами' },
      { slug: 'svet-i-kognitivnye-sposobnosti-kak-estestvennoe-osveshchenie-menyaet-iq', newTitle: 'Свет и когнитивные способности: как естественное освещение меняет IQ' }
    ];

    for (const opt of titleUpdates) {
      await client.query(
        "UPDATE runpsy_articles SET seo_title = $1 WHERE slug = $2",
        [opt.newTitle, opt.slug]
      );
    }
    console.log(`Updated ${titleUpdates.length} SEO titles.`);

    console.log("2. Consolidating Categories...");
    const categoryMapping: Record<string, string[]> = {
      'relationships': ['attachment-and-intimacy', 'male-female-psychology', 'sex-as-protection'],
      'breakup-recovery': ['crises-and-breakups', 'crisis-management'],
      'boundaries-and-communication': ['couple-boundaries', 'boundaries-and-social'],
      'anxiety-and-stress': ['burnout-and-energy', 'psychosomatics'],
      'habits-and-motivation': ['social-ident', 'emotional-maturity'],
      'neurobiology': ['neuro-detox', 'digital-hygiene-2026', 'sleep-architecture', 'neuro-aesthetics']
    };

    // First, ensure the 'neurobiology' category exists (others likely do based on audit)
    await client.query(`
      INSERT INTO runpsy_categories (slug, title, short_description, seo_title, meta_description, sort_order)
      VALUES ('neurobiology', 'Нейробиология и мозг', 'Как работает наш мозг и как это влияет на жизнь.', 'Нейробиология и психология мозга | RunPsy', 'Статьи о нейробиологии, цифровой гигиене и архитектуре сна.', 10)
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    `);

    // Update titles for consolidated categories
    const categoryTitles: Record<string, string> = {
        'relationships': 'Отношения и близость',
        'breakup-recovery': 'Кризисы и расставания',
        'boundaries-and-communication': 'Личные границы',
        'anxiety-and-stress': 'Стресс и выгорание',
        'habits-and-motivation': 'Саморазвитие и привычки'
    };

    for (const [slug, title] of Object.entries(categoryTitles)) {
        await client.query("UPDATE runpsy_categories SET title = $1 WHERE slug = $2", [title, slug]);
    }

    // Remap articles
    for (const [target, sources] of Object.entries(categoryMapping)) {
      const res = await client.query(
        "UPDATE runpsy_articles SET category_slug = $1 WHERE category_slug = ANY($2)",
        [target, sources]
      );
      console.log(`Moved articles from [${sources.join(', ')}] to ${target} (${res.rowCount} articles).`);
    }

    // Clean up empty categories
    const allSources = Object.values(categoryMapping).flat();
    await client.query("DELETE FROM runpsy_categories WHERE slug = ANY($1)", [allSources]);
    console.log("Cleaned up old categories.");

    await client.query("COMMIT");
    console.log("All updates committed successfully.");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database error:", error);
  } finally {
    await client.end();
  }
}

executeUpdates();
