import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PolishPal — Learn Polish A0 to A1",
  description:
    "Interactive Polish language learning app with lessons, quizzes, and progress tracking. From absolute beginner to A1.",
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
      </head>
      <body className="min-h-full bg-slate-50 dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
