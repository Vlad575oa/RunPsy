"use client";

import { useMemo, useState } from "react";
import { Download, Mail, MessageCircle, Send, Table2 } from "lucide-react";
import type { PsychologyChecklist, PsychologyTest } from "@/lib/tests-content";

type TestsWorkbenchProps = {
  tests: PsychologyTest[];
  checklists: PsychologyChecklist[];
};

const answerOptions = [
  { label: "Редко", value: 0 },
  { label: "Иногда", value: 1 },
  { label: "Часто", value: 2 },
];

function slugDate() {
  return new Date().toISOString().slice(0, 10);
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function TestsWorkbench({ tests, checklists }: TestsWorkbenchProps) {
  const [mode, setMode] = useState<"tests" | "checklists">("tests");
  const [selectedTestId, setSelectedTestId] = useState(tests[0]?.id ?? "");
  const [selectedChecklistId, setSelectedChecklistId] = useState(checklists[0]?.id ?? "");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const selectedTest = tests.find((test) => test.id === selectedTestId) ?? tests[0];
  const selectedChecklist = checklists.find((checklist) => checklist.id === selectedChecklistId) ?? checklists[0];

  const testScore = selectedTest.questions.reduce((sum, question) => sum + (answers[question] ?? 0), 0);
  const maxScore = selectedTest.questions.length * 2;
  const answeredCount = selectedTest.questions.filter((question) => answers[question] !== undefined).length;
  const testLevel = testScore <= maxScore * 0.34 ? "low" : testScore <= maxScore * 0.67 ? "medium" : "high";
  const testResult = testLevel === "low" ? selectedTest.low : testLevel === "medium" ? selectedTest.medium : selectedTest.high;

  const checklistDone = selectedChecklist.items.filter((item) => checked[item]).length;
  const checklistPercent = Math.round((checklistDone / selectedChecklist.items.length) * 100);

  const shareText = useMemo(() => {
    if (mode === "tests") {
      return `RunPsy тест: ${selectedTest.title}\nРезультат: ${testScore}/${maxScore}\n${testResult}\n\nhttps://runpsy.ru/tests`;
    }

    return `RunPsy чек-лист: ${selectedChecklist.title}\nГотово: ${checklistDone}/${selectedChecklist.items.length} (${checklistPercent}%)\n${selectedChecklist.recommendation}\n\nhttps://runpsy.ru/tests`;
  }, [checklistDone, checklistPercent, maxScore, mode, selectedChecklist, selectedTest, testResult, testScore]);

  const encodedShare = encodeURIComponent(shareText);

  function exportWord() {
    const title = mode === "tests" ? selectedTest.title : selectedChecklist.title;
    const body =
      mode === "tests"
        ? `<p><strong>Результат:</strong> ${testScore}/${maxScore}</p><p>${escapeHtml(testResult)}</p><ol>${selectedTest.questions
            .map((question) => `<li>${escapeHtml(question)}: ${answers[question] ?? "-"}</li>`)
            .join("")}</ol>`
        : `<p><strong>Готово:</strong> ${checklistDone}/${selectedChecklist.items.length} (${checklistPercent}%)</p><p>${escapeHtml(
            selectedChecklist.recommendation,
          )}</p><ul>${selectedChecklist.items.map((item) => `<li>${checked[item] ? "[x]" : "[ ]"} ${escapeHtml(item)}</li>`).join("")}</ul>`;

    downloadFile(
      `runpsy-${mode}-${slugDate()}.doc`,
      `<html><head><meta charset="utf-8"></head><body><h1>${escapeHtml(title)}</h1>${body}</body></html>`,
      "application/msword;charset=utf-8",
    );
  }

  function exportExcel() {
    const rows =
      mode === "tests"
        ? [["Тип", "Название", "Вопрос", "Ответ"], ...selectedTest.questions.map((question) => ["Тест", selectedTest.title, question, String(answers[question] ?? "")])]
        : [["Тип", "Название", "Пункт", "Отмечено"], ...selectedChecklist.items.map((item) => ["Чек-лист", selectedChecklist.title, item, checked[item] ? "Да" : "Нет"])];

    downloadFile(
      `runpsy-${mode}-${slugDate()}.csv`,
      rows.map((row) => row.map(escapeCsv).join(";")).join("\n"),
      "text/csv;charset=utf-8",
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-2xl border border-[var(--line)] bg-white p-3 shadow-sm">
        {/* Мобильная версия: выпадающие списки */}
        <div className="space-y-4 md:hidden">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]" htmlFor="mode-select">
              Раздел
            </label>
            <select
              id="mode-select"
              className="w-full appearance-none rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition focus:border-[var(--accent)]"
              value={mode}
              onChange={(e) => setMode(e.target.value as "tests" | "checklists")}
            >
              <option value="tests">Тесты</option>
              <option value="checklists">Чек-листы</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]" htmlFor="item-select">
              Выбор {mode === "tests" ? "теста" : "чек-листа"}
            </label>
            <select
              id="item-select"
              className="w-full appearance-none rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition focus:border-[var(--accent)]"
              value={mode === "tests" ? selectedTestId : selectedChecklistId}
              onChange={(e) => {
                const id = e.target.value;
                if (mode === "tests") {
                  setSelectedTestId(id);
                  setAnswers({});
                } else {
                  setSelectedChecklistId(id);
                  setChecked({});
                }
              }}
            >
              {(mode === "tests" ? tests : checklists).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Десктопная версия переключателей */}
        <div className="hidden grid-cols-2 gap-2 md:grid">
          <button
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${mode === "tests" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg)] text-[var(--text-soft)]"}`}
            type="button"
            onClick={() => setMode("tests")}
          >
            Тесты
          </button>
          <button
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${mode === "checklists" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg)] text-[var(--text-soft)]"}`}
            type="button"
            onClick={() => setMode("checklists")}
          >
            Чек-листы
          </button>
        </div>

        {/* Десктопный список элементов */}
        <div className="mt-3 hidden max-h-[680px] space-y-2 overflow-y-auto pr-1 md:block">
          {mode === "tests"
            ? tests.map((test) => (
                <button
                  key={test.id}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedTest.id === test.id ? "border-[#b7ded0] bg-[#eafff6]" : "border-[var(--line)] bg-[var(--bg)] hover:bg-white"
                  }`}
                  type="button"
                  onClick={() => {
                    setSelectedTestId(test.id);
                    setAnswers({});
                  }}
                >
                  <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--accent)]">{test.category}</span>
                  <span className="mt-1 block text-sm font-semibold">{test.title}</span>
                </button>
              ))
            : checklists.map((checklist) => (
                <button
                  key={checklist.id}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedChecklist.id === checklist.id ? "border-[#b7ded0] bg-[#eafff6]" : "border-[var(--line)] bg-[var(--bg)] hover:bg-white"
                  }`}
                  type="button"
                  onClick={() => {
                    setSelectedChecklistId(checklist.id);
                    setChecked({});
                  }}
                >
                  <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--accent)]">{checklist.category}</span>
                  <span className="mt-1 block text-sm font-semibold">{checklist.title}</span>
                </button>
              ))}
        </div>
      </aside>

      <section className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm md:p-7">
        {mode === "tests" ? (
          <>
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--accent)]">{selectedTest.category}</p>
            <h2 className="mt-2 font-serif text-3xl">{selectedTest.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-soft)]">{selectedTest.description}</p>

            <div className="mt-6 space-y-4">
              {selectedTest.questions.map((question, index) => (
                <fieldset key={question} className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
                  <legend className="font-semibold">
                    {index + 1}. {question}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {answerOptions.map((option) => (
                      <label
                        key={option.label}
                        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          answers[question] === option.value ? "border-[#17614f] bg-[#eafff6] text-[#17614f]" : "border-[var(--line)] bg-white text-[var(--text-soft)]"
                        }`}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name={question}
                          checked={answers[question] === option.value}
                          onChange={() => setAnswers((current) => ({ ...current, [question]: option.value }))}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <ResultPanel
              title={`Результат: ${testScore}/${maxScore}`}
              subtitle={`Отвечено: ${answeredCount}/${selectedTest.questions.length}`}
              text={testResult}
              shareText={encodedShare}
              onWord={exportWord}
              onExcel={exportExcel}
            />
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--accent)]">{selectedChecklist.category}</p>
            <h2 className="mt-2 font-serif text-3xl">{selectedChecklist.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-soft)]">{selectedChecklist.description}</p>

            <div className="mt-6 space-y-3">
              {selectedChecklist.items.map((item) => (
                <label key={item} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
                  <input
                    className="mt-1 h-5 w-5 accent-[#17614f]"
                    type="checkbox"
                    checked={Boolean(checked[item])}
                    onChange={(event) => setChecked((current) => ({ ...current, [item]: event.target.checked }))}
                  />
                  <span className="text-sm leading-6 text-[var(--text-soft)]">{item}</span>
                </label>
              ))}
            </div>

            <ResultPanel
              title={`Готово: ${checklistDone}/${selectedChecklist.items.length} (${checklistPercent}%)`}
              subtitle="Чек-лист можно пройти частично и вернуться позже."
              text={selectedChecklist.recommendation}
              shareText={encodedShare}
              onWord={exportWord}
              onExcel={exportExcel}
            />
          </>
        )}
      </section>
    </div>
  );
}

function ResultPanel({
  title,
  subtitle,
  text,
  shareText,
  onWord,
  onExcel,
}: {
  title: string;
  subtitle: string;
  text: string;
  shareText: string;
  onWord: () => void;
  onExcel: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-[#b7ded0] bg-[#eafff6]/80 p-5">
      <h3 className="font-serif text-2xl text-[#17614f]">{title}</h3>
      <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[#17614f]">{subtitle}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{text}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <a className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)]" href={`https://t.me/share/url?url=https://runpsy.ru/tests&text=${shareText}`} target="_blank" rel="noreferrer">
          <Send className="h-4 w-4" />
          Telegram
        </a>
        <a className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)]" href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)]" href={`mailto:?subject=RunPsy результат&body=${shareText}`}>
          <Mail className="h-4 w-4" />
          Email
        </a>
        <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)]" type="button" onClick={onWord}>
          <Download className="h-4 w-4" />
          Word
        </button>
        <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent-deep)]" type="button" onClick={onExcel}>
          <Table2 className="h-4 w-4" />
          Excel
        </button>
      </div>
    </div>
  );
}
