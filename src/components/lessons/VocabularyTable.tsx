'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { VocabularyItem } from '@/lib/types';
import SpeakButton from '@/components/shared/SpeakButton';

interface VocabularyTableProps {
  items: VocabularyItem[];
}

export default function VocabularyTable({ items }: VocabularyTableProps) {
  const [showTranslations, setShowTranslations] = useState(true);
  const hasPronunciation = items.some((v) => v.pronunciation);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setShowTranslations(!showTranslations)}
          className="btn btn-secondary btn-sm"
        >
          {showTranslations ? <EyeOff className="w-4 h-4" strokeWidth={2.6} /> : <Eye className="w-4 h-4" strokeWidth={2.6} />}
          {showTranslations ? 'Hide translations' : 'Show translations'}
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border-2 border-line">
        <table className="w-full text-[15px]">
          <thead>
            <tr className="bg-canvas text-ink">
              <th className="text-left px-4 py-3 font-extrabold">Polish</th>
              {hasPronunciation && (
                <th className="text-left px-4 py-3 font-extrabold hidden sm:table-cell">Pronunciation</th>
              )}
              <th className="text-left px-4 py-3 font-extrabold">English</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-line">
            {items.map((item, i) => (
              <tr key={i} className="align-top hover:bg-canvas/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <SpeakButton text={item.polish} />
                    <span className="polish-text text-base">{item.polish}</span>
                  </div>
                  {item.pronunciation && (
                    <span className="pronunciation-text block sm:hidden mt-1 pl-[42px]">
                      /{item.pronunciation}/
                    </span>
                  )}
                </td>
                {hasPronunciation && (
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="pronunciation-text leading-8">/{item.pronunciation}/</span>
                  </td>
                )}
                <td className="px-4 py-3 text-ink-2">
                  {showTranslations ? (
                    <>
                      <span className="leading-8">{item.english}</span>
                      {item.example && (
                        <span className="block text-sm text-muted mt-0.5">
                          <span className="font-bold text-crimson-ink">{item.example}</span> — {item.exampleTranslation}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="chip bg-canvas text-faint mt-1.5">hidden</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
