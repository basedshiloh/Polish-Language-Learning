import { FrequencyItem } from '@/lib/types';

// Color-grade the bar from green (always) through amber to red (never).
function barColor(percent: number): string {
  if (percent >= 85) return 'bg-green-500';
  if (percent >= 65) return 'bg-emerald-500';
  if (percent >= 40) return 'bg-amber-500';
  if (percent >= 20) return 'bg-orange-500';
  return 'bg-red-400';
}

export default function FrequencyScale({ items }: { items: FrequencyItem[] }) {
  return (
    <div className="space-y-3">
      {/* scale labels */}
      <div className="flex justify-between text-xs text-gray-400 px-1">
        <span>0% — never</span>
        <span>always — 100%</span>
      </div>

      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-28 sm:w-36 shrink-0">
            <p className="font-semibold text-blue-800 text-sm leading-tight">{item.polish}</p>
            <p className="text-xs text-gray-500">{item.english}</p>
            {item.pronunciation && (
              <p className="text-[11px] italic text-gray-400">/{item.pronunciation}/</p>
            )}
          </div>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full ${barColor(item.percent)} transition-all duration-500 flex items-center justify-end`}
              style={{ width: `${Math.max(item.percent, 4)}%` }}
            >
              {item.percent >= 15 && (
                <span className="text-[10px] font-semibold text-white pr-2">{item.percent}%</span>
              )}
            </div>
            {item.percent < 15 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400">
                {item.percent}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
