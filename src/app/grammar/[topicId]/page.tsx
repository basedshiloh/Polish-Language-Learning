'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { grammarTopics } from '@/data/grammar';
import GrammarSectionView from '@/components/grammar/GrammarSectionView';
import { categoryStyles, GrammarIcon } from '@/components/grammar/GrammarCard';
import TableOfContents from '@/components/layout/TableOfContents';
import StarRating from '@/components/shared/StarRating';
import ShareBox from '@/components/shared/ShareBox';
import CommentSection from '@/components/shared/CommentSection';

export default function GrammarTopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);

  const sorted = [...grammarTopics].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((t) => t.id === topicId);
  const topic = sorted[index];

  if (!topic) notFound();

  const prev = index > 0 ? sorted[index - 1] : null;
  const next = index < sorted.length - 1 ? sorted[index + 1] : null;
  const cat = categoryStyles[topic.category];

  const tocItems = topic.sections
    .filter((s) => s.title)
    .map((s, i) => ({ id: `gsection-${i}`, title: s.title! }));

  let tocIdx = 0;

  return (
    <div>
      {/* ── Header band ─────────────────────────────────────── */}
      <section className="border-b-2 border-line bg-canvas">
        <div className="container-pp py-8 md:py-12">
          <Link
            href="/grammar"
            className="no-print mb-6 inline-flex items-center gap-1.5 rounded-xl text-sm font-extrabold text-muted transition-colors hover:text-violet-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
            Back to Grammar
          </Link>

          <div className="flex items-start gap-5">
            <span className={`icon-badge hidden h-16 w-16 rounded-[20px] sm:inline-flex ${cat.bg} ${cat.text}`}>
              <GrammarIcon icon={topic.icon} className="h-8 w-8" />
            </span>
            <div className="min-w-0 max-w-3xl">
              <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl">{topic.title}</h1>
              {topic.polishTitle && (
                <p lang="pl" className="polish-text mt-2 text-xl md:text-2xl">
                  {topic.polishTitle}
                </p>
              )}
              <p className="mt-3 text-lg leading-relaxed text-muted">{topic.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className={`chip ${cat.bg} ${cat.text}`}>{cat.label}</span>
                <StarRating itemId={topic.id} itemType="grammar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="container-pp py-10 md:py-12">
        <div className="flex gap-10">
          <div className="min-w-0 max-w-4xl flex-1">
            <div className="space-y-10 md:space-y-12">
              {topic.sections.map((section, i) => {
                const hasTocEntry = !!section.title;
                const sectionId = hasTocEntry ? `gsection-${tocIdx++}` : undefined;
                return (
                  <section key={i} id={sectionId} className="scroll-mt-24">
                    <GrammarSectionView section={section} />
                  </section>
                );
              })}
            </div>

            <ShareBox title={topic.title} label="topic" />

            <nav aria-label="Grammar topics" className="no-print mt-10 grid grid-cols-2 gap-3">
              {prev ? (
                <Link
                  href={`/grammar/${prev.id}`}
                  className="tile tile-link group flex items-center gap-3 px-4 py-3.5"
                >
                  <ArrowLeft
                    className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-violet-ink"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted">Previous</p>
                    <p className="truncate font-extrabold text-ink">{prev.title}</p>
                  </div>
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  href={`/grammar/${next.id}`}
                  className="tile tile-link group flex items-center justify-end gap-3 px-4 py-3.5 text-right"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted">Next</p>
                    <p className="truncate font-extrabold text-ink">{next.title}</p>
                  </div>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-violet-ink"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                </Link>
              ) : <div />}
            </nav>

            <CommentSection pageId={`grammar-${topic.id}`} pageType="grammar" />
          </div>

          <TableOfContents items={tocItems} />
        </div>
      </div>
    </div>
  );
}
