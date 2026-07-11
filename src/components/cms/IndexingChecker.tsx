'use client';

import { useState, useCallback } from 'react';
import {
  Search, CheckCircle2, XCircle, AlertCircle, Clock,
  ExternalLink, Zap, RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react';

const SITE = 'https://www.polishpal.pl';

interface UrlEntry {
  url: string;
  label: string;
  type: 'post' | 'page';
}

type Verdict = 'PASS' | 'FAIL' | 'NEUTRAL' | 'error' | 'pending' | 'idle';

interface UrlResult {
  verdict: Verdict;
  coverageState?: string | null;
  lastCrawlTime?: string | null;
  googleCanonical?: string | null;
  error?: string;
}

interface Props {
  blogSlugs: string[];
  configured: boolean;
}

const STATIC_PAGES: UrlEntry[] = [
  { url: `${SITE}/`, label: 'Homepage', type: 'page' },
  { url: `${SITE}/lessons`, label: 'Lessons', type: 'page' },
  { url: `${SITE}/grammar`, label: 'Grammar', type: 'page' },
  { url: `${SITE}/quizzes`, label: 'Quizzes', type: 'page' },
  { url: `${SITE}/blog`, label: 'Blog index', type: 'page' },
  { url: `${SITE}/about`, label: 'About', type: 'page' },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function VerdictBadge({ verdict, small }: { verdict: Verdict; small?: boolean }) {
  const sz = small ? 'w-3.5 h-3.5' : 'w-4 h-4';
  if (verdict === 'PASS')
    return <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold text-xs"><CheckCircle2 className={sz} /> Indexed</span>;
  if (verdict === 'FAIL')
    return <span className="flex items-center gap-1 text-red-500 dark:text-red-400 font-semibold text-xs"><XCircle className={sz} /> Not indexed</span>;
  if (verdict === 'NEUTRAL')
    return <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-semibold text-xs"><AlertCircle className={sz} /> Unknown</span>;
  if (verdict === 'error')
    return <span className="flex items-center gap-1 text-orange-500 dark:text-orange-400 font-semibold text-xs"><AlertCircle className={sz} /> Error</span>;
  if (verdict === 'pending')
    return <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400 font-semibold text-xs"><RefreshCw className={`${sz} animate-spin`} /> Checking…</span>;
  return <span className="flex items-center gap-1 text-gray-300 dark:text-gray-600 text-xs"><Clock className={sz} /> —</span>;
}

export default function IndexingChecker({ blogSlugs, configured }: Props) {
  const allEntries: UrlEntry[] = [
    ...STATIC_PAGES,
    ...blogSlugs.map((s) => ({ url: `${SITE}/blog/${s}`, label: s, type: 'post' as const })),
  ];

  const [results, setResults] = useState<Record<string, UrlResult>>({});
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filterVerdict, setFilterVerdict] = useState<Verdict | 'all'>('all');

  const setResult = (url: string, r: UrlResult) =>
    setResults((prev) => ({ ...prev, [url]: r }));

  const checkOne = useCallback(async (url: string) => {
    setResult(url, { verdict: 'pending' });
    try {
      const res = await fetch('/api/cms/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(url, data);
    } catch {
      setResult(url, { verdict: 'error', error: 'Network error' });
    }
  }, []);

  const scanAll = useCallback(async () => {
    setScanning(true);
    setProgress({ done: 0, total: allEntries.length });
    for (let i = 0; i < allEntries.length; i++) {
      await checkOne(allEntries[i].url);
      setProgress({ done: i + 1, total: allEntries.length });
      // 350ms between requests — stay well within GSC rate limits
      if (i < allEntries.length - 1) await new Promise((r) => setTimeout(r, 350));
    }
    setProgress(null);
    setScanning(false);
  }, [allEntries, checkOne]);

  const counts = {
    indexed: Object.values(results).filter((r) => r.verdict === 'PASS').length,
    notIndexed: Object.values(results).filter((r) => r.verdict === 'FAIL').length,
    unknown: Object.values(results).filter((r) => r.verdict === 'NEUTRAL').length,
    error: Object.values(results).filter((r) => r.verdict === 'error').length,
  };

  const visible = filterVerdict === 'all'
    ? allEntries
    : allEntries.filter((e) => results[e.url]?.verdict === filterVerdict);

  if (!configured) {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Search className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Indexing Checker</h1>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-4">Setup required</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
            This feature uses the <strong>Google Search Console URL Inspection API</strong>. You need a service account with access to your Search Console property.
          </p>
          <ol className="text-sm text-amber-700 dark:text-amber-400 space-y-2 list-decimal list-inside">
            <li>Go to <strong>Google Cloud Console</strong> → IAM &amp; Admin → Service Accounts</li>
            <li>Create a new service account (no roles needed at project level)</li>
            <li>Create a JSON key for it and download it</li>
            <li>Go to <strong>Google Search Console</strong> → Settings → Users and permissions</li>
            <li>Add the service account email as a <strong>Full user</strong> or <strong>Owner</strong></li>
            <li>Add the JSON content as <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">GOOGLE_SERVICE_ACCOUNT_JSON</code> in Vercel environment variables</li>
            <li>Optionally set <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">GOOGLE_SEARCH_CONSOLE_SITE_URL</code> if your property is a domain property (e.g. <code>sc-domain:polishpal.pl</code>)</li>
            <li>Redeploy — the checker will be ready</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Indexing Checker</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Check which pages Google has indexed via the Search Console URL Inspection API.
          </p>
        </div>
        <button
          onClick={scanAll}
          disabled={scanning}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {scanning ? `Scanning… ${progress?.done}/${progress?.total}` : `Scan all ${allEntries.length} URLs`}
        </button>
      </div>

      {/* Progress bar */}
      {progress && (
        <div className="mb-6">
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{progress.done} of {progress.total} checked</p>
        </div>
      )}

      {/* Summary cards */}
      {Object.values(results).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Indexed', count: counts.indexed, color: 'text-green-600 dark:text-green-400', verdict: 'PASS' as Verdict },
            { label: 'Not indexed', count: counts.notIndexed, color: 'text-red-500 dark:text-red-400', verdict: 'FAIL' as Verdict },
            { label: 'Unknown', count: counts.unknown, color: 'text-amber-500 dark:text-amber-400', verdict: 'NEUTRAL' as Verdict },
            { label: 'Error', count: counts.error, color: 'text-orange-500 dark:text-orange-400', verdict: 'error' as Verdict },
          ].map(({ label, count, color, verdict }) => (
            <button
              key={label}
              onClick={() => setFilterVerdict(filterVerdict === verdict ? 'all' : verdict)}
              className={`rounded-xl p-3 text-left border transition-colors ${
                filterVerdict === verdict
                  ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <p className={`text-2xl font-black ${color}`}>{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Filter row */}
      {filterVerdict !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Filtered:</span>
          <button
            onClick={() => setFilterVerdict('all')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Show all →
          </button>
        </div>
      )}

      {/* URL list */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {visible.map((entry) => {
            const result = results[entry.url];
            const isExpanded = expanded[entry.url];
            const hasDetail = result && result.verdict !== 'idle' && result.verdict !== 'pending';

            return (
              <div key={entry.url}>
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Type badge */}
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                    entry.type === 'post'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {entry.type}
                  </span>

                  {/* URL */}
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-mono truncate flex-1 min-w-0">
                    {entry.url.replace('https://www.polishpal.pl', '')}
                  </span>

                  {/* Verdict */}
                  <div className="shrink-0">
                    <VerdictBadge verdict={result?.verdict ?? 'idle'} small />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Check single */}
                    <button
                      onClick={() => checkOne(entry.url)}
                      disabled={scanning || result?.verdict === 'pending'}
                      title="Re-check this URL"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    {/* Submit to IndexNow */}
                    <button
                      onClick={async () => {
                        await fetch('/api/cms/indexnow', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ urls: [entry.url] }),
                        });
                      }}
                      title="Submit to IndexNow"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                    {/* Open in Google */}
                    <a
                      href={`https://www.google.com/search?q=site:${encodeURIComponent(entry.url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Check on Google"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {/* Expand detail */}
                    {hasDetail && (
                      <button
                        onClick={() => setExpanded((p) => ({ ...p, [entry.url]: !p[entry.url] }))}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded detail row */}
                {isExpanded && result && (
                  <div className="px-4 pb-3 pt-0 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-50 dark:border-gray-800">
                    {result.error ? (
                      <p className="text-xs text-orange-600 dark:text-orange-400">{result.error}</p>
                    ) : (
                      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs">
                        {result.coverageState && (
                          <>
                            <dt className="text-gray-400 dark:text-gray-500">Coverage</dt>
                            <dd className="text-gray-700 dark:text-gray-300 col-span-1 sm:col-span-2">{result.coverageState}</dd>
                          </>
                        )}
                        {result.lastCrawlTime && (
                          <>
                            <dt className="text-gray-400 dark:text-gray-500">Last crawled</dt>
                            <dd className="text-gray-700 dark:text-gray-300 col-span-1 sm:col-span-2">{fmtDate(result.lastCrawlTime)}</dd>
                          </>
                        )}
                        {result.googleCanonical && (
                          <>
                            <dt className="text-gray-400 dark:text-gray-500">Google canonical</dt>
                            <dd className="text-gray-700 dark:text-gray-300 col-span-1 sm:col-span-2 truncate font-mono">{result.googleCanonical}</dd>
                          </>
                        )}
                      </dl>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Data from Google Search Console URL Inspection API · Rate-limited to ~3 checks/sec
      </p>
    </div>
  );
}
