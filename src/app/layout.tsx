import type { Metadata } from "next";
import { Lora, Manrope, Merriweather } from "next/font/google";
import Script from "next/script";
import { CookieNotice } from "@/components/layout/cookie-notice";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700"],
  subsets: ["latin", "cyrillic"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "RunPsy — практичная психология отношений",
    template: "%s",
  },
  description:
    "RunPsy: статьи, психологические тесты и чек-листы про отношения, тревогу, границы, расставание, самооценку и выгорание.",
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName,
    url: siteUrl,
    title: "RunPsy — практичная психология отношений",
    description:
      "Психологические статьи, тесты и чек-листы без мотивационного шума: понятные объяснения и шаги, которые можно сделать сегодня.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunPsy — практичная психология отношений",
    description: "Статьи, тесты и чек-листы по отношениям, тревоге, границам и восстановлению.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const yandexMetrikaId = "109001951";

  return (
    <html lang="ru" suppressHydrationWarning className={`${manrope.variable} ${merriweather.variable} ${lora.variable} h-full antialiased`}>
      <head>
        <meta
          name="zen-verification"
          content="S0XW5Xr0b88PBgzhtceS4iD144BMOSn9SyGryNJnepQihtMnMxg4zxYoMThP8aGL"
        />
      </head>
      <body className="min-h-full">
        <Script
          id="yandex-metrika"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,u,i){
                w[i]=w[i]||function(){(w[i].a=w[i].a||[]).push(arguments)};
                w[i].l=1*new Date();
                var ready=function(){
                  if (d.querySelector('script[src="'+u+'"]')) return;
                  var js=d.createElement(s),f=d.getElementsByTagName(s)[0];
                  js.async=1; js.src=u; f.parentNode.insertBefore(js,f);
                };
                if ('requestIdleCallback' in w) {
                  requestIdleCallback(ready, { timeout: 2000 });
                } else {
                  setTimeout(ready, 1200);
                }
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${yandexMetrikaId}', 'ym');

              window.ym(${yandexMetrikaId}, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: 'dataLayer',
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce: true,
                trackLinks: true
              });
            `,
          }}
        />
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieNotice />
        </ThemeProvider>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}
