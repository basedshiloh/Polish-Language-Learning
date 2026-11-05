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
      <p className="font-display text-2xl md:text-3xl font-semibold text-ink leading-snug mb-6">{question.prompt}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" role="group" aria-label="Answer options">
        {question.options.map((option, i) => {
          const isCorrectOption = submitted && i === question.correctIndex;
          const isWrongPick = submitted && selected === i && i !== question.correctIndex;
          const isSelected = selected === i && !submitted;

          let style = 'border-line bg-paper text-ink hover:border-line-2 hover:bg-canvas active:translate-y-0.5';
          let keyStyle = 'border-line-2 text-muted';
          if (isSelected) {
            style = 'border-cobalt bg-cobalt-soft text-cobalt-ink';
            keyStyle = 'border-cobalt bg-cobalt text-white';
          }
          if (submitted && !isCorrectOption && !isWrongPick) {
            style = 'border-line bg-paper text-muted opacity-60';
          }
          if (isCorrectOption) {
            style = 'border-emerald bg-emerald-soft text-emerald-ink';
            keyStyle = 'border-emerald bg-emerald text-white';
          }
          if (isWrongPick) {
            style = 'border-crimson bg-crimson-soft text-crimson-ink';
            keyStyle = 'border-crimson bg-crimson text-white';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              aria-pressed={selected === i}
              className={`tile flex items-center gap-3 min-h-16 px-4 py-3.5 text-left text-base font-bold transition-[transform,background-color,border-color] duration-100 disabled:cursor-default ${style}`}
            >
              <span className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center text-sm font-extrabold shrink-0 ${keyStyle}`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {isCorrectOption && (
                <CheckCircle2 className="w-6 h-6 text-emerald shrink-0" strokeWidth={2.4} aria-label="Correct answer" />
              )}
              {isWrongPick && (
                <XCircle className="w-6 h-6 text-crimson shrink-0" strokeWidth={2.4} aria-label="Your answer — incorrect" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="btn btn-green w-full sm:w-auto sm:min-w-48"
        >
          Check Answer
        </button>
      )}
    </div>
  );
}
