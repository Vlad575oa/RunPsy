import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Связаться с RunPsy | Написать нам",
  description: "Напишите нам — разберём ситуацию точечно и без лишнего шума.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="font-serif text-4xl">Контакт</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
        Напишите, если хотите разобрать ситуацию точечно и без общего шума.
      </p>
      <form className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6">
        <div className="grid gap-4">
          <input className="rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="Ваше имя" />
          <input className="rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="Email" type="email" />
          <textarea className="min-h-36 rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="Опишите ситуацию" />
        </div>
        <button type="submit" className="mt-4 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Отправить
        </button>
      </form>
    </div>
  );
}
