'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { BookOpen, Table2, Brain, Newspaper, Search } from 'lucide-react';
import { useSearch, type SearchResult, type SearchEntry } from '@/hooks/useSearch';

const categoryMeta = {
  lesson:  { icon: BookOpen,  label: 'Lessons',    color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-200 dark:border-blue-800',    heading: 'text-blue-700 dark:text-blue-300' },
  grammar: { icon: Table2,    label: 'Grammar',    color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', heading: 'text-purple-700 dark:text-purple-300' },
  quiz:    { icon: Brain,     label: 'Quizzes',    color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-200 dark:border-green-800',   heading: 'text-green-700 dark:text-green-300' },
  blog:    { icon: Newspaper, label: 'Blog Posts', color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-200 dark:border-amber-800',   heading: 'text-amber-700 dark:text-amber-300' },
};

const SECTION_ORDER = ['blog', 'lesson', 'grammar', 'quiz'] as const;

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <span>{text}</span>;
  const parts: { text: string; bold: boolean }[] = [];
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let cursor = 0;
  while (cursor < text.length) {
    const idx = lower.indexOf(q, cursor);
    if (idx === -1) { parts.push({ text: text.slice(cursor), bold: false }); break; }
    if (idx > cursor) parts.push({ text: text.slice(cursor, idx), bold: false });
    parts.push({ text: text.slice(idx, idx + query.length), bold: true });
    cursor = idx + query.length;
  }
  return (
    <span>
      {parts.map((p, i) =>
        p.bold
          ? <strong key={i} className="text-blue-700 dark:text-blue-400 font-bold">{p.text}</strong>
          : <span key={i}>{p.text}</span>
      )}
    </span>
  );
}

function ResultCard({ result, query }: { result: SearchResult; query: string }) {
  const meta = categoryMeta[result.entry.category];
  const Icon = meta.icon;
  return (
    <Link
      href={result.entry.href}
      className="flex items-start gap-4 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
    >
      <div className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${meta.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
          <HighlightMatch text={result.entry.title} query={query} />
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          <HighlightMatch text={result.matchedText} query={query} />
        </p>
      </div>
    </Link>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [blogEntries, setBlogEntries] = useState<SearchEntry[]>([]);

  useEffect(() => {
    fetch('/api/search/posts')
      .then((r) => r.json())
      .then(({ posts }) => {
        setBlogEntries(
          (posts as { title: string; excerpt: string; slug: string; tags: string[] }[]).map((p) => ({
            title: p.title,
            category: 'blog' as const,
            href: `/blog/${p.slug}`,
            snippet: [p.title, p.excerpt, ...(p.tags || [])].join(' '),
          }))
        );
      })
      .catch(() => {});
  }, []);

  const { search } = useSearch(blogEntries);
  const results = query.length >= 2 ? search(query) : [];

  // Group by category
  const grouped = Object.fromEntries(
    SECTION_ORDER.map((cat) => [cat, results.filter((r) => r.entry.category === cat)])
  ) as Record<typeof SECTION_ORDER[number], SearchResult[]>;

  const totalCount = results.length;

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Search Results</h1>
        {query && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {totalCount} result{totalCount !== 1 ? 's' : ''} for &ldquo;<span className="font-medium text-gray-700 dark:text-gray-300">{query}</span>&rdquo;
          </p>
        )}
      </div>

      {query.length >= 2 ? (
        totalCount > 0 ? (
          <div className="space-y-10">
            {SECTION_ORDER.map((cat) => {
              const items = grouped[cat];
              if (items.length === 0) return null;
              const meta = categoryMeta[cat];
              const Icon = meta.icon;
              return (
                <section key={cat}>
                  <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${meta.border}`}>
                    <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                    </div>
                    <h2 className={`text-sm font-bold uppercase tracking-wider ${meta.heading}`}>
                      {meta.label}
                    </h2>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((r, i) => <ResultCard key={i} result={r} query={query} />)}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try different keywords or check the spelling.</p>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Type a search query to find lessons, grammar, quizzes, and blog posts.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-10 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
