import { Check } from 'lucide-react';

export default function SummaryBox({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <aside className="rounded-3xl bg-emerald-soft px-6 py-6 md:px-7 mb-10" aria-label="Summary">
      <p className="font-display text-xl font-semibold text-emerald-ink mb-4">TL;DR</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[16px] font-semibold leading-relaxed text-ink">
            <span className="w-6 h-6 rounded-full bg-emerald text-white flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
