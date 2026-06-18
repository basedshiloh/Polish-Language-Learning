'use client';

import Link from 'next/link';
import { BookOpen, Brain, Flame, ArrowRight, Trophy } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import ProgressBar from '@/components/shared/ProgressBar';

export default function Dashboard() {
  const { progress, mounted, getOverallCompletion } = useProgress();

  if (!mounted) {
    return (
      <div className="p-6 md:p-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { completed, total, percentage } = getOverallCompletion();
  const streak = progress.streak.current;

  const recentAttempts = Object.values(progress.quizAttempts)
    .flat()
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 3);

  const nextLesson = lessons.find((l) => !progress.lessonProgress[l.id]?.completed);

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dzień dobry! 👋
        </h1>
        <p className="text-gray-500 mt-1">Ready to practice your Polish today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lessons</p>
              <p className="text-xl font-bold text-gray-900">{completed}/{total}</p>
            </div>
          </div>
          <ProgressBar value={completed} max={total} size="sm" />
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Streak</p>
              <p className="text-xl font-bold text-gray-900">{streak} {streak === 1 ? 'day' : 'days'}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Keep learning daily!</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Progress</p>
              <p className="text-xl font-bold text-gray-900">{percentage}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Overall completion</p>
        </div>
      </div>

      {nextLesson && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <p className="text-blue-200 text-sm font-medium mb-1">Continue Learning</p>
          <h2 className="text-xl font-bold mb-2">{nextLesson.title}</h2>
          <p className="text-blue-100 text-sm mb-4">{nextLesson.description}</p>
          <Link
            href={`/lessons/${nextLesson.id}`}
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Lesson <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quiz Scores</h3>
          {recentAttempts.length > 0 ? (
            <div className="space-y-3">
              {recentAttempts.map((attempt, i) => {
                const quiz = quizzes.find((q) => q.id === attempt.quizId);
                const scoreColor = attempt.score >= 80 ? 'text-green-600' : attempt.score >= 60 ? 'text-amber-600' : 'text-red-500';
                return (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{quiz?.title || 'Quiz'}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-lg font-bold ${scoreColor}`}>{attempt.score}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-gray-100 text-center">
              <Brain className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No quizzes taken yet</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/lessons"
              className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Browse Lessons</p>
                <p className="text-xs text-gray-500">{total} lessons available</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
            <Link
              href="/quizzes"
              className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Take a Quiz</p>
                <p className="text-xs text-gray-500">{quizzes.length} quizzes available</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
