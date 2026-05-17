"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import type { PsychologyTest } from "@/lib/tests-content";
import { resultMeta } from "@/lib/result-meta";

/* ─── helpers ─────────────────────────────────────────────────── */

const STAGE_LABELS: Record<string, "A" | "B" | "C"> = {
  "Состояние сейчас": "A",
  "Устойчивый паттерн": "B",
  "Контекст-триггеры": "C",
};

const STAGE_NAMES = {
  A: "Состояние сейчас",
  B: "Устойчивый паттерн",
  C: "Контекст-триггеры",
};

function parseQ(raw: string): { stage: "A" | "B" | "C" | null; text: string } {
  const m = raw.match(/^\[([^\]]+)\]\s*/);
  if (m) {
    const stage = STAGE_LABELS[m[1]] ?? null;
    return { stage, text: raw.slice(m[0].length) };
  }
  return { stage: null, text: raw };
}

function stageOf(raw: string): "A" | "B" | "C" | null {
  return parseQ(raw).stage;
}

function getStageForIndex(questions: string[], index: number): "A" | "B" | "C" {
  const hasTags = questions.some((q) => stageOf(q) !== null);
  if (!hasTags) return "A";
  const stage = stageOf(questions[index]);
  if (stage) return stage;
  // fallback: split evenly
  const third = Math.floor(questions.length / 3);
  if (index < third) return "A";
  if (index < third * 2) return "B";
  return "C";
}

type Phase = "intro" | "quiz" | "loading" | "result";

const answerOptions = [
  { label: "Совсем не про меня", value: 1 },
  { label: "Скорее не про меня", value: 2 },
  { label: "Иногда про меня", value: 3 },
  { label: "Часто про меня", value: 4 },
  { label: "Очень похоже на меня", value: 5 },
];

const LOADING_STEPS = [
  "Собираем вашу 3D-карту…",
  "Определяем главный триггер…",
  "Находим устойчивый паттерн…",
  "Подбираем маршрут на 72 часа…",
  "Формируем ваш профиль…",
];

/* ─── Triangle 3D widget ──────────────────────────────────────── */

function TriangleWidget({ a, b, c }: { a: number; b: number; c: number }) {
  const SIZE = 180;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = 66;

  // equilateral triangle vertices (top = A, bottom-left = B, bottom-right = C)
  const vA = { x: cx, y: cy - R };
  const vB = { x: cx - R * Math.sin((Math.PI * 2) / 3), y: cy + R * 0.5 };
  const vC = { x: cx + R * Math.sin((Math.PI * 2) / 3), y: cy + R * 0.5 };

  const sa = a / 100;
  const sb = b / 100;
  const sc = c / 100;
  const tot = sa + sb + sc || 0.001;

  const ux = (vA.x * sa + vB.x * sb + vC.x * sc) / tot;
  const uy = (vA.y * sa + vB.y * sb + vC.y * sc) / tot;

  // inner filled triangle (user profile)
  const innerA = { x: cx + (vA.x - cx) * sa, y: cy + (vA.y - cy) * sa };
  const innerB = { x: cx + (vB.x - cx) * sb, y: cy + (vB.y - cy) * sb };
  const innerC = { x: cx + (vC.x - cx) * sc, y: cy + (vC.y - cy) * sc };

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
      {/* outer triangle */}
      <polygon
        points={`${vA.x},${vA.y} ${vB.x},${vB.y} ${vC.x},${vC.y}`}
        fill="rgba(207,107,62,0.05)"
        stroke="rgba(207,107,62,0.18)"
        strokeWidth="1.5"
      />
      {/* grid lines from center */}
      {[vA, vB, vC].map((v, i) => (
        <line key={i} x1={cx} y1={cy} x2={v.x} y2={v.y} stroke="rgba(207,107,62,0.1)" strokeWidth="1" />
      ))}
      {/* inner user triangle */}
      <polygon
        points={`${innerA.x},${innerA.y} ${innerB.x},${innerB.y} ${innerC.x},${innerC.y}`}
        fill="rgba(207,107,62,0.15)"
        stroke="rgba(207,107,62,0.5)"
        strokeWidth="1.5"
      />
      {/* user dot */}
      <circle cx={ux} cy={uy} r={10} fill="var(--accent)" opacity={0.9} />
      <circle cx={ux} cy={uy} r={16} fill="var(--accent)" opacity={0.15} />
      {/* vertex dots */}
      {[vA, vB, vC].map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r={3} fill="rgba(207,107,62,0.35)" />
      ))}
      {/* labels */}
      <text x={vA.x} y={vA.y - 10} textAnchor="middle" fontSize="9" fill="var(--text-soft)" fontFamily="var(--font-manrope)">Состояние</text>
      <text x={vB.x - 4} y={vB.y + 14} textAnchor="middle" fontSize="9" fill="var(--text-soft)" fontFamily="var(--font-manrope)">Паттерн</text>
      <text x={vC.x + 4} y={vC.y + 14} textAnchor="middle" fontSize="9" fill="var(--text-soft)" fontFamily="var(--font-manrope)">Триггеры</text>
    </svg>
  );
}

