import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, ADMIN_COOKIE } from "@/lib/adminSession";
import { getDbPool } from "@/lib/db";

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const session = await verifyAdminSession(token);
  return !!session;
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const pool = getDbPool();
  if (!pool) return NextResponse.json({ error: "No DB" }, { status: 500 });

  const result = await pool.query(
    `SELECT * FROM runpsy_articles WHERE slug = $1`,
    [slug]
  );

  if (!result.rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const pool = getDbPool();
  if (!pool) return NextResponse.json({ error: "No DB" }, { status: 500 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    title,
    description,
    seo_title,
    seo_description,
    status,
    intent,
    category_slug,
    author_slug,
    tags,
    reading_time,
    hero_image,
    cta,
    safety_note,
    introduction,
    sections,
    faq,
    quiz,
  } = body;

  const result = await pool.query(
    `UPDATE runpsy_articles SET
       title = $2,
       description = $3,
       seo_title = $4,
       seo_description = $5,
       status = $6,
       intent = $7,
       category_slug = $8,
       author_slug = COALESCE($9, author_slug),
       tags = $10,
       reading_time = $11,
       hero_image = $12,
       cta = $13,
       safety_note = $14,
       introduction = $15,
       sections = $16,
       faq = $17,
       quiz = $18,
       updated = CURRENT_DATE
     WHERE slug = $1
     RETURNING *`,
    [
      slug,
      title ?? null,
      description ?? null,
      seo_title ?? null,
      seo_description ?? null,
      status ?? null,
      intent ?? null,
      category_slug ?? null,
      author_slug ?? null,
      JSON.stringify(tags ?? []),
      reading_time ?? null,
      hero_image ?? null,
      cta ?? null,
      safety_note ?? null,
      introduction ?? null,
      JSON.stringify(sections ?? []),
      JSON.stringify(faq ?? []),
      JSON.stringify(quiz ?? null),
    ]
  );

  if (!result.rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}
