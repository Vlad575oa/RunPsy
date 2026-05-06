import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, ADMIN_COOKIE } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";

function sha256Hex(value: string): Buffer {
  return crypto.createHash("sha256").update(value).digest();
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Слишком много попыток. Подождите 15 минут." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("password" in body) ||
    typeof (body as Record<string, unknown>).password !== "string"
  ) {
    return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
  }

  const password = (body as { password: string }).password;
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminPassword) {
    return NextResponse.json({ error: "Сервер не настроен" }, { status: 500 });
  }

  const incoming = sha256Hex(password);
  const expected = sha256Hex(adminPassword);

  let match = false;
  try {
    match = crypto.timingSafeEqual(incoming, expected);
  } catch {
    match = false;
  }

  if (!match) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = await createAdminSession();
  const isProduction = process.env.NODE_ENV === "production";

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 43200,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
