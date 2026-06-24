'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, Brain, BookOpen, Info, RotateCcw } from 'lucide-react';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import Badge from '@/components/shared/Badge';
import VocabularyTable from '@/components/lessons/VocabularyTable';
import GrammarBlock from '@/components/lessons/GrammarBlock';
import DialogueBlock from '@/components/lessons/DialogueBlock';
import PhraseList from '@/components/lessons/PhraseList';
import TableOfContents from '@/components/layout/TableOfContents';

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const lesson = lessons.find((l) => l.id === lessonId);
  const { mounted, getLessonStatus, markLessonComplete, unmarkLessonComplete } = useProgress();

  if (!lesson) notFound();

  const completed = mounted ? getLessonStatus(lesson.id) : false;

  const tocItems = lesson.content.map((block, i) => ({
    id: `section-${i}`,
    title: block.title,
  }));

  return (
    <div className="p-6 md:p-10">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0 max-w-4xl">
          <Link
            href="/lessons"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={lesson.level === 'A0' ? 'blue' : 'green'}>{lesson.level}</Badge>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                ~{lesson.estimatedMinutes} min
              </div>
              {completed && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-500 mt-1">{lesson.description}</p>
          </div>

          <div className="space-y-8">
            {lesson.content.map((block, i) => (
              <section key={i} id={`section-${i}`} className="bg-white dark:bg-gray-900 rounded-xl p-5 md:p-6 border border-gray-100 dark:border-gray-800 scroll-mt-8">
                <div className="flex items-center gap-2 mb-4">
                  {block.type === 'vocabulary' && <BookOpen className="w-5 h-5 text-blue-600" />}
                  {block.type === 'grammar' && <Brain className="w-5 h-5 text-blue-600" />}
                  {block.type === 'dialogue' && <BookOpen className="w-5 h-5 text-purple-600" />}
                  {block.type === 'phrases' && <BookOpen className="w-5 h-5 text-green-600" />}
                  {block.type === 'cultural-note' && <Info className="w-5 h-5 text-amber-600" />}
                  <h2 className="text-lg font-semibold text-gray-900">{block.title}</h2>
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
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-sm text-amber-900 leading-relaxed">{block.culturalNote}</p>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {!completed ? (
              <button
                onClick={() => markLessonComplete(lesson.id)}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark as Complete
              </button>
            ) : (
              <button
                onClick={() => unmarkLessonComplete(lesson.id)}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Mark as Not Complete
              </button>
            )}
            {lesson.relatedQuizId && (
              <Link
                href={`/quizzes/${lesson.relatedQuizId}`}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Brain className="w-5 h-5" />
                Take the Quiz
              </Link>
            )}
          </div>
        </div>

        <TableOfContents items={tocItems} />
      </div>
    </div>
  );
}
