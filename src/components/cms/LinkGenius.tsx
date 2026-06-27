'use client';

import { useMemo } from 'react';
import { Link2, Plus, BookOpen, Table2, Brain, Newspaper } from 'lucide-react';
import { suggestLinks, type LinkTarget } from '@/lib/internal-links';

const typeIcon = {
  Lesson: BookOpen,
  Grammar: Table2,
  Quiz: Brain,
  Blog: Newspaper,
};

export default function LinkGenius({
  content,
  index,
  onInsert,
}: {
  content: string;
  index: LinkTarget[];
  onInsert: (phrase: string, url: string) => void;
}) {
  const suggestions = useMemo(() => suggestLinks(content, index), [content, index]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-blue-600" />
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Link Genius</p>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Internal-link suggestions based on phrases in your draft. Click to insert.
      </p>

      {suggestions.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
          No suggestions yet — write more content mentioning Polish topics.
        </p>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s, i) => {
            const Icon = typeIcon[s.type];
            return (
              <li key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    <Icon className="w-3 h-3" /> {s.type}
                  </div>
                  <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                    Link <span className="font-medium">&ldquo;{s.phrase}&rdquo;</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{s.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onInsert(s.phrase, s.url)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Insert
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
