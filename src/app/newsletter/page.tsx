import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Рассылка RunPsy | Психология в письмах",
  description: "Подпишитесь на рассылку RunPsy: практичные статьи о психологии отношений, тревоге и границах — без спама.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="font-serif text-4xl">Рассылка RunPsy</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
        Одна полезная психология-подсказка в неделю. Без спама, без «прорывов к понедельнику».
      </p>
      <form className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input id="email" type="email" className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="you@example.com" />
        <button type="submit" className="mt-4 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Подписаться
        </button>
      </form>
    </div>
  );
}
