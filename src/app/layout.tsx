import type { Metadata } from "next";
import { Manrope, Merriweather } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://runpsy.example"),
  title: {
    default: "RunPsy — психология отношений без воды",
    template: "%s | RunPsy",
  },
  description:
    "Контентный проект по психологии отношений: кризисные гайды, границы, восстановление после расставания и экспертная поддержка.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${merriweather.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
