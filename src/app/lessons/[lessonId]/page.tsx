'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Brain, BookOpen, Landmark,
  MessagesSquare, MessageCircle, RotateCcw, PartyPopper, Flag,
} from 'lucide-react';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import { levelTone } from '@/components/lessons/LessonCard';
import VocabularyTable from '@/components/lessons/VocabularyTable';
import GrammarBlock from '@/components/lessons/GrammarBlock';
import DialogueBlock from '@/components/lessons/DialogueBlock';
import PhraseList from '@/components/lessons/PhraseList';
import TableOfContents from '@/components/layout/TableOfContents';
import StarRating from '@/components/shared/StarRating';
import ShareBox from '@/components/shared/ShareBox';
import CommentSection from '@/components/shared/CommentSection';
import type { ContentBlockType } from '@/lib/types';

const blockStyle: Record<ContentBlockType, { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; tone: string }> = {
  vocabulary: { icon: BookOpen, tone: 'bg-crimson-soft text-crimson-ink' },
  grammar: { icon: Brain, tone: 'bg-violet-soft text-violet-ink' },
  dialogue: { icon: MessagesSquare, tone: 'bg-cobalt-soft text-cobalt-ink' },
  phrases: { icon: MessageCircle, tone: 'bg-teal-soft text-teal-ink' },
  'cultural-note': { icon: Landmark, tone: 'bg-paper text-orange-ink' },
};

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const lesson = lessons.find((l) => l.id === lessonId);
  const { mounted, getLessonStatus, markLessonComplete, unmarkLessonComplete } = useProgress();

  if (!lesson) notFound();

  const completed = mounted ? getLessonStatus(lesson.id) : false;
  const tone = levelTone[lesson.level];

  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((l) => l.id === lesson.id);
  const prevLesson = index > 0 ? ordered[index - 1] : undefined;
  const nextLesson = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined;

  const tocItems = lesson.content.map((block, i) => ({
    id: `section-${i}`,
    title: block.title,
  }));

  return (
    <div className="container-pp py-8 md:py-12">
      <div className="flex justify-center gap-10">
        <div className="flex-1 min-w-0 max-w-3xl">
          <Link
            href="/lessons"
            className="no-print inline-flex items-center gap-1.5 text-sm font-extrabold text-muted hover:text-crimson-ink mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.6} />
            Back to Lessons
          </Link>

          {/* Lesson header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`chip ${tone.chip}`}>{lesson.level}</span>
              <span className="chip bg-canvas text-ink-2">Lesson {lesson.order} of {ordered.length}</span>
              <span className="chip bg-canvas text-muted">
                <Clock className="w-3.5 h-3.5" strokeWidth={2.6} />
                ~{lesson.estimatedMinutes} min
              </span>
              {completed && (
                <span className="chip bg-emerald-soft text-emerald-ink">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.6} />
                  Completed
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1]">{lesson.title}</h1>
            <p className="text-lg text-muted mt-3">{lesson.description}</p>
            <div className="mt-4">
              <StarRating itemId={lesson.id} itemType="lesson" />
            </div>
          </header>

          <div className="space-y-6 md:space-y-8">
            {lesson.content.map((block, i) => {
              const { icon: Icon, tone: blockTone } = blockStyle[block.type];
              const isNote = block.type === 'cultural-note';
              return (
                <section
                  key={i}
                  id={`section-${i}`}
                  className={`scroll-mt-24 p-5 md:p-7 ${isNote ? 'rounded-3xl bg-orange-soft' : 'tile'}`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`icon-badge ${blockTone}`}>
                      <Icon className="w-5 h-5" strokeWidth={2.4} />
                    </span>
                    <h2 className={`text-xl md:text-2xl font-semibold ${isNote ? 'text-orange-ink' : ''}`}>{block.title}</h2>
                  </div>

                  {block.type === 'vocabulary' && block.vocabulary && (
                    <VocabularyTable items={block.vocabulary} />
                  )}
                  {block.type === 'grammar' && block.grammar && (
                    <GrammarBlock points={block.grammar} />
                  )}
                  {block.type === 'dialogue' && block.dialogue && (
                    <DialogueBlock lines={block.dialogue} />
                  )}
                  {block.type === 'phrases' && block.phrases && (
                    <PhraseList phrases={block.phrases} />
                  )}
                  {block.type === 'cultural-note' && block.culturalNote && (
                    <p className="text-ink-2 text-[17px] leading-relaxed">{block.culturalNote}</p>
                  )}
                </section>
              );
            })}
          </div>

          {/* Finish line: completion + quiz */}
          <div
            className={`no-print mt-10 rounded-3xl p-5 md:p-7 flex flex-col md:flex-row md:items-center gap-5 ${
              completed ? 'bg-emerald-soft' : 'bg-canvas'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className={`icon-badge ${completed ? 'bg-emerald text-white' : 'bg-paper text-crimson-ink'}`}>
                {completed ? <PartyPopper className="w-5 h-5" strokeWidth={2.4} /> : <Flag className="w-5 h-5" strokeWidth={2.4} />}
              </span>
              <p className={`font-display text-lg font-semibold leading-snug ${completed ? 'text-emerald-ink' : 'text-ink'}`}>
                {completed ? 'Nice work, this lesson is complete.' : 'Finished this lesson? Mark it complete to track your progress.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {!completed ? (
                <button
                  type="button"
                  onClick={() => markLessonComplete(lesson.id)}
                  className="btn btn-green w-full sm:w-auto"
                >
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2.6} />
                  Mark as Complete
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => unmarkLessonComplete(lesson.id)}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  <RotateCcw className="w-5 h-5" strokeWidth={2.6} />
                  Mark as Not Complete
                </button>
              )}
              {lesson.relatedQuizId && (
                <Link
                  href={`/quizzes/${lesson.relatedQuizId}`}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  <Brain className="w-5 h-5" strokeWidth={2.6} />
                  Take the Quiz
                </Link>
              )}
            </div>
          </div>

          {/* Previous / next lesson */}
          {(prevLesson || nextLesson) && (
            <nav aria-label="Lesson navigation" className="no-print mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prevLesson && (
                <Link href={`/lessons/${prevLesson.id}`} className="tile tile-link group flex items-center gap-3 p-4">
                  <ArrowLeft className="w-5 h-5 text-faint shrink-0 group-hover:text-crimson-ink transition-colors" strokeWidth={2.6} />
                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold text-muted">Previous · Lesson {prevLesson.order}</span>
                    <span className="block font-bold text-ink truncate">{prevLesson.title}</span>
                  </span>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/lessons/${nextLesson.id}`}
                  className="tile tile-link group flex items-center justify-end gap-3 p-4 text-right sm:col-start-2"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold text-muted">Next · Lesson {nextLesson.order}</span>
                    <span className="block font-bold text-ink truncate">{nextLesson.title}</span>
                  </span>
                  <ArrowRight className="w-5 h-5 text-faint shrink-0 group-hover:text-crimson-ink transition-colors" strokeWidth={2.6} />
                </Link>
              )}
            </nav>
          )}

          <ShareBox title={lesson.title} label="lesson" />

          <CommentSection pageId={`lesson-${lesson.id}`} pageType="lesson" />
        </div>

        <TableOfContents items={tocItems} />
      </div>
    </div>
  );
}
