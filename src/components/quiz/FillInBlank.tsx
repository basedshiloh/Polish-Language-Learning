'use client';

import { useState, useId, useRef, type FormEvent } from 'react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { FillInBlankQuestion } from '@/lib/types';

interface FillInBlankProps {
  question: FillInBlankQuestion;
  onAnswer: (correct: boolean, answer: string) => void;
}

// Tap-to-insert letters for learners without a Polish keyboard.
const POLISH_LETTERS = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export default function FillInBlank({ question, onAnswer }: FillInBlankProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function insertLetter(letter: string) {
    const el = inputRef.current;
    const start = el?.selectionStart ?? input.length;
    const end = el?.selectionEnd ?? input.length;
    const next = input.slice(0, start) + letter + input.slice(end);
    setInput(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + letter.length, start + letter.length);
    });
  }

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
      <label htmlFor={inputId} className="block font-display text-2xl md:text-3xl font-semibold text-ink leading-snug mb-4">
        {question.prompt}
      </label>
      {question.hint && !submitted && (
        <p className="chip bg-sun-soft text-sun-ink mb-5 whitespace-normal">
          <Lightbulb className="w-3.5 h-3.5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
          Hint: {question.hint}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={submitted}
              placeholder="Type your answer..."
              aria-invalid={submitted && !isCorrect ? true : undefined}
              className={`w-full h-14 rounded-2xl border-2 px-4 pr-12 text-lg font-bold outline-none transition-colors placeholder:text-muted placeholder:font-semibold ${
                submitted
                  ? isCorrect
                    ? 'border-emerald bg-emerald-soft text-emerald-ink'
                    : 'border-crimson bg-crimson-soft text-crimson-ink line-through decoration-2'
                  : 'border-line bg-canvas text-ink focus:border-cobalt focus:bg-paper'
              }`}
              autoComplete="off"
              autoCapitalize="off"
            />
            {submitted && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald" strokeWidth={2.4} aria-label="Correct" />
                ) : (
                  <XCircle className="w-6 h-6 text-crimson" strokeWidth={2.4} aria-label="Incorrect" />
                )}
              </span>
            )}
          </div>
          {!submitted && (
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn btn-green h-14 sm:min-w-36"
            >
              Check
            </button>
          )}
        </div>
        {!submitted && (
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Insert Polish letters">
            {POLISH_LETTERS.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => insertLetter(letter)}
                className="w-10 h-10 rounded-xl border-2 border-b-4 border-line bg-paper font-display text-lg font-semibold text-ink hover:border-line-2 active:translate-y-0.5 active:border-b-2 transition-transform"
                aria-label={`Insert ${letter}`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
