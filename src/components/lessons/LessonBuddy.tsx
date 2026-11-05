'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { Volume2, ArrowRight, Shuffle } from 'lucide-react';
import Zubek from '@/components/shared/Zubek';
import { speakPolish, speechSupported } from '@/lib/speech';
import type { Lesson } from '@/lib/types';

// "Practise with Żubek": tap Żubek (or the button) and he says the next word
// from THIS lesson's vocabulary and phrase lists, out loud, with his mouth
// moving. Words come only from the lesson data (design/mascot/README.md:
// one Polish word at a time, never invented content).

interface Word {
  polish: string;
  english: string;
  pronunciation?: string;
}

function lessonWords(lesson: Lesson): Word[] {
  const seen = new Set<string>();
  const out: Word[] = [];
  for (const block of lesson.content) {
    const items = block.type === 'vocabulary' ? block.vocabulary : block.type === 'phrases' ? block.phrases : undefined;
    for (const w of items ?? []) {
      if (!w.polish || seen.has(w.polish)) continue;
      seen.add(w.polish);
      out.push({ polish: w.polish, english: w.english, pronunciation: w.pronunciation });
    }
  }
  return out;
}

const noop = () => () => {};

export default function LessonBuddy({ lesson }: { lesson: Lesson }) {
  const words = useMemo(() => lessonWords(lesson), [lesson]);
  const [index, setIndex] = useState(-1);
  // Server renders the "can speak" copy; the client corrects it after hydration.
  const canSpeak = useSyncExternalStore(noop, speechSupported, () => true);

  if (words.length === 0) return null;
  const word = index >= 0 ? words[index] : undefined;

  const say = (i: number) => {
    setIndex(i);
    speakPolish(words[i].polish);
  };
  const next = () => say((index + 1) % words.length);
  const random = () => {
    if (words.length < 2) return next();
    let i = index;
    while (i === index) i = Math.floor(Math.random() * words.length);
    say(i);
  };

  return (
    <section aria-label="Practise with Żubek" className="no-print tile mb-10 p-4 sm:p-5 flex items-center gap-3 sm:gap-6">
      <button
        type="button"
        onClick={next}
        aria-label={word ? 'Ask Żubek for the next word' : 'Ask Żubek to say a word'}
        className="shrink-0 rounded-2xl focus-visible:outline-offset-4"
      >
        <Zubek pose="speak" className="w-20 sm:w-28" />
      </button>

      <div className="min-w-0 flex-1">
        {/* Speech bubble (HTML, per the art rules: no text inside the artwork) */}
        <div className="relative rounded-2xl bg-sun-soft px-4 py-3 sm:px-5 sm:py-4" aria-live="polite">
          <span aria-hidden="true" className="absolute -left-2 top-7 h-4 w-4 rotate-45 rounded-[3px] bg-sun-soft" />
          {word ? (
            <>
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-sun-ink">
                Word {index + 1} of {words.length}
              </p>
              <p lang="pl" className="polish-text mt-1 text-2xl sm:text-[1.7rem] leading-tight">{word.polish}</p>
              {word.pronunciation && (
                <p className="mt-1 text-sm font-bold text-ink-2">
                  Say it: <span className="font-extrabold text-ink">{word.pronunciation}</span>
                </p>
              )}
              <p className="mt-1 text-base text-ink-2">{word.english}</p>
            </>
          ) : (
            <>
              <p className="font-display text-lg font-semibold text-ink leading-snug">
                I&apos;m Żubek. Let&apos;s practise this lesson&apos;s words together.
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-2">
                Tap me and I&apos;ll say one of its {words.length} words and phrases
                {canSpeak ? ' out loud.' : '. Your browser has no speech, so read along.'}
              </p>
            </>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={next} className="btn btn-primary btn-sm">
            {word ? 'Next word' : 'Say a word'}
            <ArrowRight className="w-4 h-4" strokeWidth={2.8} aria-hidden="true" />
          </button>
          {word && canSpeak && (
            <button type="button" onClick={() => say(index)} className="btn btn-secondary btn-sm">
              <Volume2 className="w-4 h-4" strokeWidth={2.6} aria-hidden="true" />
              Say it again
            </button>
          )}
          {word && (
            <button type="button" onClick={random} className="btn btn-secondary btn-sm">
              <Shuffle className="w-4 h-4" strokeWidth={2.6} aria-hidden="true" />
              Surprise me
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
