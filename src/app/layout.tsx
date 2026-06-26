import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import JsonLd, { websiteSchema, courseSchema } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const SITE_URL = "https://www.polishpal.pl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PolishPal — Learn Polish Free | A0 to A1 Course",
    template: "%s | PolishPal",
  },
  description:
    "Free interactive Polish language course from absolute beginner (A0) to elementary (A1). Lessons, grammar tables, quizzes, and pronunciation — all based on real university materials.",
  keywords: [
    "learn Polish", "Polish language", "Polish for beginners", "Polish A0", "Polish A1",
    "Polish grammar", "Polish cases", "Polish conjugation", "Polish vocabulary",
    "Polish pronunciation", "free Polish course", "Polish online",
    "nauka polskiego", "język polski", "polski dla obcokrajowców",
  ],
  authors: [{ name: "PolishPal" }],
  creator: "PolishPal",
  publisher: "PolishPal",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "pl_PL",
    url: SITE_URL,
    siteName: "PolishPal",
    title: "PolishPal — Learn Polish Free | A0 to A1 Course",
    description:
      "Free interactive Polish language course with lessons, grammar reference tables, quizzes, and text-to-speech pronunciation. From absolute beginner to A1.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PolishPal — Learn Polish A0 to A1" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PolishPal — Learn Polish Free | A0 to A1",
    description:
      "Free Polish language course: 16 lessons, grammar tables, quizzes, and pronunciation. Based on real university materials.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('polish-pal-theme');
              var dark = t === 'dark' || (!t || t === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (dark) document.documentElement.classList.add('dark');
            } catch(e) {}
          })();
        `}} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={courseSchema()} />
      </head>
      <body className="min-h-full bg-slate-50 dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
