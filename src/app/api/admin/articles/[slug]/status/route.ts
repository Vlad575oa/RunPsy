import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, ADMIN_COOKIE } from "@/lib/adminSession";
import { getDbPool } from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const session = await verifyAdminSession(token);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const pool = getDbPool();
  if (!pool) return NextResponse.json({ error: "No DB" }, { status: 500 });

  const current = await pool.query<{ status: string }>(
    `SELECT status FROM runpsy_articles WHERE slug = $1`,
    [slug]
  );

  if (!current.rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newStatus = current.rows[0].status === "published" ? "draft" : "published";

  await pool.query(
    `UPDATE runpsy_articles SET status = $2, updated = CURRENT_DATE WHERE slug = $1`,
    [slug, newStatus]
  );

  // For form submissions, redirect back to articles list
  const referer = _request.headers.get("referer");
  if (referer && !referer.includes("/api/")) {
    return NextResponse.redirect(referer, { status: 303 });
  }

  return NextResponse.json({ status: newStatus });
}
