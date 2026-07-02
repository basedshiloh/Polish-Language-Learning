export { slugify } from './utils';
import { slugify } from './utils';

// Extract H2 headings from markdown for table-of-contents generation.
// IDs match the ones MarkdownRenderer assigns (same slugify).
export function extractHeadings(markdown: string): { id: string; title: string }[] {
  const headingRegex = /^#{2}\s+(.+)$/gm;
  const headings: { id: string; title: string }[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const title = match[1].trim();
    headings.push({ id: slugify(title), title });
  }
  return headings;
}
