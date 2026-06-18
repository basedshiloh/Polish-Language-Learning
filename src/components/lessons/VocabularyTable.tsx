'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { VocabularyItem } from '@/lib/types';

interface VocabularyTableProps {
  items: VocabularyItem[];
}

export default function VocabularyTable({ items }: VocabularyTableProps) {
  const [showTranslations, setShowTranslations] = useState(true);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowTranslations(!showTranslations)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          {showTranslations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showTranslations ? 'Hide translations' : 'Show translations'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Polish</th>
              {items.some((v) => v.pronunciation) && (
                <th className="text-left py-2 px-3 font-semibold text-gray-700 hidden sm:table-cell">Pronunciation</th>
              )}
              <th className="text-left py-2 px-3 font-semibold text-gray-700">English</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-semibold text-blue-800">{item.polish}</span>
                  {item.pronunciation && (
                    <span className="block sm:hidden text-xs italic text-gray-400 mt-0.5">
                      /{item.pronunciation}/
                    </span>
                  )}
                </td>
                {items.some((v) => v.pronunciation) && (
                  <td className="py-3 px-3 text-xs italic text-gray-400 hidden sm:table-cell">
                    /{item.pronunciation}/
                  </td>
                )}
                <td className="py-3 px-3 text-gray-600">
                  {showTranslations ? (
                    <>
                      {item.english}
                      {item.example && (
                        <span className="block text-xs text-gray-400 mt-1">
                          {item.example} — {item.exampleTranslation}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-300 italic">hidden</span>
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
