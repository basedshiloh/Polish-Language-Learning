import Link from 'next/link';
import { Trophy, RotateCcw, ArrowLeft, Check, X } from 'lucide-react';
import Wycinanka from '@/components/shared/Wycinanka';

interface QuizResultsProps {
  score: number;
  correct: number;
  total: number;
  quizTitle: string;
  lessonId: string;
  onRetake: () => void;
}

export default function QuizResults({ score, correct, total, quizTitle, lessonId, onRetake }: QuizResultsProps) {
  const message = score >= 80
    ? 'Świetnie! (Excellent!)'
    : score >= 60
    ? 'Dobrze! (Good!) Keep practicing!'
    : 'Keep going! Review the lesson and try again.';

  const tier = score >= 80 ? 'great' : score >= 60 ? 'good' : 'low';
  const scoreTone = {
    great: 'text-emerald-ink',
    good: 'text-sun-ink',
    low: 'text-crimson-ink',
  }[tier];
  const barTone = { great: 'bg-emerald', good: 'bg-sun', low: 'bg-crimson' }[tier];
  const missed = total - correct;

  return (
    <div className="tile p-6 sm:p-10 text-center pp-pop">
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-2">
        <Wycinanka withStem={false} className={`w-full h-full ${tier === 'great' ? 'pp-float' : ''}`} />
      </div>

      <h2 className="text-3xl md:text-4xl font-semibold mb-1">Quiz Complete!</h2>
      <p className="text-muted font-semibold mb-6">{quizTitle}</p>

      {/* Score */}
      <p className={`font-display text-6xl sm:text-7xl font-bold leading-none tabular-nums ${scoreTone}`}>
        {score}%
      </p>
      <p className="text-lg font-bold text-ink-2 mt-3 mb-6">{message}</p>

      <div
        className="h-4 w-full max-w-sm mx-auto rounded-full bg-line overflow-hidden mb-8"
        aria-hidden="true"
      >
        <div className={`h-full rounded-full ${barTone} transition-[width] duration-700`} style={{ width: `${score}%` }} />
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
        <div className="rounded-2xl bg-emerald-soft text-emerald-ink px-4 py-3 text-left">
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider">
            <Check className="w-4 h-4" strokeWidth={3} aria-hidden="true" /> Correct
          </p>
          <p className="font-display text-2xl font-semibold tabular-nums">{correct} <span className="text-base text-emerald-ink/70">/ {total}</span></p>
        </div>
        <div className="rounded-2xl bg-crimson-soft text-crimson-ink px-4 py-3 text-left">
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider">
            <X className="w-4 h-4" strokeWidth={3} aria-hidden="true" /> Missed
          </p>
          <p className="font-display text-2xl font-semibold tabular-nums">{missed} <span className="text-base text-crimson-ink/70">/ {total}</span></p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
        <button
          onClick={onRetake}
          className={`btn ${tier === 'great' ? 'btn-secondary' : 'btn-primary'}`}
        >
          <RotateCcw className="w-5 h-5" strokeWidth={2.6} />
          Retake Quiz
        </button>
        <Link href={`/lessons/${lessonId}`} className="btn btn-secondary">
          <ArrowLeft className="w-5 h-5" strokeWidth={2.6} />
          Review Lesson
        </Link>
        <Link
          href="/quizzes"
          className={`btn ${tier === 'great' ? 'btn-green' : 'btn-secondary'}`}
        >
          <Trophy className="w-5 h-5" strokeWidth={2.6} />
          All Quizzes
        </Link>
      </div>
    </div>
  );
}
