'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MatchingQuestion } from '@/lib/types';

interface MatchingProps {
  question: MatchingQuestion;
  onAnswer: (correct: boolean, answer: string) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Matching({ question, onAnswer }: MatchingProps) {
  const [leftItems] = useState(() => shuffle(question.pairs.map((p) => p.left)));
  const [rightItems] = useState(() => shuffle(question.pairs.map((p) => p.right)));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [done, setDone] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const totalPairs = question.pairs.length;

  const finishQuiz = useCallback((finalMatched: Record<string, string>, finalMistakes: number) => {
    setDone(true);
    const correct = Object.keys(finalMatched).length;
    const isAllCorrect = finalMistakes === 0;
    onAnswer(isAllCorrect, `${correct}/${totalPairs} matched, ${finalMistakes} mistakes`);
  }, [onAnswer, totalPairs]);

  useEffect(() => {
    if (Object.keys(matched).length === totalPairs && !done) {
      finishQuiz(matched, mistakes);
    }
  }, [matched, totalPairs, done, finishQuiz, mistakes]);

  function handleLeftClick(item: string) {
    if (done || matched[item]) return;
    setSelectedLeft(selectedLeft === item ? null : item);
    setWrongPair(null);
  }

  function handleRightClick(item: string) {
    if (done || !selectedLeft || Object.values(matched).includes(item)) return;

    const correctPair = question.pairs.find((p) => p.left === selectedLeft);
    if (correctPair && correctPair.right === item) {
      setMatched((prev) => ({ ...prev, [selectedLeft]: item }));
      setSelectedLeft(null);
      setWrongPair(null);
    } else {
      setWrongPair({ left: selectedLeft, right: item });
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
      }, 800);
    }
  }

  return (
    <div>
      <p className="text-lg font-semibold text-gray-900 mb-4">{question.prompt}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {leftItems.map((item) => {
            const isMatched = !!matched[item];
            const isSelected = selectedLeft === item;
            const isWrong = wrongPair?.left === item;

            let style = 'border-gray-200 bg-white hover:border-blue-300';
            if (isMatched) style = 'border-green-300 bg-green-50 opacity-60';
            if (isSelected) style = 'border-blue-500 bg-blue-50 ring-2 ring-blue-200';
            if (isWrong) style = 'border-red-400 bg-red-50 animate-shake';

            return (
              <button
                key={item}
                onClick={() => handleLeftClick(item)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-sm font-semibold text-blue-800 text-left transition-all ${style}`}
              >
                <div className="flex items-center justify-between">
                  {item}
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightItems.map((item) => {
            const isMatched = Object.values(matched).includes(item);
            const isWrong = wrongPair?.right === item;

            let style = 'border-gray-200 bg-white hover:border-blue-300';
            if (isMatched) style = 'border-green-300 bg-green-50 opacity-60';
            if (isWrong) style = 'border-red-400 bg-red-50 animate-shake';

            return (
              <button
                key={item}
                onClick={() => handleRightClick(item)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-sm text-gray-700 text-left transition-all ${style}`}
              >
                <div className="flex items-center justify-between">
                  {item}
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {done && (
        <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm">
          All pairs matched! {mistakes === 0 ? 'Perfect score!' : `${mistakes} mistake${mistakes === 1 ? '' : 's'}.`}
        </div>
      )}
    </div>
  );
}
