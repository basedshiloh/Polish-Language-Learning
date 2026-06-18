'use client';

import { useState } from 'react';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import LessonCard from '@/components/lessons/LessonCard';
import type { LessonLevel } from '@/lib/types';

type Filter = 'all' | LessonLevel;

export default function LessonsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const { getLessonStatus, mounted } = useProgress();

  const filtered = filter === 'all' ? lessons : lessons.filter((l) => l.level === filter);

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'A0 — Beginner', value: 'A0' },
    { label: 'A1 — Elementary', value: 'A1' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lessons</h1>
        <p className="text-gray-500 mt-1">Learn Polish step by step, from greetings to telling time.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered
          .sort((a, b) => a.order - b.order)
          .map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={mounted ? getLessonStatus(lesson.id) : false}
            />
          ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No lessons found for this filter.</p>
        </div>
      )}
    </div>
  );
}
