'use client';

import { useState } from 'react';
import { grammarTopics } from '@/data/grammar';
import GrammarCard, { categoryStyles } from '@/components/grammar/GrammarCard';
import type { GrammarCategory } from '@/lib/types';

type Filter = 'all' | GrammarCategory;

const filterOrder: GrammarCategory[] = ['nouns', 'cases', 'verbs', 'numbers', 'practical'];

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
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Grammar Reference</h1>
        <p className="text-gray-500 mt-1">
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
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
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
  );
}
