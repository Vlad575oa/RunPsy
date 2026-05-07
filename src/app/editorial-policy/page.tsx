import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getDbPool } from "@/lib/db";

export const metadata = buildMetadata({
  title: "Редакционная политика | RunPsy",
  description: "Принципы подготовки материалов на RunPsy.",
  path: "/editorial-policy",
});

export const dynamic = "force-dynamic";

export default async function EditorialPolicyPage() {
  const pool = getDbPool();
  const row = pool
    ? (await pool.query(`SELECT title, content FROM runpsy_pages WHERE slug = 'editorial-policy'`)).rows[0]
    : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        ← На главную
      </Link>
      <h1 className="font-serif text-4xl mt-4">{row?.title ?? "Редакционная политика"}</h1>
      <div
        className="mt-6 space-y-4 text-sm leading-7 text-[var(--text-soft)] [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-[var(--text)] [&_h2]:mt-6 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: row?.content ?? "" }}
      />
    </div>
  );
}
