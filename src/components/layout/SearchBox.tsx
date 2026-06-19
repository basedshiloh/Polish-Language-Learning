'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Table2, Brain } from 'lucide-react';
import { useSearch, type SearchResult } from '@/hooks/useSearch';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { search } = useSearch();
  const router = useRouter();

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
    } else if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      e.preventDefault();
      router.push(results[selectedIdx].entry.href);
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
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

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => doSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search lessons, grammar, quizzes… (⌘K)"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((result, i) => {
            const meta = categoryMeta[result.entry.category];
            const Icon = meta.icon;
            return (
              <button
                key={i}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIdx(i)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  selectedIdx === i ? 'bg-blue-50' : 'hover:bg-gray-50'
                } ${i > 0 ? 'border-t border-gray-50' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      <HighlightMatch text={result.entry.title} query={query} />
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    <HighlightMatch text={result.matchedText} query={query} />
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-gray-400">No results for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
