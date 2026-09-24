'use client';

import Link from 'next/link';
import { Clock, Check, ChevronRight } from 'lucide-react';
import * as icons from 'lucide-react';
import { Lesson, LessonLevel } from '@/lib/types';

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  /** The learner's next lesson on the path (first one not yet completed). */
  current?: boolean;
}

/** Per-level colour language shared by the lessons index and lesson pages. */
export const levelTone: Record<LessonLevel, { chip: string; solid: string; node: string; name: string }> = {
  A0: {
    chip: 'bg-cobalt-soft text-cobalt-ink',
    solid: 'bg-cobalt text-white shadow-[0_4px_0_var(--color-cobalt-edge)]',
    node: 'bg-cobalt-soft text-cobalt-ink shadow-[0_4px_0_color-mix(in_oklab,var(--color-cobalt)_35%,var(--color-cobalt-soft))]',
    name: 'Beginner',
  },
  A1: {
    chip: 'bg-teal-soft text-teal-ink',
    solid: 'bg-teal text-white shadow-[0_4px_0_var(--color-teal-edge)]',
    node: 'bg-teal-soft text-teal-ink shadow-[0_4px_0_color-mix(in_oklab,var(--color-teal)_35%,var(--color-teal-soft))]',
    name: 'Elementary',
  },
};

function getLessonIcon(iconName: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
    'hand-metal': icons.HandMetal,
    'hash': icons.Hash,
    'user': icons.User,
    'zap': icons.Zap,
    'coffee': icons.Coffee,
    'calendar': icons.Calendar,
    'book-open': icons.BookOpen,
    'languages': icons.Languages,
    'briefcase': icons.Briefcase,
    'heart': icons.Heart,
    'music': icons.Music,
    'utensils': icons.Utensils,
    'clock': icons.Clock,
    'shopping-bag': icons.ShoppingBag,
    'shirt': icons.Shirt,
    'mic': icons.Mic,
  };
  return iconMap[iconName] || icons.BookOpen;
}

export default function LessonCard({ lesson, completed, current = false }: LessonCardProps) {
  const Icon = getLessonIcon(lesson.icon);
  const tone = levelTone[lesson.level];

  const nodeClass = completed
    ? 'bg-emerald text-white shadow-[0_4px_0_var(--color-emerald-edge)]'
    : current
      ? 'bg-crimson text-white shadow-[0_4px_0_var(--color-crimson-edge)] ring-[6px] ring-crimson-soft'
      : tone.node;

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="group relative flex items-center gap-3 sm:gap-5 rounded-[22px]"
    >
      {/* Path node: lesson number in a tactile circle */}
      <span
        className={`relative z-10 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 mb-1 font-display text-lg sm:text-xl font-bold transition-transform duration-150 group-hover:-translate-y-0.5 ${nodeClass}`}
        aria-hidden="true"
      >
        {completed ? <Check className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={3.2} /> : lesson.order}
      </span>

      <div
        className={`tile flex-1 min-w-0 flex items-center gap-4 p-4 sm:p-5 transition-[transform,border-color] duration-150 group-hover:-translate-y-0.5 group-active:translate-y-px ${
          current ? 'border-crimson/40 group-hover:border-crimson/60' : 'group-hover:border-line-2'
        }`}
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-semibold leading-snug text-ink group-hover:text-crimson-ink transition-colors">
            <span className="sr-only">Lesson {lesson.order}: </span>
            {lesson.title}
          </h3>
          <p className="text-sm text-muted mt-1 line-clamp-2">{lesson.description}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-faint">
              <Clock className="w-3.5 h-3.5" strokeWidth={2.4} />
              ~{lesson.estimatedMinutes} min
            </span>
            {completed && (
              <span className="chip bg-emerald-soft text-emerald-ink">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                Completed
              </span>
            )}
            {!completed && current && (
              <span className="chip bg-crimson-soft text-crimson-ink">Up next</span>
            )}
          </div>
        </div>

        <span className={`icon-badge hidden sm:inline-flex ${completed ? 'bg-emerald-soft text-emerald-ink' : tone.chip}`}>
          <Icon className="w-5 h-5" strokeWidth={2.4} />
        </span>
        <ChevronRight className="w-5 h-5 text-faint shrink-0 group-hover:text-crimson-ink transition-colors" strokeWidth={2.6} />
      </div>
    </Link>
  );
}
