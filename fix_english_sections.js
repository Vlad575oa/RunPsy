const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://cloud_user:B%25ULaA9vQOO3@159.194.202.29:5432/psy?sslmode=disable&connect_timeout=10' });

// Fix English-named duplicate sections in any category
const args = process.argv.slice(2);
const category = args[0];

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
  const where = category ? `WHERE category_slug = '${category}'` : '';
  const res = await pool.query(`SELECT slug, sections FROM runpsy_articles ${where}`);
  let fixedCount = 0;
  for (const row of res.rows) {
    const hasEnglish = row.sections.some(s => s.title === 'Why it happens' || s.title === 'What helps');
    if (!hasEnglish) continue;
    const cleaned = row.sections.filter(s => s.title !== 'Why it happens' && s.title !== 'What helps');
    cleaned.sort((a, b) => {
      const ai = canonicalOrder.findIndex(c => a.title.startsWith(c));
      const bi = canonicalOrder.findIndex(c => b.title.startsWith(c));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    await pool.query('UPDATE runpsy_articles SET sections = $1 WHERE slug = $2', [JSON.stringify(cleaned), row.slug]);
    console.log('Fixed:', row.slug, '->', cleaned.length, 'sections');
    fixedCount++;
  }
  console.log('Total fixed:', fixedCount);
  pool.end();
}

run().catch(e => { console.error(e.message); pool.end(); });
