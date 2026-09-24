interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'gray';
}

// Legacy variant names are kept for API compatibility; they map onto the
// Wycinanki palette (blue → cobalt, green → emerald, amber → sun, red → crimson).
const variants = {
  blue: 'bg-cobalt-soft text-cobalt-ink',
  green: 'bg-emerald-soft text-emerald-ink',
  amber: 'bg-sun-soft text-sun-ink',
  red: 'bg-crimson-soft text-crimson-ink',
  gray: 'bg-canvas text-muted',
};

export default function Badge({ children, variant = 'blue' }: BadgeProps) {
  return <span className={`chip ${variants[variant]}`}>{children}</span>;
}
