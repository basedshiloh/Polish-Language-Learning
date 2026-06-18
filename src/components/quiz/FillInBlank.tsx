'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { FillInBlankQuestion } from '@/lib/types';

interface FillInBlankProps {
  question: FillInBlankQuestion;
  onAnswer: (correct: boolean, answer: string) => void;
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export default function FillInBlank({ question, onAnswer }: FillInBlankProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || submitted) return;

    const targets = [question.correctAnswer, ...(question.acceptableAnswers || [])].map(normalize);
    const correct = targets.includes(normalize(input));

    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(correct, input.trim());
  }

  return (
    <div>
      <p className="text-lg font-semibold text-gray-900 mb-2">{question.prompt}</p>
      {question.hint && !submitted && (
        <p className="text-sm text-gray-400 mb-4">Hint: {question.hint}</p>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={submitted}
            placeholder="Type your answer..."
            className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm outline-none transition-colors ${
              submitted
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-blue-500'
            }`}
            autoComplete="off"
            autoCapitalize="off"
          />
          {!submitted && (
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Check
            </button>
          )}
        </div>
      </form>

      {submitted && (
        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
          isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            {isCorrect ? (
              <p>Correct!</p>
            ) : (
              <p>The correct answer is: <strong className="text-blue-800">{question.correctAnswer}</strong></p>
            )}
            {question.explanation && <p className="mt-1 opacity-80">{question.explanation}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
