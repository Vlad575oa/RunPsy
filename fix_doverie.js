const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://cloud_user:B%25ULaA9vQOO3@159.194.202.29:5432/psy?sslmode=disable&connect_timeout=10' });

async function run() {
  const res = await pool.query("SELECT sections FROM runpsy_articles WHERE slug = 'kak-vosstanovit-doverie-posle-lzhi'");
  const sections = res.rows[0].sections;

  const pochemu = {
    title: 'Почему это происходит',
    paragraphs: [
      'Доверие — это нейронная предсказуемость. Мозг строит модель партнёра: как он ведёт себя, что говорит, чего ожидать. Ложь разрушает эту модель. После обмана мозг буквально не знает, каким данным можно верить. Он переходит в режим повышенной бдительности — и остаётся в нём.',
      'Исследования Джона Готтмана показывают: доверие строится через маленькие ежедневные моменты «поворота к партнёру» — и разрушается не одним большим событием, а накопленным пренебрежением или обманом. Восстановление требует того же: не одного жеста, а системы последовательных малых действий.',
      'Нейробиологически: окситоцин — гормон доверия и привязанности — вырабатывается в ответ на предсказуемость и безопасность. После предательства его уровень падает. Восстановление доверия — это буквально восстановление нейрохимического фона через новый опыт надёжности.'
    ]
  };

  const chto = {
    title: 'Что помогает',
    paragraphs: [
      'Полная прозрачность от обманувшего: не объяснения и оправдания, а открытый доступ к информации, которая раньше скрывалась. Это не наказание — это условие восстановления предсказуемости.',
      'Называние конкретных обязательств: «Я буду сообщать, если задерживаюсь», «Я готов(а) отвечать на вопросы» — не общие обещания «я изменюсь», а конкретные поведенческие договорённости.',
      'Для пострадавшего: работа с тревогой отдельно от контроля. Проверки и слежка дают временное облегчение, но не восстанавливают доверие — они закрепляют гипербдительность. Нужно учиться переносить неопределённость постепенно.'
    ]
  };

  // Insert after "Точка боли + Пример"
  const idx1 = sections.findIndex(s => s.title.startsWith('Точка боли'));
  sections.splice(idx1 + 1, 0, pochemu);

  // Insert before "Плохие советы"
  const idx2 = sections.findIndex(s => s.title.startsWith('Плохие советы'));
  sections.splice(idx2, 0, chto);

  await pool.query("UPDATE runpsy_articles SET sections = $1 WHERE slug = 'kak-vosstanovit-doverie-posle-lzhi'", [JSON.stringify(sections)]);
  console.log('Fixed: kak-vosstanovit-doverie-posle-lzhi - now', sections.length, 'sections');
  pool.end();
}

run().catch(e => { console.error(e.message); pool.end(); });
