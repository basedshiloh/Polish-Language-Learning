'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Brain, Check, X, ListChecks, PenLine, Shuffle } from 'lucide-react';
import type { Quiz, Question } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import ProgressBar from '@/components/shared/ProgressBar';
import MultipleChoice from '@/components/quiz/MultipleChoice';
import FillInBlank from '@/components/quiz/FillInBlank';
import Matching from '@/components/quiz/Matching';
import QuizResults from '@/components/quiz/QuizResults';

interface AnswerRecord {
  questionId: string;
  correct: boolean;
  userAnswer: string;
}

/** The right answer to show in the feedback bar after a miss (presentation only). */
function correctAnswerText(q: Question): string | null {
  if (q.type === 'multiple-choice') return q.options[q.correctIndex] ?? null;
  if (q.type === 'fill-in-blank') return q.correctAnswer;
  return null;
}

function explanationText(q: Question): string | undefined {
  return q.type === 'matching' ? undefined : q.explanation;
}

const TYPE_META = {
  'multiple-choice': { label: 'Multiple choice', icon: ListChecks, tone: 'bg-cobalt-soft text-cobalt-ink' },
  'fill-in-blank': { label: 'Fill in the blank', icon: PenLine, tone: 'bg-sun-soft text-sun-ink' },
  matching: { label: 'Matching', icon: Shuffle, tone: 'bg-fuchsia-soft text-fuchsia-ink' },
} as const;

