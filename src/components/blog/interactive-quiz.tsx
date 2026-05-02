"use client";

import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { ArticleQuiz } from "@/types/article";

type InteractiveQuizProps = {
  slug: string;
  quiz: ArticleQuiz;
};

export function InteractiveQuiz({ slug, quiz }: InteractiveQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const allAnswered = answeredQuestions === totalQuestions;

  const result = useMemo(() => {
    if (!submitted || !allAnswered) return null;

    const bucketCount = Math.max(3, ...quiz.questions.map((question) => question.options.length));
    const scores = Array.from({ length: bucketCount }, () => 0);

    Object.values(answers).forEach((optionIndex) => {
      if (scores[optionIndex] !== undefined) {
        scores[optionIndex] += 1;
      }
    });

    const maxScore = Math.max(...scores);
    const leaders = scores
      .map((score, index) => ({ score, index }))
      .filter((item) => item.score === maxScore && item.score > 0)
      .map((item) => item.index);

    if (leaders.length !== 1) {
      return {
        title: "Смешанный профиль",
        details: `Тест показал сразу несколько равных паттернов. Это нормально: в вашей ситуации сочетаются разные реакции.`,
        recommendation: "Начните с базового шага: стабилизируйте себя и выберите один короткий разговор вместо большого эмоционального разбора.",
      };
    }

    const leader = leaders[0];
    const confidence = Math.round((maxScore / totalQuestions) * 100);

    if (leader === 0) {
      return {
        title: "Преобладает тревога потери",
        details: `Тест показал, что чаще включается тревожный сценарий (${confidence}% ответов в этом паттерне).`,
        recommendation: "Сначала снизьте напряжение в теле, затем формулируйте одну ясную просьбу без контроля и проверок.",
      };
    }

    if (leader === 1) {
      return {
        title: "Преобладает обида и напряжение",
        details: `Тест показал, что вы чаще реагируете через накопленную обиду (${confidence}% ответов в этом паттерне).`,
        recommendation: "Сфокусируйтесь на границе и формате разговора: коротко обозначьте, что с вами так нельзя, и предложите конструктивную альтернативу.",
      };
    }

    return {
      title: "Преобладает неясность и перегруз",
      details: `Тест показал, что сейчас больше всего мешает неопределенность (${confidence}% ответов в этом паттерне).`,
      recommendation: "Вернитесь к фактам: выпишите, что уже ясно, и выберите один следующий шаг на ближайшие 24 часа.",
    };
  }, [answers, allAnswered, quiz.questions, submitted, totalQuestions]);

  function onSelect(questionIndex: number, optionIndex: number) {
    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex,
    }));
    if (submitted) setSubmitted(false);
  }

  function onSubmit() {
    setSubmitted(true);
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6">
      <details className="group">
        <summary className="cursor-pointer list-none rounded-xl bg-white px-4 py-3 text-left marker:content-none">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-[var(--accent-deep)] transition-transform duration-200 group-open:rotate-90" />
            <h2 className="font-serif text-2xl">{quiz.title}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{quiz.description}</p>
        </summary>

        <div className="mt-5 space-y-5">
          {quiz.questions.map((question, questionIndex) => (
            <fieldset key={question.question} className="rounded-xl border border-[var(--line)] bg-white p-4">
              <legend className="px-1 text-sm font-semibold">{question.question}</legend>
              <div className="mt-3 grid gap-2">
                {question.options.map((option, optionIndex) => (
                  <label key={option} className="flex items-start gap-3 rounded-xl bg-[var(--bg)] px-3 py-2 text-sm leading-6 text-[var(--text-soft)]">
                    <input
                      className="mt-1 accent-[var(--accent)]"
                      type="radio"
                      name={`${slug}-quiz-${questionIndex}`}
                      value={optionIndex}
                      checked={answers[questionIndex] === optionIndex}
                      onChange={() => onSelect(questionIndex, optionIndex)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Показать результат
          </button>
          <p className="text-sm text-[var(--text-soft)]">
            Отвечено: {answeredQuestions} из {totalQuestions}
          </p>
        </div>

        {!allAnswered && submitted ? (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-[var(--accent-deep)]">
            Чтобы получить точный результат, отметьте ответы на все вопросы теста.
          </p>
        ) : null}

        {result ? (
          <div className="mt-4 space-y-3 rounded-xl bg-white p-4 text-sm leading-6 text-[var(--text-soft)]">
            <p className="font-semibold text-[var(--text)]">{result.title}</p>
            <p>{result.details}</p>
            <p>{result.recommendation}</p>
            <p>{quiz.resultNote}</p>
          </div>
        ) : null}
      </details>
    </section>
  );
}
