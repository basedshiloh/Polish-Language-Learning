import { FrequencyItem } from '@/lib/types';
import SpeakButton from '@/components/shared/SpeakButton';

// Colour-grade the meter from emerald (always) through sun to crimson (never).
function barColor(percent: number): string {
  if (percent >= 85) return 'bg-emerald';
  if (percent >= 65) return 'bg-teal';
  if (percent >= 40) return 'bg-sun';
  if (percent >= 20) return 'bg-orange';
  return 'bg-crimson';
}

export default function FrequencyScale({ items }: { items: FrequencyItem[] }) {
  return (
    <div className="rounded-2xl border-2 border-line bg-paper p-4 md:p-5">
      {/* scale labels */}
      <div className="mb-3 flex justify-between pr-[3.75rem] text-xs font-extrabold text-muted sm:pl-44">
        <span>0% — never</span>
        <span>always — 100%</span>
      </div>

      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="sm:w-40 sm:shrink-0">
              <div className="flex items-center gap-1">
                <p lang="pl" className="polish-text text-[17px] leading-tight">{item.polish}</p>
                <SpeakButton text={item.polish} />
              </div>
              <p className="text-sm font-semibold text-ink-2">
                {item.english}
                {item.pronunciation && (
                  <span className="pronunciation-text ml-1.5 text-xs">/{item.pronunciation}/</span>
                )}
              </p>
            </div>

            <div className="flex flex-1 items-center gap-3">
              {/* Chunky meter: grey track, colour fill with a 3D bottom edge and a glossy highlight */}
              <div className="relative h-6 flex-1 rounded-full bg-line" aria-hidden="true">
                <div
                  className={`relative h-full overflow-hidden rounded-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.14)] transition-all duration-500 ${barColor(item.percent)}`}
                  style={{ width: `${Math.max(item.percent, 4)}%` }}
                >
                  {item.percent >= 15 && (
                    <span className="absolute inset-x-2.5 top-1.5 h-1.5 rounded-full bg-white/35" />
                  )}
                </div>
              </div>
              <span className="w-12 shrink-0 text-right text-sm font-extrabold tabular-nums text-ink">
                {item.percent}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
