'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Phrase } from '@/lib/types';
import SpeakButton from '@/components/shared/SpeakButton';

interface PhraseListProps {
  phrases: Phrase[];
}

export default function PhraseList({ phrases }: PhraseListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {phrases.map((phrase, i) => (
        <div
          key={i}
          className="w-full text-left bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-all"
        >
          <div
            className="flex items-center justify-between gap-2 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedIndex(expandedIndex === i ? null : i); } }}
          >
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="font-semibold text-blue-800">{phrase.polish}</span>
              <span
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <SpeakButton text={phrase.polish} />
              </span>
              {phrase.category && (
                <span className="ml-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0">
                  {phrase.category}
                </span>
              )}
            </div>
            {expandedIndex === i ? (
              <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            )}
          </div>
          {expandedIndex === i && (
            <div className="mt-2 pt-2 border-t border-gray-50">
              <p className="text-gray-600 text-sm">{phrase.english}</p>
              {phrase.pronunciation && (
                <p className="text-xs italic text-gray-400 mt-1">/{phrase.pronunciation}/</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
