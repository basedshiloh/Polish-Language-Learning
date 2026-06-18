'use client';

import { use, useState, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Brain } from 'lucide-react';
import { quizzes } from '@/data/quizzes';
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

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const quiz = quizzes.find((q) => q.id === quizId);
  const { saveQuizAttempt } = useProgress();

  const [phase, setPhase] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [currentAnswered, setCurrentAnswered] = useState(false);

  if (!quiz) notFound();

  const quizData = quiz;
  const currentQuestion = quizData.questions[currentIndex];
  const totalQuestions = quizData.questions.length;

  const handleAnswer = useCallback((correct: boolean, answer: string) => {
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, correct, userAnswer: answer }]);
    setCurrentAnswered(true);
  }, [currentQuestion?.id]);

  function handleNext() {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswered(false);
    } else {
      const correctCount = answers.length > 0 ? answers.filter((a) => a.correct).length : 0;
      const score = Math.round((correctCount / totalQuestions) * 100);

      saveQuizAttempt({
        quizId: quizData.id,
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
    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quizzes
        </Link>

        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          <p className="text-gray-500 mb-2">{quiz.description}</p>
          <p className="text-sm text-gray-400 mb-8">{totalQuestions} questions</p>
          <button
            onClick={() => setPhase('active')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const correctCount = answers.filter((a) => a.correct).length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <QuizResults
          score={score}
          correct={correctCount}
          total={totalQuestions}
          quizTitle={quiz.title}
          lessonId={quiz.lessonId}
          onRetake={handleRetake}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <Link
        href="/quizzes"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Quizzes
      </Link>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold text-gray-900">{quiz.title}</h1>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <ProgressBar value={currentIndex + 1} max={totalQuestions} size="sm" />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
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

      {currentAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {currentIndex + 1 < totalQuestions ? (
              <>Next <ArrowRight className="w-4 h-4" /></>
            ) : (
              'See Results'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
