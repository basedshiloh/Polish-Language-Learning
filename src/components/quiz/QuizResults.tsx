import Link from 'next/link';
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  correct: number;
  total: number;
  quizTitle: string;
  lessonId: string;
  onRetake: () => void;
}

export default function QuizResults({ score, correct, total, quizTitle, lessonId, onRetake }: QuizResultsProps) {
  const emoji = score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪';
  const message = score >= 80
    ? 'Świetnie! (Excellent!)'
    : score >= 60
    ? 'Dobrze! (Good!) Keep practicing!'
    : 'Keep going! Review the lesson and try again.';

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-500';
  const ringColor = score >= 80 ? 'border-green-200 bg-green-50' : score >= 60 ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50';

  return (
    <div className="text-center py-8">
      <div className={`w-32 h-32 rounded-full border-4 ${ringColor} flex items-center justify-center mx-auto mb-6`}>
        <div>
          <span className="text-3xl">{emoji}</span>
          <p className={`text-3xl font-bold ${scoreColor}`}>{score}%</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Quiz Complete!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-1">{quizTitle}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
        {correct} correct out of {total} questions
      </p>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-8">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Retake Quiz
        </button>
        <Link
          href={`/lessons/${lessonId}`}
          className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Review Lesson
        </Link>
        <Link
          href="/quizzes"
          className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Trophy className="w-5 h-5" />
          All Quizzes
        </Link>
      </div>
    </div>
  );
}
