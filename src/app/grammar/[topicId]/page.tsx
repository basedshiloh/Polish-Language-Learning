'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { grammarTopics } from '@/data/grammar';
import GrammarSectionView from '@/components/grammar/GrammarSectionView';
import { categoryStyles } from '@/components/grammar/GrammarCard';

export default function GrammarTopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);

  const sorted = [...grammarTopics].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((t) => t.id === topicId);
  const topic = sorted[index];

  if (!topic) notFound();

  const prev = index > 0 ? sorted[index - 1] : null;
  const next = index < sorted.length - 1 ? sorted[index + 1] : null;
  const cat = categoryStyles[topic.category];

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <Link
        href="/grammar"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Grammar
      </Link>

      <div className="mb-8">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
          {cat.label}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">{topic.title}</h1>
        {topic.polishTitle && (
          <p className="text-lg text-purple-600 font-medium">{topic.polishTitle}</p>
        )}
        <p className="text-gray-500 mt-1">{topic.description}</p>
      </div>

      <div className="space-y-8">
        {topic.sections.map((section, i) => (
          <section key={i} className="bg-white rounded-xl p-5 md:p-6 border border-gray-100">
            <GrammarSectionView section={section} />
          </section>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            href={`/grammar/${prev.id}`}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-purple-200 hover:shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Previous</p>
              <p className="text-sm font-medium text-gray-800 truncate">{prev.title}</p>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/grammar/${next.id}`}
            className="flex items-center justify-end gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-purple-200 hover:shadow-sm transition-all text-right"
          >
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Next</p>
              <p className="text-sm font-medium text-gray-800 truncate">{next.title}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
