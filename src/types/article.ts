export type ArticleSection = {
  title: string;
  paragraphs: string[];
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleQuizQuestion = {
  question: string;
  options: string[];
};

export type ArticleQuiz = {
  title: string;
  description: string;
  questions: ArticleQuizQuestion[];
  resultNote: string;
};

export type ArticleDialogueOption = {
  instead: string;
  try: string;
  why: string;
};

export type ArticleInsightImpulse = {
  painPoint: string;
  essence: {
    title: string;
    text: string;
  }[];
  microAction: string;
  checklist: string[];
  dialogue: ArticleDialogueOption[];
  twoSides: {
    firstTitle: string;
    firstItems: string[];
    secondTitle: string;
    secondItems: string[];
    bridge: string;
  };
  visualMetaphor: {
    title: string;
    description: string;
  };
};

export type Article = {
  title: string;
  slug: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  heroImage?: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  intent: "кризисный" | "эмоциональный" | "информационный";
  cta: string;
  safetyNote?: string;
  introduction?: string;
  relatedSlugs: string[];
  insightImpulse: ArticleInsightImpulse;
  sections: ArticleSection[];
  faq: ArticleFaq[];
  quiz: ArticleQuiz;
};

export type Category = {
  slug: string;
  title: string;
  shortDescription: string;
  seoTitle: string;
  metaDescription: string;
  seedIdeas: string[];
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
};
