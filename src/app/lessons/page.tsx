'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import LessonCard from '@/components/lessons/LessonCard';
import ProgressBar from '@/components/shared/ProgressBar';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';
import type { LessonLevel } from '@/lib/types';

type Filter = 'all' | LessonLevel;

export default function LessonsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const { getLessonStatus, getOverallCompletion, mounted } = useProgress();

  const filtered = filter === 'all' ? lessons : lessons.filter((l) => l.level === filter);
  const { completed, total, percentage } = mounted ? getOverallCompletion() : { completed: 0, total: lessons.length, percentage: 0 };

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'A0 — Beginner', value: 'A0' },
    { label: 'A1 — Elementary', value: 'A1' },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
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

        <PageSidebar>
          <SidebarCard title="Your Progress" accent="blue">
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{completed} of {total}</span>
                <span className="font-semibold text-blue-600">{percentage}%</span>
              </div>
              <ProgressBar value={completed} max={total} size="md" />
            </div>
          </SidebarCard>

          <SidebarCard title="Learning Path" accent="green">
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {lessons.sort((a, b) => a.order - b.order).map((lesson) => {
                const done = mounted ? getLessonStatus(lesson.id) : false;
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="flex items-center gap-2 py-1.5 text-sm hover:text-blue-600 transition-colors"
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={done ? 'text-gray-400 line-through' : 'text-gray-700'}>
                      {lesson.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </SidebarCard>

          <SidebarCard title="Suggested" accent="amber">
            <div className="space-y-2">
              <Link href="/grammar" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Grammar Reference</span>
              </Link>
              <p className="text-xs text-gray-400">Review grammar tables alongside your lessons for deeper understanding.</p>
            </div>
          </SidebarCard>
        </PageSidebar>
      </div>
    </div>
  );
}
