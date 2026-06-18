'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Phrase } from '@/lib/types';

interface PhraseListProps {
  phrases: Phrase[];
}

export default function PhraseList({ phrases }: PhraseListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {phrases.map((phrase, i) => (
        <button
          key={i}
          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          className="w-full text-left bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="font-semibold text-blue-800">{phrase.polish}</span>
              {phrase.category && (
                <span className="ml-2 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {phrase.category}
                </span>
              )}
            </div>
            {expandedIndex === i ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
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
        </button>
      ))}
    </div>
  );
}
