import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 font-sans">
        <Sidebar />
        <MobileNav />
        <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
