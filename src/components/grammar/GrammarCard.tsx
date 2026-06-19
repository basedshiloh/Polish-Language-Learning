'use client';

import Link from 'next/link';
import * as icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { GrammarTopic, GrammarCategory } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'layers': icons.Layers,
  'grid': icons.Grid3x3,
  'target': icons.Target,
  'wrench': icons.Wrench,
  'minus-circle': icons.MinusCircle,
  'equal': icons.Equal,
  'table': icons.Table,
  'brain': icons.Brain,
  'clock': icons.Clock,
  'calculator': icons.Calculator,
  'map-pin': icons.MapPin,
  'users': icons.Users,
  'shopping-bag': icons.ShoppingBag,
  'gauge': icons.Gauge,
  'message-circle': icons.MessageCircle,
};

export const categoryStyles: Record<GrammarCategory, { label: string; bg: string; text: string }> = {
  pronunciation: { label: 'Pronunciation', bg: 'bg-rose-100', text: 'text-rose-700' },
  nouns: { label: 'Nouns', bg: 'bg-pink-100', text: 'text-pink-700' },
  cases: { label: 'Cases', bg: 'bg-purple-100', text: 'text-purple-700' },
  verbs: { label: 'Verbs', bg: 'bg-blue-100', text: 'text-blue-700' },
  numbers: { label: 'Numbers', bg: 'bg-green-100', text: 'text-green-700' },
  practical: { label: 'Practical', bg: 'bg-amber-100', text: 'text-amber-700' },
};

export default function GrammarCard({ topic }: { topic: GrammarTopic }) {
  const Icon = iconMap[topic.icon] || icons.BookOpen;
  const cat = categoryStyles[topic.category];

  return (
    <Link
      href={`/grammar/${topic.id}`}
      className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
          {cat.label}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
        {topic.title}
      </h3>
      {topic.polishTitle && (
        <p className="text-sm text-purple-600 font-medium mb-1">{topic.polishTitle}</p>
      )}
      <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">{topic.description}</p>

      <div className="flex items-center justify-end">
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
      </div>
    </Link>
  );
}
