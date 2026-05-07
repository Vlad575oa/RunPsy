import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, ADMIN_COOKIE } from "@/lib/adminSession";
import { getDbPool } from "@/lib/db";

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return !!(await verifyAdminSession(token));
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const pool = getDbPool();
  if (!pool) return NextResponse.json({ error: "No DB" }, { status: 500 });
  const result = await pool.query(`SELECT * FROM runpsy_pages WHERE slug = $1`, [slug]);
  if (!result.rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const pool = getDbPool();
  if (!pool) return NextResponse.json({ error: "No DB" }, { status: 500 });

  let body: { title?: string; content?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const result = await pool.query(
    `UPDATE runpsy_pages SET title = $2, content = $3, updated = CURRENT_DATE WHERE slug = $1 RETURNING *`,
    [slug, body.title ?? null, body.content ?? null]
  );
  if (!result.rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}
