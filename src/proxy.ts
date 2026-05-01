import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Bucket = {
  hits: number;
  resetAt: number;
};

const ARTICLE_WINDOW_MS = 60 * 1000;
const GLOBAL_WINDOW_MS = 60 * 1000;
const ARTICLE_LIMIT = 30;
const GLOBAL_LIMIT = 180;

const SUSPICIOUS_UA = [
  "python-requests",
  "python-httpx",
  "curl/",
  "wget/",
  "scrapy",
  "httpclient",
  "go-http-client",
  "node-fetch",
  "axios",
  "java/",
  "libwww-perl",
  "headlesschrome",
  "playwright",
  "puppeteer",
  "selenium",
];

const TRUSTED_CRAWLERS = [
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "applebot",
];

const memoryStore = globalThis as typeof globalThis & {
  __runpsyRateLimit__?: Map<string, Bucket>;
};

if (!memoryStore.__runpsyRateLimit__) {
  memoryStore.__runpsyRateLimit__ = new Map<string, Bucket>();
}

const store = memoryStore.__runpsyRateLimit__;

function getClientIp(request: NextRequest): string {
  const ipFromHeader = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return ipFromHeader || request.headers.get("x-real-ip") || "unknown";
}

function isSuspiciousAgent(userAgent: string): boolean {
  const normalized = userAgent.toLowerCase();
  const isTrusted = TRUSTED_CRAWLERS.some((agent) => normalized.includes(agent));
  if (isTrusted) return false;
  return SUSPICIOUS_UA.some((agent) => normalized.includes(agent));
}

function applyRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const next: Bucket = { hits: 1, resetAt: now + windowMs };
    store.set(key, next);
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfter: Math.ceil(windowMs / 1000),
    };
  }

  if (current.hits >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.hits += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.hits),
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") || "";
  const ip = getClientIp(request);
  const isArticlePath = pathname.startsWith("/articles");

  if (isArticlePath && isSuspiciousAgent(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const globalRate = applyRateLimit(`global:${ip}`, GLOBAL_LIMIT, GLOBAL_WINDOW_MS);
  if (!globalRate.allowed) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(globalRate.retryAfter),
        "X-RateLimit-Limit": String(GLOBAL_LIMIT),
        "X-RateLimit-Remaining": String(globalRate.remaining),
      },
    });
  }

  if (isArticlePath) {
    const articleRate = applyRateLimit(`articles:${ip}`, ARTICLE_LIMIT, ARTICLE_WINDOW_MS);
    if (!articleRate.allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(articleRate.retryAfter),
          "X-RateLimit-Limit": String(ARTICLE_LIMIT),
          "X-RateLimit-Remaining": String(articleRate.remaining),
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(ARTICLE_LIMIT));
    response.headers.set("X-RateLimit-Remaining", String(articleRate.remaining));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(GLOBAL_LIMIT));
  response.headers.set("X-RateLimit-Remaining", String(globalRate.remaining));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt)$).*)"],
};

