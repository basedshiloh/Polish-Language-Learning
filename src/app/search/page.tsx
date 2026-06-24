'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { BookOpen, Table2, Brain, Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

const categoryMeta = {
  lesson: { icon: BookOpen, label: 'Lesson', color: 'text-blue-600', bg: 'bg-blue-50' },
  grammar: { icon: Table2, label: 'Grammar', color: 'text-purple-600', bg: 'bg-purple-50' },
  quiz: { icon: Brain, label: 'Quiz', color: 'text-green-600', bg: 'bg-green-50' },
};

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
      {parts.map((p, i) => p.bold ? <strong key={i} className="text-blue-700 font-bold">{p.text}</strong> : <span key={i}>{p.text}</span>)}
    </span>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { search } = useSearch();
  const results = query.length >= 2 ? search(query) : [];

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Search Results</h1>
        {query && (
          <p className="text-gray-500 mt-1">
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;<span className="font-medium text-gray-700">{query}</span>&quot;
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result, i) => {
            const meta = categoryMeta[result.entry.category];
            const Icon = meta.icon;
            return (
              <Link
                key={i}
                href={result.entry.href}
                className="flex items-start gap-4 bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-gray-900">
                      <HighlightMatch text={result.entry.title} query={query} />
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    <HighlightMatch text={result.matchedText} query={query} />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : query.length >= 2 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No results found for &quot;{query}&quot;</p>
          <p className="text-sm text-gray-400 mt-1">Try different keywords or check the spelling.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Type a search query to find lessons, grammar topics, and quizzes.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-64 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
