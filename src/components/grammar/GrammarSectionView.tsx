import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { GrammarSection, TableColor } from '@/lib/types';
import GrammarTableView from './GrammarTableView';
import FrequencyScale from './FrequencyScale';
import SpeakButton from '@/components/shared/SpeakButton';

const compColors: Record<TableColor, { bg: string; border: string; title: string; chip: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800', title: 'text-blue-800 dark:text-blue-300', chip: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/40', border: 'border-pink-200 dark:border-pink-800', title: 'text-pink-800 dark:text-pink-300', chip: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300' },
  green: { bg: 'bg-green-50 dark:bg-green-950/40', border: 'border-green-200 dark:border-green-800', title: 'text-green-800 dark:text-green-300', chip: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', title: 'text-amber-800 dark:text-amber-300', chip: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800', title: 'text-purple-800 dark:text-purple-300', chip: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' },
  gray: { bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700', title: 'text-gray-800 dark:text-gray-200', chip: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
};

const noteStyles = {
  tip: { icon: Lightbulb, wrap: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', text: 'text-amber-900 dark:text-amber-200', iconColor: 'text-amber-600 dark:text-amber-400' },
  warning: { icon: AlertTriangle, wrap: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', text: 'text-red-900 dark:text-red-200', iconColor: 'text-red-500 dark:text-red-400' },
  info: { icon: Info, wrap: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', text: 'text-blue-900 dark:text-blue-200', iconColor: 'text-blue-600 dark:text-blue-400' },
};

export default function GrammarSectionView({ section }: { section: GrammarSection }) {
  return (
    <div>
      {section.title && (
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">{section.title}</h3>
      )}

      {section.type === 'text' && section.text && (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{section.text}</p>
      )}

      {section.type === 'table' && section.table && (
        <GrammarTableView table={section.table} />
      )}

      {section.type === 'examples' && section.examples && (
        <div className="space-y-2">
          {section.examples.map((ex, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-1 sm:min-w-[45%]">
                <span className="font-semibold text-blue-800 dark:text-blue-300">{ex.polish}</span>
                <SpeakButton text={ex.polish} />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm flex-1">{ex.english}</span>
              {ex.note && <span className="text-xs text-gray-400 dark:text-gray-500 italic shrink-0">{ex.note}</span>}
            </div>
          ))}
        </div>
      )}

      {section.type === 'frequency' && section.frequency && (
        <FrequencyScale items={section.frequency} />
      )}

      {section.type === 'comparison' && section.comparison && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {section.comparison.map((item, i) => {
            const c = compColors[item.color];
            return (
              <div key={i} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                <h4 className={`text-lg font-bold ${c.title}`}>{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{item.subtitle}</p>
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-md ${c.chip} mb-3`}>
                  {item.structure}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{item.usage}</p>
                <div className="space-y-1.5">
                  {item.examples.map((ex, j) => (
                    <div key={j} className="text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{ex.polish}</span>
                        <SpeakButton text={ex.polish} />
                      </div>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">{ex.english}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {section.type === 'note' && section.note && (() => {
        const style = noteStyles[section.noteType || 'tip'];
        const NoteIcon = style.icon;
        return (
          <div className={`flex items-start gap-3 rounded-lg border p-4 ${style.wrap}`}>
            <NoteIcon className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconColor}`} />
            <p className={`text-sm leading-relaxed ${style.text} whitespace-pre-line`}>{section.note}</p>
          </div>
        );
      })()}
    </div>
  );
}
