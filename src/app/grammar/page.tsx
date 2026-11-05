'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, BookOpen, Table2, GraduationCap } from 'lucide-react';
import { grammarTopics } from '@/data/grammar';
import GrammarCard, { categoryStyles } from '@/components/grammar/GrammarCard';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';
import Wycinanka from '@/components/shared/Wycinanka';
import type { GrammarCategory, GrammarTopic } from '@/lib/types';

type Filter = 'all' | GrammarCategory;

const filterOrder: GrammarCategory[] = ['nouns', 'cases', 'verbs', 'numbers', 'practical'];

const essentialTopics = [
  { id: 'noun-gender', label: 'Noun Gender (M/F/N)' },
  { id: 'cases-overview', label: 'The 4 Cases' },
  { id: 'three-conjugations', label: '3 Conjugations side-by-side' },
  { id: 'znac-wiedziec-umiec', label: 'znać vs wiedzieć vs umieć' },
  { id: 'telling-time', label: 'Telling the Time' },
  { id: 'polish-cities', label: 'Polish Cities (from/in)' },
  { id: 'frequency-adverbs', label: 'Frequency Adverbs' },
];

/** Group topics by category (in filter order, then any others), preserving topic order. */
function groupByCategory(topics: GrammarTopic[]) {
  const order: GrammarCategory[] = [
    ...filterOrder,
    ...topics.map((t) => t.category).filter((c) => !filterOrder.includes(c)),
  ];
  const seen = new Set<GrammarCategory>();
  const groups: { category: GrammarCategory; topics: GrammarTopic[] }[] = [];
  for (const c of order) {
    if (seen.has(c)) continue;
    seen.add(c);
    const inGroup = topics.filter((t) => t.category === c);
    if (inGroup.length) groups.push({ category: c, topics: inGroup });
  }
  return groups;
}

export default function GrammarPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const sorted = [...grammarTopics].sort((a, b) => a.order - b.order);
  const filtered = filter === 'all' ? sorted : sorted.filter((t) => t.category === filter);

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    ...filterOrder
      .filter((c) => grammarTopics.some((t) => t.category === c))
      .map((c) => ({ label: categoryStyles[c].label, value: c })),
  ];

  const groups = groupByCategory(filtered);
  const categoryCount = new Set(grammarTopics.map((t) => t.category)).size;

  return (
    <div>
      {/* ── Header band ─────────────────────────────────────── */}
      <section className="border-b-2 border-line bg-canvas">
        <div className="container-pp flex items-center gap-10 py-12 md:py-16">
          <div className="min-w-0 flex-1">
            <h1 className="text-4xl font-bold md:text-5xl">Grammar Reference</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted">
              In-depth explanations with tables for the tricky parts — gender, cases, conjugations, and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip bg-violet-soft text-violet-ink">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
                {grammarTopics.length} topics
              </span>
              <span className="chip bg-paper text-ink-2 ring-2 ring-inset ring-line">
                <Table2 className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
                {categoryCount} categories
              </span>
              <span className="chip bg-sun-soft text-sun-ink">
                <GraduationCap className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
                A0 – A1
              </span>
            </div>
          </div>
          <Wycinanka className="pp-float hidden h-44 w-auto shrink-0 md:block lg:h-52" />
        </div>
      </section>

      {/* ── Topics ──────────────────────────────────────────── */}
      <div className="container-pp py-10 md:py-12">
        <div className="flex gap-8">
          <div className="min-w-0 flex-1">
            <div
              className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-2"
              role="group"
              aria-label="Filter topics by category"
            >
              {filters.map((f) => {
                const active = filter === f.value;
                const activeClass =
                  f.value === 'all'
                    ? 'bg-ink border-ink text-white shadow-[0_3px_0_#000]'
                    : `${categoryStyles[f.value].solid} ${categoryStyles[f.value].edge} text-white`;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    aria-pressed={active}
                    className={`mb-1 inline-flex items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-extrabold transition-colors ${
                      active
                        ? activeClass
                        : 'border-line bg-paper text-muted hover:border-line-2 hover:text-ink'
                    }`}
                  >
                    {f.value !== 'all' && !active && (
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${categoryStyles[f.value].solid}`}
                        aria-hidden="true"
                      />
                    )}
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className={filter === 'all' ? 'gap-6 lg:columns-2' : ''}>
              {groups.map(({ category, topics }) => {
                const style = categoryStyles[category];
                return (
                  <section
                    key={category}
                    aria-labelledby={`grammar-group-${category}`}
                    className="tile mb-6 break-inside-avoid overflow-hidden"
                  >
                    <div className={`flex items-center justify-between gap-3 px-5 py-4 ${style.bg}`}>
                      <h2
                        id={`grammar-group-${category}`}
                        className={`text-2xl font-semibold ${style.text}`}
                      >
                        {style.label}
                      </h2>
                      <span className={`chip bg-paper ${style.text}`}>
                        {topics.length} {topics.length === 1 ? 'topic' : 'topics'}
                      </span>
                    </div>
                    <div className={`p-2 ${filter === 'all' ? '' : 'grid md:grid-cols-2'}`}>
                      {topics.map((topic) => (
                        <GrammarCard key={topic.id} topic={topic} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <PageSidebar>
            <SidebarCard title="Exam Essentials" accent="purple">
              <p className="mb-3 text-xs text-muted">Start with these for the best exam prep:</p>
              <div className="space-y-2">
                {essentialTopics.map((t) => (
                  <Link
                    key={t.id}
                    href={`/grammar/${t.id}`}
                    className="flex items-center gap-2 text-sm font-semibold text-ink-2 transition-colors hover:text-violet-ink"
                  >
                    <Star className="h-3.5 w-3.5 shrink-0 fill-sun text-sun-edge" aria-hidden="true" />
                    <span>{t.label}</span>
                  </Link>
                ))}
              </div>
            </SidebarCard>

            <SidebarCard title="By Category" accent="blue">
              <div className="space-y-2">
                {filterOrder.filter((c) => grammarTopics.some((t) => t.category === c)).map((c) => {
                  const count = grammarTopics.filter((t) => t.category === c).length;
                  const style = categoryStyles[c];
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFilter(c)}
                      className="flex w-full items-center justify-between rounded-xl px-1 py-0.5 text-sm transition-colors hover:bg-canvas"
                    >
                      <span className={`chip ${style.bg} ${style.text}`}>{style.label}</span>
                      <span className="text-xs font-extrabold text-muted">{count}</span>
                    </button>
                  );
                })}
              </div>
            </SidebarCard>
          </PageSidebar>
        </div>
      </div>
    </div>
  );
}
