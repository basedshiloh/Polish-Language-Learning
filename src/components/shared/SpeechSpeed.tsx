'use client';

import { useId } from 'react';
import { Snail, Rabbit } from 'lucide-react';
import { SPEECH_RATES, setSpeechRate, useSpeechRate } from '@/lib/speech-rate';
import { speakPolish } from '@/lib/speech';

interface Props {
  /** A Polish word played when the speed changes, so the learner hears the difference. */
  preview?: string;
  className?: string;
}

/** Slow / normal / fast picker for Polish audio. All instances share one setting. */
export default function SpeechSpeed({ preview = 'Dzień dobry', className = '' }: Props) {
  const rate = useSpeechRate();
  const labelId = useId();

  const pick = (value: number) => {
    setSpeechRate(value);
    if (preview) speakPolish(preview);
  };

  return (
    <div className={`no-print flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      <span id={labelId} className="text-sm font-extrabold text-ink-2">Audio speed</span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-paper p-1"
        onKeyDown={(e) => {
          // Arrow keys move between speeds, like a native radio group.
          const i = SPEECH_RATES.findIndex((r) => r.value === rate);
          const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
          if (!step) return;
          e.preventDefault();
          const next = SPEECH_RATES[Math.min(SPEECH_RATES.length - 1, Math.max(0, i + step))];
          pick(next.value);
          (e.currentTarget.querySelector(`[data-rate="${next.value}"]`) as HTMLButtonElement | null)?.focus();
        }}
      >
        <Snail className="ml-1 h-4 w-4 text-muted" strokeWidth={2.4} aria-hidden="true" />
        {SPEECH_RATES.map((r) => {
          const on = rate === r.value;
          return (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              data-rate={r.value}
              aria-label={`${r.name}, ${r.label}`}
              title={r.name}
              onClick={() => pick(r.value)}
              className={`min-w-[3rem] rounded-full px-2.5 py-1 text-sm font-extrabold tabular-nums transition-colors ${
                on ? 'bg-cobalt text-white' : 'text-ink-2 hover:bg-canvas'
              }`}
            >
              {r.label}
            </button>
          );
        })}
        <Rabbit className="mr-1 h-4 w-4 text-muted" strokeWidth={2.4} aria-hidden="true" />
      </div>
    </div>
  );
}
