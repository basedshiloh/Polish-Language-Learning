// Share-card versioning, kept apart from lib/og/cards.ts so the metadata helper
// does not import all lesson data. Bump CARD_DESIGN when the card look changes.
export const CARD_DESIGN = 1;

/** Short stable hash for ?v= cache busting. */
export function hashParts(parts: (string | number | undefined)[]): string {
  let h = 2166136261;
  for (const ch of parts.join('|')) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
