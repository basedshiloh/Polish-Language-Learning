import { Fragment, type ReactNode } from 'react';
import { GrammarTable, TableColor } from '@/lib/types';

// Data colours → Wycinanki palette. Gender convention: blue = masc, pink = fem, green = neut.
// `cell` is a light column tint; `solid` is an opaque tint for sticky cells.
const colColors: Record<TableColor, { head: string; cell: string; solid: string }> = {
  blue: { head: 'bg-cobalt-soft text-cobalt-ink', cell: 'bg-cobalt-soft/45', solid: 'bg-cobalt-soft' },
  pink: { head: 'bg-fuchsia-soft text-fuchsia-ink', cell: 'bg-fuchsia-soft/45', solid: 'bg-fuchsia-soft' },
  green: { head: 'bg-emerald-soft text-emerald-ink', cell: 'bg-emerald-soft/45', solid: 'bg-emerald-soft' },
  amber: { head: 'bg-sun-soft text-sun-ink', cell: 'bg-sun-soft/55', solid: 'bg-sun-soft' },
  purple: { head: 'bg-violet-soft text-violet-ink', cell: 'bg-violet-soft/45', solid: 'bg-violet-soft' },
  gray: { head: 'bg-canvas text-ink', cell: 'bg-canvas', solid: 'bg-canvas' },
};

// Endings such as "-a", "-em", "(-y/-i)", "-ować": a hyphen at the start of a token followed by letters.
const ENDING_OR_ARROW = /(^|[\s(/,])(-[a-ząćęłńóśźż]+)|(→)/giu;

/**
 * Presentation-only markup for grammar strings: grammatical endings (e.g. "-ą")
 * get a sun highlight, arrows are softened. The text itself is never altered.
 */
export function decorate(text: string, { endings = true }: { endings?: boolean } = {}): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(ENDING_OR_ARROW)) {
    const start = m.index ?? 0;
    if (m[3]) {
      if (start > last) out.push(text.slice(last, start));
      out.push(
        <span key={key++} className="font-normal text-muted">
          →
        </span>,
      );
      last = start + 1;
    } else if (endings && m[2]) {
      const endStart = start + m[1].length;
      if (endStart > last) out.push(text.slice(last, endStart));
      out.push(
        <mark
          key={key++}
          className="rounded-md bg-sun-soft px-1 font-extrabold text-sun-ink shadow-[inset_0_-2px_0_var(--color-sun)]"
        >
          {m[2]}
        </mark>,
      );
      last = endStart + m[2].length;
    }
  }
  if (out.length === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out.map((n, i) => <Fragment key={i}>{n}</Fragment>);
}

type ColumnKind = 'polish' | 'pron' | 'plain';

const PRON_HEADER = /pronunciation/;
const PLAIN_HEADER =
  /english|literally|which form|main uses|gender|^case$|owner|looks like|actually|^with a…|amount|clock|^time$|^#$|ending|^change$/;
const POLISH_HEADER =
  /^polish$|\(polish\)|^examples?$|example answers|^answers?$|^question$|^form$|^person$|nominative|accusative|instrumental|genitive|\(instr\.\)|with adjective|^sentence$|^from…|jestem z|mieszkam w|idę do|what changed|^(masculine|feminine|neuter)\b|^i{1,3}\s|—|^[a-ząćęłńóśźż/]+$/;

/** Infer from the header what a column holds, so Polish forms get `.polish-text`. */
function columnKind(header: string): ColumnKind {
  const h = header.split('\n')[0].trim().toLowerCase();
  if (!h) return 'plain';
  if (PRON_HEADER.test(h)) return 'pron';
  if (PLAIN_HEADER.test(h)) return 'plain';
  if (POLISH_HEADER.test(h)) return 'polish';
  return 'plain';
}

function Cell({ cell, kind, rowHeader }: { cell: string; kind: ColumnKind; rowHeader: boolean }) {
  const lines = cell.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        // A continuation line in brackets, e.g. "(Nominative)", is a gloss.
        const isGloss = li > 0 && line.trim().startsWith('(');
        if (isGloss) {
          return (
            <span key={li} className="mt-0.5 block text-xs font-semibold text-muted">
              {decorate(line)}
            </span>
          );
        }
        const tone =
          kind === 'polish'
            ? 'polish-text'
            : kind === 'pron'
              ? 'pronunciation-text'
              : rowHeader
                ? 'font-extrabold text-ink'
                : 'text-ink-2';
        return (
          <span key={li} lang={kind === 'polish' ? 'pl' : undefined} className={`block ${li > 0 ? 'mt-1' : ''} ${tone}`}>
            {decorate(line)}
          </span>
        );
      })}
    </>
  );
}

export default function GrammarTableView({ table }: { table: GrammarTable }) {
  const { headers, rows, columnColors, highlightFirstCol, caption, footnote } = table;
  const kinds = headers.map(columnKind);
  // Keep the row-header column visible while the table scrolls sideways on phones.
  const stickyFirst = !!highlightFirstCol && headers.length > 2;
  const label = caption ?? (headers.filter(Boolean).join(' / ') || 'Grammar table');

  return (
    <div className="my-1">
      {caption && <p className="mb-3 font-semibold text-ink-2">{decorate(caption)}</p>}
      <div
        className="overflow-x-auto rounded-2xl border-2 border-line bg-paper"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        <table className="w-full border-collapse text-[15px] leading-snug">
          <thead>
            <tr>
              {headers.map((h, i) => {
                const color = columnColors?.[i];
                const headClass = color ? colColors[color].head : 'bg-canvas text-ink';
                const sticky = stickyFirst && i === 0 ? 'sticky left-0 z-[1] border-r-2 border-line' : '';
                const [first, ...rest] = h.split('\n');
                return (
                  <th
                    key={i}
                    scope="col"
                    className={`whitespace-nowrap border-b-2 border-line px-4 py-3 text-left align-bottom font-extrabold ${headClass} ${sticky}`}
                  >
                    <span className="block">{decorate(first)}</span>
                    {rest.map((line, li) => (
                      <span key={li} className="mt-0.5 block text-xs font-bold opacity-80">
                        {decorate(line)}
                      </span>
                    ))}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t border-line first:border-t-0">
                {row.map((cell, ci) => {
                  const color = columnColors?.[ci];
                  const isRowHeader = !!highlightFirstCol && ci === 0;
                  const isSticky = stickyFirst && ci === 0;
                  const tint = isSticky
                    ? `${color ? colColors[color].solid : 'bg-canvas'} sticky left-0 z-[1] border-r-2 border-line`
                    : color
                      ? colColors[color].cell
                      : isRowHeader
                        ? 'bg-canvas/70'
                        : '';
                  // Short cells stay on one line; long ones wrap at a readable width.
                  const long = cell.split('\n').some((l) => l.length > 26);
                  return (
                    <td
                      key={ci}
                      className={`px-4 py-3 align-top ${tint} ${long ? 'min-w-[14rem]' : 'whitespace-nowrap'}`}
                    >
                      <Cell cell={cell} kind={kinds[ci] ?? 'plain'} rowHeader={isRowHeader} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote && <p className="mt-2.5 text-sm italic text-muted">{decorate(footnote)}</p>}
    </div>
  );
}
