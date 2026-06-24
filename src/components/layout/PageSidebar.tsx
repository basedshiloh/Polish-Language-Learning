export default function PageSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-8 space-y-4">
        {children}
      </div>
    </aside>
  );
}

export function SidebarCard({
  title,
  children,
  accent = 'blue',
}: {
  title: string;
  children: React.ReactNode;
  accent?: 'blue' | 'purple' | 'green' | 'amber';
}) {
  const accents = {
    blue: 'border-t-blue-500',
    purple: 'border-t-purple-500',
    green: 'border-t-green-500',
    amber: 'border-t-amber-500',
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 border-t-2 ${accents[accent]} p-4`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-3">{title}</h3>
      {children}
    </div>
  );
}
