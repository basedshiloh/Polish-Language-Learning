import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import JsonLd, { websiteSchema, courseSchema, organizationSchema } from "@/components/seo/JsonLd";
import CookieConsent from "@/components/shared/CookieConsent";

const fredoka = Fredoka({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const DIRECTION_CONTRACT = `<!--
THESIS: PolishPal as a friendly language app, not a SaaS landing page: tactile tiles, pressed buttons, a lesson path. Refuses the generic indigo hero-plus-card layout.
OWN-WORLD: White ground, Polish-crimson brand, Lowicz wycinanki accents (emerald, sun, cobalt, fuchsia, orange, violet, teal) coding categories; 2px tiles with a 4px bottom edge; uppercase 3D buttons; Fredoka headings, Nunito body; papercut flower motif.
STORY: A reader from Google gets a comfortable article with Polish words marked in crimson, and every post ends with an obvious way into lesson 1.
FIRST VIEWPORT: Home: headline and two pressed buttons left; a phrase card with working speak buttons over a papercut flower right.
FORM: Owner-pinned canon (Duolingo/Busuu feel), wycinanki-coloured. Seed key bcdd8b6b rolled, overridden by the brief.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
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
    "google-adsense-account": "ca-pub-7316825064118043",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <head>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={courseSchema()} />
        {/* Umami Analytics — cookie-free, GDPR compliant without consent */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="2137687a-7d68-4e42-baf4-2f657cd43d2e"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full bg-paper font-sans text-ink-2">
        <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <LayoutShell>{children}</LayoutShell>
        <CookieConsent />
      </body>
    </html>
  );
}