/* ─── Score bar ───────────────────────────────────────────────── */

function ScoreBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[var(--text-soft)]">{label}</span>
        <span className="font-semibold text-[var(--text)]">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--bg-soft)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

type Props = {
  tests: PsychologyTest[];
  onClose?: () => void;
};

export function TestsWorkbench({ tests, onClose }: Props) {
  const [selectedTestId, setSelectedTestId] = useState(tests[0]?.id ?? "");
  const test = tests.find((t) => t.id === selectedTestId) ?? tests[0];

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null); // for brief highlight
  const [loadStep, setLoadStep] = useState(0);
  const [visible, setVisible] = useState(true); // for fade transition

  const questions = test.questions;
  const total = questions.length;

  // Compute stage scores
  const stageScores = { A: [] as number[], B: [] as number[], C: [] as number[] };
  questions.forEach((q, i) => {
    const stage = getStageForIndex(questions, i);
    const ans = answers[q];
    if (ans !== undefined) stageScores[stage].push(ans);
  });

  function avg(arr: number[]) {
    if (!arr.length) return 0;
    return ((arr.reduce((s, v) => s + v, 0) / arr.length) - 1) / 4 * 100; // 1-5 scale → 0-100
  }

  const scoreA = avg(stageScores.A);
  const scoreB = avg(stageScores.B);
  const scoreC = avg(stageScores.C);

  const totalScore = questions.reduce((s, q) => s + (answers[q] ?? 1), 0);
  const minScore = total * 1;
  const maxScore = total * 5;
  const level = totalScore <= minScore + (maxScore - minScore) * 0.34 ? "low" : totalScore <= minScore + (maxScore - minScore) * 0.67 ? "medium" : "high";
  const resultText = level === "low" ? test.low : level === "medium" ? test.medium : test.high;

  const profileName =
    level === "low" ? "Устойчивый контакт" : level === "medium" ? "Зона чувствительности" : "Точка напряжения";
  const profileColor =
    level === "low" ? { bg: "#eafff4", text: "#1a6b45", border: "#a8e8c8" }
    : level === "medium" ? { bg: "#fff4e8", text: "#a05a1a", border: "#f5ceaa" }
    : { bg: "#fff0f0", text: "#9b2d2d", border: "#f5b8b8" };

  // Current stage
  const currentStage = phase === "quiz" ? getStageForIndex(questions, currentQ) : "A";
  const stageOrder: Array<"A" | "B" | "C"> = ["A", "B", "C"];
  const stageIndex = stageOrder.indexOf(currentStage);

  // Loading animation
  useEffect(() => {
    if (phase !== "loading") return;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      if (step >= LOADING_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => setPhase("result"), 400);
        return;
      }
      setLoadStep(step);
    }, 550);
    return () => clearInterval(iv);
  }, [phase]);

  // Fade transition helper
  const goToQ = useCallback((index: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrentQ(index);
      setSelected(null);
      setVisible(true);
    }, 180);
  }, []);

  function handleAnswer(value: number) {
    if (selected !== null) return;
    setSelected(value);
    setAnswers((prev) => ({ ...prev, [questions[currentQ]]: value }));

    setTimeout(() => {
      if (currentQ + 1 >= total) {
        setPhase("loading");
        setLoadStep(0);
      } else {
        goToQ(currentQ + 1);
      }
    }, 320);
  }

  function handleBack() {
    if (currentQ === 0) {
      setPhase("intro");
      setCurrentQ(0);
      setAnswers({});
    } else {
      goToQ(currentQ - 1);
    }
  }

  function restart() {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
  }

  /* ── Intro ─────────────────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
              {test.category}
            </span>
            <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-2xl leading-tight md:text-3xl">{test.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-soft)]">{test.description}</p>
              </div>
              {/* Stages preview */}
              <div className="flex flex-col gap-1.5 md:w-48 md:shrink-0">
                {(["A", "B", "C"] as const).map((s, i) => (
                  <div key={s} className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[var(--accent)]">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-[var(--text)]">{STAGE_NAMES[s]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-[var(--line)] p-2 text-[var(--text-soft)] hover:bg-[var(--bg-soft)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => { setPhase("quiz"); setCurrentQ(0); }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-deep)]"
        >
          Начать тест
          <ChevronRight className="h-4 w-4" />
        </button>

        <p className="mt-3 text-xs text-[var(--text-soft)]">Результат сразу — без регистрации и без диагнозов</p>
      </div>
    );
  }

  /* ── Loading ────────────────────────────────────────────────── */
  if (phase === "loading") {
    const progress = ((loadStep + 1) / LOADING_STEPS.length) * 100;
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-[var(--line)] bg-white p-10 text-center shadow-sm">
        {/* Animated triangle */}
        <div className="animate-pulse">
          <TriangleWidget a={scoreA || 40} b={scoreB || 40} c={scoreC || 40} />
        </div>
        <p className="mt-6 font-serif text-xl text-[var(--text)]">{LOADING_STEPS[loadStep]}</p>
        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-[var(--bg-soft)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-[var(--text-soft)]">Анализируем {total} ответов</p>
      </div>
    );
  }

  /* ── Result ─────────────────────────────────────────────────── */
  if (phase === "result") {
    const meta = resultMeta[test.id]?.[level];
    const stepLabels = ["Сейчас", "День 1", "День 3"];
    const stepIcons = ["👁", "🌊", "🔑"];

    return (
      <div className="space-y-5">
        {/* Profile header */}
        <div
          className="rounded-3xl border p-6 md:p-8"
          style={{ background: profileColor.bg, borderColor: profileColor.border }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: profileColor.text }}>
                {test.category} · Ваш профиль
              </p>
              <h2 className="mt-2 font-serif text-3xl" style={{ color: profileColor.text }}>{profileName}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{resultText}</p>
            </div>
            <div className="shrink-0">
              <TriangleWidget a={scoreA} b={scoreB} c={scoreC} />
            </div>
          </div>
        </div>


        {/* Trigger → Reaction → Help */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: "⚡", label: "Что запускает",      text: meta?.trigger  ?? "", bg: "#fff4e8", border: "#f5ceaa" },
            { icon: "🔄", label: "Как вы реагируете",  text: meta?.reaction ?? "", bg: "#f0f4ff", border: "#b8c4f5" },
            { icon: "🌿", label: "Что реально помогает", text: meta?.help   ?? "", bg: "#eafff4", border: "#a8e8c8" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border p-5"
              style={{ background: card.bg, borderColor: card.border }}
            >
              <div className="text-xl">{card.icon}</div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-soft)]">{card.label}</p>
              <p className="mt-1.5 text-sm leading-5 text-[var(--text)]">{card.text}</p>
            </div>
          ))}
        </div>

        {/* 72h steps */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]">Маршрут на 72 часа</p>
          <div className="mt-4 space-y-3">
            {(meta?.steps ?? ["", "", ""] as [string, string, string]).map((text, i) => (
              <div key={stepLabels[i]} className="flex gap-4 rounded-xl bg-[var(--bg-soft)] px-4 py-3">
                <div className="flex-shrink-0 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{stepLabels[i]}</p>
                  <span className="text-lg">{stepIcons[i]}</span>
                </div>
                <p className="text-sm leading-5 text-[var(--text-soft)]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upsell */}
        <div className="rounded-2xl border border-[#e0d0f5] bg-gradient-to-br from-[#f8f3ff] to-[#fef8ff] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b3fa0]">Углубить разбор</p>
          <h3 className="mt-2 font-serif text-xl text-[#22263a]">Что осталось за кадром</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
            {["Полный профиль по 5 шкалам", "Разбор ваших триггеров подробно", "Защитные стратегии и скрытые потребности", "30-дневный план по шагам", "PDF-отчёт для себя или терапевта"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-[#6b3fa0]">→</span> {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-5 rounded-full bg-[#6b3fa0] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5a3090]"
          >
            Получить полный разбор
          </button>
          <p className="mt-2 text-xs text-[var(--text-soft)]">Скоро · сейчас в разработке</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={restart}
            className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--bg-soft)]"
          >
            Пройти заново
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--bg-soft)]"
            >
              Выбрать другой тест
            </button>
          )}
        </div>

        <p className="text-xs text-[var(--text-soft)]">
          Это инструмент самопознания, не медицинская диагностика. Если вам тяжело — поговорите с психологом.
        </p>
      </div>
    );
  }

  /* ── Quiz ───────────────────────────────────────────────────── */
  const qText = parseQ(questions[currentQ]).text;
  const progress = ((currentQ) / total) * 100;
  const answeredCount = Object.keys(answers).length;

  // Detect stage transition (show mini label when stage changes)
  const prevStage = currentQ > 0 ? getStageForIndex(questions, currentQ - 1) : null;
  const isNewStage = prevStage !== null && prevStage !== currentStage && currentQ > 0;

  return (
    <div className="rounded-3xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
      {/* Top bar */}
      <div className="border-b border-[var(--line)] px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentQ === 0 ? "Назад" : `Вопрос ${currentQ}`}
          </button>

          {/* Stage pills */}
          <div className="flex items-center gap-1.5">
            {(["A", "B", "C"] as const).map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition xl:text-sm xl:px-4 xl:py-2 ${
                  currentStage === s
                    ? "bg-[var(--accent)] text-white"
                    : stageIndex > i
                    ? "bg-[var(--bg-soft)] text-[var(--accent)]"
                    : "bg-[var(--bg-soft)] text-[var(--text-soft)]"
                }`}
              >
                <span>{i + 1}</span>
                <span className="hidden sm:inline xl:text-sm">{["Состояние", "Паттерн", "Триггеры"][i]}</span>
              </div>
            ))}
          </div>

          <div className="text-right">
            <span className="text-sm font-medium text-[var(--text-soft)]">{currentQ + 1} / {total}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question area */}
      <div
        className="px-6 py-8 md:px-10 md:py-10 transition-opacity duration-180"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/* Stage label if new stage */}
        {isNewStage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-[var(--bg-soft)] px-4 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
              {stageIndex + 1}
            </span>
            <span className="text-xs font-semibold text-[var(--text)]">{STAGE_NAMES[currentStage]}</span>
          </div>
        )}

        <p className="font-serif text-xl leading-8 text-[var(--text)] md:text-2xl md:leading-9">{qText}</p>

        {/* Answer buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {answerOptions.map((opt) => {
            const isSelected = selected === opt.value;
            const isPrev = answers[questions[currentQ]] === opt.value && selected === null;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleAnswer(opt.value)}
                disabled={selected !== null}
                className={`group flex w-full items-center justify-between rounded-2xl border px-6 py-4 text-left text-sm font-semibold transition-all duration-150 ${
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-md scale-[1.01]"
                    : isPrev
                    ? "border-[var(--accent)]/60 bg-[#fff5f0] text-[var(--accent-deep)]"
                    : "border-[var(--line)] bg-[var(--bg-soft)] text-[var(--text)] hover:border-[var(--accent)]/40 hover:bg-white"
                }`}
              >
                <span>{opt.label}</span>
                {(isSelected || isPrev) && <span className="text-lg">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Skip / answered counter */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-[var(--text-soft)]">Отвечено: {answeredCount} из {total}</p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[var(--text-soft)] hover:text-[var(--text)]"
            >
              Закрыть
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
