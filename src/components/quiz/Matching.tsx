'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MatchingQuestion } from '@/lib/types';

interface MatchingProps {
  question: MatchingQuestion;
  onAnswer: (correct: boolean, answer: string) => void;
}

interface IndexedItem {
  index: number;
  text: string;
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
  const [leftItems] = useState<IndexedItem[]>(() =>
    shuffle(question.pairs.map((p, i) => ({ index: i, text: p.left })))
  );
  const [rightItems] = useState<IndexedItem[]>(() =>
    shuffle(question.pairs.map((p, i) => ({ index: i, text: p.right })))
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matchedLeft, setMatchedLeft] = useState<Set<number>>(new Set());
  const [matchedRight, setMatchedRight] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const [done, setDone] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const totalPairs = question.pairs.length;

  const finishQuiz = useCallback((matchCount: number, finalMistakes: number) => {
    setDone(true);
    onAnswer(finalMistakes === 0, `${matchCount}/${totalPairs} matched, ${finalMistakes} mistakes`);
  }, [onAnswer, totalPairs]);

  useEffect(() => {
    if (matchedLeft.size === totalPairs && !done) {
      finishQuiz(matchedLeft.size, mistakes);
    }
  }, [matchedLeft.size, totalPairs, done, finishQuiz, mistakes]);

  function handleLeftClick(item: IndexedItem) {
    if (done || matchedLeft.has(item.index)) return;
    setSelectedLeft(selectedLeft === item.index ? null : item.index);
    setWrongPair(null);
  }

  function handleRightClick(item: IndexedItem) {
    if (done || selectedLeft === null || matchedRight.has(item.index)) return;

    if (selectedLeft === item.index) {
      setMatchedLeft((prev) => new Set(prev).add(selectedLeft));
      setMatchedRight((prev) => new Set(prev).add(item.index));
      setSelectedLeft(null);
      setWrongPair(null);
    } else {
      setWrongPair({ left: selectedLeft, right: item.index });
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
            const isMatched = matchedLeft.has(item.index);
            const isSelected = selectedLeft === item.index;
            const isWrong = wrongPair?.left === item.index;

            let style = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300';
            if (isMatched) style = 'border-green-300 bg-green-50 opacity-60';
            if (isSelected) style = 'border-blue-500 bg-blue-50 ring-2 ring-blue-200';
            if (isWrong) style = 'border-red-400 bg-red-50 animate-shake';

            return (
              <button
                key={item.index}
                onClick={() => handleLeftClick(item)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-sm font-semibold text-blue-800 text-left transition-all ${style}`}
              >
                <div className="flex items-center justify-between">
                  {item.text}
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightItems.map((item) => {
            const isMatched = matchedRight.has(item.index);
            const isWrong = wrongPair?.right === item.index;

            let style = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300';
            if (isMatched) style = 'border-green-300 bg-green-50 opacity-60';
            if (isWrong) style = 'border-red-400 bg-red-50 animate-shake';

            return (
              <button
                key={item.index}
                onClick={() => handleRightClick(item)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-sm text-gray-700 text-left transition-all ${style}`}
              >
                <div className="flex items-center justify-between">
                  {item.text}
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
