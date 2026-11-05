import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

// The page itself is a client component, so its metadata lives here. Without
// it /search inherited the home title and canonical.
export const metadata: Metadata = pageMetadata({
  title: 'Search Lessons, Grammar, Quizzes and Blog Posts',
  description:
    'Search every PolishPal lesson, grammar table, quiz and blog post in one place. Type a Polish or English word to see where it is explained.',
  path: '/search',
  // Internal search results are not landing pages; keep them out of the index
  // (and out of the sitemap) but let crawlers follow the result links.
  robots: { index: false, follow: true },
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
