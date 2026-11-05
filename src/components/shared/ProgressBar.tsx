interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'bg-emerald',
  showLabel = false,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const heights = { sm: 'h-2.5', md: 'h-3', lg: 'h-4' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm font-bold text-muted mb-1.5">
          <span>{value} / {max}</span>
          <span className="text-ink">{percentage}%</span>
        </div>
      )}
      <div
        className={`w-full bg-line rounded-full ${heights[size]} overflow-hidden`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className={`relative ${color} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        >
          {/* Duolingo-style glossy highlight along the top of the fill */}
          {size !== 'sm' && percentage > 4 && (
            <span className="absolute left-2 right-2 top-[3px] h-1 rounded-full bg-white/35" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
