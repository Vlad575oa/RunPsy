"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  initialTitle: string;
  initialContent: string;
};

export default function PageEditForm({ slug, initialTitle, initialContent }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <a href="/admin/pages" className="text-sm text-blue-600 hover:underline mb-2 block">
            ← Все страницы
          </a>
          <h1 className="text-2xl font-bold text-slate-900">{initialTitle}</h1>
          <span className="text-xs text-slate-400 mt-1 block">/{slug}</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">Сохранено</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "#3b82f6" }}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Заголовок
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Содержимое (HTML)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={28}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <p className="text-xs text-slate-400 mt-1">
            Поддерживается HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            Предпросмотр
          </label>
          <div
            className="border border-slate-200 rounded-xl px-6 py-5 bg-white text-sm leading-7 text-slate-600 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
