"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Plus, Trash2, ExternalLink, Save } from "lucide-react";

type Section = { title: string; paragraphs: string[] };
type FAQ = { question: string; answer: string };
type QuizQuestion = { id?: string; question: string; options: string[] };

type ArticleData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string | null;
  author_slug: string;
  category_slug: string;
  tags: string[];
  reading_time: string;
  hero_image: string | null;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published";
  intent: "кризисный" | "эмоциональный" | "информационный";
  cta: string;
  safety_note: string | null;
  introduction: string | null;
  sections: Section[];
  faq: FAQ[];
  quiz: {
    title: string;
    description: string;
    questions: QuizQuestion[];
    results?: { score: number; text: string }[];
    resultNote?: string;
  } | null;
};

type Category = { slug: string; title: string };

type Props = { article: ArticleData; categories: Category[] };

const TABS = ["Основное", "SEO", "Разделы", "FAQ & Квиз"] as const;
type Tab = (typeof TABS)[number];

export default function ArticleEditForm({ article, categories }: Props) {
  const [tab, setTab] = useState<Tab>("Основное");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Basic fields
  const [title, setTitle] = useState(article.title ?? "");
  const [description, setDescription] = useState(article.description ?? "");
  const [status, setStatus] = useState<"draft" | "published">(article.status ?? "draft");
  const [intent, setIntent] = useState(article.intent ?? "информационный");
  const [categorySlug, setCategorySlug] = useState(article.category_slug ?? "");
  const [readingTime, setReadingTime] = useState(article.reading_time ?? "");
  const [heroImage, setHeroImage] = useState(article.hero_image ?? "");
  const [cta, setCta] = useState(article.cta ?? "");
  const [safetyNote, setSafetyNote] = useState(article.safety_note ?? "");
  const [introduction, setIntroduction] = useState(article.introduction ?? "");
  const [tagsInput, setTagsInput] = useState((article.tags ?? []).join(", "));

  // SEO
  const [seoTitle, setSeoTitle] = useState(article.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(article.seo_description ?? "");

  // Sections
  const [sections, setSections] = useState<Section[]>(
    Array.isArray(article.sections) ? article.sections : []
  );

  // FAQ
  const [faq, setFaq] = useState<FAQ[]>(Array.isArray(article.faq) ? article.faq : []);

  // Quiz
  const initQuiz = article.quiz ?? { title: "", description: "", questions: [] };
  const [quizTitle, setQuizTitle] = useState(initQuiz.title ?? "");
  const [quizDescription, setQuizDescription] = useState(initQuiz.description ?? "");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    initQuiz.questions ?? []
  );

  // --- Sections helpers ---
  function updateSectionTitle(idx: number, val: string) {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, title: val } : s)));
  }
  function updateParagraph(si: number, pi: number, val: string) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? { ...s, paragraphs: s.paragraphs.map((p, j) => (j === pi ? val : p)) }
          : s
      )
    );
  }
  function addParagraph(si: number) {
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, paragraphs: [...s.paragraphs, ""] } : s))
    );
  }
  function removeParagraph(si: number, pi: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, paragraphs: s.paragraphs.filter((_, j) => j !== pi) } : s
      )
    );
  }
  function addSection() {
    setSections((prev) => [...prev, { title: "", paragraphs: [""] }]);
  }
  function removeSection(idx: number) {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  }
  function moveSection(idx: number, dir: -1 | 1) {
    setSections((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  // --- FAQ helpers ---
  function updateFaq(idx: number, field: "question" | "answer", val: string) {
    setFaq((prev) => prev.map((f, i) => (i === idx ? { ...f, [field]: val } : f)));
  }
  function addFaq() {
    setFaq((prev) => [...prev, { question: "", answer: "" }]);
  }
  function removeFaq(idx: number) {
    setFaq((prev) => prev.filter((_, i) => i !== idx));
  }

  // --- Quiz helpers ---
  function updateQuizQuestion(idx: number, field: "question", val: string) {
    setQuizQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: val } : q)));
  }
  function updateQuizOptions(idx: number, val: string) {
    const opts = val.split(",").map((s) => s.trim());
    setQuizQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, options: opts } : q)));
  }
  function addQuizQuestion() {
    setQuizQuestions((prev) => [...prev, { question: "", options: [] }]);
  }
  function removeQuizQuestion(idx: number) {
    setQuizQuestions((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const body = {
        title,
        description,
        status,
        intent,
        category_slug: categorySlug,
        reading_time: readingTime,
        hero_image: heroImage || null,
        cta,
        safety_note: safetyNote || null,
        introduction: introduction || null,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        seo_title: seoTitle,
        seo_description: seoDescription,
        sections,
        faq,
        quiz: {
          title: quizTitle,
          description: quizDescription,
          questions: quizQuestions,
        },
      };

      const res = await fetch(`/api/admin/articles/${article.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Статья сохранена" });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: data.error ?? "Ошибка сохранения" });
      }
    } catch {
      setMessage({ type: "error", text: "Ошибка соединения" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 line-clamp-2">{title || article.slug}</h1>
          <p className="text-sm text-slate-400 mt-1">{article.slug}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`/articles/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Открыть статью
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ background: "#3b82f6" }}
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Сохранить
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Tab: Основное */}
        {tab === "Основное" && (
          <div className="space-y-5">
            <Field label="Заголовок">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Описание">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Статус">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className={inputCls}
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                </select>
              </Field>
              <Field label="Интент">
                <select
                  value={intent}
                  onChange={(e) => setIntent(e.target.value as ArticleData["intent"])}
                  className={inputCls}
                >
                  <option value="кризисный">кризисный</option>
                  <option value="эмоциональный">эмоциональный</option>
                  <option value="информационный">информационный</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Категория">
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className={inputCls}
                >
                  <option value="">— выберите —</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Время чтения">
                <input
                  type="text"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className={inputCls}
                  placeholder="5 мин"
                />
              </Field>
            </div>
            <Field label="Hero Image (URL)">
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Теги (через запятую)">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Введение">
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                rows={4}
                className={inputCls}
              />
            </Field>
            <Field label="CTA">
              <textarea
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                rows={3}
                className={inputCls}
              />
            </Field>
            <Field label="Safety Note">
              <textarea
                value={safetyNote}
                onChange={(e) => setSafetyNote(e.target.value)}
                rows={3}
                className={inputCls}
              />
            </Field>
          </div>
        )}

        {/* Tab: SEO */}
        {tab === "SEO" && (
          <div className="space-y-5">
            <Field label="SEO Title">
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="SEO Description">
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={4}
                className={inputCls}
              />
            </Field>
          </div>
        )}

        {/* Tab: Разделы */}
        {tab === "Разделы" && (
          <div className="space-y-6">
            {sections.map((section, si) => (
              <div key={si} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Раздел {si + 1}</span>
                  <div className="flex-1" />
                  <button
                    onClick={() => moveSection(si, -1)}
                    disabled={si === 0}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => moveSection(si, 1)}
                    disabled={si === sections.length - 1}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => removeSection(si)}
                    className="p-1 rounded hover:bg-red-50 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(si, e.target.value)}
                  placeholder="Заголовок раздела"
                  className={`${inputCls} mb-3 font-medium`}
                />
                <div className="space-y-2">
                  {section.paragraphs.map((p, pi) => (
                    <div key={pi} className="flex gap-2">
                      <textarea
                        value={p}
                        onChange={(e) => updateParagraph(si, pi, e.target.value)}
                        rows={3}
                        placeholder={`Параграф ${pi + 1}`}
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        onClick={() => removeParagraph(si, pi)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-400 self-start mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addParagraph(si)}
                  className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Добавить параграф
                </button>
              </div>
            ))}
            <button
              onClick={addSection}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Добавить раздел
            </button>
          </div>
        )}

        {/* Tab: FAQ & Квиз */}
        {tab === "FAQ & Квиз" && (
          <div className="space-y-8">
            {/* FAQ */}
            <div>
              <h3 className="text-base font-semibold text-slate-700 mb-4">FAQ</h3>
              <div className="space-y-4">
                {faq.map((item, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase">
                        Вопрос {i + 1}
                      </span>
                      <button
                        onClick={() => removeFaq(i)}
                        className="p-1 rounded hover:bg-red-50 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFaq(i, "question", e.target.value)}
                      placeholder="Вопрос"
                      className={`${inputCls} mb-2`}
                    />
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      rows={3}
                      placeholder="Ответ"
                      className={inputCls}
                    />
                  </div>
                ))}
                <button
                  onClick={addFaq}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Добавить вопрос
                </button>
              </div>
            </div>

            {/* Quiz */}
            <div>
              <h3 className="text-base font-semibold text-slate-700 mb-4">Квиз</h3>
              <div className="space-y-4">
                <Field label="Название квиза">
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Описание квиза">
                  <textarea
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    rows={3}
                    className={inputCls}
                  />
                </Field>
                <div className="space-y-3">
                  <span className="text-sm font-medium text-slate-600">Вопросы</span>
                  {quizQuestions.map((q, qi) => (
                    <div key={qi} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-slate-400 uppercase">
                          Вопрос {qi + 1}
                        </span>
                        <button
                          onClick={() => removeQuizQuestion(qi)}
                          className="p-1 rounded hover:bg-red-50 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuizQuestion(qi, "question", e.target.value)}
                        placeholder="Вопрос"
                        className={`${inputCls} mb-2`}
                      />
                      <input
                        type="text"
                        value={Array.isArray(q.options) ? q.options.join(", ") : ""}
                        onChange={(e) => updateQuizOptions(qi, e.target.value)}
                        placeholder="Варианты через запятую"
                        className={inputCls}
                      />
                    </div>
                  ))}
                  <button
                    onClick={addQuizQuestion}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Добавить вопрос квиза
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";
