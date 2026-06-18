'use client';

import Link from 'next/link';
import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import * as icons from 'lucide-react';
import { Lesson } from '@/lib/types';
import Badge from '@/components/shared/Badge';

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
}

function getLessonIcon(iconName: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

export default function LessonCard({ lesson, completed }: LessonCardProps) {
  const Icon = getLessonIcon(lesson.icon);

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${
          completed ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Icon className="w-6 h-6 text-blue-600" />
          )}
        </div>
        <Badge variant={lesson.level === 'A0' ? 'blue' : 'green'}>{lesson.level}</Badge>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
        {lesson.title}
      </h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{lesson.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>~{lesson.estimatedMinutes} min</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  );
}
