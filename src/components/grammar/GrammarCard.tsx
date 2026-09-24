'use client';

import Link from 'next/link';
import * as icons from 'lucide-react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { GrammarTopic, GrammarCategory } from '@/lib/types';

const iconMap: Record<string, LucideIcon> = {
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

/** The topic's lucide icon (falls back to a book). Decorative. */
export function GrammarIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = iconMap[icon] || icons.BookOpen;
  return <Icon className={className} strokeWidth={2.4} aria-hidden="true" />;
}

/**
 * Each grammar category gets one Wycinanki palette colour, used consistently
 * for chips, icon badges, group headers and active filters.
 * `bg` = soft tint, `text` = ink on tint, `solid` = full colour, `edge` = 3D bottom edge,
 * `hover` = title colour on hover.
 */
export const categoryStyles: Record<
  GrammarCategory,
  { label: string; bg: string; text: string; solid: string; edge: string; hover: string }
> = {
  pronunciation: {
    label: 'Pronunciation',
    bg: 'bg-teal-soft',
    text: 'text-teal-ink',
    solid: 'bg-teal border-teal',
    edge: 'shadow-[0_3px_0_var(--color-teal-edge)]',
    hover: 'group-hover:text-teal-ink',
  },
  nouns: {
    label: 'Nouns',
    bg: 'bg-fuchsia-soft',
    text: 'text-fuchsia-ink',
    solid: 'bg-fuchsia border-fuchsia',
    edge: 'shadow-[0_3px_0_var(--color-fuchsia-edge)]',
    hover: 'group-hover:text-fuchsia-ink',
  },
  cases: {
    label: 'Cases',
    bg: 'bg-violet-soft',
    text: 'text-violet-ink',
    solid: 'bg-violet border-violet',
    edge: 'shadow-[0_3px_0_var(--color-violet-edge)]',
    hover: 'group-hover:text-violet-ink',
  },
  verbs: {
    label: 'Verbs',
    bg: 'bg-cobalt-soft',
    text: 'text-cobalt-ink',
    solid: 'bg-cobalt border-cobalt',
    edge: 'shadow-[0_3px_0_var(--color-cobalt-edge)]',
    hover: 'group-hover:text-cobalt-ink',
  },
  numbers: {
    label: 'Numbers',
    bg: 'bg-emerald-soft',
    text: 'text-emerald-ink',
    solid: 'bg-emerald border-emerald',
    edge: 'shadow-[0_3px_0_var(--color-emerald-edge)]',
    hover: 'group-hover:text-emerald-ink',
  },
  practical: {
    label: 'Practical',
    bg: 'bg-orange-soft',
    text: 'text-orange-ink',
    solid: 'bg-orange border-orange',
    edge: 'shadow-[0_3px_0_var(--color-orange-edge)]',
    hover: 'group-hover:text-orange-ink',
  },
};

/** A topic row, designed to sit inside a colour-coded category panel on /grammar. */
export default function GrammarCard({ topic }: { topic: GrammarTopic }) {
  const cat = categoryStyles[topic.category];

  return (
    <Link
      href={`/grammar/${topic.id}`}
      className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-canvas"
    >
      <span className={`icon-badge mt-0.5 ${cat.bg} ${cat.text}`}>
        <GrammarIcon icon={topic.icon} className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className={`text-lg font-semibold leading-snug text-ink transition-colors ${cat.hover}`}>
          {topic.title}
        </h3>
        {topic.polishTitle && (
          <span lang="pl" className="polish-text block text-sm leading-snug">
            {topic.polishTitle}
          </span>
        )}
        <span className="mt-1 block text-sm leading-relaxed text-muted line-clamp-2">
          {topic.description}
        </span>
      </div>

      <ChevronRight
        className="mt-3 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
        strokeWidth={2.6}
        aria-hidden="true"
      />
    </Link>
  );
}
