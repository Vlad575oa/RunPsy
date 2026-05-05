import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru"
      : "script-src 'self' 'unsafe-inline' https://mc.yandex.ru";
    const connectSrc = isDev
      ? "connect-src 'self' ws: wss: https://mc.yandex.ru"
      : "connect-src 'self' https://mc.yandex.ru";

    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          scriptSrc,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://mc.yandex.ru",
          "frame-src https://mc.yandex.ru",
          "font-src 'self' data:",
          connectSrc,
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
      {
        key: "Cross-Origin-Resource-Policy",
        value: "same-origin",
      },
      {
        key: "X-DNS-Prefetch-Control",
        value: "off",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Статические ассеты Next.js кешируются на год
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Картинки и шрифты из /public — 30 дней
      {
        source: "/:path+\\.:ext(png|jpg|jpeg|webp|svg|ico|woff|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
