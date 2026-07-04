'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Table2, Brain, Newspaper, ArrowRight } from 'lucide-react';
import { useSearch, type SearchResult, type SearchEntry } from '@/hooks/useSearch';

const DROPDOWN_LIMIT = 10;

const categoryMeta = {
  lesson:  { icon: BookOpen,   label: 'Lesson',  color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
  grammar: { icon: Table2,     label: 'Grammar', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  quiz:    { icon: Brain,      label: 'Quiz',    color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20' },
  blog:    { icon: Newspaper,  label: 'Blog',    color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
};

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <span>{text}</span>;

  const parts: { text: string; bold: boolean }[] = [];
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let cursor = 0;

  while (cursor < text.length) {
    const idx = lower.indexOf(q, cursor);
    if (idx === -1) {
      parts.push({ text: text.slice(cursor), bold: false });
      break;
    }
    if (idx > cursor) {
      parts.push({ text: text.slice(cursor, idx), bold: false });
    }
    parts.push({ text: text.slice(idx, idx + query.length), bold: true });
    cursor = idx + query.length;
  }

  return (
    <span>
      {parts.map((p, i) =>
        p.bold ? (
          <strong key={i} className="text-blue-700 font-bold">{p.text}</strong>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [blogEntries, setBlogEntries] = useState<SearchEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { search } = useSearch(blogEntries);
  const router = useRouter();

  // Fetch blog posts once for search indexing
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
      .catch(() => {}); // fail silently — blog search degrades gracefully
  }, []);

  const doSearch = useCallback((q: string) => {
    setQuery(q);
    setSelectedIdx(-1);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const r = search(q);
    setResults(r);
    setOpen(r.length > 0);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && visibleResults[selectedIdx]) {
        router.push(visibleResults[selectedIdx].entry.href);
        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
      } else if (query.length >= 2) {
        goToFullSearch();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  function handleSelect(result: SearchResult) {
    router.push(result.entry.href);
    setOpen(false);
    setQuery('');
  }

  function goToFullSearch() {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
    inputRef.current?.blur();
  }

  const visibleResults = results.slice(0, DROPDOWN_LIMIT);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => doSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search lessons, grammar, quizzes… (⌘K)"
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all placeholder:text-gray-400 dark:text-gray-500 dark:text-gray-100"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
          {visibleResults.map((result, i) => {
            const meta = categoryMeta[result.entry.category];
            const Icon = meta.icon;
            return (
              <button
                key={i}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIdx(i)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  selectedIdx === i ? 'bg-blue-50 dark:bg-gray-700/60' : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'
                } ${i > 0 ? 'border-t border-gray-50 dark:border-gray-700/60' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      <HighlightMatch text={result.entry.title} query={query} />
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    <HighlightMatch text={result.matchedText} query={query} />
                  </p>
                </div>
              </button>
            );
          })}
          <button
            onClick={goToFullSearch}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/60 border-t border-gray-100 dark:border-gray-700/60 transition-colors"
          >
            Search all results ({results.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">No results for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
