'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Phrase } from '@/lib/types';
import SpeakButton from '@/components/shared/SpeakButton';

interface PhraseListProps {
  phrases: Phrase[];
}

export default function PhraseList({ phrases }: PhraseListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {phrases.map((phrase, i) => {
        const expanded = expandedIndex === i;
        return (
          <div
            key={i}
            className={`w-full text-left rounded-2xl border-2 px-4 py-3 transition-colors ${
              expanded ? 'border-teal/40 bg-teal-soft/50' : 'border-line bg-paper hover:border-line-2'
            }`}
          >
            <div
              className="flex items-center justify-between gap-3 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-expanded={expanded}
              onClick={() => setExpandedIndex(expanded ? null : i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedIndex(expanded ? null : i); } }}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-wrap">
                <span
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="inline-flex"
                >
                  <SpeakButton text={phrase.polish} />
                </span>
                <span className="polish-text text-base">{phrase.polish}</span>
                {phrase.category && (
                  <span className="chip bg-canvas text-muted shrink-0">
                    {phrase.category}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-faint shrink-0 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
                strokeWidth={2.6}
                aria-hidden="true"
              />
            </div>
            {expanded && (
              <div className="mt-3 pt-3 border-t-2 border-line/70 pl-[42px] pp-pop">
                <p className="text-ink-2">{phrase.english}</p>
                {phrase.pronunciation && (
                  <p className="pronunciation-text mt-1">/{phrase.pronunciation}/</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
