import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, BookOpen, Table2, Brain, Newspaper, ArrowRight, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

const links = [
  { href: '/', label: 'Dashboard', desc: 'Back to the start', icon: Home, color: 'blue' },
  { href: '/lessons', label: 'Lessons', desc: '16 structured lessons', icon: BookOpen, color: 'blue' },
  { href: '/grammar', label: 'Grammar', desc: 'Visual reference tables', icon: Table2, color: 'purple' },
  { href: '/quizzes', label: 'Quizzes', desc: 'Test your knowledge', icon: Brain, color: 'green' },
  { href: '/blog', label: 'Blog', desc: 'Tips & deep dives', icon: Newspaper, color: 'blue' },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400', border: 'hover:border-blue-200 dark:hover:border-blue-800' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400', border: 'hover:border-purple-200 dark:hover:border-purple-800' },
  green: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-400', border: 'hover:border-green-200 dark:hover:border-green-800' },
};

export default function NotFound() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-2xl mx-auto text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 mb-6">
          <Compass className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <p className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          Strona nie znaleziona
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Page not found — this link took a wrong turn. <span className="whitespace-nowrap">Nic nie szkodzi!</span> (No worries!)
          Let&apos;s get you back on track.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 text-left">
          {links.map((l) => {
            const c = colorMap[l.color];
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all ${c.border}`}
              >
                <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{l.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{l.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors ml-auto shrink-0" />
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
