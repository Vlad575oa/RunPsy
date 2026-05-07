import { notFound } from "next/navigation";
import { getDbPool } from "@/lib/db";
import PageEditForm from "./PageEditForm";

type Props = { params: Promise<{ slug: string }> };

export default async function PageEditPage({ params }: Props) {
  const { slug } = await params;
  const pool = getDbPool();
  if (!pool) return <div className="p-8 text-red-500">Нет подключения к БД</div>;

  const result = await pool.query(`SELECT * FROM runpsy_pages WHERE slug = $1`, [slug]);
  if (!result.rows.length) notFound();

  const page = result.rows[0];
  return (
    <PageEditForm
      slug={page.slug}
      initialTitle={page.title}
      initialContent={page.content}
    />
  );
}
