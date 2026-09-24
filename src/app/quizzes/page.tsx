'use client';

import Link from 'next/link';
import { Brain, ArrowRight, Trophy, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { quizzes } from '@/data/quizzes';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import Wycinanka from '@/components/shared/Wycinanka';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';

/** Cycled accent for the quiz number badge. */
const NUMBER_TONES = [
  'bg-crimson-soft text-crimson-ink',
  'bg-emerald-soft text-emerald-ink',
  'bg-cobalt-soft text-cobalt-ink',
  'bg-sun-soft text-sun-ink',
  'bg-violet-soft text-violet-ink',
  'bg-orange-soft text-orange-ink',
  'bg-teal-soft text-teal-ink',
  'bg-fuchsia-soft text-fuchsia-ink',
];

function scoreTone(score: number) {
  return score >= 80
    ? { chip: 'bg-emerald-soft text-emerald-ink', bar: 'bg-emerald' }
    : score >= 60
    ? { chip: 'bg-sun-soft text-sun-ink', bar: 'bg-sun' }
    : { chip: 'bg-crimson-soft text-crimson-ink', bar: 'bg-crimson' };
}

export default function QuizzesPage() {
  const { getQuizBestScore, mounted, progress } = useProgress();

  const allAttempts = Object.values(progress.quizAttempts).flat();
  const totalAttempts = allAttempts.length;
  const avgScore = totalAttempts > 0
    ? Math.round(allAttempts.reduce((s, a) => s + a.score, 0) / totalAttempts)
    : 0;
  const quizzesTaken = new Set(allAttempts.map((a) => a.quizId)).size;
  const perfectScores = allAttempts.filter((a) => a.score === 100).length;

  return (
    <>
      {/* Header band */}
      <section className="bg-canvas border-b-2 border-line overflow-hidden">
        <div className="container-pp relative py-12 md:py-16">
          <Wycinanka
            withStem={false}
            className="hidden md:block absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 w-44 lg:w-52 opacity-90 pp-float [--r:-8deg]"
          />
          <div className="max-w-2xl md:pr-56">
            <h1 className="text-4xl md:text-5xl font-semibold">Quizzes</h1>
            <p className="text-muted text-lg mt-3">Test your knowledge after each lesson.</p>

            <div className="flex flex-wrap gap-2 mt-6">
              <span className="chip bg-paper text-ink border-2 border-line">
                <Brain className="w-3.5 h-3.5 text-emerald-ink" strokeWidth={2.6} />
                {quizzes.length} quizzes
              </span>
              {mounted && totalAttempts > 0 && (
                <span className="contents xl:hidden">
                  <span className="chip bg-cobalt-soft text-cobalt-ink">
                    <Target className="w-3.5 h-3.5" strokeWidth={2.6} />
                    {quizzesTaken}/{quizzes.length} taken
                  </span>
                  <span className="chip bg-emerald-soft text-emerald-ink">
                    <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.6} />
                    {avgScore}% avg
                  </span>
                  {perfectScores > 0 && (
                    <span className="chip bg-sun-soft text-sun-ink">
                      <Trophy className="w-3.5 h-3.5" strokeWidth={2.6} />
                      {perfectScores} perfect
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-pp py-10 md:py-12">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz, i) => {
                const lesson = lessons.find((l) => l.id === quiz.lessonId);
                const bestScore = mounted ? getQuizBestScore(quiz.id) : null;
                const tone = bestScore !== null ? scoreTone(bestScore) : null;

                return (
                  <li key={quiz.id}>
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="group tile tile-link flex flex-col h-full p-5"
                    >
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`flex items-center justify-center w-11 h-11 rounded-2xl font-display text-lg font-bold tabular-nums ${NUMBER_TONES[i % NUMBER_TONES.length]}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {lesson && <span className="chip bg-canvas text-muted">{lesson.level}</span>}
                          <span className="chip bg-canvas text-muted">{quiz.questions.length} Qs</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold leading-snug mb-1.5 group-hover:text-crimson-ink transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-muted mb-4">{quiz.description}</p>
                      {lesson && (
                        <p className="text-xs font-bold text-faint mb-4">Lesson: {lesson.title}</p>
                      )}

                      <div className="mt-auto pt-4 border-t-2 border-line">
                        {bestScore !== null && tone ? (
                          <div className="flex items-center gap-3">
                            <span className={`chip ${tone.chip}`}>
                              <Trophy className="w-3 h-3" strokeWidth={2.6} />
                              Best {bestScore}%
                            </span>
                            <span className="flex-1 h-2.5 rounded-full bg-line overflow-hidden" aria-hidden="true">
                              <span className={`block h-full rounded-full ${tone.bar}`} style={{ width: `${bestScore}%` }} />
                            </span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-between text-sm font-extrabold uppercase tracking-wider text-emerald-ink">
                            Start quiz
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.8} />
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <PageSidebar>
            <SidebarCard title="Your Stats" accent="purple">
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-ink-2">
                    <Target className="w-4 h-4 text-cobalt" strokeWidth={2.4} />
                    Quizzes taken
                  </dt>
                  <dd className="text-sm font-extrabold text-ink tabular-nums">{quizzesTaken}/{quizzes.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-ink-2">
                    <TrendingUp className="w-4 h-4 text-emerald" strokeWidth={2.4} />
                    Avg score
                  </dt>
                  <dd className="text-sm font-extrabold text-ink tabular-nums">{totalAttempts > 0 ? `${avgScore}%` : '—'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-ink-2">
                    <Trophy className="w-4 h-4 text-sun-edge" strokeWidth={2.4} />
                    Perfect scores
                  </dt>
                  <dd className="text-sm font-extrabold text-ink tabular-nums">{perfectScores}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-ink-2">
                    <Brain className="w-4 h-4 text-violet" strokeWidth={2.4} />
                    Total attempts
                  </dt>
                  <dd className="text-sm font-extrabold text-ink tabular-nums">{totalAttempts}</dd>
                </div>
              </dl>
            </SidebarCard>

            <SidebarCard title="Tips" accent="amber">
              <ul className="space-y-2.5 text-sm text-ink-2">
                {[
                  'Take quizzes right after finishing a lesson for the best retention.',
                  'Retake quizzes you scored below 80% on — your best score is always saved.',
                  'Review the grammar reference for topics you find tricky.',
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <Lightbulb className="w-4 h-4 text-sun-edge shrink-0 mt-0.5" strokeWidth={2.4} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </SidebarCard>
          </PageSidebar>
        </div>
      </div>
    </>
  );
}
