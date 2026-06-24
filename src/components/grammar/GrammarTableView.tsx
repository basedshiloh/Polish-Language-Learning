import { GrammarTable, TableColor } from '@/lib/types';

const colColors: Record<TableColor, { head: string; cell: string }> = {
  blue: { head: 'bg-blue-100 text-blue-800', cell: 'bg-blue-50/60' },
  pink: { head: 'bg-pink-100 text-pink-800', cell: 'bg-pink-50/60' },
  green: { head: 'bg-green-100 text-green-800', cell: 'bg-green-50/60' },
  amber: { head: 'bg-amber-100 text-amber-800', cell: 'bg-amber-50/60' },
  purple: { head: 'bg-purple-100 text-purple-800', cell: 'bg-purple-50/60' },
  gray: { head: 'bg-gray-100 text-gray-700', cell: 'bg-gray-50/60' },
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
                const headClass = color ? colColors[color].head : 'bg-gray-50 text-gray-700';
                return (
                  <th
                    key={i}
                    className={`px-3 py-2.5 text-left font-semibold border-b border-gray-200 whitespace-nowrap ${headClass}`}
                  >
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100 last:border-0">
                {row.map((cell, ci) => {
                  const color = columnColors?.[ci];
                  const cellTint = color ? colColors[color].cell : '';
                  const isRowHeader = highlightFirstCol && ci === 0;
                  return (
                    <td
                      key={ci}
                      className={`px-3 py-2.5 align-top ${cellTint} ${
                        isRowHeader
                          ? 'font-semibold text-gray-800 bg-gray-50/80'
                          : 'text-gray-700'
                      }`}
                    >
                      {cell.split('\n').map((line, li) => (
                        <span key={li} className={li > 0 ? 'block text-xs text-gray-400 mt-0.5' : 'block'}>
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