export default function QuizClient({ quiz }: { quiz: Quiz }) {
  const { saveQuizAttempt } = useProgress();

  const [phase, setPhase] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [currentAnswered, setCurrentAnswered] = useState(false);
  const continueRef = useRef<HTMLButtonElement>(null);

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  const handleAnswer = useCallback((correct: boolean, answer: string) => {
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, correct, userAnswer: answer }]);
    setCurrentAnswered(true);
  }, [currentQuestion?.id]);

  // Move keyboard focus to the continue button when the feedback bar appears,
  // so Enter/Space carries the learner straight on (Duolingo-style).
  useEffect(() => {
    if (currentAnswered) continueRef.current?.focus({ preventScroll: true });
  }, [currentAnswered]);

  function handleNext() {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswered(false);
    } else {
      const correctCount = answers.length > 0 ? answers.filter((a) => a.correct).length : 0;
      const score = Math.round((correctCount / totalQuestions) * 100);

      saveQuizAttempt({
        quizId: quiz.id,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        completedAt: new Date().toISOString(),
        answers,
      });

      setPhase('results');
    }
  }

  function handleRetake() {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswered(false);
  }

  if (phase === 'intro') {
    const typeCounts = (Object.keys(TYPE_META) as (keyof typeof TYPE_META)[])
      .map((type) => ({ type, count: quiz.questions.filter((q) => q.type === type).length }))
      .filter((t) => t.count > 0);

    return (
      <div className="bg-canvas min-h-[calc(100dvh-4.25rem)]">
        <div className="container-pp py-8 md:py-14">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-muted hover:text-ink mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.6} />
              Back to Quizzes
            </Link>

            <div className="tile p-7 sm:p-10 text-center pp-pop">
              <span className="icon-badge w-16 h-16 rounded-2xl bg-emerald-soft text-emerald-ink mx-auto mb-6">
                <Brain className="w-8 h-8" strokeWidth={2.4} />
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold mb-3">{quiz.title}</h1>
              <p className="text-muted text-lg mb-6 max-w-md mx-auto">{quiz.description}</p>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <span className="chip bg-ink text-white">{totalQuestions} questions</span>
                {typeCounts.map(({ type, count }) => {
                  const meta = TYPE_META[type];
                  const Icon = meta.icon;
                  return (
                    <span key={type} className={`chip ${meta.tone}`}>
                      <Icon className="w-3.5 h-3.5" strokeWidth={2.6} />
                      {count} × {meta.label}
                    </span>
                  );
                })}
              </div>

              <button
                onClick={() => setPhase('active')}
                className="btn btn-green btn-lg w-full sm:w-auto sm:min-w-64"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const correctCount = answers.filter((a) => a.correct).length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="bg-canvas">
        <div className="container-pp py-8 md:py-14">
          <div className="max-w-2xl mx-auto">
            <QuizResults
              score={score}
              correct={correctCount}
              total={totalQuestions}
              quizTitle={quiz.title}
              lessonId={quiz.lessonId}
              onRetake={handleRetake}
            />
          </div>
        </div>
      </div>
    );
  }

  const lastAnswer = currentAnswered ? answers[answers.length - 1] : undefined;
  const isLast = currentIndex + 1 >= totalQuestions;
  const rightAnswer = correctAnswerText(currentQuestion);
  const explanation = explanationText(currentQuestion);

  return (
    <div className="container-pp py-6 md:py-10">
      <div className="max-w-3xl mx-auto">
        {/* Top bar: exit · progress · counter */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <Link
            href="/quizzes"
            aria-label="Exit quiz — back to all quizzes"
            title="Back to Quizzes"
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl text-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={2.8} />
          </Link>
          <div className="flex-1 min-w-0">
            <ProgressBar value={currentIndex + 1} max={totalQuestions} size="lg" color="bg-emerald" />
          </div>
          <span className="text-sm font-extrabold text-muted tabular-nums shrink-0" aria-label={`Question ${currentIndex + 1} of ${totalQuestions}`}>
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <h1 className="text-base font-semibold text-muted mb-3">{quiz.title}</h1>

        <div className="mb-6">
          {currentQuestion.type === 'multiple-choice' && (
            <MultipleChoice
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          )}
          {currentQuestion.type === 'fill-in-blank' && (
            <FillInBlank
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          )}
          {currentQuestion.type === 'matching' && (
            <Matching
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          )}
        </div>

        {/* Feedback bar — pops in once the question is answered */}
        <div role="status" aria-live="polite" className="sticky bottom-3 z-10">
          {lastAnswer && (
            <div
              className={`pp-pop rounded-3xl border-2 border-b-4 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                lastAnswer.correct
                  ? 'bg-emerald-soft border-emerald/30 text-emerald-ink'
                  : 'bg-crimson-soft border-crimson/25 text-crimson-ink'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-full shrink-0 text-white ${
                    lastAnswer.correct ? 'bg-emerald' : 'bg-crimson'
                  }`}
                >
                  {lastAnswer.correct
                    ? <Check className="w-6 h-6" strokeWidth={3.2} aria-hidden="true" />
                    : <X className="w-6 h-6" strokeWidth={3.2} aria-hidden="true" />}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-xl font-semibold leading-tight">
                    {lastAnswer.correct
                      ? currentQuestion.type === 'matching' ? 'All pairs matched — perfect!' : 'Correct!'
                      : currentQuestion.type === 'matching' ? 'All pairs matched' : 'Not quite'}
                  </p>
                  {!lastAnswer.correct && rightAnswer && (
                    <p className="mt-1 text-sm font-semibold">
                      Correct answer: <strong className="font-extrabold">{rightAnswer}</strong>
                    </p>
                  )}
                  {!lastAnswer.correct && currentQuestion.type === 'matching' && (
                    <p className="mt-1 text-sm font-semibold">{lastAnswer.userAnswer}</p>
                  )}
                  {explanation && (
                    <p className="mt-1 text-sm text-ink-2">{explanation}</p>
                  )}
                </div>
              </div>
              <button
                ref={continueRef}
                onClick={handleNext}
                className={`btn ${lastAnswer.correct ? 'btn-green' : 'btn-primary'} w-full sm:w-auto shrink-0`}
              >
                {isLast ? 'See Results' : <>Continue <ArrowRight className="w-4 h-4" strokeWidth={2.8} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
