import { Lightbulb } from 'lucide-react';
import { GrammarPoint } from '@/lib/types';

interface GrammarBlockProps {
  points: GrammarPoint[];
}

export default function GrammarBlock({ points }: GrammarBlockProps) {
  return (
    <div className="space-y-6">
      {points.map((point, i) => (
        <div key={i} className="bg-blue-50/50 rounded-lg p-5 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2">{point.title}</h4>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{point.explanation}</p>

          <div className="space-y-2 mb-4">
            {point.examples.map((ex, j) => (
              <div key={j} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                <span className="font-semibold text-blue-800">{ex.polish}</span>
                <span className="text-gray-400 hidden sm:inline">→</span>
                <span className="text-gray-600">{ex.english}</span>
              </div>
            ))}
          </div>

          {point.tip && (
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3 border border-amber-100">
              <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">{point.tip}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
