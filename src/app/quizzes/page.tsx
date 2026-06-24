'use client';

import Link from 'next/link';
import { Brain, ChevronRight, Trophy, Target, TrendingUp } from 'lucide-react';
import { quizzes } from '@/data/quizzes';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import Badge from '@/components/shared/Badge';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';

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
    <div className="p-6 md:p-10">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Quizzes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Test your knowledge after each lesson.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const lesson = lessons.find((l) => l.id === quiz.lessonId);
              const bestScore = mounted ? getQuizBestScore(quiz.id) : null;
              const scoreColor = bestScore !== null
                ? bestScore >= 80 ? 'green' as const : bestScore >= 60 ? 'amber' as const : 'red' as const
                : null;

              return (
                <Link
                  key={quiz.id}
                  href={`/quizzes/${quiz.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    {bestScore !== null && scoreColor && (
                      <Badge variant={scoreColor}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {bestScore}%
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-700 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{quiz.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {quiz.questions.length} questions • {lesson?.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <PageSidebar>
          <SidebarCard title="Your Stats" accent="purple">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quizzes taken</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{quizzesTaken}/{quizzes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg score</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{totalAttempts > 0 ? `${avgScore}%` : '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Perfect scores</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{perfectScores}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total attempts</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{totalAttempts}</span>
              </div>
            </div>
          </SidebarCard>

          <SidebarCard title="Tips" accent="amber">
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <p>Take quizzes right after finishing a lesson for the best retention.</p>
              <p>Retake quizzes you scored below 80% on — your best score is always saved.</p>
              <p>Review the grammar reference for topics you find tricky.</p>
            </div>
          </SidebarCard>
        </PageSidebar>
      </div>
    </div>
  );
}
