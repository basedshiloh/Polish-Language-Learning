'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { grammarTopics } from '@/data/grammar';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import GrammarSectionView from '@/components/grammar/GrammarSectionView';
import { categoryStyles, GrammarIcon } from '@/components/grammar/GrammarCard';
import TableOfContents from '@/components/layout/TableOfContents';
import StarRating from '@/components/shared/StarRating';
import ShareBox from '@/components/shared/ShareBox';
import CommentSection from '@/components/shared/CommentSection';
import Zubek from '@/components/shared/Zubek';

// Which lessons teach each grammar topic (checked against the lesson content).
// znac-wiedziec-umiec has no dedicated lesson yet, so it shows no block.
const PRACTICE_LESSONS: Record<string, string[]> = {
  'noun-gender': ['nominative-gender'],
  'cases-overview': ['nominative-gender', 'accusative-case', 'instrumental-case', 'genitive-case'],
  accusative: ['accusative-case'],
  instrumental: ['instrumental-case'],
  genitive: ['genitive-case'],
  byc: ['pronouns-byc'],
  'three-conjugations': ['conjugation-am-asz', 'conjugation-e-isz', 'conjugation-uje'],
  'telling-time': ['daily-routine-time'],
  'numbers-reference': ['numbers-counting'],
  'polish-cities': ['introductions', 'conjugation-am-asz'],
  pronouns: ['pronouns-byc', 'family-possessives'],
  'shopping-money': ['shopping-clothing'],
  'frequency-adverbs': ['hobbies-free-time'],
  'questions-answers': ['introductions'],
};

function PracticeBlock({ topicId }: { topicId: string }) {
  const items = (PRACTICE_LESSONS[topicId] ?? [])
    .map((id) => lessons.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => !!l)
    .map((lesson) => ({ lesson, quiz: quizzes.find((q) => q.id === lesson.relatedQuizId) }));
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="practise-topic" className="no-print mt-12">
      <div className="mb-4 flex items-end gap-3">
        <Zubek pose="teach" className="w-14 shrink-0 sm:w-16" />
        <h2 id="practise-topic" className="text-2xl font-semibold leading-tight md:text-[1.7rem]">
          Practise this topic
        </h2>
      </div>
      <ul className="space-y-3">
        {items.map(({ lesson, quiz }) => (
          <li key={lesson.id} className="tile p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
              Lesson {lesson.order} · {lesson.level} · about {lesson.estimatedMinutes} min
            </p>
            <Link href={`/lessons/${lesson.id}`} className="mt-1 inline-block text-lg font-extrabold text-ink hover:text-crimson-ink">
              {lesson.title}
            </Link>
            <p className="mt-1 text-base leading-relaxed text-ink-2">{lesson.description}</p>
            {quiz && (
              <p className="mt-2 text-base text-ink-2">
                Then test yourself:{' '}
                <Link href={`/quizzes/${quiz.id}`} className="font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt">
                  {quiz.title}
                </Link>{' '}
                ({quiz.questions.length} questions)
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

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

            <PracticeBlock topicId={topic.id} />

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
