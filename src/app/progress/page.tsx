'use client';

import Link from 'next/link';
import { BookOpen, Brain, Flame, Trophy, Check, Lightbulb, Target, ChevronRight } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import ProgressBar from '@/components/shared/ProgressBar';
import Wycinanka from '@/components/shared/Wycinanka';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';

function scoreChip(score: number) {
  return score >= 80
    ? 'bg-emerald-soft text-emerald-ink'
    : score >= 60
    ? 'bg-sun-soft text-sun-ink'
    : 'bg-crimson-soft text-crimson-ink';
}

function Header() {
  return (
    <section className="bg-canvas border-b-2 border-line overflow-hidden">
      <div className="container-pp relative py-12 md:py-16">
        <Wycinanka
          withStem={false}
          className="hidden md:block absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 w-40 lg:w-48 opacity-90 pp-float [--r:6deg]"
        />
        <div className="max-w-2xl md:pr-52">
          <h1 className="text-4xl md:text-5xl font-semibold">Your Progress</h1>
          <p className="text-muted text-lg mt-3">Track your Polish learning journey.</p>
        </div>
      </div>
    </section>
  );
}

export default function ProgressPage() {
  const { progress, mounted, getOverallCompletion, getQuizBestScore } = useProgress();

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="container-pp py-10 md:py-12 animate-pulse" aria-hidden="true">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="col-span-2 md:row-span-2 h-40 md:h-auto rounded-3xl bg-canvas" />
            <div className="h-40 rounded-3xl bg-canvas" />
            <div className="h-40 rounded-3xl bg-canvas" />
            <div className="col-span-2 h-24 rounded-3xl bg-canvas" />
          </div>
          <div className="h-72 rounded-3xl bg-canvas" />
        </div>
      </>
    );
  }

  const { completed, total } = getOverallCompletion();
  const streak = progress.streak.current;

  const allAttempts = Object.values(progress.quizAttempts).flat();
  const avgScore = allAttempts.length > 0
    ? Math.round(allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length)
    : 0;

  const recentAttempts = allAttempts
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 10);

  return (
    <>
      <Header />

      <div className="container-pp py-10 md:py-12">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {/* Stat tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
              <div className="col-span-2 md:row-span-2 rounded-3xl bg-emerald-soft p-5 sm:p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="icon-badge bg-emerald text-white">
                    <BookOpen className="w-5 h-5" strokeWidth={2.4} />
                  </span>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-emerald-ink">Lessons Done</p>
                </div>
                <p className="font-display text-5xl font-bold text-ink tabular-nums leading-none mb-5">
                  {completed}<span className="text-2xl text-emerald-ink/70 font-semibold"> / {total}</span>
                </p>
                <div className="mt-auto">
                  <ProgressBar value={completed} max={total} size="lg" color="bg-emerald" showLabel />
                </div>
              </div>

              <div className="rounded-3xl bg-sun-soft p-5 flex flex-col">
                <span className="icon-badge bg-sun text-ink mb-4">
                  <Flame className="w-5 h-5" strokeWidth={2.4} />
                </span>
                <p className="text-xs font-extrabold uppercase tracking-wider text-sun-ink">Current Streak</p>
                <p className="font-display text-3xl font-bold text-ink tabular-nums mt-1">
                  {streak} <span className="text-lg font-semibold">day{streak !== 1 ? 's' : ''}</span>
                </p>
                <p className="text-xs font-semibold text-sun-ink mt-auto pt-2">Keep learning daily!</p>
              </div>

              <div className="rounded-3xl bg-cobalt-soft p-5 flex flex-col">
                <span className="icon-badge bg-cobalt text-white mb-4">
                  <Target className="w-5 h-5" strokeWidth={2.4} />
                </span>
                <p className="text-xs font-extrabold uppercase tracking-wider text-cobalt-ink">Avg Quiz Score</p>
                <p className="font-display text-3xl font-bold text-ink tabular-nums mt-1">
                  {allAttempts.length > 0 ? `${avgScore}%` : '—'}
                </p>
              </div>

              <div className="col-span-2 rounded-3xl bg-violet-soft p-5 flex items-center gap-4">
                <span className="icon-badge bg-violet text-white">
                  <Brain className="w-5 h-5" strokeWidth={2.4} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-violet-ink">Quiz Attempts</p>
                  <p className="font-display text-3xl font-bold text-ink tabular-nums leading-tight">
                    {allAttempts.length} <span className="text-lg font-semibold">total</span>
                  </p>
                </div>
                <Link href="/quizzes" className="btn btn-secondary btn-sm shrink-0">Quizzes</Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
              {/* Lesson checklist */}
              <section>
                <div className="flex items-baseline justify-between gap-3 mb-4">
                  <h2 className="text-2xl font-semibold">Lessons Progress</h2>
                  <span className="chip bg-emerald-soft text-emerald-ink">{completed}/{total}</span>
                </div>
                <ul className="tile divide-y-2 divide-line overflow-hidden">
                  {lessons.sort((a, b) => a.order - b.order).map((lesson) => {
                    const isCompleted = progress.lessonProgress[lesson.id]?.completed;
                    const bestScore = getQuizBestScore(lesson.relatedQuizId || '');

                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/lessons/${lesson.id}`}
                          className="group flex items-center gap-3 px-4 py-3.5 hover:bg-canvas transition-colors"
                        >
                          {isCompleted ? (
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald text-white shrink-0">
                              <Check className="w-4 h-4" strokeWidth={3.2} aria-label="Completed" />
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-full border-2 border-line-2 shrink-0" aria-label="Not completed yet" role="img" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-[15px] font-bold truncate ${isCompleted ? 'text-ink' : 'text-ink-2'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs font-semibold text-faint">{lesson.level} • ~{lesson.estimatedMinutes} min</p>
                          </div>
                          {bestScore !== null && (
                            <span className={`chip ${scoreChip(bestScore)}`}>
                              <Trophy className="w-3 h-3" strokeWidth={2.6} />
                              {bestScore}%
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-faint shrink-0 group-hover:text-ink transition-colors" strokeWidth={2.6} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Quiz history */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Quiz History</h2>
                {recentAttempts.length > 0 ? (
                  <ul className="tile divide-y-2 divide-line overflow-hidden">
                    {recentAttempts.map((attempt, i) => {
                      const quiz = quizzes.find((q) => q.id === attempt.quizId);

                      return (
                        <li key={i} className="flex items-center justify-between gap-3 px-4 py-3.5">
                          <div className="min-w-0">
                            <p className="text-[15px] font-bold text-ink truncate">{quiz?.title || 'Quiz'}</p>
                            <p className="text-xs font-semibold text-faint">
                              {new Date(attempt.completedAt).toLocaleDateString()} • {attempt.correctAnswers}/{attempt.totalQuestions} correct
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-xl px-2.5 py-1 font-display text-lg font-bold tabular-nums ${scoreChip(attempt.score)}`}>
                            {attempt.score}%
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-line-2 p-8 text-center">
                    <span className="icon-badge bg-violet-soft text-violet-ink mx-auto mb-3">
                      <Brain className="w-5 h-5" strokeWidth={2.4} />
                    </span>
                    <p className="text-sm font-semibold text-muted mb-5">No quiz attempts yet. Take a quiz to see your history!</p>
                    <Link href="/quizzes" className="btn btn-green btn-sm">Browse quizzes</Link>
                  </div>
                )}
              </section>
            </div>
          </div>

          <PageSidebar>
            <SidebarCard title="Study Tips" accent="amber">
              <ul className="space-y-3 text-sm text-ink-2">
                <li className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-sun-edge shrink-0 mt-0.5" strokeWidth={2.4} />
                  <p>Complete one lesson per day and take the quiz right after.</p>
                </li>
                <li className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-sun-edge shrink-0 mt-0.5" strokeWidth={2.4} />
                  <p>Re-read grammar reference tables before retaking quizzes you scored low on.</p>
                </li>
                <li className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-sun-edge shrink-0 mt-0.5" strokeWidth={2.4} />
                  <p>Focus on cases (<span className="polish-text">Biernik, Narzędnik, Dopełniacz</span>) — they appear in every exam.</p>
                </li>
              </ul>
            </SidebarCard>

            <SidebarCard title="Weak Areas" accent="purple">
              {(() => {
                const lowScoreQuizzes = quizzes
                  .map((q) => {
                    const best = getQuizBestScore(q.id);
                    return { quiz: q, best };
                  })
                  .filter((x) => x.best !== null && x.best < 80)
                  .sort((a, b) => (a.best ?? 0) - (b.best ?? 0))
                  .slice(0, 4);

                if (lowScoreQuizzes.length === 0) {
                  return <p className="text-sm text-muted">Take some quizzes to identify areas to improve.</p>;
                }

                return (
                  <ul className="space-y-1">
                    {lowScoreQuizzes.map(({ quiz, best }) => (
                      <li key={quiz.id}>
                        <Link
                          href={`/quizzes/${quiz.id}`}
                          className="flex items-center justify-between gap-2 -mx-2 px-2 py-1.5 rounded-lg text-sm font-bold text-ink-2 hover:bg-canvas hover:text-ink transition-colors"
                        >
                          <span className="truncate">{quiz.title.replace(' Quiz', '')}</span>
                          <span className={`chip shrink-0 ${scoreChip(best ?? 0)}`}>{best}%</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </SidebarCard>
          </PageSidebar>
        </div>
      </div>
    </>
  );
}
