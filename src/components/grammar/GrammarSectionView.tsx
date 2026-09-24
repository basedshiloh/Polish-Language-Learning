import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { GrammarSection, TableColor } from '@/lib/types';
import GrammarTableView, { decorate } from './GrammarTableView';
import FrequencyScale from './FrequencyScale';
import SpeakButton from '@/components/shared/SpeakButton';

// Data colours → Wycinanki palette (blue = masc, pink = fem, green = neut, amber = sun).
const compColors: Record<TableColor, { head: string; title: string; chip: string; dot: string }> = {
  blue: { head: 'bg-cobalt-soft', title: 'text-cobalt-ink', chip: 'bg-cobalt text-white', dot: 'bg-cobalt' },
  pink: { head: 'bg-fuchsia-soft', title: 'text-fuchsia-ink', chip: 'bg-fuchsia text-white', dot: 'bg-fuchsia' },
  green: { head: 'bg-emerald-soft', title: 'text-emerald-ink', chip: 'bg-emerald text-white', dot: 'bg-emerald' },
  amber: { head: 'bg-sun-soft', title: 'text-sun-ink', chip: 'bg-sun text-ink', dot: 'bg-sun' },
  purple: { head: 'bg-violet-soft', title: 'text-violet-ink', chip: 'bg-violet text-white', dot: 'bg-violet' },
  gray: { head: 'bg-canvas', title: 'text-ink', chip: 'bg-ink-2 text-white', dot: 'bg-muted' },
};

const noteStyles = {
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    wrap: 'bg-sun-soft',
    badge: 'bg-sun text-ink',
    labelColor: 'text-sun-ink',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Watch out',
    wrap: 'bg-crimson-soft',
    badge: 'bg-crimson text-white',
    labelColor: 'text-crimson-ink',
  },
  info: {
    icon: Info,
    label: 'Good to know',
    wrap: 'bg-cobalt-soft',
    badge: 'bg-cobalt text-white',
    labelColor: 'text-cobalt-ink',
  },
};

export default function GrammarSectionView({ section }: { section: GrammarSection }) {
  return (
    <div>
      {section.title && (
        <h3 className="mb-4 text-2xl font-semibold leading-tight md:text-[1.7rem]">{section.title}</h3>
      )}

      {section.type === 'text' && section.text && (
        <p className="max-w-3xl whitespace-pre-line text-[17px] leading-relaxed text-ink-2">
          {decorate(section.text)}
        </p>
      )}

      {section.type === 'table' && section.table && (
        <GrammarTableView table={section.table} />
      )}

      {section.type === 'examples' && section.examples && (
        <ul className="overflow-hidden rounded-2xl border-2 border-line bg-paper">
          {section.examples.map((ex, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 border-t border-line px-4 py-3.5 first:border-t-0 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex items-center gap-1.5 sm:w-[46%] sm:shrink-0">
                <span lang="pl" className="polish-text text-[17px] leading-snug">{ex.polish}</span>
                <SpeakButton text={ex.polish} />
              </div>
              <span className="flex-1 text-[15px] text-ink-2">{ex.english}</span>
              {ex.note && (
                <span className="chip self-start whitespace-normal bg-canvas text-muted sm:self-center">
                  {decorate(ex.note, { endings: false })}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {section.type === 'frequency' && section.frequency && (
        <FrequencyScale items={section.frequency} />
      )}

      {section.type === 'comparison' && section.comparison && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {section.comparison.map((item, i) => {
            const c = compColors[item.color];
            return (
              <div key={i} className="tile flex flex-col overflow-hidden">
                <div className={`px-5 pb-4 pt-5 ${c.head}`}>
                  <h4 lang="pl" className={`text-3xl font-bold tracking-tight ${c.title}`}>{item.title}</h4>
                  <p className="mt-0.5 text-sm font-bold text-ink-2">{item.subtitle}</p>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className={`self-start rounded-xl px-2.5 py-1.5 text-xs font-extrabold ${c.chip}`}>
                    {item.structure}
                  </span>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{item.usage}</p>
                  <ul className="mt-4 space-y-3 border-t-2 border-dashed border-line pt-4">
                    {item.examples.map((ex, j) => (
                      <li key={j} className="flex gap-2.5">
                        <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${c.dot}`} aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="flex items-center gap-1">
                            <span lang="pl" className="polish-text">{ex.polish}</span>
                            <SpeakButton text={ex.polish} />
                          </span>
                          <span className="block text-sm text-muted">{ex.english}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
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
          <div className={`flex items-start gap-3.5 rounded-2xl p-4 md:p-5 ${style.wrap}`}>
            <span className={`icon-badge h-10 w-10 rounded-xl ${style.badge}`}>
              <NoteIcon className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={`text-sm font-extrabold ${style.labelColor}`}>{style.label}</p>
              <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-ink-2">
                {decorate(section.note, { endings: false })}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
