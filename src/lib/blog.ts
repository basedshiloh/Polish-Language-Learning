import fs from 'fs';
import path from 'path';

export { slugify } from './utils';
import { slugify } from './utils';

export function getBlogContent(slug: string): string {
  const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

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
