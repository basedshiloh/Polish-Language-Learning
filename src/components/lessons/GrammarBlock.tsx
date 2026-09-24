import { Lightbulb } from 'lucide-react';
import { GrammarPoint } from '@/lib/types';
import SpeakButton from '@/components/shared/SpeakButton';

interface GrammarBlockProps {
  points: GrammarPoint[];
}

export default function GrammarBlock({ points }: GrammarBlockProps) {
  return (
    <div className="space-y-5">
      {points.map((point, i) => (
        <div key={i} className="rounded-2xl bg-violet-soft p-5 md:p-6">
          <h4 className="text-lg font-semibold text-violet-ink mb-2">{point.title}</h4>
          <p className="text-ink-2 mb-4 leading-relaxed">{point.explanation}</p>

          <div className="space-y-2">
            {point.examples.map((ex, j) => (
              <div
                key={j}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 rounded-xl bg-paper px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <SpeakButton text={ex.polish} />
                  <span className="polish-text">{ex.polish}</span>
                </div>
                <span className="text-muted font-bold hidden sm:inline" aria-hidden="true">→</span>
                <span className="text-sm text-ink-2 pl-[42px] sm:pl-0">{ex.english}</span>
              </div>
            ))}
          </div>

          {point.tip && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-sun-soft p-3.5">
              <span className="icon-badge w-8 h-8 rounded-lg bg-sun text-ink">
                <Lightbulb className="w-4 h-4" strokeWidth={2.6} aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-sun-ink leading-relaxed pt-1">{point.tip}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
