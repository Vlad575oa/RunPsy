import fs from 'fs';

const content = fs.readFileSync('src/lib/content.ts', 'utf-8');

const toDelete = [
  'pochemu-muzhchina-otdalyaetsya',
  'pochemu-zhenshchina-ohladela',
  'kak-perezhit-rasstavanie',
  'kak-otpustit-cheloveka',
  'toksichnye-otnosheniya-12-priznakov',
  'sozavisimost-kak-vyyti',
  'kak-vosstanovit-doverie-posle-lzhi',
  'chto-delat-posle-izmeny',
  'kak-perestat-revnovat',
  'emocionalnoe-onemenie',
  'kak-otdyhat-bez-viny'
];

// This is a bit complex to do with regex reliably on 3.5k lines.
// I'll just use the replace tool for the specific articles the user provided.

const updatedArticle2 = {
    title: "Почему партнер отдаляется: биология «безопасного расстояния»",
    slug: "pochemu-partner-otdalyaetsya",
    category: "relationships",
    priority: "high",
    intent: "кризисный",
    tags: ["партнёр отдаляется", "дистанция", "амигдала"],
    angle: "отдаление — это биологический маневр для восстановления личных границ, а не всегда потеря любви",
    signals: ["вы тянетесь, он выстраивает стены", "уход в видеоигры или работу", "холодная вежливость"],
    firstStep: "дайте партнеру 40 минут полного пространства без проверки реакций",
    avoid: "не устраивайте серьезных разговоров, когда амигдала партнера в режиме защиты",
};

const newArticle3 = {
    title: "Эффект привыкания: почему мозг перестает видеть любимого человека",
    slug: "effekt-privykaniya",
    category: "relationships",
    priority: "medium",
    intent: "информационный",
    tags: ["привыкание", "дофамин", "отношения"],
    angle: "гедонистическая адаптация — это механизм экономии энергии, а не признак угасания любви",
    signals: ["партнер стал предсказуемым", "скучно проводить время вместе", "внимание переключается на внешние стимулы"],
    firstStep: "внесите один элемент новизны в привычный ритуал",
    avoid: "не ждите, что страсть вернется сама без изменения сценариев",
};

const newArticle4 = {
    title: "Нейрохимия отчуждения: когда «мы» превращается в «я»",
    slug: "neyrokhimiya-otchuzhdeniya",
    category: "relationships",
    priority: "high",
    intent: "кризисный",
    tags: ["отчуждение", "эмпатия", "отношения"],
    angle: "отчуждение — это защитный файрвол мозга против накопленной эмоциональной боли",
    signals: ["вы больше не чувствуете резонанса с партнером", "желание утешать исчезло", "присутствие другого раздражает"],
    firstStep: "сделайте один микро-жест безопасности без ожидания взаимности",
    avoid: "не пытайтесь решить всё через один тяжелый разговор",
};
