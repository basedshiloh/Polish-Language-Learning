'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Table2, Brain, Newspaper, ArrowRight } from 'lucide-react';
import { useSearch, type SearchResult, type SearchEntry } from '@/hooks/useSearch';

const DROPDOWN_LIMIT = 10;

const categoryMeta = {
  lesson:  { icon: BookOpen,   label: 'Lesson',  tone: 'bg-crimson-soft text-crimson-ink' },
  grammar: { icon: Table2,     label: 'Grammar', tone: 'bg-violet-soft text-violet-ink' },
  quiz:    { icon: Brain,      label: 'Quiz',    tone: 'bg-emerald-soft text-emerald-ink' },
  blog:    { icon: Newspaper,  label: 'Blog',    tone: 'bg-orange-soft text-orange-ink' },
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
          <mark key={i} className="bg-sun-soft text-ink font-extrabold rounded px-0.5">{p.text}</mark>
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

  // Auto-focus when mounted (e.g. inside search modal)
  useEffect(() => { inputRef.current?.focus(); }, []);

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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" strokeWidth={2.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => doSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search lessons, grammar, quizzes… (⌘K)"
          aria-label="Search lessons, grammar, quizzes and blog posts"
          className="w-full h-14 pl-12 pr-12 bg-canvas border-2 border-line rounded-2xl text-base font-semibold text-ink outline-none focus:border-cobalt focus:bg-paper transition-colors placeholder:text-muted placeholder:font-semibold"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-line transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full tile shadow-[0_18px_40px_-18px_rgba(30,33,50,0.3)] z-50 overflow-hidden max-h-[70vh] overflow-y-auto p-1.5">
          {visibleResults.map((result, i) => {
            const meta = categoryMeta[result.entry.category];
            const Icon = meta.icon;
            return (
              <button
                key={i}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIdx(i)}
                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                  selectedIdx === i ? 'bg-cobalt-soft' : 'hover:bg-canvas'
                }`}
              >
                <span className={`icon-badge w-9 h-9 rounded-xl ${meta.tone}`}>
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2.4} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[15px] font-extrabold text-ink leading-snug">
                      <HighlightMatch text={result.entry.title} query={query} />
                    </span>
                    <span className={`chip text-[10px] px-2 py-0.5 uppercase ${meta.tone}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-[13px] text-muted mt-1 leading-relaxed line-clamp-2">
                    <HighlightMatch text={result.matchedText} query={query} />
                  </p>
                </div>
              </button>
            );
          })}
          <button
            onClick={goToFullSearch}
            className="w-full flex items-center justify-center gap-2 mt-1 px-4 py-3 rounded-xl text-[13px] font-extrabold uppercase tracking-[0.06em] text-cobalt-ink bg-canvas hover:bg-cobalt-soft transition-colors"
          >
            Search all results ({results.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full tile shadow-[0_18px_40px_-18px_rgba(30,33,50,0.3)] z-50 p-5 text-center">
          <p className="text-sm font-semibold text-muted">No results for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
