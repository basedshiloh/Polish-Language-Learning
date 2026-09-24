export default function PageSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24 space-y-4">
        {children}
      </div>
    </aside>
  );
}

// Accent names are legacy; they map to the Wycinanki palette
// (blue → cobalt, purple → violet, green → emerald, amber → sun).
const accents = {
  blue: 'bg-cobalt',
  purple: 'bg-violet',
  green: 'bg-emerald',
  amber: 'bg-sun',
};

export function SidebarCard({
  title,
  children,
  accent = 'blue',
}: {
  title: string;
  children: React.ReactNode;
  accent?: 'blue' | 'purple' | 'green' | 'amber';
}) {
  return (
    <div className="tile p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold text-ink mb-3">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${accents[accent]}`} aria-hidden="true" />
        {title}
      </h3>
      {children}
    </div>
  );
}
