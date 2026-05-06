const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://cloud_user:B%25ULaA9vQOO3@159.194.202.29:5432/psy?sslmode=disable&connect_timeout=10' });

const slugs = [
  'seriya-alhimiya-vlyublennost',
  'kak-vosstanovit-doverie-posle-lzhi',
  'vybor-ne-tekh-travma',
  'illyuziya-togo-samogo-spasitel',
  'effekt-kulidzha-novizna'
];

const canonicalOrder = [
  'Суть за 30 секунд',
  'Точка боли',
  'Почему это происходит',
  'Исследования',
  'Плохие советы',
  'Что помогает',
  'Микро-действие',
  'Конструктор диалогов',
  'Сценарии 50/50',
  'Чек-лист',
  'Когда нужен специалист',
  'Итог'
];

async function run() {
  for (const slug of slugs) {
    const res = await pool.query('SELECT sections FROM runpsy_articles WHERE slug = $1', [slug]);
    const sections = res.rows[0].sections;
    const cleaned = sections.filter(s => s.title !== 'Why it happens' && s.title !== 'What helps');
    cleaned.sort((a, b) => {
      const ai = canonicalOrder.findIndex(c => a.title.startsWith(c));
      const bi = canonicalOrder.findIndex(c => b.title.startsWith(c));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    await pool.query('UPDATE runpsy_articles SET sections = $1 WHERE slug = $2', [JSON.stringify(cleaned), slug]);
    console.log('Fixed:', slug, '- now', cleaned.length, 'sections');
  }
  pool.end();
}

run().catch(e => { console.error(e.message); pool.end(); });
