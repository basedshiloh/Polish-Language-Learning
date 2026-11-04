import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';
import AdSenseLoader from '@/components/shared/AdSenseLoader';

export const metadata: Metadata = pageMetadata({
  title: 'Blog — Polish Language Tips & Stories',
  description:
    'Read articles about Polish language learning: grammar deep dives, pronunciation tips, cultural insights, vocabulary building, and student success stories.',
  path: '/blog',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdSenseLoader />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Blog', url: 'https://www.polishpal.pl/blog' },
      ])} />
      {children}
    </>
  );
}
