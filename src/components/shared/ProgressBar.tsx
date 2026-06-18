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
  color = 'bg-blue-600',
  showLabel = false,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{value} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
