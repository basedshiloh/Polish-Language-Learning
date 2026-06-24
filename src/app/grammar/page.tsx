'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { grammarTopics } from '@/data/grammar';
import GrammarCard, { categoryStyles } from '@/components/grammar/GrammarCard';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';
import type { GrammarCategory } from '@/lib/types';

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

  return (
    <div className="p-6 md:p-10">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Grammar Reference</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              In-depth explanations with tables for the tricky parts — gender, cases, conjugations, and more.
            </p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((topic) => (
              <GrammarCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>

        <PageSidebar>
          <SidebarCard title="Exam Essentials" accent="purple">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Start with these for the best exam prep:</p>
            <div className="space-y-2">
              {essentialTopics.map((t) => (
                <Link
                  key={t.id}
                  href={`/grammar/${t.id}`}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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
                    onClick={() => setFilter(c)}
                    className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors"
                  >
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </SidebarCard>
        </PageSidebar>
      </div>
    </div>
  );
}
