import { editorialPlanSeeds } from "./editorial-plan-seeds.generated";
import type { Article, Author, Category } from "@/types/article";

export const authors: Author[] = [
  {
    slug: "runpsy-editorial-team",
    name: "Редакция RunPsy",
    role: "Команда экспертов",
    bio: "Практикующие психологи и нейробиологи, специализирующиеся на доказательном подходе.",
    credentials: ["PhD", "MSc", "Clinical Psychology"],
  },
];

export const categories: Category[] = [
  {
    slug: "relationships",
    title: "Отношения",
    shortDescription: "Динамика пары, близость и охлаждение.",
    seoTitle: "Психология отношений: статьи и практики | RunPsy",
    metaDescription: "Разбор механизмов близости, конфликтов и привязанности с точки зрения нейробиологии.",
    seedIdeas: ["Почему партнер отдаляется", "Эффект привыкания", "Химия влечения"],
  },
  {
    slug: "breakup-recovery",
    title: "Разрыв и восстановление",
    shortDescription: "Как пережить расставание и вернуть опору.",
    seoTitle: "Как пережить расставание: помощь и восстановление | RunPsy",
    metaDescription: "Пошаговые протоколы выхода из тяжелых отношений и реабилитация после разрыва.",
    seedIdeas: ["Как пережить расставание", "Искусство отпускать", "Синдром бывших"],
  },
  {
    slug: "boundaries-and-communication",
    title: "Границы и общение",
    shortDescription: "Навыки диалога и защита своего «Я».",
    seoTitle: "Личные границы и коммуникация в паре | RunPsy",
    metaDescription: "Как говорить о чувствах, выстраивать границы и противостоять манипуляциям.",
    seedIdeas: ["Личные границы в паре", "Как говорить о чувствах", "Манипуляции"],
  },
  {
    slug: "anxiety-and-stress",
    title: "Тревога и стресс",
    shortDescription: "Саморегуляция и работа с выгоранием.",
    seoTitle: "Как справиться с тревогой и стрессом | RunPsy",
    metaDescription: "Техники заземления, нейробиология паники и методы борьбы с хроническим стрессом.",
    seedIdeas: ["Как остановить паническую атаку", "Хронический стресс", "Выгорание"],
  },
  {
    slug: "habits-and-motivation",
    title: "Привычки и дофамин",
    shortDescription: "Дисциплина и перепрошивка мотивации.",
    seoTitle: "Продуктивность и привычки: нейробиологический подход | RunPsy",
    metaDescription: "Как внедрять привычки, бороться с прокрастинацией и управлять дофамином.",
    seedIdeas: ["Дофаминовая ловушка", "Дисциплина без насилия", "Прокрастинация"],
  },
  {
    slug: "family-and-parenting",
    title: "Семья и дети",
    shortDescription: "Воспитание без крика и сепарация.",
    seoTitle: "Психология семьи и воспитания детей | RunPsy",
    metaDescription: "Статьи про родительское выгорание, подростковые кризисы и здоровую сепарацию.",
    seedIdeas: ["Истерики ребенка", "Материнское выгорание", "Сепарация от родителей"],
  },
];

type ArticleSeed = {
  title: string;
  slug: string;
  category: Category["slug"];
  priority: "high" | "medium" | "low";
  intent: Article["intent"];
  tags: string[];
  angle: string;
  signals: string[];
  firstStep: string;
  avoid: string;
  safetyNote?: string;
};

// Хранилище семян статей теперь пустое в коде, так как данные перенесены в PostgreSQL.
// Новые статьи добавляются напрямую в БД через скрипты.
const articleSeeds: ArticleSeed[] = [];

const allArticleSeeds: ArticleSeed[] = [
  ...articleSeeds,
  ...editorialPlanSeeds.filter((seed) => !articleSeeds.some((localSeed) => localSeed.slug === seed.slug)),
];

function priorityReadingTime(priority: ArticleSeed["priority"]) {
  if (priority === "high") return "10 мин";
  if (priority === "medium") return "8 мин";
  return "6 мин";
}

function makeSections(seed: ArticleSeed): Article["sections"] {
  return [
    { title: "Суть за 30 секунд", paragraphs: [`Краткий разбор темы: ${seed.angle}.`] },
    { title: "Точка боли", paragraphs: [seed.signals[0] ?? "Описание проблемы."] },
    { title: "Что помогает", paragraphs: [seed.firstStep] },
    { title: "Плохие советы", paragraphs: [seed.avoid] },
  ];
}

function makeFaq(seed: ArticleSeed): Article["faq"] {
  return [{ question: `Как начать работу с темой ${seed.title}?`, answer: seed.firstStep }];
}

function makeQuiz(seed: ArticleSeed): Article["quiz"] {
  return {
    title: `Тест: ${seed.title}`,
    description: "Проверьте свое состояние",
    questions: [
      {
        id: "q1",
        question: "Чувствуете ли вы необходимость перемен?",
        options: [
          { id: "a", text: "Да, определенно", score: 1 },
          { id: "b", text: "Пока не уверен(а)", score: 0 },
        ],
      },
    ],
    results: [
      { score: 0, text: "Вам стоит изучить теорию." },
      { score: 1, text: "Рекомендуется перейти к практике." },
    ],
  };
}

function makeInsightImpulse(seed: ArticleSeed): Article["insightImpulse"] {
  return {
    visualMetaphor: {
      description: "Образ для закрепления",
      imagePrompt: `Minimalist metaphor for ${seed.slug}`,
    },
    twoSides: {
      firstTitle: "Как ощущается сейчас",
      secondTitle: "Как может быть",
      firstItems: seed.signals,
      secondItems: [seed.firstStep],
    },
  };
}

type ArticleOverride = Partial<Omit<Article, "slug" | "category">> & {
  introduction?: string;
};

// Переопределения теперь также пусты, так как полные тексты живут в БД.
const articleOverrides: Partial<Record<string, ArticleOverride>> = {};

export const articles: Article[] = allArticleSeeds.map((seed, index) => {
  const override = articleOverrides[seed.slug];
  const readingTime = override?.readingTime ?? priorityReadingTime(seed.priority);

  return {
    slug: seed.slug,
    title: override?.title ?? seed.title,
    description: override?.description ?? `Статья про ${seed.title.toLowerCase()}: ${seed.angle}`,
    date: override?.date ?? "2026-05-04",
    updated: override?.updated,
    author: authors[0].name,
    category: seed.category,
    tags: override?.tags ?? seed.tags,
    readingTime,
    heroImage: override?.heroImage,
    seoTitle: override?.seoTitle ?? `${seed.title} | RunPsy`,
    seoDescription: override?.seoDescription ?? seed.angle,
    status: (override?.status as Article["status"]) ?? "published",
    intent: seed.intent,
    cta: override?.cta ?? seed.firstStep,
    safetyNote: seed.safetyNote ?? override?.safetyNote,
    introduction: override?.introduction,
    relatedSlugs: override?.relatedSlugs ?? [],
    insightImpulse: makeInsightImpulse(seed),
    sections: override?.sections ?? makeSections(seed),
    faq: override?.faq ?? makeFaq(seed),
    quiz: override?.quiz ?? makeQuiz(seed),
  };
});
