import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen } from 'lucide-react';
import { quizzes } from '@/data/quizzes';
import { lessons } from '@/data/lessons';
import type { Quiz } from '@/lib/types';
import JsonLd from '@/components/seo/JsonLd';
import { pageMetadata, composeDescription, SITE_URL } from '@/lib/seo';
import QuizClient from './QuizClient';

interface Props {
  params: Promise<{ quizId: string }>;
}

const TYPE_LABELS = {
  'multiple-choice': 'multiple choice',
  'fill-in-blank': 'fill in the blank',
  matching: 'matching',
} as const;

/** "6 multiple choice, 4 fill in the blank and 2 matching", from the quiz's real questions. */
function typeBreakdown(quiz: Quiz): { label: string; count: number }[] {
  return (Object.keys(TYPE_LABELS) as (keyof typeof TYPE_LABELS)[])
    .map((type) => ({ label: TYPE_LABELS[type], count: quiz.questions.filter((q) => q.type === type).length }))
    .filter((t) => t.count > 0);
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export function generateStaticParams() {
  return quizzes.map((q) => ({ quizId: q.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { quizId } = await params;
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return {};

  const types = joinList(typeBreakdown(quiz).map((t) => t.label));
  return pageMetadata({
    title: quiz.title,
    description: composeDescription(
      quiz.description,
      [
        `${quiz.questions.length} questions with instant feedback: ${types}.`,
        `${quiz.questions.length} questions with instant feedback.`,
        `${quiz.questions.length} questions.`,
      ],
      ['Free, no sign-up.'],
    ),
    path: `/quizzes/${quiz.id}`,
  });
}

export default async function QuizPage({ params }: Props) {
  const { quizId } = await params;
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) notFound();

  const lesson = lessons.find((l) => l.id === quiz.lessonId);
  const breakdown = typeBreakdown(quiz);
  const topics = lesson ? lesson.content.map((b) => b.title).filter(Boolean) : [];
  const url = `${SITE_URL}/quizzes/${quiz.id}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          name: quiz.title,
          description: quiz.description,
          url,
          inLanguage: 'en',
          isAccessibleForFree: true,
          learningResourceType: 'Quiz',
          ...(lesson ? { educationalLevel: lesson.level, about: { '@type': 'Thing', name: lesson.title } } : {}),
          provider: { '@type': 'Organization', name: 'PolishPal', url: SITE_URL },
        }}
      />

      <QuizClient quiz={quiz} />

      {/* Server-rendered summary: the interactive quiz above is client state,
          so this is the text crawlers and no-JS readers get. */}
      <section aria-labelledby="quiz-about" className="no-print border-t-2 border-line bg-paper">
        <div className="container-pp py-10 md:py-14">
          <div className="max-w-2xl mx-auto text-[17px] leading-relaxed text-ink-2">
            <h2 id="quiz-about" className="text-2xl md:text-[1.75rem] font-bold leading-tight mb-4">
              What this quiz covers
            </h2>
            {lesson && (
              <p className="mb-4">
                This quiz goes with lesson {lesson.order},{' '}
                <Link href={`/lessons/${lesson.id}`} className="font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt">
                  {lesson.title}
                </Link>{' '}
                ({lesson.level} level, about {lesson.estimatedMinutes} minutes). {lesson.description}
              </p>
            )}
            <p className="mb-6">
              It has {quiz.questions.length} questions:{' '}
              {joinList(breakdown.map((t) => `${t.count} ${t.label}`))}. After each answer you see straight away
              whether you were right, with the correct answer and a short explanation when you miss. Your score is
              saved in this browser, so you can track it on your progress page and retake the quiz as often as you like.
            </p>

            {topics.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mb-3">Sections of the lesson it tests</h3>
                <ul className="tile px-6 py-5 pl-10 list-disc marker:text-crimson space-y-1.5 mb-6">
                  {topics.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </>
            )}

            {lesson && (
              <Link href={`/lessons/${lesson.id}`} className="btn btn-secondary btn-sm">
                <BookOpen className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                Review the lesson first
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
