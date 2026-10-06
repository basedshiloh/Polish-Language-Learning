'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
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

    // Compare by label, not position: pairs may share a right-hand label
    // (e.g. two "Masculine" nouns), and either tile is a correct match.
    if (question.pairs[selectedLeft].right === question.pairs[item.index].right) {
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

  const base = 'tile w-full min-h-14 px-3 sm:px-4 py-3 text-left text-[15px] sm:text-base transition-[transform,background-color,border-color,opacity] duration-100 disabled:cursor-default';
  const idle = 'border-line bg-paper hover:border-line-2 hover:bg-canvas active:translate-y-0.5';
  const matched = 'border-emerald bg-emerald-soft text-emerald-ink';
  const selectedStyle = 'border-cobalt bg-cobalt-soft text-cobalt-ink';
  const wrong = 'border-crimson bg-crimson-soft text-crimson-ink';

  return (
    <div>
      <p className="font-display text-2xl md:text-3xl font-semibold text-ink leading-snug mb-2">{question.prompt}</p>
      <p className="text-sm font-semibold text-muted mb-6 min-h-5">
        {!done && (selectedLeft === null
          ? 'Pick an item on the left, then its match on the right.'
          : 'Now pick its match on the right.')}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3" role="group" aria-label="Items to match">
          {leftItems.map((item) => {
            const isMatched = matchedLeft.has(item.index);
            const isSelected = selectedLeft === item.index;
            const isWrong = wrongPair?.left === item.index;

            let style = `${idle} text-crimson-ink font-extrabold`;
            if (isMatched) style = `${matched} font-extrabold`;
            if (isSelected) style = `${selectedStyle} font-extrabold`;
            if (isWrong) style = `${wrong} font-extrabold`;

            return (
              <button
                key={item.index}
                onClick={() => handleLeftClick(item)}
                disabled={isMatched}
                aria-pressed={isSelected}
                className={`${base} ${style}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="min-w-0 break-words">{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald shrink-0" strokeWidth={2.4} aria-label="Matched" />}
                  {isWrong && <XCircle className="w-5 h-5 text-crimson shrink-0" strokeWidth={2.4} aria-label="Wrong match" />}
                </span>
              </button>
            );
          })}
        </div>
        <div className="space-y-3" role="group" aria-label="Matches">
          {rightItems.map((item) => {
            const isMatched = matchedRight.has(item.index);
            const isWrong = wrongPair?.right === item.index;

            let style = `${idle} text-ink font-bold`;
            if (isMatched) style = `${matched} font-bold`;
            if (isWrong) style = `${wrong} font-bold`;

            return (
              <button
                key={item.index}
                onClick={() => handleRightClick(item)}
                disabled={isMatched}
                className={`${base} ${style}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="min-w-0 break-words">{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald shrink-0" strokeWidth={2.4} aria-label="Matched" />}
                  {isWrong && <XCircle className="w-5 h-5 text-crimson shrink-0" strokeWidth={2.4} aria-label="Wrong match" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
