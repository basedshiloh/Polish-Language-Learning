'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MultipleChoiceQuestion } from '@/lib/types';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean, answer: string) => void;
}

export default function MultipleChoice({ question, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(index: number) {
    if (submitted) return;
    setSelected(index);
  }

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
    onAnswer(selected === question.correctIndex, question.options[selected]);
  }

  return (
    <div>
      <p className="text-lg font-semibold text-gray-900 mb-4">{question.prompt}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {question.options.map((option, i) => {
          let style = 'border-gray-200 hover:border-blue-300 bg-white';
          if (selected === i && !submitted) {
            style = 'border-blue-500 bg-blue-50 ring-2 ring-blue-200';
          }
          if (submitted && i === question.correctIndex) {
            style = 'border-green-500 bg-green-50';
          }
          if (submitted && selected === i && i !== question.correctIndex) {
            style = 'border-red-400 bg-red-50';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left text-sm transition-all ${style}`}
            >
              <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {submitted && i === question.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              )}
              {submitted && selected === i && i !== question.correctIndex && (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      )}

      {submitted && question.explanation && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          selected === question.correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
