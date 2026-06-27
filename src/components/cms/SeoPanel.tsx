'use client';

import { Check, X } from 'lucide-react';
import { analyzeSeo, type SeoInput } from '@/lib/seo-analysis';

export default function SeoPanel(props: SeoInput) {
  const { score, checks, wordCount, density } = analyzeSeo(props);

  const color = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-500';
  const ring = score >= 80 ? 'border-green-500' : score >= 50 ? 'border-amber-500' : 'border-red-400';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full border-4 ${ring} flex items-center justify-center`}>
          <span className={`text-lg font-bold ${color}`}>{score}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold text-gray-900 dark:text-gray-100">SEO score</p>
          <p>{wordCount} words · {density.toFixed(2)}% keyword density</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-sm">
            {c.passed ? (
              <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className={c.passed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'}>{c.label}</span>
              {!c.passed && <p className="text-xs text-gray-400 dark:text-gray-500">{c.hint}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
