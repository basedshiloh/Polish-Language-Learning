'use client';

import Link from 'next/link';
import { Brain, ChevronRight, Trophy } from 'lucide-react';
import { quizzes } from '@/data/quizzes';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import Badge from '@/components/shared/Badge';

export default function QuizzesPage() {
  const { getQuizBestScore, mounted } = useProgress();

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-500 mt-1">Test your knowledge after each lesson.</p>
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
              className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
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

              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{quiz.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {quiz.questions.length} questions • {lesson?.title}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
