'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, BookOpen, ArrowRight, Trophy } from 'lucide-react';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import LessonCard, { levelTone } from '@/components/lessons/LessonCard';
import ProgressBar from '@/components/shared/ProgressBar';
import Wycinanka from '@/components/shared/Wycinanka';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';
import type { LessonLevel } from '@/lib/types';

type Filter = 'all' | LessonLevel;

const LEVELS: LessonLevel[] = ['A0', 'A1'];

export default function LessonsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const { getLessonStatus, getOverallCompletion, mounted } = useProgress();

  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  const filtered = filter === 'all' ? ordered : ordered.filter((l) => l.level === filter);
  const { completed, total, percentage } = mounted ? getOverallCompletion() : { completed: 0, total: lessons.length, percentage: 0 };

  const isDone = (id: string) => (mounted ? getLessonStatus(id) : false);
  // The learner's next step on the path: first lesson (by order) not yet completed.
  const nextLesson = ordered.find((l) => !isDone(l.id));

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'A0 — Beginner', value: 'A0' },
    { label: 'A1 — Elementary', value: 'A1' },
  ];

  const groups = LEVELS.map((level) => ({
    level,
    items: filtered.filter((l) => l.level === level),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {/* Header band */}
      <section className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16 flex items-center gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl md:text-5xl font-bold">Lessons</h1>
            <p className="text-lg text-muted mt-3 max-w-xl">Learn Polish step by step, from greetings to telling time.</p>

            <div className="flex flex-wrap gap-2 mt-6">
              <span className="chip bg-paper text-ink-2 border-2 border-line">
                <BookOpen className="w-3.5 h-3.5" strokeWidth={2.6} />
                {lessons.length} lessons
              </span>
              <span className="chip bg-paper text-ink-2 border-2 border-line">A0 → A1</span>
              <span className="chip bg-emerald-soft text-emerald-ink border-2 border-transparent">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.6} />
                {completed} of {total} done
              </span>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-5">
              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.id}`} className="btn btn-primary w-full sm:w-auto">
                  {completed > 0 ? `Continue: lesson ${nextLesson.order}` : 'Start lesson 1'}
                  <ArrowRight className="w-4 h-4" strokeWidth={2.8} />
                </Link>
              ) : (
                <span className="chip bg-sun-soft text-sun-ink text-sm">
                  <Trophy className="w-4 h-4" strokeWidth={2.4} />
                  All lessons complete
                </span>
              )}
              <div className="w-full sm:max-w-xs xl:hidden">
                <ProgressBar value={completed} max={total} size="md" />
              </div>
            </div>
          </div>

          <Wycinanka className="hidden md:block w-32 lg:w-40 shrink-0" />
        </div>
      </section>

      <div className="container-pp py-10 md:py-14">
        <div className="flex gap-10">
          <div className="flex-1 min-w-0">
            <div className="max-w-3xl">
              {/* Level filter: segmented control */}
              <div className="flex gap-1 p-1 mb-10 w-fit max-w-full overflow-x-auto rounded-2xl bg-canvas border-2 border-line" role="group" aria-label="Filter lessons by level">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    aria-pressed={filter === f.value}
                    className={`px-4 py-2 rounded-xl text-sm font-extrabold whitespace-nowrap transition-colors ${
                      filter === f.value
                        ? 'bg-paper text-ink shadow-[0_2px_0_var(--color-line-2)]'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="space-y-14">
                {groups.map(({ level, items }) => {
                  const tone = levelTone[level];
                  const doneInLevel = items.filter((l) => isDone(l.id)).length;
                  return (
                    <section key={level} aria-labelledby={`level-${level}`}>
                      <div className="flex items-center gap-4 mb-7">
                        <span
                          className={`flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 font-display text-xl font-bold ${tone.solid}`}
                          aria-hidden="true"
                        >
                          {level}
                        </span>
                        <div className="min-w-0">
                          <h2 id={`level-${level}`} className="text-2xl md:text-3xl font-semibold">
                            <span className="sr-only">{level} </span>
                            {tone.name}
                          </h2>
                          <p className="text-sm font-bold text-muted mt-0.5">
                            Level {level} · {items.length} lessons · {doneInLevel} done
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        {/* The path: a rail running behind the numbered nodes */}
                        <span
                          className="absolute left-6 sm:left-7 top-8 bottom-8 w-1.5 -translate-x-1/2 rounded-full bg-line"
                          aria-hidden="true"
                        />
                        <ol className="relative space-y-4">
                          {items.map((lesson) => (
                            <li key={lesson.id} className="relative">
                              <LessonCard
                                lesson={lesson}
                                completed={isDone(lesson.id)}
                                current={mounted && nextLesson?.id === lesson.id}
                              />
                            </li>
                          ))}
                        </ol>
                      </div>
                    </section>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted font-semibold">No lessons found for this filter.</p>
                </div>
              )}
            </div>
          </div>

          <PageSidebar>
            <SidebarCard title="Your Progress" accent="blue">
              <div className="flex justify-between items-baseline text-sm mb-2">
                <span className="font-bold text-muted">{completed} of {total}</span>
                <span className="font-display text-2xl font-bold text-emerald-ink">{percentage}%</span>
              </div>
              <ProgressBar value={completed} max={total} size="md" />
            </SidebarCard>

            <SidebarCard title="Learning Path" accent="green">
              <div className="space-y-0.5 max-h-80 overflow-y-auto -mx-2">
                {ordered.map((lesson) => {
                  const done = isDone(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-semibold hover:bg-canvas hover:text-crimson-ink transition-colors"
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" strokeWidth={2.6} />
                      ) : (
                        <Circle className="w-4 h-4 text-line-2 shrink-0" strokeWidth={2.6} />
                      )}
                      <span className={done ? 'text-muted line-through' : 'text-ink-2'}>
                        {lesson.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </SidebarCard>

            <SidebarCard title="Suggested" accent="amber">
              <div className="space-y-2">
                <Link href="/grammar" className="flex items-center gap-2.5 text-sm font-extrabold text-ink hover:text-violet-ink transition-colors">
                  <span className="icon-badge w-8 h-8 rounded-lg bg-violet-soft text-violet-ink">
                    <BookOpen className="w-4 h-4" strokeWidth={2.4} />
                  </span>
                  <span>Grammar Reference</span>
                </Link>
                <p className="text-xs text-muted leading-relaxed">Review grammar tables alongside your lessons for deeper understanding.</p>
              </div>
            </SidebarCard>
          </PageSidebar>
        </div>
      </div>
    </>
  );
}
