'use client';

import { useState, useMemo } from 'react';
import { Search, Link2, Check, BookOpen, Table2, Brain, Newspaper } from 'lucide-react';
import type { LinkTarget } from '@/lib/internal-links';

const typeIcon = { Lesson: BookOpen, Grammar: Table2, Quiz: Brain, Blog: Newspaper };

export default function LinkIndexBrowser({ index }: { index: LinkTarget[] }) {
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState('');

  const filtered = useMemo(() => {
    const lc = q.toLowerCase().trim();
    if (!lc) return index;
    return index.filter((t) => t.title.toLowerCase().includes(lc) || t.url.toLowerCase().includes(lc) || t.keywords.some((k) => k.includes(lc)));
  }, [q, index]);

  function copy(markdown: string, url: string) {
    navigator.clipboard?.writeText(markdown);
    setCopied(url);
    setTimeout(() => setCopied(''), 1500);
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Link Genius</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          All {index.length} internal pages you can link to. Click any row to copy a ready-made Markdown link.
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lessons, grammar, quizzes, posts…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-blue-400 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((t) => {
            const Icon = typeIcon[t.type];
            const md = `[${t.title}](${t.url})`;
            return (
              <button
                key={t.url}
                onClick={() => copy(md, t.url)}
                className="w-full flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-left hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{t.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{t.url}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {copied === t.url ? <span className="flex items-center gap-1 text-green-600"><Check className="w-3.5 h-3.5" /> Copied</span> : 'Copy MD'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
