import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { GrammarSection, TableColor } from '@/lib/types';
import GrammarTableView from './GrammarTableView';
import FrequencyScale from './FrequencyScale';
import SpeakButton from '@/components/shared/SpeakButton';

const compColors: Record<TableColor, { bg: string; border: string; title: string; chip: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-800', chip: 'bg-blue-100 text-blue-700' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', title: 'text-pink-800', chip: 'bg-pink-100 text-pink-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-800', chip: 'bg-green-100 text-green-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', title: 'text-amber-800', chip: 'bg-amber-100 text-amber-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', title: 'text-purple-800', chip: 'bg-purple-100 text-purple-700' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', title: 'text-gray-800', chip: 'bg-gray-100 text-gray-700' },
};

const noteStyles = {
  tip: { icon: Lightbulb, wrap: 'bg-amber-50 border-amber-200', text: 'text-amber-900', iconColor: 'text-amber-600' },
  warning: { icon: AlertTriangle, wrap: 'bg-red-50 border-red-200', text: 'text-red-900', iconColor: 'text-red-500' },
  info: { icon: Info, wrap: 'bg-blue-50 border-blue-200', text: 'text-blue-900', iconColor: 'text-blue-600' },
};

export default function GrammarSectionView({ section }: { section: GrammarSection }) {
  return (
    <div>
      {section.title && (
        <h3 className="text-base font-semibold text-gray-900 mb-3">{section.title}</h3>
      )}

      {section.type === 'text' && section.text && (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{section.text}</p>
      )}

      {section.type === 'table' && section.table && (
        <GrammarTableView table={section.table} />
      )}

      {section.type === 'examples' && section.examples && (
        <div className="space-y-2">
          {section.examples.map((ex, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-1 sm:min-w-[45%]">
                <span className="font-semibold text-blue-800">{ex.polish}</span>
                <SpeakButton text={ex.polish} />
              </div>
              <span className="text-gray-600 text-sm flex-1">{ex.english}</span>
              {ex.note && <span className="text-xs text-gray-400 italic shrink-0">{ex.note}</span>}
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
                <p className="text-xs text-gray-500 mb-3">{item.subtitle}</p>
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-md ${c.chip} mb-3`}>
                  {item.structure}
                </span>
                <p className="text-sm text-gray-700 mb-3">{item.usage}</p>
                <div className="space-y-1.5">
                  {item.examples.map((ex, j) => (
                    <div key={j} className="text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-800">{ex.polish}</span>
                        <SpeakButton text={ex.polish} />
                      </div>
                      <span className="block text-xs text-gray-500">{ex.english}</span>
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
