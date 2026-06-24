import { GrammarTable, TableColor } from '@/lib/types';

const colColors: Record<TableColor, { head: string; cell: string }> = {
  blue: { head: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300', cell: 'bg-blue-50/60 dark:bg-blue-950/30' },
  pink: { head: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300', cell: 'bg-pink-50/60 dark:bg-pink-950/30' },
  green: { head: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300', cell: 'bg-green-50/60 dark:bg-green-950/30' },
  amber: { head: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300', cell: 'bg-amber-50/60 dark:bg-amber-950/30' },
  purple: { head: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300', cell: 'bg-purple-50/60 dark:bg-purple-950/30' },
  gray: { head: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300', cell: 'bg-gray-50/60 dark:bg-gray-800/40' },
};

export default function GrammarTableView({ table }: { table: GrammarTable }) {
  const { headers, rows, columnColors, highlightFirstCol, caption, footnote } = table;

  return (
    <div className="my-2">
      {caption && (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{caption}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => {
                const color = columnColors?.[i];
                const headClass = color ? colColors[color].head : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
                return (
                  <th
                    key={i}
                    className={`px-3 py-2.5 text-left font-semibold border-b border-gray-200 dark:border-gray-700 whitespace-nowrap ${headClass}`}
                  >
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                {row.map((cell, ci) => {
                  const color = columnColors?.[ci];
                  const cellTint = color ? colColors[color].cell : '';
                  const isRowHeader = highlightFirstCol && ci === 0;
                  return (
                    <td
                      key={ci}
                      className={`px-3 py-2.5 align-top ${cellTint} ${
                        isRowHeader
                          ? 'font-semibold text-gray-800 dark:text-gray-200 bg-gray-50/80 dark:bg-gray-800/60'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cell.split('\n').map((line, li) => (
                        <span key={li} className={li > 0 ? 'block text-xs text-gray-400 dark:text-gray-500 mt-0.5' : 'block'}>
                          {line}
                        </span>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 italic">{footnote}</p>
      )}
    </div>
  );
}
