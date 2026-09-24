'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { BookOpen, Table2, Brain, Newspaper, Search, ArrowRight } from 'lucide-react';
import { useSearch, type SearchResult, type SearchEntry } from '@/hooks/useSearch';

const categoryMeta = {
  lesson:  { icon: BookOpen,  label: 'Lessons',    tone: 'bg-crimson-soft text-crimson-ink' },
  grammar: { icon: Table2,    label: 'Grammar',    tone: 'bg-violet-soft text-violet-ink' },
  quiz:    { icon: Brain,     label: 'Quizzes',    tone: 'bg-emerald-soft text-emerald-ink' },
  blog:    { icon: Newspaper, label: 'Blog Posts', tone: 'bg-orange-soft text-orange-ink' },
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
          ? <mark key={i} className="bg-sun-soft text-ink font-extrabold rounded px-0.5">{p.text}</mark>
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
      className="group flex items-start gap-4 px-4 py-4 md:px-5 hover:bg-canvas transition-colors"
    >
      <span className={`icon-badge w-10 h-10 rounded-xl ${meta.tone}`}>
        <Icon className="w-5 h-5" strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-extrabold text-ink leading-snug mb-1 group-hover:text-crimson-ink transition-colors">
          <HighlightMatch text={result.entry.title} query={query} />
        </p>
        <p className="text-sm text-muted leading-relaxed line-clamp-2">
          <HighlightMatch text={result.matchedText} query={query} />
        </p>
      </div>
      <ArrowRight className="w-4 h-4 mt-1 text-faint group-hover:text-ink transition-colors shrink-0" strokeWidth={2.5} />
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
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">Search Results</h1>
            {query && (
              <p className="text-muted text-lg mt-4">
                {totalCount} result{totalCount !== 1 ? 's' : ''} for &ldquo;<span className="font-bold text-ink">{query}</span>&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container-pp py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
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
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="leading-none">
                          <span className={`chip text-sm px-3.5 py-1.5 uppercase tracking-[0.08em] font-sans ${meta.tone}`}>
                            <Icon className="w-4 h-4" strokeWidth={2.5} />
                            {meta.label}
                          </span>
                        </h2>
                        <span className="text-sm font-extrabold text-muted">
                          {items.length}
                        </span>
                      </div>
                      <div className="tile divide-y-2 divide-line overflow-hidden">
                        {items.map((r, i) => <ResultCard key={i} result={r} query={query} />)}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="tile p-10 md:p-14 text-center">
                <span className="icon-badge w-14 h-14 rounded-2xl bg-canvas text-muted mx-auto mb-4">
                  <Search className="w-7 h-7" strokeWidth={2.4} />
                </span>
                <p className="text-lg font-extrabold text-ink">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-base text-muted mt-1">Try different keywords or check the spelling.</p>
              </div>
            )
          ) : (
            <div className="tile p-10 md:p-14 text-center">
              <span className="icon-badge w-14 h-14 rounded-2xl bg-cobalt-soft text-cobalt-ink mx-auto mb-4">
                <Search className="w-7 h-7" strokeWidth={2.4} />
              </span>
              <p className="text-lg font-bold text-ink-2 max-w-md mx-auto">Type a search query to find lessons, grammar, quizzes, and blog posts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="bg-canvas border-b-2 border-line">
          <div className="container-pp py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
              <div className="h-11 bg-line rounded-2xl w-72 max-w-full mb-4" />
              <div className="h-5 bg-line rounded-full w-56" />
            </div>
          </div>
        </div>
        <div className="container-pp py-10 md:py-14">
          <div className="max-w-3xl mx-auto space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-canvas rounded-2xl" />)}
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
