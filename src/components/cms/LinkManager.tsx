'use client';

import { useState, useMemo } from 'react';
import { Link2, ChevronDown, ChevronRight, ArrowUpRight, ArrowDownLeft, CornerDownRight, AlertTriangle, ExternalLink } from 'lucide-react';
import type { LinkAudit } from '@/lib/link-audit';

type Filter = 'all' | 'Post' | 'Lesson' | 'Grammar';
type View = 'out' | 'in';
type Sort = 'most' | 'least' | 'title';

interface InboundSource {
  title: string;
  url: string;
  kind: LinkAudit['kind'];
  anchor: string;
}

function norm(u: string): string {
  return u
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?polishpal\.pl/, '')
    .replace(/\/$/, '');
}

export default function LinkManager({ audits }: { audits: LinkAudit[] }) {
  const [view, setView] = useState<View>('out');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('most');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Reverse index: page URL → who links to it (internal links pointing at audited pages)
  const inbound = useMemo(() => {
    const byUrl = new Map(audits.map((a) => [norm(a.url), a]));
    const map = new Map<string, InboundSource[]>();
    for (const a of audits) {
      for (const l of a.links) {
        if (l.type !== 'internal') continue;
        const key = norm(l.url);
        if (!byUrl.has(key)) continue; // only count links to pages we audit
        if (key === norm(a.url)) continue; // ignore self-links
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ title: a.title, url: a.url, kind: a.kind, anchor: l.anchor });
      }
    }
    return map;
  }, [audits]);

  const inboundCount = (a: LinkAudit) => inbound.get(norm(a.url))?.length || 0;

  const totals = useMemo(() => {
    const internal = audits.reduce((s, a) => s + a.internal, 0);
    const external = audits.reduce((s, a) => s + a.external, 0);
    const dupes = audits.filter((a) => a.duplicates.length > 0).length;
    const orphans = audits.filter((a) => inboundCount(a) === 0).length;
    return { internal, external, dupes, orphans };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audits, inbound]);

  const rows = useMemo(() => {
    const list = filter === 'all' ? audits : audits.filter((a) => a.kind === filter);
    const metric = (a: LinkAudit) => (view === 'out' ? a.internal + a.external : inboundCount(a));
    return [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'least') return metric(a) - metric(b);
      return metric(b) - metric(a); // most
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audits, filter, view, sort, inbound]);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Link Manager</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Audit links across the site. <strong>Outbound</strong> = links going out from a page (watch duplicates for stuffing).
          <strong> Inbound</strong> = how many pages link to it (0 = orphan page).
        </p>

        {/* View toggle */}
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 mb-5">
          <button
            onClick={() => { setView('out'); setExpanded(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'out' ? 'bg-blue-600 text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <ArrowUpRight className="w-4 h-4" /> Outbound
          </button>
          <button
            onClick={() => { setView('in'); setExpanded(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'in' ? 'bg-blue-600 text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <ArrowDownLeft className="w-4 h-4" /> Inbound
          </button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">Internal (out)</p>
            <p className="text-2xl font-bold text-blue-600">{totals.internal}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">External (out)</p>
            <p className="text-2xl font-bold text-purple-600">{totals.external}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">Duplicates</p>
            <p className={`text-2xl font-bold ${totals.dupes > 0 ? 'text-amber-600' : 'text-green-600'}`}>{totals.dupes}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">Orphan pages</p>
            <p className={`text-2xl font-bold ${totals.orphans > 0 ? 'text-amber-600' : 'text-green-600'}`}>{totals.orphans}</p>
          </div>
        </div>

        {/* Kind filter + sort */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex gap-2">
            {(['all', 'Post', 'Lesson', 'Grammar'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {f === 'all' ? 'All' : `${f}s`}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 outline-none text-gray-700 dark:text-gray-300"
          >
            <option value="most">Most links</option>
            <option value="least">Fewest links</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((a) => {
            const isOpen = expanded === a.url;
            const hasDupes = a.duplicates.length > 0;
            const inCount = inboundCount(a);
            const sources = inbound.get(norm(a.url)) || [];
            return (
              <div key={a.url} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : a.url)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{a.kind}</span>
                      {view === 'out' && hasDupes && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="w-3 h-3" /> {a.duplicates.length} duplicate{a.duplicates.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {view === 'in' && inCount === 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="w-3 h-3" /> orphan
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{a.title}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    {view === 'out' ? (
                      <>
                        <span className="flex items-center gap-1 text-blue-600" title="Internal outbound"><CornerDownRight className="w-3.5 h-3.5" /> {a.internal}</span>
                        <span className="flex items-center gap-1 text-purple-600" title="External outbound"><ArrowUpRight className="w-3.5 h-3.5" /> {a.external}</span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 font-medium" title="Inbound internal links"><ArrowDownLeft className="w-3.5 h-3.5" /> {inCount}</span>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-3">
                    {view === 'out' ? (
                      <>
                        {a.duplicates.length > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg p-2.5">
                            <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Repeated links (consider reducing)
                            </p>
                            <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-0.5">
                              {a.duplicates.map((d) => (<li key={d.url}>{d.url} <span className="font-semibold">×{d.count}</span></li>))}
                            </ul>
                          </div>
                        )}
                        {a.links.length === 0 ? (
                          <p className="text-xs text-gray-400 dark:text-gray-500 py-2">No outgoing links.</p>
                        ) : (
                          <ul className="space-y-1.5">
                            {a.links.map((l, i) => {
                              const dup = a.duplicates.some((d) => d.url === l.url.replace(/\/$/, '').toLowerCase());
                              return (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${l.type === 'internal' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
                                    {l.type === 'internal' ? 'INT' : 'EXT'}
                                  </span>
                                  {l.type === 'external' && l.rel && (
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${l.rel === 'dofollow' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'}`}>
                                      {l.rel}
                                    </span>
                                  )}
                                  <span className="text-gray-700 dark:text-gray-300 truncate max-w-[35%]" title={l.anchor}>{l.anchor}</span>
                                  <span className="text-gray-300 dark:text-gray-600">→</span>
                                  <span className={`truncate ${dup ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`} title={l.url}>{l.url}</span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </>
                    ) : (
                      sources.length === 0 ? (
                        <p className="text-xs text-amber-600 dark:text-amber-400 py-2 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> No pages link here. Add internal links to this page to fix the orphan.
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {sources.map((s, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 shrink-0 w-14">{s.kind}</span>
                              <span className="text-gray-700 dark:text-gray-300 truncate max-w-[45%]" title={s.title}>{s.title}</span>
                              <span className="text-gray-300 dark:text-gray-600">via</span>
                              <span className="text-gray-400 dark:text-gray-500 truncate" title={s.anchor}>&ldquo;{s.anchor}&rdquo;</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}

                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <ExternalLink className="w-3 h-3" /> View page
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
