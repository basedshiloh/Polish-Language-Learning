'use client';

import Link from 'next/link';
import { BookOpen, Brain, Flame, Trophy, CheckCircle2, Circle, Lightbulb } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import ProgressBar from '@/components/shared/ProgressBar';
import Badge from '@/components/shared/Badge';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';

export default function ProgressPage() {
  const { progress, mounted, getOverallCompletion, getQuizBestScore } = useProgress();

  if (!mounted) {
    return (
      <div className="p-6 md:p-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { completed, total, percentage } = getOverallCompletion();
  const streak = progress.streak.current;

  const allAttempts = Object.values(progress.quizAttempts).flat();
  const avgScore = allAttempts.length > 0
    ? Math.round(allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length)
    : 0;

  const recentAttempts = allAttempts
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 10);

  return (
    <div className="p-6 md:p-10">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Your Progress</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your Polish learning journey.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lessons Done</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{completed} / {total}</p>
            </div>
          </div>
          <ProgressBar value={completed} max={total} size="sm" showLabel />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Quiz Score</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {allAttempts.length > 0 ? `${avgScore}%` : '—'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">{allAttempts.length} quiz attempt{allAttempts.length !== 1 ? 's' : ''} total</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{streak} day{streak !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Keep learning daily!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Lessons Progress</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
            {lessons.sort((a, b) => a.order - b.order).map((lesson) => {
              const isCompleted = progress.lessonProgress[lesson.id]?.completed;
              const bestScore = getQuizBestScore(lesson.relatedQuizId || '');

              return (
                <div key={lesson.id} className="flex items-center gap-3 p-4">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{lesson.level} • ~{lesson.estimatedMinutes} min</p>
                  </div>
                  {bestScore !== null && (
                    <Badge variant={bestScore >= 80 ? 'green' : bestScore >= 60 ? 'amber' : 'red'}>
                      <Trophy className="w-3 h-3 mr-1" />
                      {bestScore}%
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quiz History</h2>
          {recentAttempts.length > 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
              {recentAttempts.map((attempt, i) => {
                const quiz = quizzes.find((q) => q.id === attempt.quizId);
                const scoreColor = attempt.score >= 80 ? 'text-green-600' : attempt.score >= 60 ? 'text-amber-600' : 'text-red-500';

                return (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{quiz?.title || 'Quiz'}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(attempt.completedAt).toLocaleDateString()} • {attempt.correctAnswers}/{attempt.totalQuestions} correct
                      </p>
                    </div>
                    <span className={`text-lg font-bold ${scoreColor}`}>{attempt.score}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
              <Brain className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No quiz attempts yet. Take a quiz to see your history!</p>
            </div>
          )}
        </div>
      </div>
        </div>

        <PageSidebar>
          <SidebarCard title="Study Tips" accent="amber">
            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>Complete one lesson per day and take the quiz right after.</p>
              </div>
              <div className="flex gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>Re-read grammar reference tables before retaking quizzes you scored low on.</p>
              </div>
              <div className="flex gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>Focus on cases (Biernik, Narzędnik, Dopełniacz) — they appear in every exam.</p>
              </div>
            </div>
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
                return <p className="text-xs text-gray-400 dark:text-gray-500">Take some quizzes to identify areas to improve.</p>;
              }

              return (
                <div className="space-y-2">
                  {lowScoreQuizzes.map(({ quiz, best }) => (
                    <Link key={quiz.id} href={`/quizzes/${quiz.id}`} className="flex items-center justify-between text-sm hover:text-purple-600 transition-colors">
                      <span className="text-gray-600 dark:text-gray-400 truncate">{quiz.title.replace(' Quiz', '')}</span>
                      <span className="text-red-500 font-semibold text-xs shrink-0 ml-2">{best}%</span>
                    </Link>
                  ))}
                </div>
              );
            })()}
          </SidebarCard>
        </PageSidebar>
      </div>
    </div>
  );
}
