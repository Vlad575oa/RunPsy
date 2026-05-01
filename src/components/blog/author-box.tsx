import type { Author } from "@/types/article";

export function AuthorBox({ author }: { author: Author }) {
  return (
    <aside className="rounded-2xl border border-[var(--line)] bg-[#fff7f0] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">Автор</p>
      <h3 className="mt-2 font-serif text-2xl">{author.name}</h3>
      <p className="mt-1 text-sm text-[var(--text-soft)]">{author.role}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{author.bio}</p>
      <ul className="mt-4 space-y-1 text-sm text-[var(--text-soft)]">
        {author.credentials.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </aside>
  );
}
