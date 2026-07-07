'use client';

import { useState, useCallback } from 'react';
import { Zap, CheckSquare, Square, RefreshCw, ExternalLink, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface UrlEntry {
  url: string;
  label: string;
  type: 'blog' | 'lesson' | 'grammar' | 'quiz' | 'page';
}

interface Props {
  blogSlugs: string[];
  indexNowKey: string;
}

const TYPE_STYLES: Record<UrlEntry['type'], { bg: string; text: string; darkBg: string; darkText: string }> = {
  blog:    { bg: 'bg-amber-100',  text: 'text-amber-700',  darkBg: 'dark:bg-amber-900/30',  darkText: 'dark:text-amber-400' },
  lesson:  { bg: 'bg-blue-100',   text: 'text-blue-700',   darkBg: 'dark:bg-blue-900/30',   darkText: 'dark:text-blue-400' },
  grammar: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' },
  quiz:    { bg: 'bg-green-100',  text: 'text-green-700',  darkBg: 'dark:bg-green-900/30',  darkText: 'dark:text-green-400' },
  page:    { bg: 'bg-gray-100',   text: 'text-gray-700',   darkBg: 'dark:bg-gray-800',      darkText: 'dark:text-gray-400' },
};

const STATIC_PAGES: UrlEntry[] = [
  { url: 'https://www.polishpal.pl/', label: 'Homepage', type: 'page' },
  { url: 'https://www.polishpal.pl/lessons', label: 'Lessons index', type: 'page' },
  { url: 'https://www.polishpal.pl/grammar', label: 'Grammar index', type: 'page' },
  { url: 'https://www.polishpal.pl/quizzes', label: 'Quizzes index', type: 'page' },
  { url: 'https://www.polishpal.pl/blog', label: 'Blog index', type: 'page' },
];

export default function IndexNowManager({ blogSlugs, indexNowKey }: Props) {
  const allEntries: UrlEntry[] = [
    ...STATIC_PAGES,
    ...blogSlugs.map((slug) => ({
      url: `https://www.polishpal.pl/blog/${slug}`,
      label: slug,
      type: 'blog' as const,
    })),
  ];

  const [selected, setSelected] = useState<Set<string>>(new Set(allEntries.map((e) => e.url)));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; submitted?: number; status?: number; urls?: string[]; error?: string } | null>(null);
  const [filterType, setFilterType] = useState<UrlEntry['type'] | 'all'>('all');

  const visible = filterType === 'all' ? allEntries : allEntries.filter((e) => e.type === filterType);
  const allVisibleSelected = visible.every((e) => selected.has(e.url));
  const noneVisibleSelected = visible.every((e) => !selected.has(e.url));

  function toggle(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  function toggleAll() {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        visible.forEach((e) => next.delete(e.url));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        visible.forEach((e) => next.add(e.url));
        return next;
      });
    }
  }

  const submit = useCallback(async () => {
    const urls = [...selected];
    if (urls.length === 0) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/cms/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ ok: false, error: String(e) });
    } finally {
      setSubmitting(false);
    }
  }, [selected]);

  const keyFileUrl = `https://www.polishpal.pl/${indexNowKey}.txt`;
  const types: UrlEntry['type'][] = ['blog', 'lesson', 'grammar', 'quiz', 'page'];

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">IndexNow</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Instantly notify Bing, Yandex, and other search engines about new or updated content.
          </p>
        </div>
        <button
          onClick={submit}
          disabled={submitting || selected.size === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {submitting ? 'Submitting…' : `Submit ${selected.size} URL${selected.size !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Key info card */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Setup</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide font-medium">API Key</p>
            <code className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 font-mono text-gray-800 dark:text-gray-200 break-all">
              {indexNowKey}
            </code>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide font-medium">Key File</p>
            <a
              href={keyFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all"
            >
              {keyFileUrl} <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-xl mb-6 ${
          result.ok
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          {result.ok
            ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            : <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />}
          <div>
            {result.ok ? (
              <>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  {result.submitted} URL{result.submitted !== 1 ? 's' : ''} submitted successfully (HTTP {result.status})
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                  Bing, Yandex, and participating engines will crawl these URLs shortly.
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">{result.error || 'Submission failed'}</p>
            )}
          </div>
        </div>
      )}

      {/* Filter + select all */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All ({allEntries.length})
          </button>
          {types.map((t) => {
            const count = allEntries.filter((e) => e.type === t).length;
            if (count === 0) return null;
            const s = TYPE_STYLES[t];
            return (
              <button
                key={t}
                onClick={() => setFilterType(filterType === t ? 'all' : t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  filterType === t ? `${s.bg} ${s.text} ${s.darkBg} ${s.darkText}` : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t} ({count})
              </button>
            );
          })}
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {allVisibleSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          {allVisibleSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      {/* URL list */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {visible.map((entry) => {
            const isSelected = selected.has(entry.url);
            const s = TYPE_STYLES[entry.type];
            return (
              <label
                key={entry.url}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(entry.url)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${s.bg} ${s.text} ${s.darkBg} ${s.darkText}`}>
                  {entry.type}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-mono truncate flex-1">
                  {entry.url}
                </span>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-300 dark:text-gray-600 hover:text-blue-500 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </label>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        {selected.size} of {allEntries.length} URLs selected · New and updated posts are submitted automatically on publish
      </p>
    </div>
  );
}
